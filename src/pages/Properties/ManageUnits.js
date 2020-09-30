import React, { useState, useEffect } from 'react'
import { mapPropsStream } from 'recompose';
import Template from '../Template';
import { AInput, AInputNumber, ATextarea } from '@/components/forms/Field';
import { hidden } from 'chalk';
import { PageHeader, Tabs, Button, Statistic, Descriptions, Divider, Card } from 'antd';
import { queryOne, queryAll, query } from '../Template/service';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

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

    useEffect(() => {
        queryOne(props.match.params.id).then(x => {
            setPropertyInfo(x)


            query({filter:{ type:'units',property_id: x._id }}).then(x=>
                {
                    console.log(x);
                    let totalRent = 0
                    setTotalUnits(x.data.length)
                    x.data.map(d=>totalRent+=d.rent)
                    setTotalRent(totalRent)
                    console.log('tttttttttt',x.data )
    
            })
        })
    }, [props.match.params.id])

    return (
        <Card>
            <PageHeader
                className="site-page-header-responsive"
                onBack={() => window.history.back()}
                title={propertyInfo.name}
                subTitle={propertyInfo.address}
                extra={[
                    <Button key="1" type="primary">
                        <EditOutlined /> Edit
      </Button>,
                    <Button key="2" type="danger">
                        <DeleteOutlined /> Deactivate
      </Button>,
                ]}
            >
                <div className="content" style={{ display: 'flex' }}>
                    <div className='main'>
                        <Descriptions size="small" column={1}>
                            <Descriptions.Item label='Property name'>{propertyInfo.name}</Descriptions.Item>
                            <Descriptions.Item label="Location">{propertyInfo.address}</Descriptions.Item>
                            <Descriptions.Item label="Management Percentage">{propertyInfo.management_percentage} %</Descriptions.Item>
                            <Descriptions.Item label="Created on">{dayjs(propertyInfo.createdAt).format('ddd DD MMM YYYY, HH:mm')}</Descriptions.Item>
                            <Descriptions.Item label="Description">{propertyInfo.description}</Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className='extra'>
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
                                }} title="Total units" value={totalUnits}  valueStyle={{ color: '#0050ff' }}/>
                            <Statistic 
                                style={{
                                    marginRight: 32,
                                }}title="Occupied units" value={568.08}  valueStyle={{ color: '#3f8600' }}/>
                            <Statistic 
                                style={{
                                    marginRight: 32,
                                }}title="Vacant units" value={568.08}  valueStyle={{ color: '#ff0000' }}/>
                            <Statistic 
                                style={{
                                    marginRight: 32,
                                }}title="%age vacant units" suffix="%" value={568.08}  valueStyle={{ color: '#fa8c16' }}/>
                        </div>
                        <Divider />
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
                                }} title="Total rent" prefix="UGX" value={totalRent}  valueStyle={{ color: '#0050ff' }}/>
                            <Statistic 
                                style={{
                                    marginRight: 32,
                                }}title="Occupied rent" prefix="UGX" value={568.08}  valueStyle={{ color: '#3f8600' }}/>
                            <Statistic 
                                style={{
                                    marginRight: 32,
                                }}title="Vacant rent" prefix="UGX" value={568.08}  valueStyle={{ color: '#ff0000' }}/>
                            <Statistic 
                                style={{
                                    marginRight: 32,
                                }}title="%age vacant rent" suffix="%" value={568.08}  valueStyle={{ color: '#fa8c16' }}/>
                        </div>
                    </div>

                </div>
            </PageHeader>
            <Divider />
            <Template moduleColumns={columns} name={`Units`} singular='Unit' collection='units' mFilter={{ property_id: propertyInfo._id }} />
        </Card>
    )
}

export default ManageUnits
