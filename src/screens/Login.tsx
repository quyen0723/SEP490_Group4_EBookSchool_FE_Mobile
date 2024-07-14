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
  id: string; // Updated to match API response
  username: string;
  fullname: string;
  address: string;
  email: string;
  phone: string;
  avatar: string;
}

interface ClassInfo {
  ID: string;
  Classroom: string;
}

interface ApiResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  permissions: string[];
  roles: string[];
  schoolYears: string[];
  classes: {
    [key: string]: ClassInfo[];
  };
  success?: boolean;
  message?: string;
}

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Login'>;
  route: RouteProp<RootNavigationProps, 'Login'>;
}

const Login = ({navigation}: MyProps) => {
  // const [username, setUsername] = useState<string>('ANHLHS0001');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('aA@123');
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    let valid = true;

    if (username === '') {
      Alert.alert('Validation Error', 'Please enter your username');
      valid = false;
    }
    if (password === '') {
      Alert.alert('Validation Error', 'Please enter your password');
      valid = false;
    }

    return valid;
  };

  const login = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('https://orbapi.click/api/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.accessToken) {
        // Updated condition
        // Save access token to AsyncStorage
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem(
          'permissions',
          JSON.stringify(data.permissions),
        );
        await AsyncStorage.setItem('userId', data.user.id);
        await AsyncStorage.setItem('userRoles', JSON.stringify(data.roles));
        await AsyncStorage.setItem(
          'userSchoolYears',
          JSON.stringify(data.schoolYears),
        );

        const firstSchoolYear = data.schoolYears[0];
        // await AsyncStorage.setItem(
        //   'userClasses',
        //   JSON.stringify(data.classes[firstSchoolYear]),
        // );
        await AsyncStorage.setItem('userClasses', JSON.stringify(data.classes));

        console.log('Navigating to HomeMain with userId:', data.user.id);
        navigation.navigate('HomeMain', {userId: data.user.id});
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
        onChangeText={setUsername}
        style={styles.input}
      />
      <Text style={styles.textLabel}>Mật khẩu:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Text style={styles.textForgot}>Quên mật khẩu?</Text>
      <TouchableOpacity style={styles.loginBtn} onPress={login}>
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
