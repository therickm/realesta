import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import { FormattedMessage } from 'umi';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = ({ loading, visitData, expenseData }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="Arrears"
        action={
          <Tooltip title="Total arrears in rent and other areas">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>126560</Yuan>}
        footer={<Field label="Rent arrears" value={`￥${numeral(12423).format('0,0')}`} />}
        contentHeight={46}
      >
        <Trend
          flag="up"
          style={{
            marginRight: 16,
          }}
        >
          Weekly Changes
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          Daily Changes
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Revenue"
        action={
          <Tooltip title="Income">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={`UGX ${numeral(visitData && visitData[visitData.length - 1].y).format('0,0')}`}
        footer={<Trend
          reverseColor={true}
          flag={visitData[visitData.length - 1].y - visitData[visitData.length - 2].y < 0 ? 'down' : 'up'}
          style={{
            marginRight: 16,
          }}
        >
          Daily change(income)
          <span className={styles.trendText}>{`${numeral(((visitData[visitData.length - 1].y - visitData[visitData.length - 2].y) / visitData[visitData.length - 2].y) * 100).format('0,0')}%`}</span>
        </Trend>}
        contentHeight={46}
      >
        <MiniBar color="#33aa33" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Expenses"
        action={
          <Tooltip title="Money spent including payments">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={`UGX ${numeral(expenseData && expenseData[expenseData.length - 1].y).format('0,0')}`}
        footer={<Trend
          flag={expenseData[expenseData.length - 1].y - expenseData[expenseData.length - 2].y < 0 ? 'down' : 'up'}
          style={{
            marginRight: 16,
          }}
        >
          Daily change(expense)
          <span className={styles.trendText}>{`${numeral(((expenseData[expenseData.length - 1].y - expenseData[expenseData.length - 2].y) / expenseData[expenseData.length - 2].y) * 100).format('0,0')}%`}</span>
        </Trend>}
        contentHeight={46}
      >
        <MiniArea color="#ff0000" data={expenseData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="Operational Capacity"
        action={
          <Tooltip title="Introduce">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total="78%"
        footer={
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              Weekly Changes
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              Weekly Changes
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
