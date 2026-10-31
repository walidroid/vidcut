import styles from './filter.module.less';
import Item from '../item';

import { observer } from 'mobx-react';

export interface IProps {}
export default function Filter(props: IProps) {
  return (
    <Item title={language.val('option_tab_filter') || 'Filter'}>
      <div className={styles.opacity}>Filter</div>
    </Item>
  );
}
