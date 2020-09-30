import React, { useEffect, useState, createRef } from 'react';
import { Col, Divider, Row, Table, Card } from 'antd';
import dayjs from 'dayjs';
import Pdf from "react-to-pdf";
import { capitalCase, pascalCase } from 'case-anything';
import Page from '../Template/Page';
import receipts from '@/attributes/receipts';
import { getTenantAndUnit } from '../Template/service';



const ref = createRef();
const Receipts = () => {
	const [derived, setDerived] = useState({collection:'receipts',singular:'',moduleColumns:[]})
	useEffect(() => {
		receipts().then(x=>setDerived(x))
	}, [])

	console.log(derived.moduleColumns);

	return (
		<div>
			<Page {...derived} CustomView={View}/>
		</div>
	);
};


const View = (props) =>{

	const {data}=props
	const [tenantAndUnit, setTenantAndUnit] = useState({})
	useEffect(() => {
		getTenantAndUnit(data.tenant).then((one)=>setTenantAndUnit(one))
	}, [])
	console.log('one',tenantAndUnit,data)


	const tenantName=(tenant)=>{
		return `${tenant.title !== 'none'?pascalCase(tenant.title):''} ${tenant.sur_name?tenant.sur_name:''} ${tenant.first_name?tenant.first_name:''} ${tenant.middle_name?tenant.middle_name:''}`
	}
	return (
		<div style={{ padding: 20}}>
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
<div  ref={ref} style={{width:'100%', fontSize:'12px' }}>
		<Row gutter={24} style={{ marginTop: 32 }}>
			<Col span={16	}>
			</Col>
			<Col span={8}>
			<table style={{ marginTop: 10, textAlign:'right', width:'100%' }}>
				<tr>
				  <th>Invoice # :</th>
				  <td>{data._id}</td>
				</tr>
				<tr>
				  <th>Invoice Date :</th>
				<td>{dayjs(data.createdAt).format('ddd DD MMM YY, HH:mm')}</td>
				</tr>
			  </table>
			</Col>
		</Row>
		  <Divider>RECEIPT</Divider>
		  <Row gutter={24} style={{ marginTop: 32 }}>
			<Col span={10}>
			  <h3>Eco Haya</h3>
			  <div>#944/945, 4th Cross, 9th Main,</div>
			  <div>Vijaya Bank Layout,</div>
			  <div>Bannerghatta Road,</div>
			  <div>Bangalore - 560076</div>
			</Col>
			<Col span={10} offset={4}>
			<div>Bill To: <strong>{tenantAndUnit.tenant && tenantName(tenantAndUnit.tenant)}</strong></div>
			<div>Tenants ID: <strong>{tenantAndUnit.tenant && tenantAndUnit.tenant._id}</strong></div>
			<div>Unit Code: <strong>{tenantAndUnit.unit && tenantAndUnit.unit.code}</strong></div>
			<div>Phone: <strong>{tenantAndUnit.tenant && tenantAndUnit.tenant.phone}</strong></div>
			  
			  
			</Col>
		  </Row>

			<Table dataSource={[{...data, unit:tenantAndUnit.unit && tenantAndUnit.unit.code}]}
			pagination={false}
			style={{ marginTop: 48 }}
			size='small'
			tableLayout='auto'
			>
				<Table.Column title="Unit" dataIndex='unit' ellipsis={true} width={100}/>
			  <Table.Column title="Particulars" dataIndex='particulars' />
			  <Table.Column title="Amount" dataIndex='amount' ellipsis={true} width={100} align='right'/>
			</Table>
			
	
		  <Row style={{ marginTop: 30 }}>
			<Col span={5} offset={19}>
			  <table style={{textAlign:'right', width:'100%'}}>
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
	
		  <Row style={{ marginTop: 48, textAlign: 'center' }}>
			notes
		  </Row>
	
		  <Row style={{ marginTop: 48, textAlign: 'center' }}>
			Footer
		  </Row>	
</div>

		</div>
	  );
}

export default Receipts;
