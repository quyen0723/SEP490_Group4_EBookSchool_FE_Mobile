import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {TextInput} from 'react-native-gesture-handler';
import Loader from '../components/Loader';
import {colors} from '../assets/css/colors';
import {RootNavigationProps} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp} from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';

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
  // const [username, setUsername] = useState<string>('Supervisor');
  // const [username, setUsername] = useState<string>('BinhDV');
  // const [username, setUsername] = useState<string>('nghiahh');
  // const [username, setUsername] = useState<string>('ANHLHS0001');
  // const [username, setUsername] = useState<string>('ANVHS0002');
  const [username, setUsername] = useState<string>('');
  // const [username, setUsername] = useState<string>('belv2');
  // const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('aA@123');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>(
    {},
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Ensure username is reset upon loading the login screen
  useEffect(() => {
    setUsername('PHONGNVHS0075'); // Reset the username to the new value you want
  }, []);

  const sortSchoolYearsDescending = (schoolYears: string[]) => {
    return schoolYears.sort((a, b) => {
      const [startYearA, endYearA] = a.split('-').map(Number);
      const [startYearB, endYearB] = b.split('-').map(Number);
      return endYearB - endYearA || startYearB - startYearA;
    });
  };

  const validate = () => {
    let valid = true;
    const newErrors: {username?: string; password?: string} = {};

    if (username === '') {
      newErrors.username = 'Không được bỏ trống!';
      valid = false;
    } else if (username.length < 4) {
      newErrors.username = 'Tên đăng nhập ít nhất 4 kí tự!';
      valid = false;
    }

    if (password === '') {
      newErrors.password = 'Không được bỏ trống!';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu ít nhất 6 kí tự!';
      valid = false;
    }

    setErrors(newErrors);
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
        const loginTimestamp = new Date().getTime();
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('loginTimestamp', loginTimestamp.toString());
        await AsyncStorage.setItem(
          'permissions',
          JSON.stringify(data.permissions),
        );
        let userIdToStore = data.user.id;
        if (data.roles.includes('Parent')) {
          userIdToStore = userIdToStore.substring(2);
        }
        await AsyncStorage.setItem('userId', userIdToStore);
        await AsyncStorage.setItem('userRoles', JSON.stringify(data.roles));
        if (data.roles.length > 1) {
          const roles = [...data.roles];
          const indexHomeroomTeacher = roles.indexOf('Homeroom Teacher');
          const indexSubjectTeacher = roles.indexOf('Subject Teacher');

          if (indexHomeroomTeacher !== -1 && indexSubjectTeacher !== -1) {
            const filteredRoles = roles.filter(
              role => role !== 'Homeroom Teacher',
            );
            await AsyncStorage.setItem(
              'userRoles',
              JSON.stringify(filteredRoles),
            );
            console.log(filteredRoles);
          } else {
            await AsyncStorage.setItem('userRoles', JSON.stringify(roles));
            console.log(roles);
          }
        } else {
          await AsyncStorage.setItem('userRoles', JSON.stringify(data.roles));
          console.log(data.roles);
        }
        // console.log(data.roles);
        // await AsyncStorage.setItem('userRoles', JSON.stringify(data.roles));
        const sortedSchoolYears = sortSchoolYearsDescending(data.schoolYears);
        await AsyncStorage.setItem(
          'userSchoolYears',
          JSON.stringify(sortedSchoolYears),
        );
        console.log('School years sorted and saved:', sortedSchoolYears);

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
        setAlertMessage(
          data.message ||
            'Tài khoản không tồn tại. Bạn vui lòng đăng nhập đúng tài khoản hoặc truy cập vào website để thay đổi mật khẩu nhé!',
        );
        setShowAlert(true);
      }
    } catch (error) {
      // console.error('Error logging in', error);
      setAlertMessage(
        'Tài khoản không tồn tại. Bạn vui lòng đăng nhập đúng tài khoản hoặc truy cập vào website để thay đổi mật khẩu nhé!',
      );
      setShowAlert(true);
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
        onChangeText={text => {
          setUsername(text);
          setErrors(prevErrors => ({...prevErrors, username: ''}));
        }}
        style={styles.input}
      />
      {errors.username ? (
        <Text style={styles.errorText}>{errors.username}</Text>
      ) : null}

      <Text style={styles.textLabel}>Mật khẩu:</Text>
      <TextInput
        value={password}
        onChangeText={text => {
          setPassword(text);
          setErrors(prevErrors => ({...prevErrors, password: ''}));
        }}
        secureTextEntry
        style={styles.input}
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.btnText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Loader visible={loading} />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Đăng nhập không thành công"
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText=" Đồng ý "
        confirmButtonColor={colors.primaryColor}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        titleStyle={styles.alertTitle}
        messageStyle={styles.alertMessage}
        confirmButtonTextStyle={styles.alertButtonText}
      />
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
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
