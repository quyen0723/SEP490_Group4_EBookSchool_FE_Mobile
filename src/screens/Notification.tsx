import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import {colors} from '../assets/css/colors';
import {ItemType} from '../components/Data';
import {useIsFocused} from '@react-navigation/native';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Notification'>;
}
type Notes = {
  title: string;
  description: string;
  id: string;
  date: string;
  time: string;
};
const Notification = ({navigation}: MyProps) => {
  const [notifications, setNotifications] = useState<Notes[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notes[]>(
    [],
  );
  const [keyword, setKeyword] = useState<string>('');
  const isFocused = useIsFocused();
  const [data, setData] = useState<ItemType[]>([]);
  // const filterItemName = () => {
  //   setData(data.filter(item => item.title.includes(keyword.toLowerCase())));
  // };

  useEffect(() => {
    getNotes();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Notification',
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

  const getNotes = async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const res = await fetch(
      'https://66390e0c4253a866a25025ec.mockapi.io/notification',
      {
        headers: headers,
        method: 'GET',
      },
    );

    const data = await res.json();
    setNotifications(data);
    setFilteredNotifications(data);
    console.log(data);
  };

  const filterItemName = (text: string) => {
    setKeyword(text);
    if (text.trim() === '') {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredNotifications(filtered);
    }
  };
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <TextInput
          onChangeText={filterItemName}
          style={{
            borderWidth: 1,
            borderColor: colors.primaryColor,
            height: 40,
            borderRadius: 15,
            paddingLeft: 10,
            backgroundColor: 'white',
            flex: 1,
          }}
          placeholder="Tìm kiếm..."
        />
        {/* <TouchableOpacity
          onPress={filterItemName}
          style={{
            backgroundColor: colors.primaryColor,
            borderRadius: 15,
            width: 40,
            height: 40,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}>
          <Image
            source={require('../assets/images/icons/Search.png')}
            style={{height: 20, width: 20}}
          />
        </TouchableOpacity> */}
      </View>
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('NotificationDetail', {
                    notification: item,
                  })
                }>
                <View style={styles.notesItem}>
                  <View>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationsDate}>
                      Date: {item.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.noDataView}>
          <Text style={styles.title}>Không có thông báo nào tương tự</Text>
        </View>
      )}
    </View>
  );
};

export default Notification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
    marginLeft: 10,
  },
  btn: {
    width: 200,
    height: 50,
    borderRadius: 30,
    position: 'absolute',
    right: 20,
    bottom: 20,
    // top: 700,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesItem: {
    width: '90%',
    height: 100,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 18,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 5,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationTitle: {
    color: 'black',
    fontWeight: '500',
    paddingBottom: 10,
  },
  notificationsDate: {color: 'black'},
});
