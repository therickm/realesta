import { CommentOutlined, MoneyCollectOutlined, PhoneFilled } from '@ant-design/icons';
import { Button, Descriptions, Divider, PageHeader, Statistic, Table, Tabs } from 'antd'
import React from 'react'
import numeral from 'numeral'
import { pascalCase, spaceCase } from 'case-anything';
import dayjs from 'dayjs';
const { TabPane } = Tabs;
const ClientDetails = (props) => {
    const { closeDrawer, name, code, } = props

    let standings = 0
    const statement = [...props.receipts, ...props.invoices]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(entry => {
            if (entry.type === 'receipts') {
                standings -= entry.amount
                return {
                    ...entry,
                    payment: numeral(entry.amount * -1).format('0,0'),
                    standings: standings,
                    createdAt: dayjs(entry.createdAt).format('DD MMM YY, HH:mm')
                }
            } else if (entry.type === 'invoices') {
                standings += entry.amount
                return {
                    ...entry,
                    invoice: numeral(entry.amount).format('0,0'),
                    standings: standings,
                    createdAt: dayjs(entry.createdAt).format('DD MMM YY, HH:mm')
                }
            }
        }).reverse()

    return (
        <PageHeader
            className="site-page-header-responsive"
            title={name}
            subTitle={code}
            onBack={closeDrawer}
            extra={[
                <Button key="1" type="primary" danger>
                    Evict Tenant
                </Button>,
            ]}
            footer={
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<><MoneyCollectOutlined />Statement</>} key="statement">
                        <Table
                            columns={
                                [
                                    { title: 'Date', dataIndex: 'createdAt' },
                                    { title: 'ID', dataIndex: '_id' },
                                    { title: 'Particulars', dataIndex: 'particulars' },
                                    { title: 'Invoice', dataIndex: 'invoice' },
                                    { title: 'Payment', dataIndex: 'payment' },
                                    { title: 'Standing', dataIndex: 'standings' },
                                ]
                            }
                            dataSource={statement} size="small" />
                    </TabPane>
                    <TabPane tab={<><PhoneFilled />Follow ups</>} key="followups" />
                    <TabPane tab={<><CommentOutlined />Complaints</>} key="complaints" />
                </Tabs>
            }
        >
            <div className="content">
                <div className="main">
                    <Descriptions size="small" column={3}>
                        {['name', 'email', 'phone', 'id_type', 'id_number',]
                            .map(
                                (item, index) =>
                                    <Descriptions.Item label={spaceCase(pascalCase(item))}>{props[item]}</Descriptions.Item>
                            )
                        }
                    </Descriptions>
                    <Descriptions size="small" column={3}>
                        {['property', 'code', 'rooms', 'water_meter', 'electricity_meter', 'landlord']
                            .map(
                                (item, index) =>
                                    <Descriptions.Item label={spaceCase(pascalCase(item))}>{props[item]}</Descriptions.Item>
                            )
                        }
                    </Descriptions>

                </div>
                <div className="extra">
                    <div
                        style={{
                            display: 'flex',
                            width: 'max-content',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Statistic
                            title="Status"
                            value={props.status}
                            style={{
                                marginRight: 32,
                            }}
                        />
                        <Statistic title={`Balance ${props.months ? '(' + props.months + ' months)' : ''}`} prefix="UGX" value={numeral(props.advance === 0 ? props.arrears : props.advance).format('0,0')} />
                    </div>
                </div>
            </div>
        </PageHeader>
    )
}

export default ClientDetails
