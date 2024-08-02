import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from '../navigations/AppNavigator';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';

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
        onPress: async () => {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('loginTimestamp');
          await AsyncStorage.removeItem('userId');
          await AsyncStorage.removeItem('userRoles');
          await AsyncStorage.removeItem('userSchoolYears');
          await AsyncStorage.removeItem('userClasses');
          navigation.dispatch(DrawerActions.closeDrawer());
          // await AsyncStorage.clear();
          navigation.navigate('Login'); // Điều hướng đến màn hình đăng nhập
        },
      },
    ],
    {cancelable: false},
  );
}
