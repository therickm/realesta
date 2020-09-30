export const getParticulars=(form)=>{
    console.log('........................',form);
    const incomeExpenseTypes = form.getFieldValue("income_expense_type")
    incomeExpenseTypes && form.setFieldsValue({"particulars":'test'})
    console.log('>>>>>>>>>>>>>>>>>>>thats Right',incomeExpenseTypes)
}
