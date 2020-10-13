import React, { useEffect } from 'react'
import { Row, Col, Descriptions, Divider, Card, Timeline } from 'antd';
import { useState } from 'react';
import { queryOne, queryAll, query } from '../Template/service';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {formUserName} from '../../utils/utils' 
import { getDocument, getAllData } from '@/services/template';

const UnitView = (props) => {

    console.log('the unit props',props);
    const [property, setProperty] = useState({})
    const [tenant, setTenant] = useState({})
    const [occupancy,setOccupancy]=useState([])

    useEffect(() => {
       getHistoryData()
    }, [])
      async function getHistoryData(){
        let occupancyHistory = []
        await getDocument(props.data.property_id,'properties').then(x=>setProperty(x))
        await getAllData('occupations',).then(x=>{
            console.log('x',x);
            x.filter(occupationRow=>props.data._id===occupationRow.unit).map(async function (row){
                const tenant = await getDocument(row.tenant,'tenants')
                occupancyHistory.push({type:'in',action:`${formUserName(tenant)} moved in.`,date:row.dateIn})
                row.dateOut && occupancyHistory.push({type:'out',action:`${formUserName(tenant)} moved out.`,date:row.dateOut})
                setOccupancy([...occupancyHistory.sort ( (a, b) => {
                    return new Date(a.date) - new Date(b.date);
              })])
            })
        })
    }

    console.log('occupancy',occupancy);
    return (
        <>
        <Row>
            <Col span={12}>
            <Descriptions column={1} title="Unit Details">
            <Descriptions.Item label="Code">{props.data.code}</Descriptions.Item>
    <Descriptions.Item label="Rooms">{props.data.rooms}</Descriptions.Item>
            <Descriptions.Item label="Rent">{`UGX ${props.data.rent}`}</Descriptions.Item>
            {property&&<Descriptions.Item label="Property">{property.name}</Descriptions.Item>}
            <Descriptions.Item label="Description">
            {props.data.description}
            </Descriptions.Item>
        </Descriptions>
            </Col>

            <Col span={12}>
            <Descriptions column={2} title="Tenants Details">
            <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
            <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="Remark">empty</Descriptions.Item>
            <Descriptions.Item label="Address">
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item>
        </Descriptions>
            </Col>
        </Row>
        <Card title="Unit occupancy history">
        <Timeline mode='left'>
            {
                occupancy && occupancy.reverse().map((record,index)=>
                <Timeline.Item
                dot={<ClockCircleOutlined className="timeline-clock-icon" />} 
                color={record.type ==='out'?"red":"green"}
                 key={index} 
                 label={dayjs(record.date).format('ddd DD MMM YY, HH:mm')}>{record.action}
                 </Timeline.Item>)
            }
      </Timeline>
        </Card>
        </>
    )
}

export default UnitView
