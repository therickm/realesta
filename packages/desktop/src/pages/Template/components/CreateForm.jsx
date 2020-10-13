import React from 'react'
import { Form, message } from 'antd'
import { add } from '../service'
const CreateForm = (props) => {

    const { form, columns, selectedRecord, contentType, layout, collection, singular } = props

    console.log('selected', selectedRecord, form);

    if (contentType === 'update') {
        selectedRecord && form.setFieldsValue(selectedRecord)
    } else {
        form.resetFields()
    }

    const setFieldV = (name, val) => {
        form.setFieldsValue({
            [name]: val,
        });
    }

    return (
        <Form
            {...{
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
            }}
            value={50}
            form={form}
            layout={layout}
            onFinish={async () =>
                form.validateFields()
                    .then(async submittedValues => {
                        const hide = message.loading('Adding');
                        console.log('singular', singular);
                        try {
                            await add({ ...selectedRecord, ...submittedValues, type: collection, singular: singular });
                            hide();
                            message.success('Information Updated successfully');
                            return true;
                        } catch (error) {
                            hide();
                            message.error('Add failed, please try again!');
                            return false;
                        }
                    })}
        >
            {
                columns.map(
                    (props, i) => props.MyComponent && !props.hideInForm && <props.MyComponent key={i} form={form} setFieldV={setFieldV} {...props} />
                )
            }
            {props.children}
        </Form>
    )
}

export default CreateForm
