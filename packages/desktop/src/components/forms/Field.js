import React, { useState, useEffect } from 'react'
import { DatePicker, Form, Input, InputNumber, Radio, Select, Drawer, Switch } from 'antd';
import PhoneInput from './phone-input';
import TextArea from 'antd/lib/input/TextArea';
import MyFormList from './MyFormList';
import _ from 'lodash'
import DBSelect from './DBSelect';
export const Field = (props) => {



    const { Component, title, dataIndex, selectOptions, onChange, removeLabel, value, form, radioOptions, setFieldV } = props

    radioOptions && setFieldV(dataIndex, radioOptions[0]);

    return (
        <Form.Item
            label={removeLabel ? undefined : title}
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
                    radioOptions ?
                        <Component defaultValue={radioOptions[0]} buttonStyle="solid" options={radioOptions} {...props} onChange={onChange}
                            optionType="button"
                            buttonStyle="solid" />
                        :
                        <Component placeholder={title} onChange={onChange} {...props} style={{ width: '100%', }} />
            }

        </Form.Item>
    )
}

export const AInput = (props) => <Field Component={Input} {...props} />;
export const ARadio = (props) => <Field Component={Radio.Group}{...props} />;
export const ASwitch = (props) => <Field Component={Switch} {...props} size="small" />;
export const APassword = (props) => <Field Component={Input.Password} {...props} />;
export const ATextarea = (props) => <Field Component={TextArea} {...props} />;
export const AInputNumber = (props) => <Field Component={InputNumber} {...props} />;
export const APhoneInput = (props) => <Field Component={PhoneInput} {...props} />;
export const AFormList = (props) => <Field Component={MyFormList} {...props} {...{ wrapperCol: { offset: 0, span: 24 }, }} />;
export const ATags = (props) => <Field Component={Select} mode='tags' isTags={true} {...props} tokenSeparators={[',', ';']} showSearch />
export const ASelect = (props) => <Field Component={Select} defaultValue={props.value} {...props} />;
export const ADBSelect = DBSelect
export const ADatePicker = (props) => {
    const onChange = (v, sV) => {
        props.setFieldV(props.dataIndex, v)
    }
    return <Field Component={DatePicker} onChange={onChange} {...props} />
};
