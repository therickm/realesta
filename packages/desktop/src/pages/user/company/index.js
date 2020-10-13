import { LoadingOutlined, LockOutlined, RightCircleFilled, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps, Button, message, Card, Input, Result, Badge } from 'antd';
import Form from 'antd/lib/form/Form';
import React, { useState } from 'react'
import Authentication from './Authentication';
import "./styles.css"
import Verification from './Verification';
const { Step } = Steps;
const company = () => {
    const [current, setCurrent] = useState(0)
    const [verificationCode, setVerificationCode] = useState(111333)
    const [companyID, setCompanyID] = useState(null)


    const next = () => {
        setCurrent(current + 1);
    }
    const prev = () => {
        setCurrent(current - 1);
    }
    const proceed = () => {
        if (companyID) {
            localStorage.setItem('organization', companyID)
            window.location.href = '/login';
        } else {
            message.error('Sorry, something went wrong')
        }
    }

    const steps = [
        {
            title: 'Authentication',
            content: [<Authentication next={next} setVerificationCode={setVerificationCode} setCompanyID={setCompanyID} />],
            icon: <UserOutlined />
        },
        {
            title: 'Verification',
            content: [<Verification next={next} verificationCode={verificationCode} />],
            icon: <SolutionOutlined />
        },
        {
            title: 'Done',
            content: [
                <Result
                    status="success"
                    title="Successfully Purchased Cloud Server ECS!"
                    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    extra={[
                        <Button onClick={proceed} type="primary" key="console">
                            Proceed <RightCircleFilled />
                        </Button>,
                    ]}
                />
            ],
            icon: <SmileOutlined />
        },
    ];
    return (
        <div style={{ textAlign: 'right', alignSelf: 'flex-start', justifySelf: 'center' }}>
            <div style={{ width: 700 }}>
                <Steps current={current} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} icon={steps[current].title === item.title ? <Badge dot={true}>{item.icon}</Badge> : item.icon} />
                    ))}
                </Steps>
                <div>{steps[current].content}
                    {/* <div className="steps-action">
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div> */}
                </div>
            </div>
        </div >
    )
}

export default company

