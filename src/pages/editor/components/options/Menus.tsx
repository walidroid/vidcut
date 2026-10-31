import styles from './menus.module.less';
// import { SettingConfig, Performance, SpeedOne, WindmillTwo, MagicWand } from '@icon-park/react';
import { observer } from 'mobx-react';
import type * as ctypes from '@config/types';
import type { BaseElement } from 'video-core-sdk';
import { stores } from '@stores/index';

export interface IProps {
  elements: BaseElement[];
}

export interface NavItem {
  id: ctypes.ElementOptionType;
  name: string;
  // icon: JSX.Element;
}

function Menus(props: IProps) {
  const { editor } = stores;
  const elements = props.elements;
  if (elements.length > 1) {
    return <div>group</div>;
  }
  const [element] = elements;

  const staticNavs: NavItem[] = [
    {
      id: 'basic',
      name: language.val('option_tab_base') || 'Basic',
    },
    {
      id: 'audio',
      name: language.val('option_tab_audio') || 'Audio',
    },
    {
      id: 'speed',
      name: language.val('option_speed') || 'Speed',
    },
    {
      id: 'animation',
      name: language.val('option_tab_animation') || 'Animation',
    },
    {
      id: 'colour',
      name: language.val('option_adjust') || 'Adjust',
    },
  ];

  let navTypes = [];
  switch (element.type) {
    case 'image':
      navTypes = ['basic', 'animation', 'colour'];
      break;
    case 'video':
      navTypes = ['basic', 'audio', 'speed', 'animation', 'colour'];
      break;
    case 'audio':
      navTypes = ['basic', 'speed'];
      break;
    case 'text':
      navTypes = ['basic', 'animation', 'colour'];
      break;
    case 'filter':
    case 'effect':
      navTypes = ['basic'];
      break;
    default:
      return <div style={{ color: '#ccc', padding: 10 }}>Not configured: {element.type}</div>;
  }
  const navs: NavItem[] = staticNavs.filter(d => navTypes.includes(d.id));

  return (
    <div className={styles.menus}>
      {navs.map(nav => {
        return (
          <a
            onClick={() => {
              editor.setElementOptionType(nav.id);
            }}
            key={nav.id}
            className={nav.id === editor.elementOptionType ? styles.active : ''}
          >
            {/* {nav.icon} */}
            <p>{nav.name}</p>
          </a>
        );
      })}
    </div>
  );
}

export default observer(Menus);
