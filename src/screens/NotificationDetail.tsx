import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
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
          <Text style={styles.textNofi}>Ngày tạo: {notification.createAt}</Text>
          <Text style={[styles.textNofi, {paddingLeft: 10}]}>
            Ngày cập nhập: {notification.updateAt}
          </Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View>
            <Image
              source={{uri: notification.thumbnail}}
              style={styles.thumbnail}
            />
          </View>
          <RenderHTML
            contentWidth={Dimensions.get('window').width - 20} // Adjust the width as needed
            source={{html: notification.content}}
            // renderersProps={{}}
          />
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
  thumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});
