import React from 'react';
import RouterApp from './RouterApp';
import { device } from './apps/constants/device';
import { ScreenOrientation } from "expo";
import { Provider, store } from './RouterModule';



// create a component
class Inisialiasasi extends React.Component {
 
  componentDidMount(){   
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  }
  render() {
    return (
      <Provider store={store}>
        <RouterApp device_id={ device }/>
      </Provider>
    );
  }
}


export default function App() {
  return (
    <Inisialiasasi/>
  );
}


