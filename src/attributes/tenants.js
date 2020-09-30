import { AInput, APhoneInput, ASelect, ATags } from "@/components/forms/Field";
import modules from "../modules";
import { Select } from "antd";

export default {
    ...modules.TENANTS,
    moduleColumns: [
        {
            title: 'Title',
            dataIndex: 'title',
            sorter: true,
            MyComponent: ASelect,
            selectOptions: <>
                <Select.Option value='mr'>
                    Mr.
              </Select.Option>
                <Select.Option value='ms'>
                    Ms.
              </Select.Option>
                <Select.Option value='mrs'>
                    Mrs.
              </Select.Option>
                <Select.Option value='dr'>
                    Dr.
              </Select.Option>
                <Select.Option value='prof'>
                    Prof.
              </Select.Option>
            </>,
            rules: [
                {
                    required: true,
                    message: 'Landlord\'s name is required'
                }
            ]
        },
        {
            title: 'Sur Name',
            dataIndex: 'sur_name',
            sorter: true,
            MyComponent: AInput,

        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: true,
            MyComponent: AInput,

        },
        {
            title: 'Middle Name',
            dataIndex: 'middle_name',
            sorter: true,
            MyComponent: AInput,
        },

        {
            title: 'Email',
            dataIndex: 'email',
            MyComponent: ATags,
            copyable: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            MyComponent: APhoneInput,
            sorter: true,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            MyComponent: APhoneInput,
            sorter: true,
        },
        {
            title: 'ID Type',
            dataIndex: 'id_type',
            selectOptions: <>
                <Select.Option value='national_id'>
                    National ID
              </Select.Option>
                <Select.Option value='driving_permit'>
                    Driving Permit
              </Select.Option>
                <Select.Option value='passport'>
                    Passport
              </Select.Option>
                <Select.Option value='others'>
                    Others
              </Select.Option>
            </>,
            MyComponent: ASelect,
            sorter: true,
        },
        {
            title: 'ID Number',
            dataIndex: 'id_number',
            MyComponent: AInput,
            sorter: true,
        },

    ]
}