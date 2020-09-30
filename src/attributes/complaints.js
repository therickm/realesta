import {  AInput,AInputNumber, APhoneInput, ATags, ATextarea,ADBSelect }from "@/components/forms/Field";
import landlords from "./landlords";
import { options } from "./utils";
import modules from "../modules";
import tenants from "./tenants";
import users from "./users";

export default async () =>{
	const ops = await options(landlords.collection,["name", " - ","location"]).then((x)=>x ).catch(e=>console.log(e))
	return {
	...modules.COMPLAINTS,
    moduleColumns : [
		
		{
			title: 'Complainant',
			dataIndex: 'complainant',
			MyComponent:ADBSelect,
			LabelFormat:['sur_name',' ','first_name',' - ','location'],
			type:[landlords.collection,tenants.collection,users.collection],
			singular:'Complainant',
			createNew:false,
			optionColumns:tenants.moduleColumns,
            valueEnum: {...ops},
            rules: [
				{
					required: true,
					message: 'Property name is required'
				}
			]   
		},
		{
			title: 'Complaint',
			dataIndex: 'complaint',
			valueType: 'textarea',
			MyComponent:ATextarea,
		}
    ]
}
}