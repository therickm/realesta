import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import Template from '.'

const Page = (props) => {
    const {Statistics} = props
    return (
        <PageContainer
        content={Statistics&&<Statistics/>}
        >
            <Template {...props}/>
        </PageContainer>
    )
}

export default Page
