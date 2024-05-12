import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {User} from './types';
import {colors} from '../assets/css/colors';

const Profile = ({route}: any) => {
  const {userId} = route.params;
  console.log(userId);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://662e5424a7dda1fa378caa6a.mockapi.io/login/${userId}`,
        );
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

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
            <Text style={styles.userInfoMainText}>{user.name}</Text>
            <Text style={styles.userInfoSubText}>
              {user._id} - Trạng thái: {user.status}
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
            {user.dateofbirth}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nơi sinh: </Text>
            {user.placeofbirth}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Dân tộc: </Text>
            {user.nation}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Chỗ ở hiện tại: </Text>
            {user.currentresidence}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Con liệt sĩ, thương binh: </Text>
            {user.martyrson}
          </Text>
          {/* <View style={styles.userInfoRow}>
            <Text style={styles.userInfoText}>
              <Text style={styles.styleText}>Họ tên cha: </Text>
              {user.namefather}
            </Text>
            <Text style={styles.userInfoText}>
              <Text style={styles.styleText}>Nghề nghiệp: </Text>
              {user.occupationfather}
            </Text>
          </View> */}

          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Họ tên cha: </Text>
            {user.namefather}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nghề nghiệp: </Text>
            {user.occupationfather}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Số điện thoại cha: </Text>
            {user.phonefather}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Họ tên mẹ: </Text>
            {user.namemother}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nghề nghiệp: </Text>
            {user.occupationmother}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Số điện thoại mẹ: </Text>
            {user.phonemother}
          </Text>

          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Họ tên người giám hộ: </Text>
            {user.nameGuardian}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nghề nghiệp: </Text>
            {user.occipationguardian}
          </Text>

          {/* <Text style={styles.userInfoText}>
            <Text style={styles.styleText}></Text>
            {user.nameGuardian}
          </Text>
          <Text style={styles.userInfoText}>
            <Text style={styles.styleText}>Nghệ nghiệp: </Text>
            {user.occipationguardian}
          </Text> */}
        </View>
        {/* Display other user information */}
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
    // color: 'gray',
    color: 'black',
  },
  boldText: {
    fontWeight: 'bold',
  },
  styleText: {
    fontWeight: 'bold',
    color: 'black',
  },
});
