import React, { useState, useEffect } from 'react'
import occupations from '@/attributes/occupations'
import { queryAll, queryOne, query } from './Template/service';
import ProTable from '@ant-design/pro-table';
import { Input, Button, Table, Row, Col, Statistic, Card, Badge,Icon } from 'antd';
import receipts from '@/attributes/receipts';
import { ArrowUpOutlined } from '@ant-design/icons';
import { map, includes, sortBy, uniqBy, each, result, get } from "lodash";

const { Search } = Input;
const Collection = () => {

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchText, setSearchText] = useState(null)

    const [keyword, setKeyword] = useState("");

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "_id",
            sorter: true
        },
        {
            title: 'Unit',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Rent',
            dataIndex: 'rent',
            key: 'rent',
            sorter: true
        },
        {
            title: 'Arrears',
            dataIndex: 'arrears',
            key: 'arrears',
            sorter: true,
            render: (text, record) => (
                <span>
                  <Badge
                    color={record.arrears > 0 ? "red" : "green"}
                    text={record.arrears.toLocaleString()}
                  />
                </span>
              )
        },
        {
            title: 'Advance',
            dataIndex: 'advance',
            key: 'advance',
            sorter: true,
            render: (text, record) => (
                <span>
                  {record.advance.toLocaleString()}
                </span>
              )
        },
        {
            title: 'Months',
            dataIndex: 'months',
            key: 'months',
            sorter: true
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            sorter: true,
            render: (text, record) => (
                <span>
                  <Badge
                    color={record.balance > 0 ? "red" : "green"}
                    text={record.balance.toLocaleString()}
                  />
                </span>
              )
        },
        {
            title: 'Landlord',
            dataIndex: 'landlord',
            key: 'landlord  ',
        },
    ]

    const processData = async () => {
        let collectionData = []
        let tt = 0, ta = 0, tArr = 0
        const occupationsAttributes = await occupations()
        const occupationData = await queryAll(occupationsAttributes.collection)
        occupationData.docs.map(
            async (doc, index) => {
                const tenant = await queryOne(doc.tenant)
                const unit = await queryOne(doc.unit)
                const property = await queryOne(unit.property_id)
                const landlord = await queryOne(property.landlord)
                const invoices = await query({ filter: { type: 'invoices', tenant: doc._id } })
                const totalInvoices = invoices.data.reduce((total, row) => total + row.amount, 0)

                console.log('Total invoices', totalInvoices);
                const receipts = await query({ filter: { type: 'receipts', tenant: doc._id } })
                const totalReceipts = receipts.data.reduce((total, row) => total + row.amount, 0)

                console.log('trans', invoices, receipts);

                tt += unit.rent
                tArr += (totalInvoices - totalReceipts) > 0 ? (totalInvoices - totalReceipts) : 0
                ta += (totalInvoices - totalReceipts) <= 0 ? (totalInvoices - totalReceipts) : 0


                setTotalExpectedRent(tt)
                setTotalArrears(tArr)
                setTotalAdvance(ta)

                collectionData.push(
                    {
                        ...unit,
                        ...tenant,
                        landlord: `${landlord.sur_name} ${landlord.first_name}`,
                        name: `${tenant.sur_name} ${tenant.first_name}`,
                        months: (totalInvoices - totalReceipts) / unit.rent,
                        balance: totalInvoices - totalReceipts,
                        arrears: (totalInvoices - totalReceipts) > 0 ? (totalInvoices - totalReceipts) : 0,
                        advance: (totalInvoices - totalReceipts) <= 0 ? (totalInvoices - totalReceipts) : 0,
                        key: unit._id,
                    })
                console.log(collectionData);
                collectionData && setData([...collectionData])
                setFilteredData([...collectionData])
            }
        )
    }

    const [totalExpectedRent, setTotalExpectedRent] = useState(0)
    const [totalArrears, setTotalArrears] = useState(0)
    const [totalAdvance, setTotalAdvance] = useState(0)
    useEffect(() => {
        processData()
    }, [])


    const onSearch = e => {
        const reg = new RegExp(e.target.value, "gi");
        const filteredData = map(data, record => {
          const sur_nameMatch = record.sur_name.match(reg);
          const nameMatch = record.name.match(reg);
          const first_nameMatch = record.first_name.match(reg);
          const last_nameMatch = record.last_name && record.last_name.match(reg);
          const codeMatch = record.code.match(reg);
          if (!nameMatch && !sur_nameMatch && !codeMatch && !first_nameMatch && !last_nameMatch) {
            return null;
          }
          return record;
        }).filter(record => !!record);
    
        console.log(data,filteredData);

        setFilteredData(e.target.value?filteredData:data)
      };

      const suffix = searchText ? (
        <Icon type="close-circle" onClick={this.emitEmpty} />
      ) : null;

    return (
        <div>
            <Row gutter={5}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Expected Rent"
                            value={totalExpectedRent}
                            precision={0}
                            valueStyle={{ color: '#0050ff' }}
                            prefix="UGX"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Advance (Rent & Utilities)"
                            value={totalAdvance}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix="UGX"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Arrears (Rent & Utilities)"
                            value={totalArrears}
                            precision={0}
                            valueStyle={{ color: '#ff0000' }}
                            prefix="UGX"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Arrears (Rent & Utilities)"
                            value={totalArrears}
                            precision={0}
                            valueStyle={{ color: '#ffaa00' }}
                            prefix="UGX"
                        />
                    </Card>
                </Col>
            </Row>
            <Search
                        suffix={suffix}
                        onChange={onSearch}
                        placeholder="Search Records"
                    />

            <Table dataSource={filteredData} columns={columns} size="small" />
        </div>
    )
}

export default Collection
