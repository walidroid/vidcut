import React, { useReducer, useEffect, useState } from 'react';
import styles from './header.module.less';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { user } from '@stores/user';
import logoImg from '@images/logo2.png';
import { Button, Popover, Avatar, Space, Toast } from '@douyinfe/semi-ui';
import Login from '@components/login';
import User from './user/User';
import { config } from '@config/index';
import { theme, ThemeName } from '@theme';
import { layout } from '@stores/layout';
import { IconDuration, IconSun } from '@douyinfe/semi-icons';
import { getInitData } from '@config/initData';
import { server } from './server';
import { pubsub } from '@utils/pubsub';
import Intl from '@language/Intl';
import { language } from '@language/language';
import { AllApplication, Box, International } from '@icon-park/react';
import classNames from 'classnames';
import { reURL } from '@utils/util';
import VipRecharge from '@pages/editor/components/header/VipRecharge';
import CreditRecharge from '@pages/editor/components/header/CreditRecharge';

export interface IProps {
  componentName?: string;
  match?: any;
  navs?: any[];
}

const Header = (props: IProps) => {
  // const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [cid = '', cname = ''] = props.match.params.cid?.split('_') || [];
  const [vipRechargeVisible, setVipRechargeVisible] = useState(false);
  const [creditRechargeVisible, setCreditRechargeVisible] = useState(false);

  // 创建视频
  const createVideo = async () => {
    if (!user.info) {
      pubsub.publish('showLoginModal', true);
      return;
    }

    const initData = getInitData();
    if (cid) {
      initData.category_id = cid;
    }
    const [res, err] = await server.createVideo(initData);
    if (err) {
      Toast.error(err);
      return;
    }
    location.href = `${config.editorHost}/${res.id}`;
  };

  useEffect(() => {
    const vipSub = pubsub.subscribe('showVipRecharge', () => {
      setVipRechargeVisible(true);
    });
    const creditSub = pubsub.subscribe('showCreditRecharge', () => {
      setCreditRechargeVisible(true);
    });
    return () => {
      pubsub.unsubscribe('showVipRecharge');
      pubsub.unsubscribe('showCreditRecharge');
    };
  }, []);

  const languageType = language.getLanguage();

  return (
    <div className={styles.header}>
      <div className={styles.logoNav}>
        <Link to="/">
          <div
            className={classNames({
              [styles.logoen]: true,
            })}
          ></div>
        </Link>
        <div className={styles.nav}>
          <NavLink
            to="/"
            className={styles.text}
            activeClassName={styles.active}
            isActive={(match, location) => {
              if (location.pathname === '/') {
                return true;
              }
            }}
          >
            <Intl name="common_home" />
          </NavLink>
          {props.navs?.map((item, index) => (
            <a key={index} href={item.to} className={styles.text}>
              {item.name}
            </a>
          ))}
          {/* <NavLink to="/article/vip" className={styles.text} activeClassName={styles.active}>
            会员中心
          </NavLink> */}
          {/* <NavLink to="/tools" className={styles.text} activeClassName={styles.active}>
            <Intl name="common_tools" />
          </NavLink> */}
          {/* <a
            href={languageType === 'en-US' ? '/docs/en' : '/docs'}
            target="_blank"
            className={styles.text}
          >
            <Intl name="common_tech_docs" />
          </a> */}
        </div>
      </div>
      <Space spacing={20}>
        {/* <a
          className={styles.space}
          onClick={() => {
            const cur = language.getLanguage();
            if (cur === 'en-US') {
              language.setLanguage('fr-FR');
            } else if (cur === 'fr-FR') {
              language.setLanguage('ar-SA');
            } else {
              language.setLanguage('en-US');
            }
          }}
        >
          <Intl name="user_language" />
        </a> */}
        {!!user.info && (
          <>
            <Link to="/workspace/material" className={styles.space}>
              {/* <Intl name="user_workspace" /> */}
              <Box theme="outline" size="20" fill="var(--theme-icon)" />
              素材
            </Link>
            <Link to="/workspace/draft" className={styles.space + ' ' + styles.active2}>
              {/* <Intl name="user_workspace" /> */}
              <AllApplication theme="outline" size="20" fill="var(--theme-icon)" />
              项目
            </Link>
          </>
        )}
        {/* <a className={styles.createVideoBtn} onClick={createVideo}>
          <Button theme="solid" type="primary" className={styles.create}>
            <Intl name="common_create_video" />
          </Button>
        </a> */}
        {user.info ? (
          <Popover content={<User />} position="bottomRight" trigger="hover">
            <Avatar src={reURL(user.info.avatar, config.resourcesHost)} size="small" color="blue" alt="Lisa LeBlanc">
              {user.info.name.toUpperCase().split('')[0]}
            </Avatar>
          </Popover>
        ) : (
          <Login>
            <Button theme="solid" className={styles.loginBtn}>
              <Intl name="header_login" />
            </Button>
          </Login>
        )}
      </Space>
      <VipRecharge visible={vipRechargeVisible} onCancel={() => setVipRechargeVisible(false)} />
      <CreditRecharge visible={creditRechargeVisible} onCancel={() => setCreditRechargeVisible(false)} />
    </div>
  );
};

export default withRouter(observer(Header));
