import react,{ useState, useEffect } from "react"
import { Select, Drawer } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { Field } from "./Field"
import SubForm from "./SubForm"
import { queryAll, queryOne } from "@/pages/Template/service"
import { LabelFormatter } from "@/utils/utils"
import { getAllData } from "@/services/template"

const DBSelect = (props) => {

    const [optionsData, setOptionsData] = useState([])
    const [childrenDrawer, setChildrenDrawer] = useState(false)
    const [parentValue, setParentValue] = useState(null)


    

    const { options, LabelFormat, singular, type, optionColumns, createNew=true } = props


    const reloadList = async () => {
        if(_.isArray(type)){
            let data =[]
            console.log(type.map(aType=>getAllData(aType).then((response) => {data = [...data,...response]; console.log(data);setOptionsData(data)})))    
        }else{
            getAllData(type).then((response) => setOptionsData(response))
        }
    }
    useEffect(() => {
        reloadList();
    }, [childrenDrawer,parentValue])


    console.log(optionsData);

    const selectOptions = <>
        {optionsData.map((data) =>
            <Select.Option value={data._id} key={data._id}>
                {LabelFormatter(LabelFormat,data)}
            </Select.Option>
        )}
        {createNew && <Select.Option value="create new" key="new" style={{ borderTop: '1px solid #e8e8e8' }}>
            <PlusOutlined />
            {` `}
                Create New {singular}
                </Select.Option>
        }
    </>
    const onChange = (v) => {
        props.dataIndex === 'income_expense_type' && getParticulars(props.form);
        v === 'create new' && setChildrenDrawer(true)
    }
    return (<>
        <Field 
            placeholder={`Select or create a ${singular}`}
            showSearch
            Component={Select}
            selectOptions={selectOptions}
            onChange={onChange}
            passedValue={parentValue}

            {...props} />
        <Drawer
            title={`Quick add ${singular}`}
            width={720}
            closable={false}
            onClose={() => setChildrenDrawer(false)}
            visible={childrenDrawer}
        >
            <SubForm reloadList={reloadList} handleSubVisible={() => setChildrenDrawer(false)}
                optionColumns={[...optionColumns]}
                type={type}
                setParentValue={setParentValue}
                singular={singular} />
        </Drawer>
    </>)
}

export default DBSelect