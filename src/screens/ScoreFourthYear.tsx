import {View, Text} from 'react-native';
import React from 'react';
import {RootNavigationProps} from './types';
import {StackNavigationProp} from '@react-navigation/stack';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreFourthYear'>;
}
const ScoreFourthYear = ({navigation}: MyProps) => {
  return (
    <View>
      <Text>ScoreFourthYear</Text>
    </View>
  );
};

export default ScoreFourthYear;
