import { Breadcrumb, Button, Layout, Menu, Slider } from 'antd'
import Head from 'next/head'



export default function Home() {
  return (
    <div className="container">

      <Layout>
        <Layout.Header>
          <div className='logo' />
        </Layout.Header>
        <Layout.Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Layout className="site-layout-background" style={{ padding: '24px 0', background: '#fff' }}>
            <Layout.Sider className="site-layout-background" width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys='dashboard'
                style={{ height: '100%' }}
              >
                <Menu.Item key='dashboard'>
                  Dashboard
          </Menu.Item>
                <Menu.Item key='organizations'>
                  Organizations
          </Menu.Item>
                <Menu.Item key='plans'>
                  Plans
          </Menu.Item>
              </Menu>

            </Layout.Sider>
            <Layout.Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Layout.Content>
          </Layout>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Layout.Footer>
      </Layout>
    </div>
  )
}
