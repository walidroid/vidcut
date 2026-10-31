import React, { useReducer } from 'react';
import { observer } from 'mobx-react';
import { plugin, options } from '@pages/editor/SDK';
import { QrcodeElement } from './ElementData';
import { TextArea } from '@douyinfe/semi-ui';
import { language } from '@language/language';

const { Color, Item } = options;

function QrcodeSet(props: { editor: Record<string, any> }) {
  const { editor } = props;
  // 获取当前操作的元素
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const elementData = editor.getElementData() as QrcodeElement;
  const languageType = language.getLanguage();

  const languageData =
    {
      'fr-FR': {
        title: 'Contenu du code QR',
        colorTitle: 'Couleur du code QR',
      },
      'ar-SA': {
        title: 'محتوى رمز الاستجابة السريعة (QR)',
        colorTitle: 'لون رمز الاستجابة السريعة (QR)',
      },
      'en-US': {
        title: 'QR Code Content',
        colorTitle: 'QR Code Color',
      },
    }[languageType] || {
      title: 'QR Code Content',
      colorTitle: 'QR Code Color',
    };

  return (
    <>
      <Item title={languageData.title}>
        <TextArea
          showClear
          value={elementData.text}
          onChange={v => {
            elementData.text = v;
            editor.updateMovie();
            forceUpdate();
          }}
          onBlur={() => {
            // 保存操作记录
            editor.record({
              type: 'elements_update',
              desc: 'Change QR Code Content',
            });
          }}
        />
      </Item>
      <Item title={languageData.colorTitle}>
        <Color
          value={elementData.colorDark}
          onChange={(e: any) => {
            // 修改二维码颜色
            elementData.colorDark = `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`;
            forceUpdate();
            editor.updateMovie();
          }}
          onAfterChange={() => {
            // 保存操作记录
            editor.record({
              type: 'elements_update',
              desc: 'Change QR Code Color',
            });
          }}
        />
      </Item>
    </>
  );
}
export default observer(QrcodeSet);
