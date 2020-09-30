import React from 'react'
import { isArray, isObject, isBoolean } from 'lodash';
import { Descriptions, Tag } from 'antd';
import moment from 'moment'
import { pascalCase, spaceCase, kebabCase, snakeCase, constantCase } from 'case-anything'
import dayjs from 'dayjs';
const Details = ({data, singular}) => {

    const createDetails = () => {
        let table = [];
    
        Object.keys(data).map(element =>{
            if(isArray(data[element]) || isObject(data[element])){
                if(isObject(data[element])){
                //     table.push(<Descriptions title={`${element} Info`}>
                //     {createDetails()}
                //   </Descriptions>)

                    console.log('object found',element,data[element]);

                }
            }
            else{
                if(element==='status'){
                    table.push(<Descriptions.Item label={spaceCase(pascalCase(element))}>{
                        data[element] === 'active'?
                        <Tag color="success">{data[element]}</Tag>:
                        data[element] === 'inactive'?
                        <Tag color="error">{data[element]}</Tag>:
                        data[element] === 'processing'?
                        <Tag color="processing">{data[element]}</Tag>:
                        <Tag color="default">{data[element]}</Tag>
                        }</Descriptions.Item>)
                }else{

                    if(element === '_id'|| element === '_rev' || element === 'entrant'|| element === 'updatedAt' || element === 'key'|| element === 'type'|| element === 'updatedBy' || element === 'password'){
                        if(JSON.parse(localStorage.getItem('role')).name === 'Supper Administrator'){

                        }
                    }else{
                        table.push(<Descriptions.Item label={spaceCase(pascalCase(element))}>{element === 'createdAt' ? dayjs(data[element]).format('ddd DD MMM YY, HH:mm'):data[element]}</Descriptions.Item>)
                    }

                    
                }
            }
        })


        
        
        return table;
      };

    return (
        <Descriptions title={`${singular} Info`} column={2} bordered>
        {createDetails()}
      </Descriptions>
    )
}

export default Details
