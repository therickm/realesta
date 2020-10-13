import { getTenantAndUnit } from '@/pages/Template/service';
import { Button, Col, Image, Radio, Row, Space, Table } from 'antd';
import { capitalCase, pascalCase } from 'case-anything';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print';
import './styles.less'
const ReceiptInvoice = (props) => {
    const printRef = useRef();

    const { data } = props
    const [tenantAndUnit, setTenantAndUnit] = useState({})
    const [docType, setDocType] = useState('A4')
    useEffect(() => {
        getTenantAndUnit(data.tenant).then((one) => setTenantAndUnit(one))
    }, [])
    console.log('one', props, tenantAndUnit, data)


    const tenantName = (tenant) => {
        return `${tenant.title !== 'none' ? pascalCase(tenant.title) : ''} ${tenant.sur_name ? tenant.sur_name : ''} ${tenant.first_name ? tenant.first_name : ''} ${tenant.middle_name ? tenant.middle_name : ''}`
    }
    return (
        <div>
            <Space>
                <Radio.Group onChange={e => setDocType(e.target.value)} value={docType}>
                    <Radio value={'A4'}>A4</Radio>
                    <Radio value={'Thermal'}>Thermal</Radio>
                </Radio.Group>
                <ReactToPrint
                    trigger={() => <Button type='primary' success>Print</Button>}
                    content={() => printRef.current}
                />
            </Space>

            <div style={{ width: docType === 'Thermal' ? '250px' : '100%', fontSize: '12px', padding: 20 }} ref={el => (printRef.current = el)}>

                <Row>
                    <Col span={12}>
                        <img style={{ width: '100px' }} src={require('../../assets/logo.png')} />
                    </Col>
                    <Col span={12} style={{ textAlign: 'right', top: 28, position: "relative" }}>
                        Tenants Copy
				</Col>
                </Row>

                <h2 style={{ fontSize: 25, fontWeight: 700 }}><center>{props.singular.toUpperCase()}</center></h2>
                <div className={`information-${docType}`}>
                    <div className='from'>
                        <h3>From</h3>
                        <div>Property aame</div>
                        <div>c/o Madrachi Company Limited</div>
                        <div>0781343882 | 0708183272</div>
                        <div>info@madrachi.ug</div>
                    </div>
                    <div className='to'>
                        <h3>To</h3>
                        <div>{tenantAndUnit.tenant && tenantName(tenantAndUnit.tenant)}</div>
                        <div>Client ID: {tenantAndUnit.tenant && tenantAndUnit.tenant._id}</div>
                        <div>Unit: {tenantAndUnit.unit && tenantAndUnit.unit.code}</div>
                        <div>{tenantAndUnit.tenant && tenantAndUnit.tenant.phone}</div>
                    </div>
                    <div className='doc'>
                        <div>{props.singular}</div>
                        <div>ID: {data._id}</div>
                        <div>{dayjs(data.createdAt).format('ddd DD MMM YY, HH:mm')}</div>
                    </div>
                </div>
                {docType === 'Thermal' ?
                    <>
                        <div>
                            unit: {tenantAndUnit.unit._id}
                        </div>
                        <div>
                            {data.particulars}
                        </div>
                    </>
                    : <Table dataSource={[{ ...data, unit: tenantAndUnit.unit && tenantAndUnit.unit.code }]}
                        pagination={false}
                        style={{ marginTop: 48 }}
                        size='small'
                        tableLayout='auto'
                    >
                        <Table.Column title="Unit" dataIndex='unit' ellipsis={true} width={100} />
                        <Table.Column title="Particulars" dataIndex='particulars' />
                        <Table.Column title="Amount" dataIndex='amount' ellipsis={true} width={100} align='right' />
                    </Table>
                }



                <div style={{ paddingTop: '15px', paddingBottom: '15px', textAlign: '-webkit-right', textAlign: '-webkit-right' }}>
                    <table style={{ textAlign: 'right', width: '150px' }}>
                        <tr>
                            <th>Gross Total :</th>
                            <td>{data.amount}</td>
                        </tr>
                        {
                            props.singular === 'Receipt' && <tr>
                                <th>Balance :</th>
                                <td>0</td>
                            </tr>
                        }
                    </table>
                </div>
                <div span={24} style={{ marginTop: 5, textAlign: 'center', width: '100%' }}>This document is made to the tenant by Madrachi Company Limited on behalf of the landlord.</div>

            </div>

        </div>
    );
}

export default ReceiptInvoice