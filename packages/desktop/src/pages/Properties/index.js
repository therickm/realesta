import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import { Divider, PageHeader, Button, Descriptions, Space, Statistic, Badge } from 'antd';
import { propertiesStatistics } from '@/services/statistics';
import { PageContainer } from '@ant-design/pro-layout';
import Page from '../Template/Page';
import properties from '@/attributes/properties';
import numeral from 'numeral'
const index = () => {

    const LinkToUnits = (props) => {
        return <><Link to={`/properties/${props._id}`}>Units</Link><Divider type="vertical" /></>
    }

    const [derivedProperties, setDerivedProperties] = useState({ collection: 'properties', singular: '', moduleColumns: [] })
    useEffect(() => {
        properties().then(x => setDerivedProperties(x))
    }, [])

    return (
        <div>
            <Page {...derivedProperties} moreActions={[LinkToUnits,]} Statistics={Statistics} />
        </div>
    );
};

const Statistics = () => {

    const [statisticsData, setStatisticsData] = useState({})

    useEffect(() => {
        propertiesStatistics().then(res => setStatisticsData(res))
        return () => {

        }
    }, [])

    const {
        totalProperties = 0,
        totalUnits = 0,
        occupiedUnits = 0,
        totalRent = 0,
        occupiedRent = 0,
        aManagementPercentage = 0
    } = statisticsData

    return (
        <div>
            <PageHeader
                className="site-page-header-responsive"
                style={{ marginTop: '-30px' }}
            >
                <div className="content" style={{ display: 'flex' }}>
                    <div className='main'>
                        <Descriptions size="small" column={1}>
                            {/* <Descriptions.Item label="Management Percentage">{propertyInfo.management_percentage} %</Descriptions.Item>
                            <Descriptions.Item label="Created on">{dayjs(propertyInfo.createdAt).format('ddd DD MMM YYYY, HH:mm')}</Descriptions.Item> */}
                            <Descriptions.Item label="Number of Properties">{totalProperties}</Descriptions.Item>
                            <Descriptions.Item label="Average Management Percentage">{numeral(aManagementPercentage).format(0.00)}</Descriptions.Item>
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
                                title={<>Occupied rent <Badge count={`${occupiedUnits} units`} style={{ backgroundColor: '#3f8600' }} /></>}
                                prefix="UGX"
                                value={occupiedRent}
                                valueStyle={{ color: '#3f8600' }}
                            />
                            <Statistic
                                style={{
                                    marginRight: 32,
                                }}
                                title={<>Vacant rent <Badge count={`${totalUnits - occupiedUnits} units`} style={{ backgroundColor: '#ff0000' }} /></>}
                                prefix="UGX"
                                value={totalRent - occupiedRent}
                                valueStyle={{ color: '#ff0000' }}
                            />
                            <Statistic
                                precision={2}
                                style={{
                                    marginRight: 32,
                                }}
                                title={<>% Rent <Badge count={`${numeral(((totalUnits - occupiedUnits) / totalUnits) * 100).format('0.00')} %`} style={{ backgroundColor: '#fa8c16' }} /></>}
                                suffix="%"
                                value={numeral(((totalRent - occupiedRent) / totalRent) * 100).format('0.00')}
                                valueStyle={{ color: '#fa8c16' }}
                            />

                        </div>
                    </Space>

                </div>
            </PageHeader>
        </div>
    )
}


export default index;
