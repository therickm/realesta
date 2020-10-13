import { Button, Form, Input, message } from 'antd'
import React from 'react'
import Database from '../../database/Database'

const CrudForm = ({ columns, collection }) => {
    return (
        <Form
            {...{
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
            }}
            onFinish={(v) => {
                const db = new Database(collection)
                db.saveDocument(v)
                    .then(res => {
                        console.log(res);
                        message.success('Data added successfully!')
                    })
            }
            }
            onFinishFailed={() => { }}
        >
            {
                columns.map(({ dataIndex, title, formComponent, required, hideInForm }, index) =>
                    formComponent && !hideInForm && <Form.Item
                        key={dataIndex}
                        label={title}
                        name={dataIndex}
                        rules={[{ required: required, message: `${title} is required` }]}
                    >
                        {formComponent === 'input' ? <Input /> : null}
                    </Form.Item>
                )
            }
            <Button type="primary" htmlType="submit">
                Submit
          </Button>
        </Form>
    )
}

export default CrudForm
