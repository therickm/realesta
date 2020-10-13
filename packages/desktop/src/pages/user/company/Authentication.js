import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import RemoteDB from '../../../../db/remoteDB'
const Authentication = ({ next, setVerificationCode, setCompanyID }) => {

    const [form] = Form.useForm();
    const [, forceUpdate] = useState();
    const [loading, setLoading] = useState(false)

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onFinish = async values => {
        setLoading(true)
        const db = new RemoteDB('admin_organizations')
        const users = await db.getAllData()
        const user = users.find(x => (x.email === values.username || x._id === values.username || x.phone === values.username) && x.password === values.password);
        setLoading(false)
        if (!user) {
            const email = users.find(x => (x.email === values.username || x._id === values.username || x.phone === values.username));
            if (email) {
                return message.error('Wrong password for provided Email.')
            } else {
                return message.error('This Email is not registered')
            }
        } else {
            setCompanyID(user._id)
            setVerificationCode(555555)
            next()
            message.success('Authentication Successful!')
            return { state: 'success', user: user }
        }

    };
    return (
        <Form className="steps-content" form={form} style={{ justifyContent: 'center' }} name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
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
                        Authenticate
                    </Button>
                )}
            </Form.Item>
        </Form>
    )
}
export default Authentication