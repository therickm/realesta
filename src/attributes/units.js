import { AInput, ATags, APhoneInput, ASelect,APassword, ADBSelect,AInputNumber,ATextarea } from "@/components/forms/Field";
import roles from "./roles";
import { options } from "./utils";
import modules from "@/modules";

export default async (property_id) =>{
    const rolesOps = await options(roles.collection,["name"]).then((x)=>x ).catch(e=>console.log(e))
	return{
    ...modules.UNITS,
    moduleColumns : [
        {
            title: 'Code',
            dataIndex: 'code',
            MyComponent: AInput
        },
        {
            title: 'Rent',
            dataIndex: 'rent',
            MyComponent: AInputNumber,
            valueType: (item) => ({ type: 'money', locale: 'en-Us' }),
        },
        {
            title: 'Number of rooms',
            dataIndex: 'rooms',
            MyComponent: AInputNumber
        },
        {
            title: 'Water Meter Number',
            dataIndex: 'water_meter',
            MyComponent: AInputNumber
        },
        {
            title: 'Electricity Meter Number',
            dataIndex: 'electricity_meter',
            MyComponent: AInputNumber
        },
        {
            title: 'Description',
            dataIndex: 'description',
            MyComponent: ATextarea
        },
        {
            title: 'Property',
            dataIndex: 'property_id',
            MyComponent: AInput,
            initialValue: property_id?property_id:null,
            hideInTable: true,
            hidden: true
        },
    ]
}
}