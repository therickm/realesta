import { AInput, ATextarea }from "@/components/forms/Field";

export default {
    name: 'User Types',
        collection:'user_types',
        singular:'User Type',
    moduleColumns : [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            MyComponent:AInput,
            rules: [
                {
                    required: true,
                    message: ' name is required'
                }
            ] 
        },
        {
            title: 'Description',
            dataIndex: 'description',
            MyComponent:ATextarea,
            copyable: true,
        },
    ]
}