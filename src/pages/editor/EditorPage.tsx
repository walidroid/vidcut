import { Provider } from 'mobx-react';
import React, { useMemo } from 'react';
import { Editor } from '@stores/editor';
import { stores, user } from '@stores/index';
import EditorComp from './Editor';

const EditorPage = (props: any) => {
  const editor = useMemo(() => {
    const ed = new Editor();
    stores.editor = ed;
    return ed;
  }, [props.match?.params?.appId]);

  return (
    <Provider editor={editor} user={user}>
      <EditorComp {...props} editor={editor} useLocalStorage={true} />
    </Provider>
  );
};

export default EditorPage;
