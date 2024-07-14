import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../assets/css/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CircularProgressComponent from '../components/CircularProgressComponent';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';

interface MyProps {
  navigation: StackNavigationProp<
    RootNavigationProps,
    'DetailAttendanceSubject'
  >;
  route: RouteProp<
    {params: {year: string; semesterId: number; title: string}},
    'params'
  >;
}

interface Attendance {
  attendenceID: string;
  studentID: string;
  studentName: string;
  avatar: string;
  present: boolean;
  date: string;
  subject: string;
  status: string;
  teacher: string;
  slot: number;
}

interface ApiResponse {
  message: string;
  statusCode: number;
  data: Attendance[];
}

interface UserClasses {
  [year: string]: {
    ID: string;
    Classroom: string;
  }[];
}

const DetailAttendanceSubject = ({route, navigation}: MyProps) => {
  const {title, year} = route.params;

  const [attendanceSubject, setAttendanceSubject] = useState<Attendance[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userClasses, setUserClasses] = useState<UserClasses | null>(null);
  const [className, setClassName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTimeTable = async (userId: string) => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `https://orbapi.click/api/Attendance/GetAttendanceByStudent?studentID=${userId}&subjectName=${title}&schoolYear=${year}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data: Attendance[] = await response.json();
        console.log('Data fetched from API:', JSON.stringify(data, null, 2));
        if (response.ok) {
          setAttendanceSubject(data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching scores data', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserIdAndClasses = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserClasses = await AsyncStorage.getItem('userClasses');
        if (storedUserId && storedUserClasses) {
          setUserId(storedUserId);
          const parsedClasses: UserClasses = JSON.parse(storedUserClasses);
          setUserClasses(parsedClasses);

          fetchTimeTable(storedUserId);

          // Find the class name for the given year
          if (parsedClasses[year] && parsedClasses[year].length > 0) {
            setClassName(parsedClasses[year][0].Classroom);
          } else {
            console.error(`No classes found for the year ${year}`);
          }
        } else {
          console.error('No user ID or user classes found in AsyncStorage');
        }
      } catch (error) {
        console.error(
          'Error fetching user ID or classes from AsyncStorage',
          error,
        );
      }
    };

    fetchUserIdAndClasses();
  }, [title, year]);

  const getTotalAbsent = () => {
    return getTotalAbsentNo() + getTotalAbsentYes();
  };

  const getTotalAbsentNo = () => {
    return attendanceSubject
      ? attendanceSubject.filter(item => item.status === 'Vắng không phép')
          .length
      : 0;
  };

  const getTotalAbsentYes = () => {
    return attendanceSubject
      ? attendanceSubject.filter(item => item.status === 'Vắng có phép').length
      : 0;
  };

  const getTotalPresent = () => {
    return attendanceSubject
      ? attendanceSubject.filter(item => item.status === 'Có mặt').length
      : 0;
  };

  const getTotalFuture = () => {
    return attendanceSubject
      ? attendanceSubject.filter(item => item.status === 'Chưa bắt đầu').length
      : 0;
  };

  const getTotalPresentAndAbsent = () => {
    return getTotalPresent() + getTotalAbsentNo();
  };

  const getAttendanceRate = () => {
    const totalAbsent = getTotalAbsent();
    const totalPresent = getTotalPresent();
    const total = totalAbsent + totalPresent;
    return total > 0 ? (totalPresent / total) * 100 : 0;
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết điểm danh môn học</Text>
        <View style={{flex: 1}} />
      </View>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.textTitle}>{title}</Text>
        </View>
        <View style={styles.centeredContainer}>
          <View style={styles.notificationDetailss}>
            <View style={styles.column}>
              <CircularProgressComponent value={getAttendanceRate()} />
            </View>

            <View style={styles.column}>
              <Text style={[styles.textNofi, {fontWeight: 'bold'}]}>
                Lớp: {className}
              </Text>
              <Text
                style={[
                  styles.textNofi,
                  {color: colors.primaryColor, fontWeight: 'bold'},
                ]}>
                Tỉ lệ: {getTotalPresent()}/{getTotalPresentAndAbsent()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.notificationDetails}>
          <View
            style={[
              styles.column,
              {alignItems: 'flex-start', paddingLeft: 50},
            ]}>
            <View style={styles.presentRow}>
              <View style={styles.presentContainer}>
                <Text style={[styles.presentText, {color: 'white'}]}>
                  {getTotalPresent()}
                </Text>
              </View>
              <Text style={styles.textNofi}> Có mặt</Text>
            </View>
          </View>
          <View
            style={[styles.column, {alignItems: 'flex-start', paddingLeft: 0}]}>
            <View style={styles.presentRow}>
              <View style={styles.futureContainer}>
                <Text style={[styles.presentText, {color: 'white'}]}>
                  {getTotalFuture()}
                </Text>
              </View>
              <Text style={styles.textNofi}> Chưa bắt đầu</Text>
            </View>
          </View>
        </View>
        <View style={[styles.notificationDetails, {marginBottom: 15}]}>
          <View
            style={[
              styles.column,
              {alignItems: 'flex-start', paddingLeft: 50},
            ]}>
            <View style={styles.presentRow}>
              <View style={styles.absentContainerYes}>
                <Text style={[styles.presentText, {color: 'white'}]}>
                  {getTotalAbsentYes()}
                </Text>
              </View>
              <Text style={styles.textNofi}> Vắng có phép</Text>
            </View>
          </View>
          <View
            style={[styles.column, {alignItems: 'flex-start', paddingLeft: 0}]}>
            <View style={styles.presentRow}>
              <View style={styles.absentContainer}>
                <Text style={[styles.presentText, {color: 'white'}]}>
                  {getTotalAbsentNo()}
                </Text>
              </View>
              <Text style={styles.textNofi}> Vắng không phép</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {attendanceSubject && attendanceSubject.length > 0 ? (
            attendanceSubject.map((item, index) => (
              <View key={index} style={styles.attendanceItem}>
                <View style={styles.leftColumn}>
                  <Text style={styles.dateText}>
                    Ngày: {item.date} - Tiết: {item.slot}
                  </Text>
                  <Text style={styles.teacherText}>
                    Giáo viên: {item.teacher}
                  </Text>
                </View>
                {item.status === 'Vắng không phép' && (
                  <Image
                    source={require('../assets/images/icons/wrong.png')}
                    style={styles.avatarImage}
                  />
                )}
                {item.status === 'Có mặt' && (
                  <Image
                    source={require('../assets/images/icons/check.png')}
                    style={styles.avatarImage}
                  />
                )}
                {item.status === 'Chưa bắt đầu' && (
                  <Image
                    source={require('../assets/images/icons/wait.png')}
                    style={styles.avatarImage}
                  />
                )}
                {item.status === 'Vắng có phép' && (
                  <Image
                    source={require('../assets/images/icons/failed.png')}
                    style={styles.avatarImage}
                  />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Không có dữ liệu điểm danh.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default DetailAttendanceSubject;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {justifyContent: 'center', alignItems: 'center'},
  presentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presentContainer: {
    paddingHorizontal: 5,
    backgroundColor: colors.primaryColor,
    borderRadius: 5,
  },
  absentContainer: {
    paddingHorizontal: 5,
    backgroundColor: '#CF1F25',
    borderRadius: 5,
  },
  absentContainerYes: {
    paddingHorizontal: 5,
    backgroundColor: '#FFC107',
    borderRadius: 5,
  },
  futureContainer: {
    paddingHorizontal: 5,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  presentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginLeft: 35,
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
    fontSize: 24,
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
    // marginBottom: 15,
    marginTop: 15,
  },
  notificationDetailss: {
    flexDirection: 'row',
    margin: 15,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  leftColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  teacherText: {
    fontSize: 16,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
