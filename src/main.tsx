import '@less/initialize.less';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'mobx-react';
import { stores } from './stores';
import { BrowserRouter } from 'react-router-dom';
import { routes } from './routes.config';
import { LocaleProvider } from '@douyinfe/semi-ui';
import { language } from '@language/language';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import fr from '@douyinfe/semi-ui/lib/es/locale/source/fr';
import ar from '@douyinfe/semi-ui/lib/es/locale/source/ar';

const locale = {
  'en-US': en_US,
  'fr-FR': fr,
  'ar-SA': ar,
}[language.getLanguage()] || en_US;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocaleProvider locale={locale}>
    <Provider {...stores}>
      <App Router={BrowserRouter} routes={routes} />
    </Provider>
  </LocaleProvider>,
);

export { routes };
