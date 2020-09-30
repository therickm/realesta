import { AInput, ATextarea }from "@/components/forms/Field";
import modules from "@/modules"; 
export default {
        ...modules.INCOME_EXPENSE_TYPES,
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
        },
    ]
}