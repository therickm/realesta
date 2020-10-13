import {  AInput,AInputNumber, APhoneInput, ATags, ATextarea,ADBSelect, ADatePicker }from "@/components/forms/Field";
import landlords from "./landlords";
import { options } from "./utils";
import modules from "../modules";
import tenants from "./tenants";
import units from "./units";

export default async () =>{
    const unitAttributes = await units()
	const tenantOps = await options(tenants.collection,['sur_name',' ','first_name',' - ','location']).then((x)=>x ).catch(e=>console.log(e))
	const unitOps = await options(tenants.collection,['code']).then((x)=>x ).catch(e=>console.log(e))
	return {
	...modules.OCCUPATION,
    moduleColumns : [
		{
			title: 'Tenant',
			dataIndex: 'tenant',
			MyComponent:ADBSelect,
			LabelFormat:['sur_name',' ','first_name',' - ','location'],
			type:'tenants',
			singular:'tenant',
			optionColumns:tenants.moduleColumns,
			valueEnum: {...tenantOps}
        },
        {
			title: 'Unit',
			dataIndex: 'unit',
			MyComponent:ADBSelect,
			LabelFormat:['code'],
			type:'units',
			singular:unitAttributes.singular,
			optionColumns:tenants.moduleColumns,
			valueEnum: {...unitOps}
        },
		{
			title: 'Date in',
			dataIndex: 'dateIn',
			MyComponent:ADatePicker,
			sorter: true
        },
        {
			title: 'Date out',
			dataIndex: 'dateOut',
			MyComponent:ADatePicker,
			sorter: true
		},
    ]
}
}