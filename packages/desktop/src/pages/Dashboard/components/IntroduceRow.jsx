import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Col, Row, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';
import { introData } from '@/services/statistics';
const { Text } = Typography;
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

const IntroduceRow = ({ loading }) => {
  const [arrearsData, setArrearsData] = useState({
    totalArrears: 0,
    totalAdvance: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    expenseData: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    ],
    receiptData: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 0,
        y: 0,
      },
    ],
  });
  useEffect(() => {
    introData().then((res) => setArrearsData(res));
  }, []);
  console.log('arr data', arrearsData);
  return (
    <Row gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="Total Arrears"
          action={
            <Tooltip title="Total arrears in rent and other areas">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => (
            <Text type="danger">UGX {numeral(arrearsData.totalArrears).format('0,0')}</Text>
          )}
          footer={
            <Field
              label="Advance"
              value={
                <Text type="success">
                  UGX {numeral(arrearsData.totalAdvance * -1).format('0,0')}
                </Text>
              }
            />
          }
          contentHeight={46}
        >
          {/* <Trend
           flag="up"
           style={{
             marginRight: 16,
           }}
          >
           Weekly Changes
          <span className={styles.trendText}>12%</span>
          </Trend> */}
          <Trend
            flag={
              ((arrearsData.totalArrears - arrearsData.totalArrearsYesterday) /
                arrearsData.totalArrearsYesterday) *
                100 <
                0
                ? 'down'
                : 'up'
            }
          >
            Daily Changes
            <span className={styles.trendText}>
              {numeral(
                ((arrearsData.totalArrears - arrearsData.totalArrearsYesterday) /
                  arrearsData.totalArrearsYesterday) *
                100,
              ).format('0.00')}
              %
            </span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Revenue (Last 30 days)"
          action={
            <Tooltip title="Income">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={`UGX ${numeral(
            arrearsData.receiptData &&
            arrearsData.receiptData[arrearsData.receiptData.length - 1].y,
          ).format('0,0')}`}
          footer={
            <Trend
              reverseColor={true}
              flag={
                arrearsData.receiptData[arrearsData.receiptData.length - 1].y -
                  arrearsData.receiptData[arrearsData.receiptData.length - 2].y <
                  0
                  ? 'down'
                  : 'up'
              }
              style={{
                marginRight: 16,
              }}
            >
              Daily change
              <span className={styles.trendText}>{`${numeral(
              ((arrearsData.receiptData[arrearsData.receiptData.length - 1].y -
                arrearsData.receiptData[arrearsData.receiptData.length - 2].y) /
                arrearsData.receiptData[arrearsData.receiptData.length - 2].y) *
              100,
            ).format('0.00')}%`}</span>
            </Trend>
          }
          contentHeight={46}
        >
          <MiniBar color="#52ca14" data={arrearsData.receiptData} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Expenses (Last 30 days)"
          action={
            <Tooltip title="Money spent including payments">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={`UGX ${numeral(
            arrearsData.expenseData &&
            arrearsData.expenseData[arrearsData.expenseData.length - 1].y,
          ).format('0,0')}`}
          footer={
            <Trend
              flag={

                arrearsData.expenseData[arrearsData.expenseData.length - 1].y - arrearsData.expenseData[arrearsData.expenseData.length - 2].y < 0
                  ? 'down'
                  : 'up'
              }
              style={{
                marginRight: 16,
              }}
            >
              Daily change
              <span className={styles.trendText}>{`${numeral(
              ((arrearsData.expenseData[arrearsData.expenseData.length - 1].y -
                arrearsData.expenseData[arrearsData.expenseData.length - 2].y) /
                arrearsData.expenseData[arrearsData.expenseData.length - 2].y) *
              100,
            ).format('0.00')}%`}</span>
            </Trend>
          }
          contentHeight={46}
        >
          <MiniArea color="#ff4d4f" data={arrearsData.expenseData} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="Occupancy"
          action={
            <Tooltip title="Introduce">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={`${numeral((arrearsData.occupiedUnits / arrearsData.totalUnits) * 100).format(
            '0.00',
          )}%`}
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {/* <Tag icon={<ExclamationCircleOutlined />} color="#0050ff">
          {arrearsData.totalUnits}
          </Tag> */}

              <Row>
                <Col span={12}>
                  <Trend>
                    <strong>{arrearsData.occupiedUnits}</strong> occupied
                  </Trend>
                </Col>
                <Col span={12}>
                  <Trend>
                    <strong>{arrearsData.totalUnits - arrearsData.occupiedUnits}</strong> vacant
                  </Trend>
                </Col>
              </Row>
            </div>
          }
          contentHeight={46}
        >
          <MiniProgress
            percent={(arrearsData.occupiedUnits / arrearsData.totalUnits) * 100}
            strokeWidth={8}
            target={100}
            color="#52ca14"
          />
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
