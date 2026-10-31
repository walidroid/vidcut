import styles from './styles.module.less';
import Item from '../item';
import { Select } from '@douyinfe/semi-ui';
import type { VideoElement } from 'video-core-sdk';
import { useReducer } from 'react';
import { observer } from 'mobx-react';
import * as PIXI from 'pixi.js';
import { language } from '@language/language';
import { stores } from '@stores/index';

// https://pixijs.download/release/docs/PIXI.html#BLEND_MODES
/**
 * PIXI Blend Modes reference:
 * NORMAL, ADD, MULTIPLY, SCREEN, NONE, DST_IN, DST_OUT, SUBTRACT
 */
export interface IProps {}
function BlendMode(props: IProps) {
  const { editor } = stores;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const elementData = editor.getElementData() as VideoElement;

  const arr = [
    { val: PIXI.BLEND_MODES.NORMAL, ename: 'Normal', name: 'Normal' }, //yes
    { val: PIXI.BLEND_MODES.ADD, ename: 'Add', name: 'Add' }, //yes
    { val: PIXI.BLEND_MODES.MULTIPLY, ename: 'Multiply', name: 'Multiply' }, //yes
    { val: PIXI.BLEND_MODES.SCREEN, ename: 'Screen', name: 'Screen' }, //yes
    
    // { val: PIXI.BLEND_MODES.OVERLAY, ename: 'OVERLAY', name: '叠加' },
    // { val: PIXI.BLEND_MODES.DARKEN, ename: 'DARKEN', name: '变暗' },
    // { val: PIXI.BLEND_MODES.LIGHTEN, ename: 'LIGHTEN', name: '变亮' },
    // { val: PIXI.BLEND_MODES.COLOR_DODGE, ename: 'COLOR_DODGE', name: '颜色减淡' },
    // { val: PIXI.BLEND_MODES.COLOR_BURN, ename: 'COLOR_BURN', name: '颜色加深' },
    // { val: PIXI.BLEND_MODES.HARD_LIGHT, ename: 'HARD_LIGHT', name: '强光' },
    // { val: PIXI.BLEND_MODES.SOFT_LIGHT, ename: 'SOFT_LIGHT', name: '柔光' },
    // { val: PIXI.BLEND_MODES.DIFFERENCE, ename: 'DIFFERENCE', name: '差值' },
    // { val: PIXI.BLEND_MODES.EXCLUSION, ename: 'EXCLUSION', name: '排除' },
    // { val: PIXI.BLEND_MODES.HUE, ename: 'HUE', name: '色相' },
    // { val: PIXI.BLEND_MODES.SATURATION, ename: 'SATURATION', name: '饱和度' },
    // { val: PIXI.BLEND_MODES.COLOR, ename: 'COLOR', name: '颜色' },
    // { val: PIXI.BLEND_MODES.LUMINOSITY, ename: 'LUMINOSITY', name: '明度' },
    // { val: PIXI.BLEND_MODES.NORMAL_NPM, ename: 'NORMAL_NPM' },
    // { val: PIXI.BLEND_MODES.ADD_NPM, ename: 'ADD_NPM', name: '线性减淡NPM' },  //yes
    // { val: PIXI.BLEND_MODES.SCREEN_NPM, ename: 'SCREEN_NPM', name: '滤色NPM' }, //yes

    { val: PIXI.BLEND_MODES.NONE, ename: 'Remove Background', name: 'Remove Background' }, //yes 透明背景会变黑
    // { val: PIXI.BLEND_MODES.SRC_IN, ename: 'SRC_IN' },
    // { val: PIXI.BLEND_MODES.SRC_OUT, ename: 'SRC_OUT' },
    // { val: PIXI.BLEND_MODES.SRC_ATOP, ename: 'SRC_ATOP' },
    // { val: PIXI.BLEND_MODES.DST_OVER, ename: 'DST_OVER' },
    { val: PIXI.BLEND_MODES.DST_IN, ename: 'Inverted Mask', name: 'Inverted Mask' }, //yes
    { val: PIXI.BLEND_MODES.DST_OUT, ename: 'Mask', name: 'Mask' }, //yes
    // { val: PIXI.BLEND_MODES.ERASE, ename: 'ERASE' },
    // { val: PIXI.BLEND_MODES.DST_ATOP, ename: 'DST_ATOP' },
    { val: PIXI.BLEND_MODES.SUBTRACT, ename: 'Subtract', name: 'Subtract' }, //yes
    // { val: PIXI.BLEND_MODES.XOR, ename: 'XOR' },
  ];

  const languageType = language.getLanguage();

  return (
    <Item title={language.val('option_blend_mode')}>
      <Select
        value={elementData.blendMode}
        style={{ width: '100%' }}
        onChange={e => {
          console.log(e);
          elementData.blendMode = e as number;
          editor.updateMovie();
          forceUpdate();
        }}
      >
        {arr.map(d => {
          return (
            <Select.Option key={d.val} value={d.val}>
              {d.ename}
            </Select.Option>
          );
        })}
      </Select>
    </Item>
  );
}
export default observer(BlendMode);
