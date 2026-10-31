import styles from './vipRecharge.module.less';
import { Avatar, Button, Modal, Spin, Toast } from '@douyinfe/semi-ui';
import { CheckOne, Gift } from '@icon-park/react';
import { useEffect, useRef, useState } from 'react';
import { server } from '@pages/editor/server';
import { userService } from '@server/user.service';
import { stores } from '@stores/index';
import { pubsub } from '@utils/pubsub';
import { util } from '@utils/index';
import { config } from '@config/index';

interface IProps {
  visible?: boolean;
  onCancel?: () => void;
}

const statusMap: Record<number, string> = {
  0: 'Pending Payment',
  1: 'Activating...',
  2: 'VIP Activated',
  3: 'Closed',
  4: 'Failed',
};

const unitMap: Record<string, string> = {
  day: ' days',
  month: ' months',
  year: ' years',
};

const VipRecharge = (props: IProps) => {
  const { user } = stores;
  const [packages, setPackages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState(1800);
  const [internalVisible, setInternalVisible] = useState(false);
  const timerRef = useRef<any>();
  const countdownRef = useRef<any>();
  const orderCacheRef = useRef<Record<string, any>>({});
  const selectSeqRef = useRef(0);

  // 外部 prop 或 内部 pubsub 都可控制 visible
  const isVisible = props.visible || internalVisible;

  const closeModal = () => {
    if (props.onCancel) {
      props.onCancel();
      setInternalVisible(false);
    } else {
      setInternalVisible(false);
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const clearAllTimers = () => {
    clearTimer();
    clearCountdown();
  };

  const getOrderRemainingSeconds = (data: any) => {
    if (!data) return 0;
    const expireAt = data.expire_at || data.details?.payment_order?.expireAt || data.details?.payment_order?.expire_at;
    if (expireAt) {
      return Math.max(Math.floor((new Date(expireAt).getTime() - Date.now()) / 1000), 0);
    }
    return Math.max(Number(data.remaining_seconds || 0), 0);
  };

  const isOrderAvailable = (data: any) => Number(data?.status || 0) === 0 && getOrderRemainingSeconds(data) > 0;

  const formatRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.max(seconds % 60, 0)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const formatDuration = (item: any) => `${item?.value || 0}${unitMap[item?.value_unit || item?.unit] || item?.value_unit || item?.unit || ''}`;

  const handlePaymentSuccess = async () => {
    clearAllTimers();
    orderCacheRef.current = {};
    Toast.success('VIP activated successfully');
    await userService.getUserDetail();
    closeModal();
  };

  const loadPackages = async () => {
    const [res, err] = await server.getVipPackages();
    if (err) {
      Toast.error(err);
      return;
    }
    setPackages(res || []);
    const first = res?.[0] || null;
    if (first) {
      selectPackage(first);
    }
  };

  const pollStatus = (orderId: string) => {
    clearTimer();
    timerRef.current = setInterval(async () => {
      const [res, err] = await server.getVipOrderStatus(orderId);
      if (err) {
        return;
      }
      setStatus(Number(res.status));
      if (Number(res.status) === 2) {
        await handlePaymentSuccess();
      }
    }, 3000);
  };

  const startCountdown = (data: any) => {
    clearCountdown();
    setRemainingSeconds(getOrderRemainingSeconds(data));
    countdownRef.current = setInterval(() => {
      setRemainingSeconds(seconds => {
        if (seconds <= 1) {
          clearCountdown();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  };

  const refreshStatus = async () => {
    if (!order?.id) return;
    const [res, err] = await server.getVipOrderStatus(order.id);
    if (err) {
      Toast.error(err);
      return;
    }
    setStatus(Number(res.status));
    if (Number(res.status) === 2) {
      await handlePaymentSuccess();
    }
  };

  const selectPackage = async (item: any) => {
    selectSeqRef.current += 1;
    const currentSeq = selectSeqRef.current;
    console.log('itemitemitemitemitem', item);
    setSelected(item);
    setStatus(0);
    clearAllTimers();
    const cachedOrder = orderCacheRef.current[String(item.id)];
    if (isOrderAvailable(cachedOrder)) {
      if (currentSeq !== selectSeqRef.current) return;
      setOrder(cachedOrder);
      setStatus(Number(cachedOrder.status || 0));
      startCountdown(cachedOrder);
      pollStatus(cachedOrder.id);
      return;
    }
    setOrder(null);
    setLoading(true);
    const [res, err] = await server.createVipOrder(item.id, item.vip_level);
    if (currentSeq !== selectSeqRef.current) return;
    setLoading(false);
    if (err) {
      Toast.error(err);
      return;
    }
    setOrder(res);
    orderCacheRef.current[String(item.id)] = res;
    setStatus(Number(res.status || 0));
    startCountdown(res);
    pollStatus(res.id);
  };

  useEffect(() => {
    if (isVisible) {
      setSelected(null);
      setOrder(null);
      setStatus(0);
      setRemainingSeconds(1800);
      orderCacheRef.current = {};
      loadPackages();
    }
    return clearAllTimers;
  }, [isVisible]);

  // 订阅 pubsub 事件，任何组件可通过 pubsub.publish('showVipRecharge') 打开弹窗
  useEffect(() => {
    pubsub.subscribe('showVipRecharge', () => {
      setInternalVisible(true);
    });
    return () => {
      pubsub.unsubscribe('showVipRecharge');
    };
  }, []);

  return (
    <Modal
      title={null}
      visible={isVisible}
      zIndex={1100}
      closeOnClickModal={false}
      onCancel={() => {
        clearAllTimers();
        closeModal();
      }}
      footer={null}
      width={800}
      className={styles.rechargeModal}
    >
      <div className={styles.recharge}>
        <h2 className={styles.header}>
          Subscribe VIP
          <span className={styles.subtitle}>VIP benefits accumulate and renew automatically.</span>
        </h2>

        <div className={styles.packages}>
          {packages.map((item: any) => (
            <button
              key={item.id}
              className={selected?.id === item.id ? styles.active : ''}
              onClick={() => selectPackage(item)}
            >
              <span className={item.details?.vip_level === 2 ? styles.svipTag : styles.vipTag}>
                {item.details?.vip_level === 2 ? 'SVIP' : 'VIP'}
              </span>
              <strong>{item.name}</strong>
              <em>
                <i>￥</i>
                {Number(item.current_price || 0)}
              </em>
              {Number(item.original_price || 0) > Number(item.current_price || 0) && (
                <del>Regular ￥{Number(item.original_price || 0)}</del>
              )}
              <span>{formatDuration(item)}</span>
              {item.description && <small>{item.description}</small>}
              {item.first_credit > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  background: '#fff0ed',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#ff6a32',
                  fontWeight: 600,
                  marginTop: '6px'
                }}>
                  <Gift size="12" fill="#ff6a32" />
                  Bonus {item.first_credit} Credits
                  {item.first_credit_expire && (
                    <> · Valid for {formatDuration(item.first_credit_expire)}</>
                  )}
                </span>
              )}
              <b>
                <CheckOne theme="outline" size="22" fill="#fff" />
              </b>
            </button>
          ))}
        </div>

        <div className={styles.pay}>
          <div className={styles.qrcodeBox}>
            <div className={styles.qrcode}>
              {loading || !order?.pay_url_base64 ? <Spin /> : <img src={order.pay_url_base64} />}
            </div>
            <p className={styles.qrCountdown}>
              {remainingSeconds > 0 ? `Expires in: ${formatRemaining(remainingSeconds)}` : 'QR code expired'}
            </p>
          </div>
          <div className={styles.payInfo}>
            <p>
              Total: <strong>￥{Number(selected?.current_price || 0)}</strong>
            </p>
            <div className={styles.channels}>
              <span className={styles.wechat}>Pay</span>
              
              <em>Scan QR code to pay</em>
            </div>
            <p className={styles.status}>{statusMap[status] || 'Waiting for payment'}</p>
            <Button onClick={refreshStatus} disabled={!order?.id}>
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VipRecharge;
