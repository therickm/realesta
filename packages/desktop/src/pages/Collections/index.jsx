import React, { useEffect, useState } from 'react'
import { Tabs, PageHeader, Button, Card } from 'antd'
import Collection from './Collection';
import { HomeFilled, BulbOutlined, DollarOutlined, UserSwitchOutlined } from '@ant-design/icons';
import occupations from '@/attributes/occupations';
import Page from '../Template/Page'
import Template from '../Template';

const { TabPane } = Tabs;

const Occupations = () => {

  const [derived, setDerived] = useState({ collection: 'occupations', singular: '', moduleColumns: [] })
  useEffect(() => {
    occupations().then(x => setDerived(x))
  }, [])

  return (
    <>
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
              <Collection category={'Rent'} />
            </TabPane>
            <TabPane tab={<><BulbOutlined />Utilities</>} key="2">
              <Collection category={'Utilities'} />
            </TabPane>
            <TabPane tab={<><DollarOutlined />Others</>} key="3">
              <Collection category={'Others'} />
            </TabPane>
            <TabPane tab={<><UserSwitchOutlined />Assign unit to tenant</>} key="4">
              <Template {...derived} />
            </TabPane>
          </Tabs>
        }
      >
      </PageHeader>

    </>
  )
}

export default Occupations
