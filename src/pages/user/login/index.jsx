import { Alert, Checkbox, message } from 'antd';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import LoginForm from './components/Login';
import styles from './style.less';
import { accountLogin, getPermissions } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import { query, queryAll, add } from '@/pages/Template/service';
import md5 from 'md5';
import { init } from '../../../../db/actions';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const [submitting, setSubmitting] = useState(false)
  const { status, type: loginType } = {};
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('users');

  const initUsers = () => {
    queryAll('users').then(
      users=>{
        console.log(users.docs);
        users.docs.length === 0 &&  init()
      }
    )
  }

  useEffect(() => {
    initUsers()
    return () => {
      
    }
  }, [])

  const handleSubmit = values => {
    setSubmitting(true)
    accountLogin(values).then(user=>
      {
        setSubmitting(false)
        getPermissions(user.role).then(role=>{
          localStorage.setItem('user',user._id)
          localStorage.setItem('role',JSON.stringify(role))
          setAuthority(role.name)
          message.success(`Welcome ${user.name}`)
          const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
        })
      })
  };

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <div key="account" tab="Account password login">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="Incorrect account or password（admin/ant.design）" />
          )}

          <UserName
            name="username"
            placeholder="Username: admin or user"
            rules={[
              {
                required: true,
                message: 'Please enter user name!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="Password: ant.design"
            rules={[
              {
                required: true,
                message: 'Please enter the password!',
              },
            ]}
          />
        </div>
        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            Auto login
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            Forget password
          </a>
        </div>
        <Submit loading={submitting}>Login</Submit>
      </LoginForm>
    </div>
  );
};

export default Login
