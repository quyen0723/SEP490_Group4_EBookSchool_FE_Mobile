import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from '../screens/AppNavigator';
import {Alert} from 'react-native';

export function handleLogout(
  navigation: StackNavigationProp<RootNavigationProps, 'Home'>,
) {
  Alert.alert(
    'Xác nhận',
    'Bạn muốn đăng xuất phải không?',
    [
      {
        text: 'Không',
        onPress: () => console.log('Không'),
        style: 'cancel',
      },
      {
        text: 'Có',
        onPress: () => navigation.navigate('Login'), // Điều hướng đến màn hình đăng nhập
      },
    ],
    {cancelable: false},
  );
}
