import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useState} from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';

const DemoCircularProgress: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const getColor = (value: number): string => {
    return value >= 50 ? '#2ecc71' : 'tomato';
  };

  return (
    <View style={styles.container}>
      <Text>DemoCircularProgress</Text>

      <CircularProgress
        radius={90}
        value={85}
        title={'KM/H'}
        titleColor={'#222'}
        titleFontSize={20}
        valueSuffix={'%'}
        activeStrokeColor={getColor(85)} // Using the function to set the color
        inActiveStrokeOpacity={0.2}
        inActiveStrokeWidth={20}
        activeStrokeWidth={20}
        duration={3000}
        onAnimationComplete={() => setValue(45)}
      />
      <CircularProgress
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
      />

      <StatusBar />
    </View>
  );
};

export default DemoCircularProgress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
