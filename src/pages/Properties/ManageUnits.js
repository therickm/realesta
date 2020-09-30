import React, { useState, useEffect } from 'react'
import { AInput, AInputNumber, ATextarea } from '@/components/forms/Field';
import { PageHeader, Tabs, Button, Statistic, Descriptions, Divider, Card, Badge, Space, Form, Drawer, message, Popconfirm } from 'antd';
import { queryOne, queryAll, query, add } from '../Template/service';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CreateForm from '../Template/components/CreateForm';
import properties from '@/attributes/properties';
import moment from 'moment'
import UnitView from './UnitView';
import { getDocument, getCollectionDocuments, saveDocument, getAllData } from '@/services/template';
import Page from '../Template/Page';

const ManageUnits = (props) => {

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            MyComponent: AInput
        },
        {
            title: 'Rent',
            dataIndex: 'rent',
            MyComponent: AInputNumber,
            valueType: (item) => ({ type: 'money', locale: 'en-Us' }),
        },
        {
            title: 'Number of rooms',
            dataIndex: 'rooms',
            MyComponent: AInputNumber
        },
        {
            title: 'Water Meter Number',
            dataIndex: 'water_meter',
            MyComponent: AInputNumber
        },
        {
            title: 'Electricity Meter Number',
            dataIndex: 'electricity_meter',
            MyComponent: AInputNumber
        },
        {
            title: 'Description',
            dataIndex: 'description',
            MyComponent: ATextarea
        },
        {
            title: 'Property',
            dataIndex: 'property_id',
            MyComponent: AInput,
            initialValue: props.match.params.id,
            hideInTable: true,
            hidden: true
        },
    ]
    console.log('units', props);

    const [propertyInfo, setPropertyInfo] = useState({ ...props.match.params })
    const [totalUnits, setTotalUnits] = useState(0)
    const [totalRent, setTotalRent] = useState(0)
    const [allOccupied, setAllOccupied] = useState([])
    const [allUnits, setAllUnits] = useState([])

    useEffect(() => {
        getDocument(props.match.params.id,'properties').then(propertyData => {
            setPropertyInfo(propertyData)
            getAllData('units').then(x => {
                setAllUnits(x.filter(u=>u.property_id === props.match.params.id))
                console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',x.filter(u=>u.property_id === props.match.params.id));
                let totalRent = 0
                setTotalUnits(x.filter(u=>u.property_id === props.match.params.id).length)
                x.filter(u=>u.property_id === props.match.params.id).map(d => totalRent += d.rent)
                setTotalRent(totalRent)
            })
                .then(() =>
                getAllData('occupations').then(x => setAllOccupied(x)))
                .then(() => {

                })
        })
    }, [props.match.params.id])



    const AllOccupiedUnits = allUnits.filter((el) => {
        return allOccupied.some((f) => {
            return f.unit === el._id;
        });
    });

    console.log(allUnits, allOccupied, AllOccupiedUnits);

    const rentOccupiedUnits = AllOccupiedUnits.reduce((t, c) => t + c.rent, 0)

    const [form] = Form.useForm();
    const [derivedProperties, setDerivedProperties] = useState({ collection: 'properties', singular: '', moduleColumns: [] })
    useEffect(() => {
        properties().then(x => setDerivedProperties(x))
    }, [])
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const handleAdd = async (fields, collection) => {
        const hide = message.loading('Adding');
        console.log('adding', fields);
        let processedFields = {}
        _.forOwn(fields, (value, key) => { processedFields = { ...processedFields, [key]: moment.isMoment(value) ? moment(value).utc().format() : value } })
        // const processedFields = {...Object.keys(fields).map(field=>moment.isMoment(fields[field])?moment(fields[field]).utc().format():fields[field])}
        console.log('adding', processedFields, collection);
        try {
            await saveDocument({ ...processedFields, type: collection });
            hide();
            message.success('Added successfully');
            return true;
        } catch (error) {
            hide();
            console.log('error', error);
            message.error('Add failed, please try again!');
            return false;
        }
    }


    function confirm(e) {
        console.log(e);
        message.success('Click on Yes');
    }

    function cancel(e) {
        console.log(e);
        message.error('Click on No');
    }


    return (
        <Card>
            <PageHeader
                className="site-page-header-responsive"
                onBack={() => window.history.back()}
                title={propertyInfo.name}
                subTitle={propertyInfo.address}
                extra={[

                    <>
                        <Button key="1" type="primary" onClick={showDrawer}>
                            <EditOutlined /> Edit
                        </Button>
                        <Drawer
                            width={820}
                            bodyStyle={{
                                padding: '32px 40px 48px',

                            }}
                            title={`Update ${propertyInfo.name}`}
                            placement="right"
                            closable={false}
                            onClose={onClose}
                            visible={visible}
                            footer={
                                <div
                                    style={{
                                        textAlign: 'right',
                                    }}
                                >
                                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                                        Cancel
                                    </Button>

                                    <Button
                                        onClick={async () =>
                                            form.validateFields()
                                                .then(async submittedValues => {


                                                    if (submittedValues.password && !submittedValues._id) { submittedValues.password = md5(md5(submittedValues.password)) }
                                                    const success = await handleAdd({ ...propertyInfo, ...submittedValues, type: derivedProperties.singular }, derivedProperties.collection);
                                                    if (success) {
                                                        onClose();
                                                        getDocument(props.match.params.id,properties).then(x => setPropertyInfo(x))
                                                    }
                                                })
                                        } type="primary">
                                        Update {propertyInfo.name}
                                    </Button>
                                </div>
                            }
                        >
                            {propertyInfo.name &&
                                <CreateForm
                                    columns={derivedProperties.moduleColumns}
                                    form={form}
                                    selectedRecord={propertyInfo}
                                    contentType={'update'}
                                    singular={derivedProperties.singular} />
                            }
                        </Drawer>
                    </>
                    ,
                    <Popconfirm
                        placement="bottomRight"
                        title="Are you sure you want to deactivate this property?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button key="2" type="danger">
                            <DeleteOutlined /> Deactivate
                        </Button>
                    </Popconfirm>
                    ,
                ]}
            >
                <div className="content" style={{ display: 'flex' }}>
                    <div className='main'>
                        <Descriptions size="small" column={1}>
                            <Descriptions.Item label="Management Percentage">{propertyInfo.management_percentage} %</Descriptions.Item>
                            <Descriptions.Item label="Created on">{dayjs(propertyInfo.createdAt).format('ddd DD MMM YYYY, HH:mm')}</Descriptions.Item>
                            <Descriptions.Item label="Description">{propertyInfo.remark}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Space className='extra'>
                        <div
                            style={{
                                display: 'flex',
                                width: 'max-content',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Statistic
                                style={{
                                    marginRight: 32,
                                }}
                                title={<>Total Rent <Badge count={`${totalUnits} units`} style={{ backgroundColor: '#0050ff' }} /></>}
                                prefix="UGX"

                                value={totalRent}
                                valueStyle={{ color: '#0050ff' }}
                                footer={
                                    <>
                                        555
                                    </>
                                }
                            />
                            <Statistic
                                style={{
                                    marginRight: 32,
                                }}
                                title={<>Occupied rent <Badge count={`${AllOccupiedUnits.length} units`} style={{ backgroundColor: '#3f8600' }} /></>}
                                prefix="UGX"
                                value={rentOccupiedUnits}
                                valueStyle={{ color: '#3f8600' }}
                            />
                            <Statistic
                                style={{
                                    marginRight: 32,
                                }}
                                title={<>Vacant rent <Badge count={`${totalUnits - AllOccupiedUnits.length} units`} style={{ backgroundColor: '#ff0000' }} /></>}
                                prefix="UGX" value={totalRent - rentOccupiedUnits}
                                valueStyle={{ color: '#ff0000' }}
                            />
                            <Statistic
                                precision={2}
                                style={{
                                    marginRight: 32,
                                }}
                                title={<>% Rent <Badge count={`${((totalUnits - AllOccupiedUnits.length) * 100) / totalUnits}%`} style={{ backgroundColor: '#fa8c16' }} /></>}
                                suffix="%"
                                value={((totalRent - rentOccupiedUnits) * 100) / totalRent}
                                valueStyle={{ color: '#fa8c16' }}
                            />

                        </div>
                    </Space>

                </div>
            </PageHeader>
            <Divider />
            <Page CustomView={UnitView} moduleColumns={columns} name={`Units`} singular='Unit' collection='units' mFilter={{ property_id: propertyInfo._id }} />
        </Card>
    )
}

export default ManageUnits
