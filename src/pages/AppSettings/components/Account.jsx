import React, { useState, useEffect } from 'react'
import users from '../../../attributes/users'
import { Form, Col, Row, Button, Upload } from 'antd'
import CreateForm from '@/pages/Template/components/CreateForm';
import { queryOne, getImageAttachedImage, attachImage } from '@/pages/Template/service';
import styles from './BaseView.less';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import AttachImage from './AttachImage';

const Account = (props) => {
    const [columns, setColumns] = useState({moduleColumns:[],collection:'users'})
    const [currentUser, setCurrentUser] = useState(null)

    const getCurrentUser = (id)=>{
        users().then(x=>setColumns(x))
        queryOne(localStorage.getItem('user')).then(user=>setCurrentUser(user))
    }

    useEffect(() => {
        getCurrentUser()
    }, [])


    const [form] = Form.useForm();

        return (
        <div className={styles.baseView} >
        <div className={styles.left}>
            <CreateForm layout={"vertical"} columns={columns.moduleColumns} form={form} selectedRecord={currentUser} contentType={'update'} collection={columns.collection}>
            <Button
            htmlType="submit"
                type="primary">
                                Update Information
                            </Button>
                </CreateForm>
            </div>
            <div className={styles.right}>
                {
                    currentUser && <AttachImage getUpdatedDoc={getCurrentUser} currentUser={currentUser} styles={styles} />
                }
        </div>
        </div>
    )
}

export default Account
