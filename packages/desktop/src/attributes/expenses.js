import { AInput, ATags, APhoneInput, ASelect,APassword, ADBSelect, AInputNumber, ATextarea, ARadio, ADatePicker } from "@/components/forms/Field";
import { options, occupancyOptions } from "./utils";
import modules from "@/modules";
import tenants from "./tenants";
import landlords from "./landlords";
import paymentOptions from "./paymentOptions";
import incomeExpenseTypes from "./incomeExpenseTypes";
import { Select } from "antd";

export default async () =>{

    const occupationOps = await occupancyOptions()  
    let valueEnum = {}
    occupationOps.map(op=>{valueEnum = {...valueEnum, [op.key]:{...op}}})

    const selectOptions = <>{Object.keys(occupationOps).map(v=>{
    return <Select.Option value={occupationOps[v].key}>{occupationOps[v].text}</Select.Option>
    })}</>


	return{
    ...modules.EXPENSE,
    moduleColumns : [
        {
            title: 'Expense Date',
            dataIndex: 'date',
            MyComponent: ADatePicker,
        },
        {
            title:"Expense Type",
            dataIndex:'expense_type',
            MyComponent:ARadio,
            radioOptions : ['Expense', 'Landlord Payment'],
            defaultValue:'Expense'
        },
        {
            title:'Landlord',
            dataIndex:'landlord',
            MyComponent:ADBSelect,
                LabelFormat:['sur_name'],
                type:landlords.collection,
                singular:landlords.singular,
                optionColumns:landlords.moduleColumns,
                filters: true,
        },
    {
        title:'Payment Option',
        dataIndex:'payment_option',
        MyComponent:ADBSelect,
			LabelFormat:['name'],
			type:paymentOptions.collection,
            singular:paymentOptions.singular,
			optionColumns:paymentOptions.moduleColumns,
            filters: true,
    },
    {
        title:'Income Center',
        dataIndex:'income_expense_type',
        MyComponent:ADBSelect,
			LabelFormat:['name'],
			type:incomeExpenseTypes.collection,
            singular:incomeExpenseTypes.singular,
			optionColumns:incomeExpenseTypes.moduleColumns,
            filters: true,
    },
    {
        title:'Particulars',
        dataIndex:'particulars',
        MyComponent:ATextarea,
    },
    {
        title:'Amount',
        dataIndex:'amount',
        MyComponent:AInputNumber,
    },
]
}
}