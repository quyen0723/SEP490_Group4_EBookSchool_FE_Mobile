import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import TouchableOpacityComponent from '../components/TouchableOpacityComponent';
import {scoreByStudent} from '../mock/score';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../assets/css/colors';
import TouchableOpacityAttendance from '../components/TouchableOpacityAttendance';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'DetailAttendanceFirst'>;
}

interface SemesterData {
  id: number;
  semester: string;
  schoolYear: string;
  average: number;
  conduct: string;
  rank: number;
}

interface AttendanceSubject {
  'Có mặt': number;
  Vắng: number;
  'Chưa bắt đầu': number;
  'Ngày bắt đầu': string;
  'Ngày kết thúc': string;
}

// Define the interface for the overall data structure
interface AttendanceData {
  [subject: string]: AttendanceSubject;
}

// Define the interface for the entire API response
interface ApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AttendanceData;
}

// Calculate attendance percentage
const calculateAttendancePercentage = (
  attendanceData: AttendanceData,
): number => {
  const subjects = Object.keys(attendanceData);
  const totalSubjects = subjects.length;
  let totalPercentage = 0;

  subjects.forEach(subject => {
    const {'Có mặt': present, Vắng: absent} = attendanceData[subject];
    const totalClasses = present + absent;
    const attendancePercentage =
      totalClasses > 0 ? (present / totalClasses) * 100 : 0;
    totalPercentage += attendancePercentage;
  });

  return totalPercentage / totalSubjects;
};

const calculateTotalPresent = (attendanceData: AttendanceData): number => {
  let totalPresent = 0;
  for (const subject in attendanceData) {
    totalPresent += attendanceData[subject]['Có mặt'];
  }
  return totalPresent;
};

// Hàm tính tổng "Vắng"
const calculateTotalAbsent = (attendanceData: AttendanceData): number => {
  let totalAbsent = 0;
  for (const subject in attendanceData) {
    totalAbsent += attendanceData[subject].Vắng;
  }
  return totalAbsent;
};
const DetailAttendanceFirst = ({navigation}: MyProps) => {
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [studentAttendances, setStudentAttendances] =
    useState<AttendanceData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeTable = async (userId: string) => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `https://orbapi.click/api/Attendance/GetAttendanceByStudentAllSubject?studentID=${userId}&schoolYear=2023-2024`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        console.log('Data fetched from API:', JSON.stringify(data, null, 2));
        if (data.success) {
          //   data.data.details.forEach((subject: Subject) => {
          //     console.log(`Subject: ${subject.subject}`);
          //     if (subject.scores.length > 0) {
          //       subject.scores.forEach((score, index) => {
          //         console.log(`Score ${index}:`, JSON.stringify(score, null, 2));
          //       });
          //     } else {
          //       console.log(`Scores array for ${subject.subject} is empty`);
          //     }
          //   });
          //   console.log(data);
          setStudentAttendances(data.data);
          // setStudentScoresValue(data.data.details.scores);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching scores data', error);
      }
    };

    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          // console.log('User ID fetched from AsyncStorage:', storedUserId);
          fetchTimeTable(storedUserId);
        } else {
          console.error('No user ID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchedSemesters = scoreByStudent.data.filter(item => item.id <= 3);
    setSemesters(fetchedSemesters);
  }, []);

  const handleSubjectPress = (subject: string) => {
    navigation.navigate('DetailAttendanceSubject', {title: subject});
  };
  const renderSemesterComponents = () => {
    const tbcm = studentAttendances
      ? calculateAttendancePercentage(studentAttendances)
      : 0;

    const totalPresent = studentAttendances
      ? calculateTotalPresent(studentAttendances)
      : 0;

    const totalAbsent = studentAttendances
      ? calculateTotalAbsent(studentAttendances)
      : 0;
    if (!studentAttendances) return null;
    return Object.entries(studentAttendances).map(([subject, attendance]) => (
      <TouchableOpacityAttendance
        key={subject}
        title={subject}
        present={attendance['Có mặt']} // Thay vì present
        absent={attendance['Vắng']} // Thay vì absent
        onPress={() => handleSubjectPress(subject)}
        imageSource={0}
        startDate={attendance['Ngày bắt đầu']} // Lấy Ngày bắt đầu từ dữ liệu
        endDate={attendance['Ngày kết thúc']} // Lấy Ngày kết thúc từ dữ liệu
        tbcm={0}
      />
    ));
  };

  const getStartDate = (schoolYear: string) => {
    const [startYear] = schoolYear.split('-');
    return `01/01/${startYear}`;
  };

  const getEndDate = (schoolYear: string) => {
    const [, endYear] = schoolYear.split('-');
    return `31/12/${endYear}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết thông báo</Text>
        {/* <View style={{flex: 1}} /> */}
      </View>
      {renderSemesterComponents()}
    </ScrollView>
  );
};

export default DetailAttendanceFirst;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
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
});
