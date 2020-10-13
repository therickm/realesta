import { Card, Col, DatePicker, Radio, Row, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import { Bar } from './Charts';
import styles from '../style.less';
import Line from './Charts/Line';
import { homeChartData } from '../../../services/statistics'
import { processData } from '@/utils/utils';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const rankingListData = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: 'dashboard.analysis.test',
    total: 323234,
  });
}

const SalesCard = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}) => {

  const [incomeVsExpense, setIncomeVsExpense] = useState([{ income: 0, expense: 0, date: 0 }])
  const [chartDuration, setChartDuration] = useState('Daily')
  const [mostArrears, setMostArrears] = useState([])
  useEffect(() => {
    homeChartData().then(res => {
      console.log(res);
      setIncomeVsExpense(res)
    })
  }, [])

  useEffect(() => {
    processData('Rent').then(({ TheData }) => setMostArrears(TheData.filter(i => i.arrears > 0).sort((a, b) => a.months - b.months).reverse().slice(0, 6)))
  }, [])

  console.log("aeeertfhgfhghjj", mostArrears);


  return (
    <Card
      loading={loading}
      bordered={false}
      title={<Radio.Group
        options={[
          { label: 'Daily', value: 'Daily' },
          { label: 'Monthly', value: 'Monthly' },
          { label: 'Annual', value: 'Annual' },
        ]}
        onChange={(e) => { console.log(e.target.value); setChartDuration(e.target.value) }}
        value={chartDuration}
        optionType="button"
        buttonStyle="solid"
      />}
    // bodyStyle={{
    //   padding: 0,
    // }}
    >
      <div className={styles.salesCard}>
        <Row>
          <Col xl={16} lg={12} md={12} sm={24} xs={24}>
            <div onClick={() => setIncomeVsExpense({ daily: incomeVsExpense.monthly })
            } className={styles.salesBar}>
              <Line height={295} title={`${chartDuration} Income Vs Expenditure`} data={chartDuration === 'Daily' ? incomeVsExpense.daily : chartDuration === 'Monthly' ? incomeVsExpense.monthly : incomeVsExpense.annual} />
            </div>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>Tenants with most Arrears</h4>
              <ul className={styles.rankingList}>
                {mostArrears.map((item, i) => (
                  <li key={i}>
                    <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                      {i + 1}
                    </span>
                    <span className={styles.rankingItemTitle} title={item.title}>
                      {`${item.name} (${numeral(item.months).format('0.0')})`}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.arrears).format('0,0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  )
}

export default SalesCard;
