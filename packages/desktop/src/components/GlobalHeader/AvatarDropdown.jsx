import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import { stringify } from 'querystring';
import styles from './index.less';
import { getImageAttachedImage } from '@/pages/Template/service';
import { queryCurrent } from '@/services/user';


const AvatarDropdown = (props) => {

  const [currentUser, setCurrentUser] = useState({})
  const [imageAvatar, setImageAvatar] = useState('')

  useEffect(() => {
    queryCurrent().then(user=>{
      setCurrentUser(user)
      getImageAttachedImage({id:user._id}).then(blob=>blob && (URL.createObjectURL(blob)))
    })
    }, [])

  const onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      localStorage.removeItem('user')
      if (window.location.pathname !== '/user/login') {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      return;
    }

    history.push(`/account/${key}`);
  };

    const {
      menu,
    } = props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            Personal center
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            Personal settings
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          Sign out
        </Menu.Item>
      </Menu>
    );
    
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={imageAvatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }


export default AvatarDropdown
