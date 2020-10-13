import React from 'react'
import { Form, Button, message, Divider } from 'antd'
import { saveDocument } from '@/services/template';

const SubForm = ({ optionColumns, type, singular, handleSubVisible, setParentValue, reloadList, dataIndex }) => {

  const handleAdd = async fields => {
    const hide = message.loading('Adding');

    try {
      const v = await saveDocument({ ...fields, type: type });
      await reloadList()
      setParentValue(dataIndex, v._id)
      hide();
      message.success(singular + 'Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Add failed, please try again!');
      return false;
    }
  };

  return (
    <div>
      <Form
        {...{
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }}
        onFinish={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleSubVisible(false);
          }
        }} >
        {
          optionColumns && optionColumns.map(
            (props) => props.MyComponent && <props.MyComponent {...props} />
          )
        }
        <Divider />
        <Button
          htmlType="button"
          onClick={() => handleSubVisible(false)}
          // disabled={submitting}
          // loading={submitting}
          style={{ marginTop: '10px' }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          // disabled={submitting}
          // loading={submitting}
          style={{ marginTop: '10px', float: 'right' }}
        >
          Save {singular}
        </Button>
      </Form>
    </div>
  )
}

export default SubForm
