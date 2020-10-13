import { Button, Drawer, Layout, PageHeader, Row, Statistic, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import Database from '../../database/Database';
import CrudForm from './CrudForm';


const CrudTable = (props) => {

    const [data, setData] = useState([])

    const { columns, collection } = props

    useEffect(() => {
        const db = new Database(collection)
        db.getAllData().then(res => setData(res))
    }, [])

    const [formDrawerVisibility, setFormDrawerVisibility] = useState(false)

    return (
        <>
            <Layout>
                <PageHeader
                    onBack={() => window.history.back()}
                    title="Title"
                    tags={<Tag color="blue">Running</Tag>}
                    subTitle="This is a subtitle"
                    extra={[
                        <Button key="1" type="primary"
                            onClick={() => setFormDrawerVisibility(true)}
                        >
                            Add New
            </Button>,
                    ]}
                >
                    <Row>
                        <Statistic title="Status" value="Pending" />
                        <Statistic
                            title="Price"
                            prefix="$"
                            value={568.08}
                            style={{
                                margin: '0 32px',
                            }}
                        />
                        <Statistic title="Balance" prefix="$" value={3345.08} />
                    </Row>
                </PageHeader>
                <Table columns={columns} dataSource={data} />
            </Layout>
            <Drawer
                width="780"
                visible={formDrawerVisibility}
                onClose={() => setFormDrawerVisibility(false)}
            >
                <CrudForm {...props} />
            </Drawer>
        </>
    )
}

export default CrudTable
