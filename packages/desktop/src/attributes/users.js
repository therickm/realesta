import { AInput, ATags, APhoneInput, ASelect,APassword, ADBSelect } from "@/components/forms/Field";
import roles from "./roles";
import { options } from "./utils";
import modules from "@/modules";

export default async () =>{
    const rolesOps = await options(roles.collection,["name"]).then((x)=>x ).catch(e=>console.log(e))
	return{
    ...modules.USERS,
    moduleColumns : [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        MyComponent:AInput,
        rules: [
            {
                required: true,
                message: 'User\'s name is required'
            }
        ]
    },
    {
        title: 'Address ',
        dataIndex: 'address',
        MyComponent:AInput,
        sorter: true
    },
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
        MyComponent:ATags,
        valueType: 'email'
    },
    {
        title:'Phone',
        dataIndex:'phone',
        MyComponent:APhoneInput,
        addLabel:true
    },
    {
        title:'Username',
        dataIndex:'username',
        MyComponent:AInput,
    },
    {
        title:'Role',
        dataIndex:'role',
        MyComponent:ADBSelect,
			LabelFormat:['name'],
			type:'roles',
			singular:'Role',
			optionColumns:roles.moduleColumns,
            valueEnum: {...rolesOps},
            filters: true,
    },
    {
        title:'Password',
        dataIndex:'password',
        MyComponent:APassword,
        hideInTable:true,
        hideInSearch:true,
        rules: [
            {
                required: true,
                message: 'User\'s name is required'
            }
        ]
    }
]
}
}