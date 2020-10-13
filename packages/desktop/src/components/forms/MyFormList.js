import React from 'react'
import { Form, Space, Input, Button, Row, Col, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined, MinusCircleTwoTone } from '@ant-design/icons';
import { history } from 'umi';

const MyFormList = (props) => {

    const { dataIndex, arrayColumns, form,setFieldV } = props

    console.log('my form list props', props);

    return (
        <Form.List 
         
        name={dataIndex} 
        {...props}>
            {(fields, { add, remove }) => {
                console.log('field Data', fields);
                return (
                    <div>
                        <Divider orientation="left">{props.title}</Divider>
                        {fields.map(field => (
                            <Row gutter={16} key={field.key} style={{ display: 'flex' }}>
                                {
                                    arrayColumns.map(
                                        (column, index) =>
                                            <Col span={column.width}>
                                                    <column.MyComponent 
                                                    {...field}
                                                    name={[field.name, column.dataIndex]}
                                                    fieldKey={[field.fieldKey, column.dataIndex]} {...column} form={form} setFieldV={setFieldV} />
                                            </Col>
                                    )
                                }
                                <Col span={1}>
                                    <Form.Item>
                                        <MinusCircleTwoTone twoToneColor="#ff0000"
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />

                                    </Form.Item>
                                </Col>
                            </Row>
                        ))}

                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                }}
                                block
                            >
                                <PlusOutlined /> Add
                </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form.List>
    )
}

export default MyFormList
