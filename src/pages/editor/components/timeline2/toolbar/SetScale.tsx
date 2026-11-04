import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Add, Reduce, AutoWidthOne } from '@icon-park/react';
import { Slider } from '@douyinfe/semi-ui';
import { debounce } from 'lodash';
import { stores } from '@stores/index';
import { pubsub } from '@utils/pubsub';

type Props = {};

const SetScale = (props: Props) => {
  const { editor } = stores;
  const [rscale, setRScale] = useState(editor.rulerScale);

  useEffect(() => {
    setRScale(editor.rulerScale);
  }, [editor.rulerScale]);

  const autoFun = useCallback(() => {
    // 计算合适的scale值
    const elem = document.getElementById('canvaTimelineRuler');
    if (!elem || !editor.movie) return;
    const timelineWidth = elem.clientWidth;
    const totalTime = editor.movie.getTotalTime();
    if (!totalTime) return;
    const scale = Number(Math.max(1, Math.min(500, (timelineWidth - 200) / totalTime)).toFixed(2));
    editor.rulerScale = scale;
  }, [editor.movie]);

  // 缩小 (Zoom out)
  const zoomInFun = useCallback(() => {
    let scale = editor.rulerScale;
    scale = scale - scale / 5;
    if (scale < 1) {
      scale = 1;
    }
    editor.rulerScale = Math.round(scale * 100) / 100;
  }, [editor.rulerScale]);

  // 放大 (Zoom in)
  const zoomOutFun = useCallback(() => {
    let scale = editor.rulerScale;
    scale = scale + scale / 5;
    if (scale > 500) {
      scale = 500;
    }
    editor.rulerScale = Math.round(scale * 100) / 100;
  }, [editor.rulerScale]);

  useEffect(() => {
    const unsub = pubsub.subscribe('keyboardScaleRuler', (_msg, action) => {
      if (action === 'in' || action === 'zoomOut') {
        zoomInFun();
      } else if (action === 'out' || action === 'zoomIn') {
        zoomOutFun();
      } else if (action === 'auto') {
        autoFun();
      }
    });
    return () => {
      pubsub.unsubscribe('keyboardScaleRuler');
    };
  }, [zoomInFun, zoomOutFun, autoFun]);

  const updateScale = useCallback(
    debounce(v => {
      editor.rulerScale = v;
    }, 300),
    [],
  );

  const size = 18;
  return (
    <>
      <section
        onClick={() => {
          autoFun();
        }}
      >
        <AutoWidthOne theme="outline" size={size} fill="var(--theme-icon)" />
      </section>
      <section
        onClick={() => {
          zoomInFun();
        }}
      >
        <Reduce theme="outline" size={size} fill="var(--theme-icon)" />
      </section>
      <section>
        <Slider
          style={{ width: 120 }}
          min={1}
          max={500}
          value={rscale}
          onChange={(v: number) => {
            setRScale(v);
            updateScale(v);
          }}
        />
      </section>
      <section
        onClick={() => {
          zoomOutFun();
        }}
      >
        <Add theme="outline" size={size} fill="var(--theme-icon)" />
      </section>
    </>
  );
};

export default observer(SetScale);
