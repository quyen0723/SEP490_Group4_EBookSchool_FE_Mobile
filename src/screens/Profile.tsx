import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../assets/css/colors';
import {RootNavigationProps, User} from './types';
import {StackNavigationProp} from '@react-navigation/stack';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Profile'>;
}

const Profile = ({navigation}: MyProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const roles = JSON.parse(
        (await AsyncStorage.getItem('userRoles')) || '[]',
      );
      console.log('Stored User ID:', storedUserId);
      console.log('User Roles:', roles);
      if (storedUserId) {
        setUserId(storedUserId);
        setUserRoles(roles);

        const isStudent = roles.includes('Student') || roles.includes('Parent');
        const apiUrl = isStudent
          ? `https://orbapi.click/api/Students/${storedUserId}`
          : `https://orbapi.click/api/Teachers/${storedUserId}`;

        console.log('API URL:', apiUrl);

        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log('Access Token:', accessToken);

        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('API Response Status:', res.status);
        console.log('API Response Status Text:', res.statusText);

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('API Response Data:', data);
        setUser(data); // Cập nhật state user đúng cách
        setError(null); // Reset error nếu có dữ liệu thành công
      } else {
        console.error('No user ID found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('An error occurred while fetching user data');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );
  useEffect(() => {
    navigation.setOptions({
      title: 'Thông tin cá nhân',
      headerLeft: () => (
        // <Button onPress={() => navigation.goBack()} title="Go Back" />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getUserStatus = () => {
    if (userRoles.includes('Student')) {
      return 'Học sinh';
    } else if (userRoles.includes('Parent')) {
      return 'Phụ huynh';
    } else {
      return 'Giáo viên';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoRow}>
          <View
            style={{
              flex: 0.3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 70,
                height: 70,
                backgroundColor: 'gray',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
              }}>
              <Image
                style={styles.logo}
                source={require('../assets/images/icons/Profile.png')}
              />
            </View>
          </View>

          <View style={styles.userInfoTextContainer}>
            <Text style={styles.userInfoMainText}>{user.fullname}</Text>
            <Text style={styles.userInfoSubText}>
              {user.id} - Trạng thái: {getUserStatus(user.id)}
            </Text>
            <Text style={styles.userInfoSubText}>{user.email}</Text>
          </View>
        </View>

        <View style={{marginHorizontal: 20}}>
          <Text style={[styles.userInfoText, {marginTop: 20}]}>
            <Text style={styles.styleText}>Giới tính: </Text>
            {user.gender}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Ngày sinh: </Text>
            {user.birthday}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nơi sinh: </Text>
            {user.birthplace}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Dân tộc: </Text>
            {user.nation}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Chỗ ở hiện tại: </Text>
            {user.address}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Con liệt sĩ, thương binh: </Text>
            {user.isMartyrs}
          </Text>

          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Họ tên cha: </Text>
            {user.fatherFullName}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nghề nghiệp: </Text>
            {user.fatherProfession}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Số điện thoại cha: </Text>
            {user.fatherPhone}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Họ tên mẹ: </Text>
            {user.motherFullName}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nghề nghiệp: </Text>
            {user.motherProfession}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Số điện thoại mẹ: </Text>
            {user.motherPhone}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
  },
  userInfoContainer: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    elevation: 5,
    width: '92%',
  },
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
    marginLeft: 10,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: 'gray',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoText: {
    marginBottom: 9,
    fontSize: 12,
    color: 'black',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
  },
  userInfoTextContainer: {
    marginLeft: 10,
    flexShrink: 1,
    flex: 0.7,
  },
  userInfoMainText: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  userInfoSubText: {
    fontSize: 12,
    color: 'black',
  },
  styleText: {
    fontWeight: 'bold',
    color: 'black',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
