import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const schoolYears = [];
const DropdownComponent = () => {
  return (
    <View style={styles.container}>
      <Text>dropdownComponent</Text>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
