import {  AInput,AInputNumber, APhoneInput, ATags, ATextarea,ADBSelect }from "@/components/forms/Field";
import landlords from "./landlords";
import { options } from "./utils";
import modules from "../modules";

export default async () =>{
	const ops = await options(landlords.collection,["name", " - ","location"]).then((x)=>x ).catch(e=>console.log(e))
	return {
	...modules.PROPERTIES,
    moduleColumns : [
		{
			title: 'Name',
			dataIndex: 'name',
			sorter: true,
			MyComponent:AInput,
			rules: [
				{
					required: true,
					message: 'Property name is required'
				}
			]   
		},
		{
			title: 'Landlord',
			dataIndex: 'landlord',
			MyComponent:ADBSelect,
			LabelFormat:['sur_name',' ','first_name',' - ','location'],
			type:'landlords',
			singular:'landlord',
			optionColumns:landlords.moduleColumns,
			valueEnum: {...ops}
		},
		{
			title: 'Address ',
			dataIndex: 'address',
			MyComponent:AInput,
			sorter: true
		},
		{
			title: 'Management Percentage ',
			dataIndex: 'management_percentage',
			sorter: true,
			valueType: 'digit',
			MyComponent:AInputNumber,
		},
		{
			title: 'Remark',
			dataIndex: 'remark',
			valueType: 'textarea',
			MyComponent:ATextarea,
		}
    ]
}
}