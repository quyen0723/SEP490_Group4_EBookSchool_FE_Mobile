import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {TextInput} from 'react-native-gesture-handler';
import Loader from '../components/Loader';
import {colors} from '../assets/css/colors';
import {RootNavigationProps} from './types';

interface User {
  _id: string; // Add _id field
  name: string;
  email: string;
  // Add other user fields here
}
interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Login'>;
}

const Login = ({navigation}: MyProps) => {
  const [email, setEmail] = useState<string>('Quyennnmce161096@fpt.edu.vn');
  const [password, setPassword] = useState<string>('Password 1');
  const [data, setData] = useState<[]>();
  const [badEmail, setBadEmail] = useState<boolean>(false);
  const [badPassword, setBadPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validate = () => {
    let valid = true;

    if (email == '') {
      setBadEmail(true);
      valid = false;
    } else if (email != '') {
      setBadEmail(false);
    }
    if (password == '') {
      setBadPassword(true);
      valid = false;
    } else if (password != '') {
      setBadPassword(false);
    }

    return valid;
  };

  const login = async () => {
    if (!validate()) {
      return; // Không gửi request nếu validation không hợp lệ
    }

    setLoading(true);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const body = {email, password};

    try {
      const res = await fetch(
        `https://662e5424a7dda1fa378caa6a.mockapi.io/login`,
        {
          headers,
          method: 'GET',
          //   body: JSON.stringify(body),
        },
      );

      const data = await res.json();

      const user = data.find(
        (userData: any) =>
          userData.email === email && userData.password === password,
      );

      if (user) {
        setLoading(false);
        // navigation.navigate('HomeMain', {id: user._id});
        navigation.navigate('HomeMain', {userId: user._id});
        // setData(user);
        // console.log(user._id);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Đăng nhập</Text>
      <Text style={styles.textLabel}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={txt => setEmail(txt)}
        style={styles.input}
      />
      {badEmail && <Text style={styles.errorText}>Please Enter Email</Text>}
      <Text style={styles.textLabel}>Mật khẩu:</Text>
      <TextInput
        value={password}
        onChangeText={txt => setPassword(txt)}
        style={styles.input}
      />
      {badPassword && (
        <Text style={styles.errorText}>Please Enter Password</Text>
      )}
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.textForgot}>Quên mật khẩu?</Text>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          if (validate()) {
            login();
          }
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
