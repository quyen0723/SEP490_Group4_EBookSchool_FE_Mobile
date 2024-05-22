import {View, Text} from 'react-native';
import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreSecondYear'>;
}
const ScoreSecondYear = ({navigation}: MyProps) => {
  return (
    <View>
      <Text>ScoreSecondYear</Text>
    </View>
  );
};

export default ScoreSecondYear;
