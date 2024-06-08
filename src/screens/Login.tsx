import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {TextInput} from 'react-native-gesture-handler';
import Loader from '../components/Loader';
import {colors} from '../assets/css/colors';
import {RootNavigationProps} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp} from '@react-navigation/native';

interface User {
  _id: string; // Add _id field
  name: string;
  email: string;
  // Add other user fields here
}
interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Login'>;
  route: RouteProp<RootNavigationProps, 'Login'>;
}

const Login = ({navigation}: MyProps) => {
  const [username, setUsername] = useState<string>('STUDENTLVHS0001');
  const [password, setPassword] = useState<string>('aA@123');
  const [data, setData] = useState<[]>();
  const [badEmail, setBadEmail] = useState<boolean>(false);
  const [badPassword, setBadPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // const validate = () => {
  //   let valid = true;

  //   if (email == '') {
  //     setBadEmail(true);
  //     valid = false;
  //   } else if (email != '') {
  //     setBadEmail(false);
  //   }
  //   if (password == '') {
  //     setBadPassword(true);
  //     valid = false;
  //   } else if (password != '') {
  //     setBadPassword(false);
  //   }

  //   return valid;
  // };

  const login = async () => {
    // if (!validate()) {
    //   return;
    // }

    setLoading(true);

    try {
      const response = await fetch('https://orbapi.click/api/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save access token to AsyncStorage
        await AsyncStorage.setItem('accessToken', data.data.accessToken);
        await AsyncStorage.setItem(
          'permissions',
          JSON.stringify(data.data.permissions),
        );
        // Navigate to HomeMain screen
        await AsyncStorage.setItem('userId', data.data.user.id);
        console.log('Navigating to HomeMain with userId:', data.data.user.id);
        navigation.navigate('HomeMain', {userId: data.data.user.id});
        // navigation.navigate('HomeMain');
      } else {
        console.error('Login failed', data);
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid username or password',
        );
      }
    } catch (error) {
      console.error('Error logging in', error);
      Alert.alert('Error', 'An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Đăng nhập</Text>
      <Text style={styles.textLabel}>Tên tài khoản:</Text>
      <TextInput
        value={username}
        onChangeText={txt => setUsername(txt)}
        style={styles.input}
      />
      {/* {badEmail && <Text style={styles.errorText}>Please Enter Email</Text>} */}
      <Text style={styles.textLabel}>Mật khẩu:</Text>
      <TextInput
        value={password}
        onChangeText={txt => setPassword(txt)}
        secureTextEntry={true}
        style={styles.input}
      />
      {/* {badPassword && (
        <Text style={styles.errorText}>Please Enter Password</Text>
      )}
      {error !== '' && <Text style={styles.errorText}>{error}</Text>} */}
      <Text style={styles.textForgot}>Quên mật khẩu?</Text>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          // if (validate()) {
          //   login();
          // }
          login();
        }}>
        <Text style={styles.btnText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Loader visible={loading} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 30,
    color: colors.primaryColor,
    marginTop: 100,
    fontWeight: '700',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    marginLeft: 20,
    marginTop: 30,
  },
  textForgot: {
    color: colors.primaryColor,
    fontWeight: '600',
    marginTop: 15,
    marginRight: 20,
    textAlign: 'right',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#9e9e9e',
    marginTop: 10,
    alignSelf: 'center',
    paddingLeft: 20,
    borderRadius: 10,
  },
  loginBtn: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primaryColor,
    marginTop: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginLeft: 20,
    marginTop: 5,
  },
});
