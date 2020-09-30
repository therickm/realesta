import { AInput, APhoneInput,ASelect, ATags }from "@/components/forms/Field";
import modules from "../modules";

export default {
    ...modules.LANDLORDS,
    moduleColumns : [
        {
            title: 'Sur Name',
            dataIndex: 'sur_name',
            sorter: true,
            MyComponent: AInput,
            rules: [
                {
                    required: true,
                    message: `${modules.LANDLORDS.singular}'s Surname/last name is required`
                }
            ]

        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: true,
            MyComponent: AInput,
            rules: [
                {
                    required: true,
                    message: `${modules.LANDLORDS.singular}'s Religious/first name is required`
                }
            ]

        },
        {
            title: 'Middle Name',
            dataIndex: 'middle_name',
            sorter: true,
            MyComponent: AInput
        },
        {
            title: 'Email',
            dataIndex: 'email',
            MyComponent:ATags,
            copyable: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone ',
            MyComponent:APhoneInput,
            sorter: true,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            MyComponent:AInput,
            sorter: true,
        },
        {
            title: 'District',
            dataIndex: 'district',
            MyComponent:AInput,
            sorter: true,
        },
        
    ]
}