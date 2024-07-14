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
import {RouteProp} from '@react-navigation/native';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'DetailAttendanceFirst'>;
  route: RouteProp<{params: {year: string; semesterId: number}}, 'params'>;
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
  'Vắng không phép': number;
  'Vắng có phép': number;
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

// Calculate attendance percentage for each subject
const calculateAttendancePercentage = (
  attendanceData: AttendanceData,
): {[subject: string]: number} => {
  const attendancePercentageBySubject: {[subject: string]: number} = {};

  Object.keys(attendanceData).forEach(subject => {
    const {
      'Có mặt': present,
      'Vắng không phép': absentNoPermission,
      'Vắng có phép': absentWithPermission,
    } = attendanceData[subject];
    const totalClasses = present + absentNoPermission + absentWithPermission;
    const attendancePercentage =
      totalClasses > 0 ? (present / totalClasses) * 100 : 0;
    attendancePercentageBySubject[subject] = attendancePercentage;
  });

  return attendancePercentageBySubject;
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
    totalAbsent +=
      attendanceData[subject]['Vắng không phép'] +
      attendanceData[subject]['Vắng có phép'];
  }
  return totalAbsent;
};

const DetailAttendanceFirst = ({navigation, route}: MyProps) => {
  const {year, semesterId} = route.params;
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [studentAttendances, setStudentAttendances] = useState<
    AttendanceData[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTimeTable = async (userId: string) => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `https://orbapi.click/api/Attendance/GetAttendanceByStudentAllSubject?studentID=${userId}&schoolYear=${year}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: AttendanceData[] = await response.json();
        console.log('Data fetched from API:', JSON.stringify(data, null, 2));
        if (Object.keys(data).length === 0) {
          // Check if data is empty
          setLoading(false); // Set loading to false
          return; // Exit early
        }
        setStudentAttendances(data);
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
    navigation.navigate('DetailAttendanceSubject', {title: subject, year});
  };
  const renderSemesterComponents = () => {
    const attendancePercentages =
      calculateAttendancePercentage(studentAttendances);

    const totalPresent = studentAttendances
      ? calculateTotalPresent(studentAttendances)
      : 0;

    const totalAbsent = studentAttendances
      ? calculateTotalAbsent(studentAttendances)
      : 0;

    if (!studentAttendances) return null;
    return Object.entries(studentAttendances).map(([subject, attendance]) => {
      const totalAbsent =
        attendance['Vắng không phép'] + attendance['Vắng có phép'];
      return (
        <TouchableOpacityAttendance
          key={subject}
          title={subject}
          present={attendance['Có mặt']}
          absent={totalAbsent}
          onPress={() => handleSubjectPress(subject)}
          imageSource={0}
          startDate={attendance['Ngày bắt đầu']}
          endDate={attendance['Ngày kết thúc']}
          tbcm={attendancePercentages[subject]}
        />
      );
    });
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <ScrollView style={styles.container}>
        {renderSemesterComponents()}
      </ScrollView>
    </View>
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
    // justifyContent: 'center',
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

// const data = await response.json();
// console.log('Data fetched from API:', JSON.stringify(data, null, 2));
// if (data.success) {
//   //   data.data.details.forEach((subject: Subject) => {
//   //     console.log(`Subject: ${subject.subject}`);
//   //     if (subject.scores.length > 0) {
//   //       subject.scores.forEach((score, index) => {
//   //         console.log(`Score ${index}:`, JSON.stringify(score, null, 2));
//   //       });
//   //     } else {
//   //       console.log(`Scores array for ${subject.subject} is empty`);
//   //     }
//   //   });
//   //   console.log(data);
//   setStudentAttendances(data.data);
//   // setStudentScoresValue(data.data.details.scores);
// } else {
//   console.error('Error:', data.message);
// }

// const getStartDate = (schoolYear: string) => {
//   const [startYear] = schoolYear.split('-');
//   return `01/01/${startYear}`;
// };

// const getEndDate = (schoolYear: string) => {
//   const [, endYear] = schoolYear.split('-');
//   return `31/12/${endYear}`;
// };

{
  /* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết điểm danh</Text>

      </View> */
}
