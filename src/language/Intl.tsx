import React from 'react';

import { locals, ValueType } from './language';
import { storage } from '@utils/storage';

interface IProps {
  name: string;
  data?: any;
  type?: ValueType;
}

/**
 * <Intl name=""/>
 * @param {string} name key
 * @param {object} data template params
 * @param {string} type language type
 */
function Intl(props: IProps): JSX.Element {
  const { name, data, type } = props;
  const _window = window as any;

  if (!_window.language) {
    const saved = storage.local.get('language');
    _window.language = (saved === 'fr-FR' || saved === 'ar-SA' || saved === 'en-US') ? saved : 'en-US';
  }
  const currentLang = (type || _window.language || 'en-US') as ValueType;
  const dict = locals[currentLang] || locals['en-US'];
  let str = dict?.[name] || locals['en-US']?.[name] || name;
  if (data) {
    for (const key in data) {
      str = str.replaceAll(`{{${key}}}`, data[key]);
    }
  }

  return <>{str}</>;
}

export default Intl;
