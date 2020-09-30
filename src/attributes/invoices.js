import { AInput, ATags, APhoneInput, ASelect, APassword, ADBSelect, AInputNumber, ARadio } from "@/components/forms/Field";
import { options, occupancyOptions } from "./utils";
import modules from "@/modules";
import tenants from "./tenants";
import units from "./units";
import incomeExpenseTypes from "./incomeExpenseTypes";
import occupations from "./occupations";
import { queryOne } from "@/pages/Template/service";
import { Select } from "antd";
import _ from 'lodash'

export default async () => {

    const typeOps = await options(incomeExpenseTypes.collection, ['name'])

    const occupationOps = await occupancyOptions()  
    let valueEnum = {}
    occupationOps.map(op=>{valueEnum = {...valueEnum, [op.key]:{...op}}})

    const selectOptions = <>{Object.keys(occupationOps).map(v=>{
    return <Select.Option value={occupationOps[v].key}>{occupationOps[v].text}</Select.Option>
    })}</>

    return {
        ...modules.INVOICES,
        moduleColumns: [
            {
                title: 'Tenant',
                dataIndex: 'tenant',
                MyComponent: ASelect,
                valueEnum: { ...valueEnum },
                selectOptions: selectOptions,
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
                title: 'Invoice Type',
                dataIndex: 'income_expense_type',
                MyComponent: ADBSelect,
                LabelFormat: ['name'],
                type: incomeExpenseTypes.collection,
                singular: 'Unit',
                optionColumns: incomeExpenseTypes.moduleColumns,
                valueEnum: { ...typeOps },
                filters: true,
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                MyComponent: AInputNumber,
            },
        ]
    }
}