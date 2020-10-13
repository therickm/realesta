import { getData } from '../../db/actions';
import modules from "../modules";
import { getAllData } from './template';
import moment from 'moment'
moment.locale('en')

export async function propertiesStatistics() {
  const allProperties = await getAllData(modules.PROPERTIES.collection)
  const allUnits = await getAllData(modules.UNITS.collection)
  const occupancy = await getAllData(modules.OCCUPATION.collection).then(z => z.filter(h => !h.dateOut))

  const allOccupiedUnits = allUnits.filter((el) => {
    return occupancy.some((f) => {
      return f.unit === el._id;
    });
  });

  const totalRent = allUnits.reduce((p, c) => p + c.rent, 0)
  const occupiedRent = allOccupiedUnits.reduce((p, c) => p + c.rent, 0)

  return {
    totalProperties: allProperties.length,
    totalUnits: allUnits.length,
    occupiedUnits: allOccupiedUnits.length,
    totalRent: totalRent,
    occupiedRent: occupiedRent,
    aManagementPercentage: (allProperties.reduce((p, c) => p + c.management_percentage, 0)) / allProperties.length
  }
}

export const introData = async (date = null) => {
  const occupationData = getAllData('occupations')

  const allTenants = getAllData('tenants')
  const allUnits = getAllData('units')
  const allProperties = getAllData('properties')
  const allLandlords = getAllData('landlords')
  const allInvoices = getAllData('invoices')
  const allReceipts = getAllData('receipts')
  const allExpenses = getAllData('expenses')

  const ddata = await Promise.all([occupationData, allTenants, allUnits, allProperties, allLandlords, allInvoices, allReceipts, allExpenses])

  let totalAdvance = 0, totalArrears = 0, totalArrearsYesterday = 0, expenseData = [], receiptData = []

  ddata[0] && ddata[0].map(
    (doc, index) => {

      const tenant = ddata[1].find(t => t._id === doc.tenant)
      const unit = ddata[2].find(u => u._id === doc.unit)
      const property = ddata[3].find(p => p._id === unit.property_id)
      const landlord = ddata[4].find(l => l._id === property.landlord)
      const invoices = ddata[5].filter(i => i.tenant === doc._id)
      const receipts = ddata[6].filter(r => r.tenant === doc._id)

      const totalInvoices = invoices.reduce((total, row) => moment(row.createdAt).isBefore(moment().add(0, 'days')) ? total + row.amount : total + 0, 0)
      const totalReceipts = receipts.reduce((total, row) => moment(row.createdAt).isBefore(moment().add(0, 'days')) ? total + row.amount : total + 0, 0)

      const totalInvoicesYesterday = invoices.reduce((total, row) => moment(row.createdAt).isBefore(moment().add(-1, 'days'), 'day') ? total + row.amount : total + 0, 0)
      const totalReceiptsYesterday = receipts.reduce((total, row) => moment(row.createdAt).isBefore(moment().add(-1, 'days'), 'day') ? total + row.amount : total + 0, 0)

      totalArrears += (totalInvoices - totalReceipts) > 0 ? (totalInvoices - totalReceipts) : 0
      totalArrearsYesterday += (totalInvoicesYesterday - totalReceiptsYesterday) > 0 ? (totalInvoicesYesterday - totalReceiptsYesterday) : 0
      totalAdvance += (totalInvoices - totalReceipts) <= 0 ? (totalInvoices - totalReceipts) : 0
    }
  )

  const beginDay = new Date().getTime();

  for (let i = 0; i < 31; i += 1) {
    let date = moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('Do MMM')
    let total = ddata[7].filter(expense => moment(expense.createdAt).format('YYYY-MM-DD') === moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'))
      .reduce((previousValue, currentExpense) => previousValue + currentExpense.amount, 0)

    let rTotal = ddata[6].filter(receipt => moment(receipt.createdAt).format('YYYY-MM-DD') === moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'))
      .reduce((previousValue, currentReceipt) => previousValue + currentReceipt.amount, 0)

    expenseData.push({ x: date, y: total, });
    receiptData.push({ x: date, y: rTotal, });
  }
  return {
    totalArrears: totalArrears,
    totalAdvance: totalAdvance,
    totalArrearsYesterday: totalArrearsYesterday,

    totalUnits: ddata[2].length,
    occupiedUnits: ddata[0].filter(occupation => !occupation.dateOut).length,

    expenseData: expenseData.reverse(),
    receiptData: receiptData.reverse(),
  }
}

export const homeChartData = async () => {

  const beginDay = new Date().getTime();

  const allReceipts = getAllData('receipts')
  const allExpenses = getAllData('expenses')
  const promiseData = await Promise.all([allReceipts, allExpenses])
  const dailyIncomeVsExpense = [], monthlyIncomeVsExpense = [], annualIncomeVsExpense = [];
  for (let i = 0; i < 31; i += 1) {
    let date = moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('DD MMM')
    let totalExpense = promiseData[1].filter(expense => moment(expense.createdAt).format('YYYY-MM-DD') === moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'))
      .reduce((previousValue, currentExpense) => previousValue + currentExpense.amount, 0)

    let totalIncome = promiseData[0].filter(receipt => moment(receipt.createdAt).format('YYYY-MM-DD') === moment(new Date(beginDay - 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'))
      .reduce((previousValue, currentReceipt) => previousValue + currentReceipt.amount, 0)
    dailyIncomeVsExpense.push({ date: date, income: totalIncome, expense: totalExpense })
  }

  //monthly
  var d = new Date()
  for (let i = 0; i <= 11; i++) {
    let date = moment(d).format('MMM YYYY')
    let totalExpense = promiseData[1].filter(expense => moment(expense.createdAt).format('YYYY-MM') === moment(d.getTime()).format('YYYY-MM'))
      .reduce((previousValue, currentExpense) => previousValue + currentExpense.amount, 0)

    let totalIncome = promiseData[0].filter(receipt => moment(receipt.createdAt).format('YYYY-MM') === moment(d.getTime()).format('YYYY-MM'))
      .reduce((previousValue, currentReceipt) => previousValue + currentReceipt.amount, 0)
    if ((totalIncome !== 0 || totalExpense !== 0)) { monthlyIncomeVsExpense.push({ date: date, income: totalIncome, expense: totalExpense }) }
    d.setMonth(d.getMonth() - 1);
  }
  var dd = new Date()
  for (let i = 0; i <= 11; i++) {
    let date = moment(dd).format('YYYY')
    let totalExpense = promiseData[1].filter(expense => moment(expense.createdAt).format('YYYY') === moment(dd.getTime()).format('YYYY'))
      .reduce((previousValue, currentExpense) => previousValue + currentExpense.amount, 0)

    let totalIncome = promiseData[0].filter(receipt => moment(receipt.createdAt).format('YYYY') === moment(dd.getTime()).format('YYYY'))
      .reduce((previousValue, currentReceipt) => previousValue + currentReceipt.amount, 0)
    if ((totalIncome !== 0 || totalExpense !== 0)) { annualIncomeVsExpense.push({ date: date, income: totalIncome, expense: totalExpense }) }
    dd.setMonth(dd.getFullYear() - 1);
  }

  console.log('annual', annualIncomeVsExpense);



  return {
    daily: dailyIncomeVsExpense.reverse(),
    monthly: monthlyIncomeVsExpense.reverse(),
    annual: annualIncomeVsExpense.reverse(),
  }
}