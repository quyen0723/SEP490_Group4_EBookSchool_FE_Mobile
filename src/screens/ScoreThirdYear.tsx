import {View, Text} from 'react-native';
import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreThirdYear'>;
}
const ScoreThirdYear = ({navigation}: MyProps) => {
  return (
    <View>
      <Text>ScoreThirdYear</Text>
    </View>
  );
};

export default ScoreThirdYear;
