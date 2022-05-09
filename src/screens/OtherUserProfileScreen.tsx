import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface OtherUserProfileScreenProps {}

const OtherUserProfileScreen = (props: OtherUserProfileScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>OtherUserProfileScreen</Text>
    </View>
  );
};

export default OtherUserProfileScreen;

const styles = StyleSheet.create({
  container: {}
});
