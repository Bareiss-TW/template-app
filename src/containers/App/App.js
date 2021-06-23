import React, { useState, useEffect, useCallback } from 'react';
import VisionPanel from '../../components/VisionPanel/VisionPanel';

import classes from './App.module.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const App = props => {

  const [msg, setMsg] = useState('');

  const onReplyMsg = useCallback(
    (e, msg) => {
      console.log(msg)
      setMsg(msg)
    },
    []
  )

  useEffect(() => {
    ipcRenderer.on('reply_Hello', onReplyMsg);
    ipcRenderer.send('Hello')
    return () => {
      ipcRenderer.removeAllListeners();
    }
  }, [onReplyMsg])

  return <div className={classes.Background}>
    <VisionPanel />
  </div>;
}

export default App;
