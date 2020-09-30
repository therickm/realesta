import { getAll, save,getImage,setImage,remove,details, getData } from '../../../db/actions';

export async function query(params) {
      const rows = await getAll(params)
      let data = []
      rows.map(r=>data.push({...r, key:r._id}))
      return {data:data};
}

export async function getOccupancyOptions() {
  const rows = await getAll({ params: {}, sorter: {}, filter: { type: 'occupations' } })
  let data = []
  const ll =rows.map(async r=>{
    try {
    const unit = await details(r.unit)
    const tenant = await details(r.tenant)
    console.log(unit,tenant);
    return ({...r, key:r._id, text: `${tenant.sur_name?tenant.sur_name:''} ${tenant.first_name?tenant.first_name:''} ${tenant.middle_name?tenant.middle_name:''} - ${unit.code}`  })
    }catch(e){console.log(e)}
  })
  console.log(ll,rows);
  return Promise.all(ll);
}

export async function queryAll(type) {
  return await getData(type)
}

export async function queryOne(params) {
  return await details(params)
}

export async function removeOne(params) {
  return await remove(params)
}

export async function bulkRemove(params) {
  const done = await req.body.rows.map(row=>remove(row))
  return 'done'
}

export async function getImageAttachedImage(params) {
    return await getImage(params)
}

export async function attachImage(params) {
  return await setImage(params)
}

export async function add(params) {
  return await save(params)
}
