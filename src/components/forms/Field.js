import React, { useState, useEffect } from 'react'
import { Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Drawer, Switch } from 'antd';
import PhoneInput from './phone-input';
import TextArea from 'antd/lib/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';
import SubForm from './SubForm'
import { query, queryAll, queryOne } from '@/pages/Template/service';
import MyFormList from './MyFormList';
import { LabelFormatter } from '@/utils/utils';
import _ from 'lodash'
import { getParticulars } from './formUtils';
import DBSelect from './DBSelect';
export const Field = (props) => {


    const { Component, title, dataIndex, selectOptions, onChange, removeLabel,value, form } = props
    
    return (
        <Form.Item  
            label={removeLabel? undefined : title}
            name={dataIndex}
            {...props}
        >
            {
                selectOptions
                    ?
                    <Component 
                    placeholder={`Enter ${title}`}
                    {...props}
                    onChange={onChange}>
                    {selectOptions && selectOptions}
                    
                    </Component>
                    :
                    <Component placeholder={title} onChange={onChange} {...props} style={{width: '100%',}}/>
            }

        </Form.Item>
    )
}

export const AInput = (props) => <Field Component={Input} {...props} />;
export const ASwitch = (props) => <Field Component={Switch} {...props} size="small"/>;
export const APassword = (props) => <Field Component={Input.Password} {...props}/>;
export const ATextarea = (props) => <Field Component={TextArea} {...props} />;
export const AInputNumber = (props) => <Field Component={InputNumber} {...props} />;
export const APhoneInput = (props) => <Field Component={PhoneInput} {...props} />;
export const AFormList = (props) => <Field Component={MyFormList} {...props} {...{wrapperCol: { offset: 0, span: 24 },}} />;
export const ATags = (props) =><Field Component={Select} mode='tags' isTags={true} {...props} tokenSeparators={[',', ';']} showSearch/>
export const ASelect = (props) => <Field Component={Select} defaultValue={props.value} {...props}/>;
export const ADBSelect = DBSelect
export const ADatePicker = (props) => {
const onChange=(v,sV)=>{
    props.setFieldV(props.dataIndex,v)
    console.log('onChange',sV,props);
}
return<Field Component={DatePicker} onChange={onChange} {...props}/>};
