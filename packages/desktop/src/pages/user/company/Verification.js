import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import RemoteDB from '../../../../db/remoteDB'
const Verification = ({ next, verificationCode }) => {

    const [form] = Form.useForm();
    const [, forceUpdate] = useState();
    const [loading, setLoading] = useState(false)

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onFinish = values => {
        setLoading(true)
        console.log(values, verificationCode);
        if (verificationCode === Number(values.code)) {
            message.success('Verification successful')
            next()
        }
        setLoading(false)


    };


    return (
        <Form className="steps-content" form={form} style={{ justifyContent: 'center' }} name="horizontal_login" layout="inline" onFinish={onFinish}>

            <Form.Item
                name="code"
                rules={[{ required: true, message: 'Please enter Verification Code sent to your email or phone' }]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="code"
                    placeholder="Verification Code"
                />
            </Form.Item>
            <Form.Item shouldUpdate={true}>
                {() => (
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                            !form.isFieldsTouched(true) ||
                            form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                        loading={loading}
                        onClick={onFinish}
                    >
                        Verify
                    </Button>
                )}
            </Form.Item>
        </Form>
    )
}
export default Verification