import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from "react-dom";
import occupations from '@/attributes/occupations'
import { Input, Button, Table, Row, Col, Statistic, Badge,Icon, Space, Spin } from 'antd';
import { map, } from "lodash";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getAllData } from '@/services/template';
import { processData } from '@/utils/utils';

const { Search } = Input;
const Collection = ({category}) => {



    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchText, setSearchText] = useState(null)

    const [keyword, setKeyword] = useState(""); 
    const tableRef = useRef();
    useEffect(() => {
      if (tableRef.current) {
        const tableCon = ReactDOM.findDOMNode(tableRef.current);
        const table = tableCon.querySelector("table");
        table.setAttribute("id", "tableId");
      }
    }, [tableRef]);

    let columns = [
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
            title: 'Landlord',
            dataIndex: 'landlord',
            key: 'landlord  ',
        },
    ]


    // const [ddata, setDdata] = useLocalStorage('ddata', [[],[]]);
    const [statisticalData, setStatisticalData] = useState({TheData:[],totalRent:0,totalArrears:0,totalAdvance:0})
    const [loadingData, setLoadingData] = useState(true)

    

    const [totalExpectedRent, setTotalExpectedRent] = useState(0)
    const [totalArrears, setTotalArrears] = useState(0)
    const [totalAdvance, setTotalAdvance] = useState(0)

    useEffect(() => {
        processData(category).then(promiseData=>{
            setStatisticalData(promiseData)
            setData(promiseData.TheData)
            setFilteredData(promiseData.TheData)
            setLoadingData(false)
        })
    }, [])

    if(category === "Rent"){
        columns = [...columns,
            {
                title: 'Rent',
                dataIndex: 'rent',
                key: 'rent',
                sorter: true
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
        ]
    }

    const filterByBalance=(balance)=>{
        if(balance === 'cleared'){
            setFilteredData(data.filter(i=>i.balance === 0))
        }else if(balance === 'arrears'){
            setFilteredData(data.filter(i=>i.balance > 0))
        }else if(balance === 'advance'){
            setFilteredData(data.filter(i=>i.balance < 0))
        }
    }

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
        setFilteredData(e.target.value?filteredData:data)
      };

      const suffix = searchText ? (
        <Icon type="close-circle" onClick={this.emitEmpty} />
      ) : null;

    return (
        <div>
            <Row gutter={5} style={{paddingTop:'30px',paddingBottom:'30px'}}>
                {category === "Rent" && <Col span={6}>
                    <Spin spinning={loadingData}>
                        <Statistic
                            title="Total Rent (Current Capacity)"
                            value={statisticalData.totalRent}
                            precision={0}
                            valueStyle={{ color: '#0050ff' }}
                            prefix="UGX"
                        />
                        </Spin>
                </Col>}
                <Col span={category === "Rent"?6:8}>
                    <Spin spinning={loadingData}>
                        <Statistic
                            title="Total Advance"
                            value={statisticalData.totalAdvance}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix="UGX"
                        />
                        </Spin>
                </Col>
                <Col span={category === "Rent"?6:8}>
                    <Spin spinning={loadingData}>
                        <Statistic
                            title="Total Arrears"
                            value={statisticalData.totalArrears}
                            precision={0}
                            valueStyle={{ color: '#ff0000' }}
                            prefix="UGX"
                        />
                        </Spin>
                </Col>
                <Col span={category === "Rent"?6:8}>
                    <Spin spinning={loadingData}>
                        <Statistic
                            title="Total Arrears"
                            value={statisticalData.totalArrears}
                            precision={0}
                            valueStyle={{ color: '#ffaa00' }}
                            prefix="UGX"
                        />
                        </Spin>
                </Col>
            </Row>
            
                <Row style={{paddingBottom:'15px'}}>
                    <Col span={10}>
                    <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="tableId"
        filename="tablexls"
        sheet="tablexls"
        buttonText="Download as XLS"
      />
                    </Col>
                    <Col span={14}>
                        <Space>
                    <Button type="danger" onClick={()=>filterByBalance('arrears')}>
                        Arrears
                    </Button>
                    <Button type="default" onClick={()=>filterByBalance('cleared')}>
                        Cleared
                    </Button>
                    <Button type="primary" onClick={()=>filterByBalance('advance')}>
                        Advance
                    </Button>
                    <Button type="primary" onClick={()=>setFilteredData(data)}>
                        Reset
                    </Button>
            <Search
                        suffix={suffix}
                        onChange={onSearch}
                        placeholder="Search Records"
                    />
                        </Space>
                    </Col>
                </Row>
                

            <Table pagination={{ pageSizeOptions: ["20", "50", "100", "500"], showSizeChanger: true, showQuickJumper: true, position: "bottom" }}  ref={tableRef} loading={loadingData}  dataSource={filteredData} columns={columns} size="small" />
        </div>
    )
}

export default Collection
