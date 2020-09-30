import React, { useEffect, useState } from 'react'
import { Tabs, PageHeader, Button, Card } from 'antd'
import occupations from '../attributes/occupations';
import Template from './Template';
import Collection from './Collection';
import TestPage from './TestPage';
import { BuildFilled, HomeFilled, DropboxCircleFilled, BgColorsOutlined, BulbOutlined, DollarOutlined, UserSwitchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const Occupations = () => {

    const [derived, setDerived] = useState({collection:'occupations',singular:'',moduleColumns:[]})
	useEffect(() => {
        occupations().then(x=>setDerived(x))
	}, [])

    return (
        <Card>
          <PageHeader
      style={{
        border: '1px solid rgb(235, 237, 240)',
      }}
      onBack={() => window.history.back()}
      title="Collection"
      subTitle="Income collection & tracking"
      extra={[
        <Button key="1" type="primary">
          Export
        </Button>,
      ]}
      footer={
        <Tabs defaultActiveKey="1">
        <TabPane tab={<><HomeFilled />Rent</>} key="1">
          <Collection />
        </TabPane>
        <TabPane tab={<><BulbOutlined />Utilities</>}  key="2">
          <TestPage />
        </TabPane>
        <TabPane tab={<><DollarOutlined />Others</>} key="3">
          <TestPage />
        </TabPane>
        <TabPane tab={<><UserSwitchOutlined />Others</>} key="4">
          <Template  {...derived}/>
        </TabPane>
        
      </Tabs>
      }
    >
    </PageHeader>
            
        </Card>
    )
}

export default Occupations
