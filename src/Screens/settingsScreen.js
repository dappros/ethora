/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, { Component } from 'react';
import {Text, SafeAreaView } from 'react-native';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text> settingsScreen </Text>
      </SafeAreaView>
    );
  }
}
