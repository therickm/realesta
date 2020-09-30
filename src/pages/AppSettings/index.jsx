import React, { Component } from 'react';
import { FormattedMessage, connect } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import styles from './style.less';
import Account from './components/Account';
import UserTypes from './components/UserTypes';
import IncomeExpenseTypes from './components/IncomeExpenseTypes';
import PaymentOptions from './components/PaymetOptions';
import Organization from './components/Organization';
const { Item } = Menu;

class AppSettings extends Component {
  main = undefined;

  constructor(props) {
    super(props);
    const menuMap = {
      account: 'Account Settings',
      organization: 'Organization Settings',
      userTypes: 'User Types',
      incomeExpenseTypes: 'Income & Expense Types',
      paymentOptions: 'Payment Options',
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'account',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'appSettings/fetchCurrent',
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };
  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };
  selectKey = (key) => {
    this.setState({
      selectKey: key,
    });
  };
  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };
  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'account':
        return <Account />;

      case 'organization':
        return <Organization />;

      case 'userTypes':
        return <UserTypes />;

      case 'incomeExpenseTypes':
        return <IncomeExpenseTypes />;

      case 'paymentOptions':
        return <PaymentOptions />;

      default:
        break;
    }

    return null;
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser.userid) {
      return '';
    }

    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={({ key }) => this.selectKey(key)}>
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(({ appSettings }) => ({
  currentUser: appSettings.currentUser,
}))(AppSettings);
