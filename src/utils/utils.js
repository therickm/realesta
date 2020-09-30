import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { pascalCase } from 'case-anything';
import occupations from '@/attributes/occupations';
import { getAllData } from '@/services/template';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {


  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );

  if (authority) {
    if(authority.collection){
      return {...authority, authority:auth(authority.collection)}
    }else{
      return authority
    }
  }else{
    return undefined;
  }
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });



  return authorities;
};

export const auth = (mod) =>{
  const myRole = JSON.parse(localStorage.getItem('role'))
  return myRole.permission.some(p=>p.module === mod) ? ['Super Administrator', myRole.name] : ['Super Administrator']
}

export const getBase64 = (img, callback) =>{
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const LabelFormatter = (LabelFormat,data)=>LabelFormat.map((e) => data[e] ? data[e] : e)

export const formUserName=(user)=>{
  return `${user.sur_name?user.sur_name:''} ${user.first_name?user.first_name:''} ${user.middle_name?user.middle_name:''}`
}

export const processData = async (category) => {
  const occupationData = occupations().then(occupationsAttributes=>getAllData(occupationsAttributes.collection))

  const allTenants = getAllData('tenants')
  const allUnits = getAllData('units')
  const allProperties = getAllData('properties')
  const allLandlords = getAllData('landlords')
  const allInvoices = getAllData('invoices')
  const allReceipts = getAllData('receipts')
  const allExpenses = getAllData('expenses')

  const ddata =  await Promise.all([occupationData,allTenants,allUnits,allProperties,allLandlords,allInvoices,allReceipts,allExpenses])


  let totalRent = 0, totalAdvance = 0, totalArrears = 0
  
  const TheData = ddata[0] && ddata[0].map(
    (doc, index) => {

            const tenant = ddata[1].find(t=>t._id === doc.tenant)
            const unit = ddata[2].find(u=>u._id===doc.unit)
            const property = ddata[3].find(p=>p._id===unit.property_id)
            const landlord = ddata[4].find(l=>l._id===property.landlord)
            const invoices = ddata[5].filter(i=>i.tenant === doc._id && i.category === category)
            const receipts = ddata[6].filter(r=>r.tenant === doc._id  && r.category === category)

            const totalInvoices = invoices.reduce((total, row) => total + row.amount, 0)
            const totalReceipts = receipts.reduce((total, row) => total + row.amount, 0)

            totalRent += unit.rent
            totalArrears += (totalInvoices - totalReceipts) > 0 ? (totalInvoices - totalReceipts) : 0
            totalAdvance += (totalInvoices - totalReceipts) <= 0 ? (totalInvoices - totalReceipts) : 0

            let rowToPush = {
                ...unit,
                ...tenant,
                landlord: `${landlord.sur_name} ${landlord.first_name}`,
                name: `${tenant.sur_name} ${tenant.first_name}`,
                arrears: (totalInvoices - totalReceipts) > 0 ? (totalInvoices - totalReceipts) : 0,
                advance: (totalInvoices - totalReceipts) <= 0 ? (totalInvoices - totalReceipts) : 0,
                key: unit._id,
                landlord_id:landlord._id,
                property_id:property._id,

            }
            if(category === 'Rent'){
                rowToPush.months = (totalInvoices - totalReceipts) / unit.rent
                rowToPush.balance= totalInvoices - totalReceipts
            }
            return rowToPush
          }
  )


  const rentCollection = ddata[6].map(receipt=>{
    const receiptOccupancy = ddata[0].find(u=>u._id===receipt.tenant)
    const receiptUnit = ddata[2].find(u=>u._id===receiptOccupancy.unit)
    const receiptProperty = ddata[3].find(u=>u._id===receiptUnit.property_id)
    const receiptLandlord = ddata[4].find(u=>u._id===receiptProperty.landlord)
    
    return{...receipt,
      landlord: receiptProperty.landlord, property:receiptProperty._id}})

  return {TheData:TheData,totalRent:totalRent,totalArrears:totalArrears,totalAdvance:totalAdvance, allExpenses:ddata[7],rentCollection:rentCollection}
}