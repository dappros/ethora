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
