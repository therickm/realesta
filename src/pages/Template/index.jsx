import { PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone, DeleteOutlined, SearchOutlined} from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Select, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { add, removeOne, query, bulkRemove, } from './service';
import { ASelect } from '@/components/forms/Field';
import TemplateDrawer from './components/TemplateDrawer';
import moment from 'moment'
import _ from 'lodash'
/**
 * 添加节点
 * @param fields
 */


const Template = (props) => {

  const {moduleColumns,collection, singular, name, mFilter, moreActions } = props
  const [contentType, setContentType] = useState('create')
  const [templateDrawerState, setTemplateDrawerState] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState({})
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [showSearch, setShowSearch] = useState(false)


  const handleAdd = async fields => {
    const hide = message.loading('Adding');
    console.log('adding',fields);
    let processedFields = {}
    _.forOwn(fields,(value,key)=>{processedFields = {...processedFields,[key]:moment.isMoment(value)?moment(value).utc().format():value}})
  // const processedFields = {...Object.keys(fields).map(field=>moment.isMoment(fields[field])?moment(fields[field]).utc().format():fields[field])}
  console.log('adding',processedFields);
    try {
      await add({ ...processedFields,type:collection });
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Add failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async fields => {
    const hide = message.loading('Configuring');
  
    try {
      await add({
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      });
      hide();
      message.success('Successfully configured');
      return true;
    } catch (error) {
      hide();
      message.error('Please try again if the configuration fails!');
      return false;
    }
  };
  /**
   *  删除节点
   * @param selectedRows
   */
  
  const handleRemove = async selectedRows => {
    const hide = message.loading('Deleting');
    if (!selectedRows) return true;
  
    try {
      await bulkRemove({rows:selectedRows});
      hide();
      message.success('Successfully deleted, will refresh soon');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to delete, please try again');
      return false;
    }
  };
  
  const handleSingleRemove = async id => {
    const hide = message.loading('Deleting');
    if (!id) return true;
  
    try {
      await removeOne(id);
      hide();
      message.success('Successfully deleted, will refresh soon');
      return true;
    } catch (error) {
      hide();
      message.error('Failed to delete, please try again');
      return false;
    }
  };
  

  const checkAccessPermission = (toCheck) =>{
    const mod = JSON.parse(localStorage.getItem('role')).permission.find(i=>i.module === collection)
    return mod && mod[toCheck]
  }

  const openTemplateDrawer = (contentType, record = {})=>{
              setTemplateDrawerState(true);
              setContentType(contentType)
              setSelectedRecord(record);
  }

  const closeTemplateDrawer = () =>{
    setTemplateDrawerState(false)
    setSelectedRecord({});
  }
  
  const columns = [
    ...moduleColumns, 
    {
      title: 'Status',
      dataIndex: 'status',
      MyComponent:ASelect,
      initialValue: 'lead',
      filters: true,
      selectOptions:<>
      <Select.Option value='lead'>
                  Lead
              </Select.Option>
        <Select.Option value='processing'>
        Processing
              </Select.Option>
        <Select.Option value='inactive'>
        Inactive
              </Select.Option>
        <Select.Option value='active'>
        Active
              </Select.Option>
      </>,
      valueEnum: {
        lead: {
          text: 'Lead',
          status: 'Default'
        },
        processing: {
          text: 'Processing',
          status: 'Processing'
        },
        active: {
          text: 'Active',
          status: 'Success'
        },
        inactive: {
          text: 'Inactive',
          status: 'Error'
        }
      }
    },
    {
      title:'Entrant',
      dataIndex:'entrant',
      hideInTable:true,
      hideInForm:true,
    },
    {
      title: 'Actions   ',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      render: (_, record) => (
        <>
        {moreActions && moreActions.map(El=><El {...record} />)}
        <span
            onClick={() => {
              openTemplateDrawer('view',record)
            }}
          >
            <EyeTwoTone />
          </span>
          {checkAccessPermission('update') &&<Divider type="vertical"/>}
          {checkAccessPermission('update') &&<span
            onClick={() => {
              openTemplateDrawer('update',record)
            }}
          >
            <EditTwoTone twoToneColor="#F57C00"/>
          </span>}
          {checkAccessPermission('delete') &&<Divider type="vertical"/>}
          {checkAccessPermission('delete') &&<Popconfirm
    title="Are you sure delete this task?"
    onConfirm={() => {
      handleSingleRemove(record);
      actionRef.current?.reloadAndRest();
      setStepFormValues(record);
    }}
    onCancel={()=>message.info('Data not deleted')}
    okText="Yes"
    cancelText="No"
  >
            <DeleteTwoTone twoToneColor="#ff0000" />
  </Popconfirm>
    }
          
        </>
      ),
    },
  ];

  console.log(props);

  return (
    <>
      <ProTable
        headerTitle={
          name
        }
        size="small"
        actionRef={actionRef}
        rowKey="key"
        search={showSearch}
        tableAlertRender  ={false}
        toolBarRender={() => [checkAccessPermission('create') &&<Button type="primary" onClick={() => {
          openTemplateDrawer('create')
        }}> 
          <PlusOutlined /> Add new {singular}
        </Button>,<Tooltip title="Show search tools"><SearchOutlined onClick={()=>setShowSearch(!showSearch)} /></Tooltip>]}
        request={(params, sorter, filter) => query({ ...params, sorter, filter:{...filter,...mFilter, type:collection} })} 
        columns={columns} 
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Selected{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              
              record  (s) &nbsp;&nbsp;
            </div>
          }
        >
          
          <Popconfirm
    title="Are you sure delete this task?"
    onConfirm={async () => {
      await handleRemove(selectedRowsState);
      setSelectedRows([]);
      actionRef.current?.reloadAndRest();
    }}
    onCancel={()=>message.info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ('Data not deleted')}
    okText="Yes"
    cancelText="No"
  >
            <Button  type="danger">
            <DeleteOutlined /> Bulk delete
          </Button>
  </Popconfirm>
        </FooterToolbar>
      )}
        
        <TemplateDrawer 
        handleAdd={handleAdd} 
        columns={columns} 
        actionRef={actionRef}
        values={stepFormValues}
        templateDrawerState={templateDrawerState}
        singular={singular}
        contentType={contentType}
        selectedRecord={selectedRecord}
        closeTemplateDrawer={closeTemplateDrawer}
        setTemplateDrawerState={setTemplateDrawerState}
        />
    </>
  );
};

export default Template
