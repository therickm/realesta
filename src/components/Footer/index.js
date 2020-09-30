import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'
import { GithubOutlined } from '@ant-design/icons'

const Footer = () => {
    return (
        <DefaultFooter 
        copyright={`${new Date().getFullYear()}   Madrachi Co Ltd`}
        links={[
          {
            key: 'Documentation',
            title: 'Documentation',
            href: 'https://realesta.com',
            blankTarget: true,
          },
          {
            key: 'github',
            title: <GithubOutlined />,
            href: 'https://github.com/ant-design/ant-design-pro',
            blankTarget: true,
          },
          {
            key: 'App Support',
            title: 'App Support',
            href: 'https://realesta.com',
            blankTarget: true,
          },
        ]}
        />
    )
}

export default Footer
