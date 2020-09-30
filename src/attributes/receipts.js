import { AInput, ATags, APhoneInput, ASelect,APassword, ADBSelect, AInputNumber, ATextarea, ARadio } from "@/components/forms/Field";
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
    ...modules.RECEIPTS,
    moduleColumns : [
        {
            title: 'Tenant',
            dataIndex: 'tenant',
            MyComponent: ASelect,
            valueEnum: { ...valueEnum },
            selectOptions: selectOptions,
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
        title:"Category",
        dataIndex:'category',
        MyComponent:ARadio,
        radioOptions : ['Rent', 'Security Deposit', 'Utilities','Others'],
        defaultValue:'Rent'
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