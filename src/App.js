/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './config/store';
import {Text} from 'react-native';
import Routes from './routes';
import RNBootSplash from 'react-native-bootsplash';
import {StatusBar} from 'react-native';

// Sentry.init({
//   dsn: "https://daaa65328f6041fc915a0074ce208923@o301951.ingest.sentry.io/5843000",
// });

class App extends Component {
  constructor() {
    super();
    Text.defaultProps = Text.defaultProps || {};
    // Text.defaultProps.allowFontScaling = false;
    // if(Text.defaultProps === null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }

  componentDidMount() {
    RNBootSplash.hide();
  }


  render() {
    return (
      <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Routes />
      </Provider>
    );
  }
}

export default App;
