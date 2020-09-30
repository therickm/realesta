import { AInput, APhoneInput,ASelect, ATags, AFormList, ACheckbox, ASwitch, }from "@/components/forms/Field";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import modules from '../modules'
import { Select } from "antd";
console.log(Object.keys(modules));
export default {
    ...modules.ROLES,
    moduleColumns : [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            MyComponent:AInput,
            rules: [
                {
                    required: true,
                    message: 'Landlord\'s name is required'
                }
            ]
        },
        {
            title:'Permissions',
            dataIndex:'permission',
            MyComponent:AFormList,
            removeLabel:true,
            hideInTable:true,
            arrayColumns:[
                {
                    title:'Module',
                    dataIndex:'module',
                    MyComponent:ASelect,
                    selectOptions:<>
                        {Object.keys(modules).map(key=><Select.Option key={key} value={modules[key].collection}>
                            {modules[key].name}
                        </Select.Option>)}
                        </>,
                    width:8,
                    removeLabel:true
                },
                {
                    title:'Create',
                    dataIndex:'create',
                    MyComponent:ASwitch,
                    checkedChildren:<CheckOutlined />, 
                    unCheckedChildren:<CloseOutlined />,
                    width:5
                    
                },
                {
                    title:'Update',
                    dataIndex:'update',
                    MyComponent:ASwitch,
                    checkedChildren:<CheckOutlined />, 
                    unCheckedChildren:<CloseOutlined />,
                    width:5
                },
                {
                    title:'Delete',
                    dataIndex:'delete',
                    MyComponent:ASwitch,
                    checkedChildren:<CheckOutlined />, 
                    unCheckedChildren:<CloseOutlined />,
                    width:5
                },
            ]
        }
        
    ]
}