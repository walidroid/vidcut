import { enUS } from './enUS';
import { frFR } from './frFR';
import { arSA } from './arSA';
import { storage } from '@utils/index';

export type ValueType = 'en-US' | 'fr-FR' | 'ar-SA';

export const locals: Record<ValueType, any> = {
  'en-US': enUS,
  'fr-FR': frFR,
  'ar-SA': arSA,
};

const _window = window as any;

/**
 * Internationalization handler (EN, FR & AR)
 */
class Language {
  constructor() {
    const saved = storage.local.get('language');
    _window.language = (saved === 'fr-FR' || saved === 'ar-SA' || saved === 'en-US') ? saved : 'en-US';
    storage.local.set('language', _window.language);
    this.applyDir(_window.language);
  }

  private applyDir(lang: ValueType) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'ar-SA' ? 'ar' : (lang === 'fr-FR' ? 'fr' : 'en');
      if (lang === 'ar-SA') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
  }

  /**
   * Get localized string
   * @param {string} name key
   * @param {object} data template params
   * @param {string} type language type
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
   * Reverse lookup
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
    return (lang === 'fr-FR' || lang === 'ar-SA' || lang === 'en-US') ? lang : 'en-US';
  }

  setLanguage(type: ValueType) {
    storage.local.set('language', type);
    _window.language = type;
    this.applyDir(type);
    location.reload();
  }
}

export const language = new Language();
