import { Provider } from 'mobx-react';
import React from 'react';
import { Editor } from '@stores/editor';
import { stores, user } from '@stores/index';
import EditorComp from './Editor';

const EditorPage = (props: any) => {
  stores.editor = new Editor();

  return (
    <Provider editor={stores.editor} user={user}>
      <EditorComp {...props} useLocalStorage={true} />
    </Provider>
  );
};

export default EditorPage;
