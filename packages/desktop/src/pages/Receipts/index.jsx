import React, { useEffect, useState, createRef, useRef } from 'react';
import { Col, Divider, Row, Table, Card, Button } from 'antd';
import dayjs from 'dayjs';
import Pdf from "react-to-pdf";
import { capitalCase, pascalCase } from 'case-anything';
import Page from '../Template/Page';
import receipts from '@/attributes/receipts';
import { getTenantAndUnit } from '../Template/service';
import ReactToPrint from "react-to-print";
import ReceiptInvoice from '@/components/ReceiptInvoice';



const ref = createRef();
const Receipts = () => {
	const [derived, setDerived] = useState({ collection: 'receipts', singular: '', moduleColumns: [] })
	useEffect(() => {
		receipts().then(x => setDerived(x))
	}, [])

	console.log(derived.moduleColumns);

	return (
		<div>
			<Page {...derived} CustomView={ReceiptInvoice} />
		</div>
	);
};


const View = (props) => {

	const printRef = useRef();

	const { data } = props
	const [tenantAndUnit, setTenantAndUnit] = useState({})
	useEffect(() => {
		getTenantAndUnit(data.tenant).then((one) => setTenantAndUnit(one))
	}, [])
	console.log('one', tenantAndUnit, data)


	const tenantName = (tenant) => {
		return `${tenant.title !== 'none' ? pascalCase(tenant.title) : ''} ${tenant.sur_name ? tenant.sur_name : ''} ${tenant.first_name ? tenant.first_name : ''} ${tenant.middle_name ? tenant.middle_name : ''}`
	}
	return (
		<div>
			<Pdf targetRef={ref} filename={`Invoice - ${tenantAndUnit.tenant && tenantName(tenantAndUnit.tenant)} - ${tenantAndUnit.unit && tenantAndUnit.unit.code} (${dayjs(Date.now()).format('ddd DD MMM YY, HH:mm')})`}>
				{({ toPdf }) => (
					<button
						className="button is-danger is-outlined is-small"
						onClick={toPdf}
					>
						Export PDF
					</button>
				)}
			</Pdf>
			<ReactToPrint
				trigger={() => <Button type='primary' success>Print</Button>}
				content={() => printRef.current}
			/>
			<div style={{ width: '100%', fontSize: '12px', padding: 20 }} ref={el => (printRef.current = el)}>

				<Row>
					<Col span={12}>
						Logo
				</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						Tenants Copy
				</Col>
				</Row>

				<h2 style={{ fontSize: 25, fontWeight: 700 }}><center>RECEIPT</center></h2>
				<Row>
					<Col
						span={8}
						sm={24}
					>
						<h3>From</h3>
						<div>Property aame</div>
						<div>c/o Madrachi Company Limited</div>
						<div>0781343882 | 0708183272</div>
						<div>info@madrachi.ug</div>
					</Col>
					<Col xs={24} span={8} style={{ textAlign: 'center' }}>
						<h3>To</h3>
						<div>{tenantAndUnit.tenant && tenantName(tenantAndUnit.tenant)}</div>
						<div>Client ID: {tenantAndUnit.tenant && tenantAndUnit.tenant._id}</div>
						<div>Unit: {tenantAndUnit.unit && tenantAndUnit.unit.code}</div>
						<div>{tenantAndUnit.tenant && tenantAndUnit.tenant.phone}</div>
					</Col>
					<Col xs={24} span={8} style={{ textAlign: 'right' }}>
						<h3>Receipt</h3>
						<h3>#: <strong>{data._id}</strong></h3>
						<h3><strong>{dayjs(data.createdAt).format('ddd DD MMM YY, HH:mm')}</strong></h3>
					</Col>
				</Row>
				<Table dataSource={[{ ...data, unit: tenantAndUnit.unit && tenantAndUnit.unit.code }]}
					pagination={false}
					style={{ marginTop: 48 }}
					size='small'
					tableLayout='auto'
				>
					<Table.Column title="Unit" dataIndex='unit' ellipsis={true} width={100} />
					<Table.Column title="Particulars" dataIndex='particulars' />
					<Table.Column title="Amount" dataIndex='amount' ellipsis={true} width={100} align='right' />
				</Table>


				<Row style={{ marginTop: 30 }}>
					<Col span={5} sm={12} style={{ textAlign: 'right' }}>
						<table style={{ textAlign: 'right', width: '100%' }}>
							<tr>
								<th>Gross Total :</th>
								<td>{data.amount}</td>
							</tr>
							<tr>
								<th>Balance :</th>
								<td>0</td>
							</tr>
						</table>
					</Col>
				</Row>
				<Row >
					<Col span={24} style={{ marginTop: 5, textAlign: 'center' }}>This document is made to the tenant by Madrachi Company Limited on behalf of the landlord.</Col>
				</Row>
			</div>

		</div>
	);
}

export default Receipts;
