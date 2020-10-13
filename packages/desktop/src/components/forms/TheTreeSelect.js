import React, { useState, useEffect } from "react";
import { TreeSelect } from "antd";
import { queryAll } from "@/pages/Template/service";
import tenants from "@/attributes/tenants";
import { LabelFormatter } from "@/utils/utils";

  const TheTreeSelect = () => {
    const tree = [
        {
          title: "西安sssss",
          value: "0-0",
          key: "0-0",
          disabled: true,
          children: [
            {
              title: "neekoo",
              value: "0-0-1",
              key: "0-0-1"
            },
            {
              title: "kaze",
              value: "0-0-2",
              key: "0-0-2"
            },
            {
              title: "随园",
              value: "0-0-3",
              key: "0-0-3"
            },
            {
              title: "密集安排",
              value: "0-0-4",
              key: "0-0-4"
            }
          ]
        },
        {
          title: "南京",
          value: "0-1",
          key: "0-1",
          disabled: true,
          children: [
            {
              title: "上海",
              value: "0-0-5",
              key: "0-0-5"
            },
            {
              title: "栖霞",
              value: "0-0-6",
              key: "0-0-6"
            },
            {
              title: "koo阳",
              value: "0-0-7",
              key: "0-0-7"
            },
            {
              title: "密集ssss安排",
              value: "0-0-8",
              key: "0-0-8"
            }
          ]
        },
        {
          title: "杭州",
          value: "0-2",
          key: "0-2",
          disabled: true
        }
      ];
    

    const [value, setValue] = useState(undefined)
    const [treeData, setTreeData] = useState([])

    useEffect(() => {

      queryAll(tenants.collection)
      .then(
        ({docs}) =>{

          let tData = []
          queryAll('invoices')
          .then(children=>{
            docs.map(parent=>{

              const availableChildren = children.docs.filter(c=>c.tenant === parent._id)
              console.log(availableChildren,children);
              tData = availableChildren && availableChildren.length > 0 ? [...tData,{
                title: LabelFormatter(['sur_name',' ','first_name',' ','middle_name'],parent),
                value: parent._id,
                key: parent._id,
                disabled: true,
                children: [
                  ...availableChildren.map(child=>{return {title: LabelFormatter(['_id',' ','createdAt',' - ','amount'],child),value: child._id,key: child._id,}})
                ]
        }]:
        null
            })

          console.log('tree data', tData);

      setTreeData(tData)
          })
        }
      )

    }, [])


    const onChange = value => {
      // console.log(value);
      setValue(value)
    };
  
    const onSearch = value => {
      // console.log(value);
      setTreeData(treeData)
    };
  

      return (
              <TreeSelect
              showSearch
              style={{ width: 300 }}
              value={value}
              // dropdownStyle={{ maxHeight: 400, overflow: "auto" }} 
              placeholder="Please select"
              allowClear
              multiple
              filterTreeNode
              treeNodeFilterProp={"title"}
              treeDefaultExpandAll={false}
              dropdownMatchSelectWidth={false}
              onChange={onChange}
              treeData={treeData}
              onSearch={onSearch}
      />
      )
  }
  
  export default TheTreeSelect
  