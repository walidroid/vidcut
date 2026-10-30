import { enUS } from './enUS';
import { frFR } from './frFR';
import { storage } from '@utils/index';

export type ValueType = 'en-US' | 'fr-FR';

export const locals: Record<ValueType, any> = {
  'en-US': enUS,
  'fr-FR': frFR,
};

const _window = window as any;

/**
 * 国际化处理 / Internationalization handler (EN & FR)
 */
class Language {
  constructor() {
    const saved = storage.local.get('language');
    _window.language = (saved === 'fr-FR' || saved === 'en-US') ? saved : 'en-US';
    storage.local.set('language', _window.language);
  }

  /**
   * 国际化语言
   * @param {string} name 字段名称
   * @param {object} data 模板参数：默认是undefined
   * @param {string} type 语言类型，默认是undefined
   */
  val(name: string, data?: any, type?: ValueType): string {
    if (!_window.language) {
      _window.language = this.getLanguage();
    }
    const targetType = type || _window.language || 'en-US';
    let str = locals[targetType as ValueType]?.[name] || locals['en-US']?.[name] || name;
    if (data) {
      for (const key in data) {
        str = str.replaceAll(`{{${key}}}`, data[key]);
      }
    }
    return str;
  }

  /**
   * 反向查找语言
   */
  findVal(value: string, valueType: ValueType = 'en-US'): string {
    if (!_window.language) {
      _window.language = this.getLanguage();
    }
    const source = locals[valueType] || locals['en-US'];
    for (const key in source) {
      if (source[key] === value) {
        return locals[_window.language as ValueType]?.[key] || value;
      }
    }
    return value;
  }

  getLanguage(): ValueType {
    const lang = _window.language || storage.local.get('language');
    return (lang === 'fr-FR' || lang === 'en-US') ? lang : 'en-US';
  }

  setLanguage(type: ValueType) {
    storage.local.set('language', type);
    _window.language = type;
    location.reload();
  }
}

export const language = new Language();
