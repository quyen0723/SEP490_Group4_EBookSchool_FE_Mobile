import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../assets/css/colors';

const NotificationDetail = ({route, navigation}) => {
  // Extract the notification object from the route parameters
  const {notification} = route.params;

  return (
    <View style={styles.main}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết thông báo</Text>
        <View style={{flex: 1}} />
      </View>
      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.textTitle}>{notification.title}</Text>
        <View style={styles.notificationDetails}>
          <Text style={styles.textNofi}>Ngày: {notification.date}</Text>
          <Text style={[styles.textNofi, {paddingLeft: 10}]}>
            Thời gian: {notification.time}
          </Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <Text style={[styles.textNofi, {marginTop: 20}]}>
            {notification.description}
          </Text>
        </ScrollView>
        {/* Add other details you want to display */}
      </View>
    </View>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
  },
  main: {
    backgroundColor: '#F4F5F4',
    flex: 1,
    width: '100%',
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: colors.primaryColor,
    elevation: 5,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 70,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '75%',
    padding: 17,
    backgroundColor: 'white',
    // marginVertical: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 10,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  textNofi: {
    fontSize: 14,
    color: 'black',
  },
  notificationDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
});
