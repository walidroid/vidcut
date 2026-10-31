import { observer } from 'mobx-react';
import { Button, Empty, Input, Modal, Pagination, Select, Spin, Table, Tag, Toast } from '@douyinfe/semi-ui';
import { Refresh, VipOne } from '@icon-park/react';
import { useEffect, useRef, useState } from 'react';
import ContentUser from '@components/content-user';
import { userService } from '@server/user.service';
import { user } from '@stores/user';
import { pubsub, util } from '@utils/index';
import server from './server';
import styles from './styles.module.less';

const creditStatusMap: Record<number, { text: string; type: any }> = {
  0: { text: 'Invalid', type: 'tertiary' },
  1: { text: 'Active', type: 'success' },
  2: { text: 'Depleted', type: 'warning' },
  3: { text: 'Expired', type: 'danger' },
};

const actionMap: Record<string, string> = {
  vip: 'VIP Subscription Bonus',
  vip_month: 'VIP Monthly Allowance',
  purchase: 'Purchase Credits',
  purchase_refund: 'Refund Deduction',
  admin: 'Admin Grant',
  reward: 'Reward Credits',
  consume: 'Usage Consumption',
  deduct: 'Admin Deduction',
  expire: 'Expired Credits',
};

const sourceMap: Record<string, string> = {
  vip: 'VIP Subscription Bonus',
  vip_month: 'VIP Monthly Allowance',
  daily: 'Daily Bonus',
  reward: 'Reward Credits',
  purchase: 'Purchase Credits',
  purchase_refund: 'Refund',
  admin: 'Admin Grant',
  consume: 'Usage Deduction',
  deduct: 'Admin Deduction',
  expire: 'Expired Credits',
};

const sceneMap: Record<string, string> = {
  tts: 'Text-to-Speech',
  auc: 'Audio Transcription',
  video: 'Video Generation',
  image: 'Image Generation',
  cv: 'Computer Vision',
  openai: 'AI Model',
};

const formatTime = (value: any) => (value ? util.formatDate(value, 'YYYY-MM-DD HH:mm:ss') : '-');
const formatDate = (value: any) => (value ? util.formatDate(value, 'YYYY-MM-DD') : 'Permanent');

function Credit() {
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [orderFilters, setOrderFilters] = useState({ keyword: '', status: '', source_type: '' });
  const [logFilters, setLogFilters] = useState({ keyword: '', type: '', source_type: '' });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [logsVisible, setLogsVisible] = useState(false);

  const orderPage = useRef({ page: 1, page_size: 10, total: 0 });
  const logPage = useRef({ page: 1, page_size: 10, total: 0 });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setOrdersLoading(true);
    const [res, err] = await server.getOrders({
      page: orderPage.current.page,
      page_size: orderPage.current.page_size,
      keyword: orderFilters.keyword || undefined,
      status: orderFilters.status === '' ? undefined : Number(orderFilters.status),
      source_type: orderFilters.source_type || undefined,
    });
    setOrdersLoading(false);
    if (err) {
      Toast.error(err);
      return;
    }
    setOrders(res.list || []);
    orderPage.current.total = res.total || 0;
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    const [res, err] = await server.getLogs({
      page: logPage.current.page,
      page_size: logPage.current.page_size,
      keyword: logFilters.keyword || undefined,
      type: logFilters.type || undefined,
      source_type: logFilters.source_type || undefined,
    });
    setLogsLoading(false);
    if (err) {
      Toast.error(err);
      return;
    }
    setLogs(res.list || []);
    logPage.current.total = res.total || 0;
  };

  const searchOrders = () => {
    orderPage.current.page = 1;
    loadOrders();
  };

  const resetOrders = () => {
    setOrderFilters({ keyword: '', status: '', source_type: '' });
    orderPage.current.page = 1;
    loadOrders();
  };

  const searchLogs = () => {
    logPage.current.page = 1;
    loadLogs();
  };

  const resetLogs = () => {
    setLogFilters({ keyword: '', type: '', source_type: '' });
    logPage.current.page = 1;
    loadLogs();
  };

  const openLogs = () => {
    setLogsVisible(true);
    logPage.current.page = 1;
    loadLogs();
  };

  const refreshBalance = async () => {
    setBalanceLoading(true);
    const [, err] = await userService.getUserDetail();
    await loadOrders();
    setBalanceLoading(false);
    if (err) {
      Toast.error(err);
      return;
    }
    Toast.success('Refreshed successfully');
  };

  const creditColumns = [
    { title: 'Record ID', dataIndex: 'id', width: 100 },
    { title: 'Source', dataIndex: 'source_type', width: 140, render: (value: any) => sourceMap[value] || value || '-' },
    {
      title: 'Credits',
      dataIndex: 'credits',
      width: 120,
      render: (value: any) => <span className={styles.amountPositive}>+{Number(value || 0)}</span>,
    },
    {
      title: 'Remaining',
      dataIndex: 'balance',
      width: 120,
      render: (value: any) => value ?? '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      render: (value: any) => {
        const item = creditStatusMap[value] || { text: value || '-', type: 'tertiary' };
        return <Tag type={item.type}>{item.text}</Tag>;
      },
    },
    { title: 'Expires', dataIndex: 'expire_at', width: 170, render: formatDate },
    { title: 'Ref ID', dataIndex: 'source_ref_id', width: 180, render: (value: any, record: any) => value || record.source_ref_type || '-' },
    { title: 'Created At', dataIndex: 'createdAt', width: 170, render: formatTime },
  ];

  const logColumns = [
    { title: 'Time', dataIndex: 'createdAt', width: 170, render: formatTime },
    { title: 'Type', dataIndex: 'type', width: 140, render: (value: any) => actionMap[value] || value || '-' },
    { title: 'Source', dataIndex: 'source_type', width: 140, render: (value: any, record: any) => sourceMap[value || record.type] || value || record.type || '-' },
    {
      title: 'Credit Change',
      dataIndex: 'credits',
      width: 130,
      render: (value: any) => {
        const num = Number(value || 0);
        return <span className={num >= 0 ? styles.amountPositive : styles.amountNegative}>{num > 0 ? `+${num}` : num}</span>;
      },
    },
    { title: 'Balance', dataIndex: 'balance', width: 100, render: (value: any) => value ?? '-' },
    {
      title: 'Scene',
      dataIndex: 'task_type',
      render: (value: any, record: any) => {
        const scene = value || record.scene || record.details?.scene || record.details?.source_type || record.model || '';
        return sceneMap[scene] || scene || '-';
      },
    },
  ];

  if (!user.info) {
    return null;
  }

  return (
    <ContentUser title="My Credits">
      <div className={styles.credit}>
        <div className={styles.balance}>
          <div className={styles.label}>Current Credit Balance</div>
          <div className={styles.value}>{user.info.credits || 0}</div>
          <div className={styles.balanceActions}>
            <Button icon={<Refresh theme="outline" size="16" />} loading={balanceLoading} onClick={refreshBalance}>
              Refresh
            </Button>
            <Button type="primary" icon={<VipOne theme="outline" size="16" />} onClick={() => {
              pubsub.publish('showCreditRecharge');
            }}>
              Recharge Credits
            </Button>
            <Button icon={<VipOne theme="outline" size="16" />} onClick={openLogs}>
              Credit Details
            </Button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Credit Records</div>
          <div className={styles.filters}>
            <Input
              value={orderFilters.keyword}
              placeholder="Record ID / Ref ID"
              showClear
              onChange={keyword => setOrderFilters({ ...orderFilters, keyword })}
              onEnterPress={searchOrders}
            />
            <Select
              value={orderFilters.status}
              placeholder="Status"
              showClear
              onChange={status => setOrderFilters({ ...orderFilters, status: status as string })}
            >
              {Object.entries(creditStatusMap).map(([value, item]) => (
                <Select.Option key={value} value={value}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
            <Select
              value={orderFilters.source_type}
              placeholder="Source"
              showClear
              onChange={source_type => setOrderFilters({ ...orderFilters, source_type: source_type as string })}
            >
              {Object.entries(sourceMap).map(([value, text]) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" onClick={searchOrders}>
              Search
            </Button>
            <Button onClick={resetOrders}>Reset</Button>
          </div>
          <Table
            rowKey="id"
            columns={creditColumns}
            dataSource={orders}
            loading={ordersLoading}
            pagination={false}
            empty={<Empty description="No credit records found" />}
          />
          <div className={styles.pagination}>
            <Pagination
              currentPage={orderPage.current.page}
              pageSize={orderPage.current.page_size}
              total={orderPage.current.total}
              onPageChange={page => {
                orderPage.current.page = page;
                loadOrders();
              }}
            />
          </div>
        </div>

        <Modal title="Credit Details" visible={logsVisible} footer={null} width={860} onCancel={() => setLogsVisible(false)}>
          <Spin spinning={logsLoading}>
            <div className={styles.filters}>
              <Input
                value={logFilters.keyword}
                placeholder="Transaction ID / Order ID"
                showClear
                onChange={keyword => setLogFilters({ ...logFilters, keyword })}
                onEnterPress={searchLogs}
              />
              <Select
                value={logFilters.type}
                placeholder="Change Type"
                showClear
                onChange={type => setLogFilters({ ...logFilters, type: type as string })}
              >
                {Object.entries(actionMap).map(([value, text]) => (
                  <Select.Option key={value} value={value}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={logFilters.source_type}
                placeholder="Source"
                showClear
                onChange={source_type => setLogFilters({ ...logFilters, source_type: source_type as string })}
              >
                {Object.entries(sourceMap).map(([value, text]) => (
                  <Select.Option key={value} value={value}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
              <Button type="primary" onClick={searchLogs}>
                Search
              </Button>
              <Button onClick={resetLogs}>Reset</Button>
            </div>
            <Table rowKey="id" columns={logColumns} dataSource={logs} pagination={false} empty={<Empty description="No credit details found" />} />
            <div className={styles.pagination}>
              <Pagination
                currentPage={logPage.current.page}
                pageSize={logPage.current.page_size}
                total={logPage.current.total}
                onPageChange={page => {
                  logPage.current.page = page;
                  loadLogs();
                }}
              />
            </div>
          </Spin>
        </Modal>
      </div>
    </ContentUser>
  );
}

export default observer(Credit);
