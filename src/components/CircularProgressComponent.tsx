import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {colors} from '../assets/css/colors';

interface CircularProgressComponentProps {
  value: number; // Giá trị của progress
  radius?: number;
}

const CircularProgressComponent: React.FC<CircularProgressComponentProps> = ({
  value,
  radius = 32,
}) => {
  const getColor = (value: number): string => {
    if (value >= 80) {
      return colors.primaryColor;
    } else if (value > 60 && value < 80) {
      return '#5199e1';
    } else if (value > 35 && value <= 60) {
      return '#ee9928';
    } else {
      return '#e73232';
    }
  };

  return (
    <View style={styles.container}>
      <CircularProgress
        radius={radius}
        value={value}
        // title={'KM/H'}
        titleColor={'#222'}
        titleFontSize={10}
        valueSuffix={'%'}
        activeStrokeColor={getColor(value)}
        inActiveStrokeOpacity={0.2}
        inActiveStrokeWidth={10}
        activeStrokeWidth={12}
        duration={3000}
      />
    </View>
  );
};

export default CircularProgressComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

{
  /* <CircularProgress
radius={100}
value={value}
title={'KM/H'}
titleColor={'#222'}
titleFontSize={20}
valueSuffix={'%'}
activeStrokeColor={getColor(value)} // Using the function to set the color
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={6}
duration={4000}
// onAnimationComplete={() => setValue(50)}
/> */
}
