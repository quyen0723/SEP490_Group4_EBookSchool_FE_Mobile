import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Splash'>;
}

const Splash = ({navigation}: MyProps) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/logos/Logo.png')}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 500,
  },
});
