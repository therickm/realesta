import React from 'react'
import { Drawer, Button, Form } from 'antd'
import Details from './Details'
import md5 from 'md5'
import CreateForm from './CreateForm'

const TemplateDrawer = (props) => {
    const { contentType, columns, handleAdd, selectedRecord, singular, setTemplateDrawerState, templateDrawerState, actionRef,closeTemplateDrawer } = props

    const [form] = Form.useForm();

    const closeModel = () => {
        setTemplateDrawerState(false)
        form.resetFields()
    }

    return (
        <Drawer
            width={820}
            bodyStyle={{
                padding: '32px 40px 48px',

            }}
            destroyOnClose
            title="Record Details"
            visible={templateDrawerState}
            onClose={closeTemplateDrawer}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={closeModel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>

                    {
                        contentType !== 'view' && <>
                            <Button
                                style={{ marginRight: 8 }}
                                onClick={async () =>
                                    form.validateFields()
                                        .then(async submittedValues => {
                                            const success = await handleAdd({ ...selectedRecord, ...submittedValues,singular:singular });
                                            if (success) {
                                                form.resetFields();
                                                if (actionRef.current) {
                                                    actionRef.current.reload();
                                                }
                                            }
                                        })
                                } type="primary">
                                Save & add more
                            </Button>

                            <Button
                                onClick={async () =>
                                    form.validateFields()
                                        .then(async submittedValues => {


                                            if (submittedValues.password && !submittedValues._id) { submittedValues.password = md5(md5(submittedValues.password)) }
                                            const success = await handleAdd({ ...selectedRecord, ...submittedValues ,singular:singular });
                                            if (success) {
                                                closeModel();
                                                if (actionRef.current) {
                                                    actionRef.current.reload();
                                                }
                                            }
                                        })
                                } type="primary">
                                Save {singular}
                            </Button>
                        </>
                    }
                </div>
            }
        >
            {
                contentType === 'view' ? <Details data={selectedRecord} singular={singular} /> :
                    <CreateForm columns={columns} form={form} selectedRecord={selectedRecord} contentType={contentType} singular={singular}/>
            }
        </Drawer>
    )
}

export default TemplateDrawer
