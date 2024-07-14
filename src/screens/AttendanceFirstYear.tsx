import {View, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import TouchableOpacityComponent from '../components/TouchableOpacityComponent';
import {scoreByStudent} from '../mock/score';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TouchableOpacityAttendance from '../components/TouchableOpacityAttendance';
import {RouteProp} from '@react-navigation/native';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'AttendanceFirstYear'>;
  route: RouteProp<{params: {year: string}}, 'params'>;
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
const AttendanceFirstYear = ({navigation, route}: MyProps) => {
  const {year} = route.params;
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [studentAttendances, setStudentAttendances] = useState<
    AttendanceData[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

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
        // if (data) {
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
        //   if (Object.keys(data.data).length === 0) {
        //     // Check if data is empty
        //     setLoading(false); // Set loading to false
        //     return; // Exit early
        //   }
        //   setStudentAttendances(data);
        //   // setStudentScoresValue(data.data.details.scores);
        // } else {
        //   console.error('Error:', data.message);
        // }
      } catch (error) {
        console.error('Error fetching scores data', error);
      }
      setLoading(false);
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

  const handleSemesterPress = (semesterId: number) => {
    navigation.navigate('DetailAttendanceFirst', {year, semesterId});
    // navigation.navigate('DetailAttendanceFirst');
    // navigation.navigate('DetailAttendanceFirst', {semesterId: semesterId});
  };

  const renderSemesterComponents = () => {
    if (loading) {
      // Render loading indicator if still loading
      return <Text>Loading...</Text>;
    }
    if (!studentAttendances || Object.keys(studentAttendances).length === 0) {
      // Render message if data is empty
      return <Text>Không có điểm danh nào cho năm học này</Text>;
    }
    const tbcm = studentAttendances
      ? calculateAttendancePercentage(studentAttendances)
      : 0;

    const totalPresent = studentAttendances
      ? calculateTotalPresent(studentAttendances)
      : 0;

    const totalAbsent = studentAttendances
      ? calculateTotalAbsent(studentAttendances)
      : 0;

    return semesters.map(semesterData => (
      <TouchableOpacityAttendance
        key={semesterData.id}
        // imageSource={semesterData.average}
        imageSource={tbcm}
        title={semesterData.semester}
        // startDate={studentAttendances.}
        endDate={getEndDate(semesterData.schoolYear)}
        startDate={getStartDate(semesterData.schoolYear)}
        // endDate={getEndDate(semesterData.schoolYear)}
        // tbcm={semesterData.average}
        tbcm={tbcm + 20}
        // hanhKiem={totalPresent}
        // rank={totalAbsent}
        onPress={() => handleSemesterPress(semesterData.id)}
        present={totalPresent}
        absent={totalAbsent}
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

  return <View style={styles.container}>{renderSemesterComponents()}</View>;
};

export default AttendanceFirstYear;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// import {View, StyleSheet} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {RootNavigationProps} from './types';
// import TouchableOpacityComponent from '../components/TouchableOpacityComponent';
// import {scoreByStudent} from '../mock/score';

// interface MyProps {
//   navigation: StackNavigationProp<RootNavigationProps, 'ScoreFirstYear'>;
// }

// const ScoreFirstYear = ({navigation}: MyProps) => {
//   //Học kỳ 1
//   const [semesterOne, setSemesterOne] = useState<string>('');
//   const [schoolYearOne, setSchoolYearOne] = useState<string>('');
//   const [averageOne, setAverageOne] = useState<number>(0);
//   const [conductOne, setConductOne] = useState<string>('');
//   const [rankOne, setRankOne] = useState<number>(0);
//   const [startDateOne, setStartDateOne] = useState<string>('');
//   const [endDateOne, setEndDateOne] = useState<string>('');

//   //Học kỳ 2
//   const [semesterTwo, setSemesterTwo] = useState<string>('');
//   const [schoolYearTwo, setSchoolYearTwo] = useState<string>('');
//   const [averageTwo, setAverageTwo] = useState<number>(0);
//   const [conductTwo, setConductTwo] = useState<string>('');
//   const [rankTwo, setRankTwo] = useState<number>(0);
//   const [startDateTwo, setStartDateTwo] = useState<string>('');
//   const [endDateTwo, setEndDateTwo] = useState<string>('');

//   //Cả năm
//   const [semesterAll, setSemesterAll] = useState<string>('');
//   const [schoolYearAll, setSchoolYearAll] = useState<string>('');
//   const [averageAll, setAverageAll] = useState<number>(0);
//   const [conductAll, setConductAll] = useState<string>('');
//   const [rankAll, setRankAll] = useState<number>(0);
//   const [startDateAll, setStartDateAll] = useState<string>('');
//   const [endDateAll, setEndDateAll] = useState<string>('');

//   useEffect(() => {
//     // Học kỳ 1
//     const foundSemesterOne = scoreByStudent.data.find(item => item.id === 1);
//     if (foundSemesterOne) {
//       setSemesterOne(foundSemesterOne.semester);
//       setSchoolYearOne(foundSemesterOne.schoolYear);
//       setAverageOne(foundSemesterOne.average);
//       setConductOne(foundSemesterOne.conduct);
//       setRankOne(foundSemesterOne.rank);
//       const [startYear, endYear] = foundSemesterOne.schoolYear.split('-');
//       setStartDateOne(`01/06/${startYear}`);
//       setEndDateOne(`02/01/${endYear}`);
//     }

//     // Học kỳ 2
//     const foundSemesterTwo = scoreByStudent.data.find(item => item.id === 2);
//     if (foundSemesterTwo) {
//       setSemesterTwo(foundSemesterTwo.semester);
//       setSchoolYearTwo(foundSemesterTwo.schoolYear);
//       setAverageTwo(foundSemesterTwo.average);
//       setConductTwo(foundSemesterTwo.conduct);
//       setRankTwo(foundSemesterTwo.rank);
//       const [startYear, endYear] = foundSemesterTwo.schoolYear.split('-');
//       setStartDateTwo(`03/01/${startYear}`);
//       setEndDateTwo(`16/06/${endYear}`);
//     }

//     // Học kỳ 2
//     const foundSemesterAll = scoreByStudent.data.find(item => item.id === 3);
//     if (foundSemesterAll) {
//       setSemesterAll(foundSemesterAll.semester);
//       setSchoolYearAll(foundSemesterAll.schoolYear);
//       setAverageAll(foundSemesterAll.average);
//       setConductAll(foundSemesterAll.conduct);
//       setRankAll(foundSemesterAll.rank);
//       const [startYear, endYear] = foundSemesterAll.schoolYear.split('-');
//       setStartDateAll(`01/06/${startYear}`);
//       setEndDateAll(`16/06/${endYear}`);
//     }
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Học kỳ 1 */}
//       <TouchableOpacityComponent
//         imageSource={require('../assets/images/icons/Calendar.png')}
//         title={semesterOne}
//         startDate={startDateOne}
//         endDate={endDateOne}
//         tbcm={averageOne}
//         hanhKiem={conductOne}
//         rank={rankOne}
//         onPress={() => {
//           console.log('TouchableOpacity pressed');
//         }}
//       />

//       {/* Học kỳ 2 */}
//       <TouchableOpacityComponent
//         imageSource={require('../assets/images/icons/Calendar.png')}
//         title={semesterTwo}
//         startDate={startDateTwo}
//         endDate={endDateTwo}
//         tbcm={averageTwo}
//         hanhKiem={conductTwo}
//         rank={rankTwo}
//         onPress={() => {
//           console.log('TouchableOpacity pressed');
//         }}
//       />

//       {/* Cả năm */}
//       <TouchableOpacityComponent
//         imageSource={require('../assets/images/icons/Calendar.png')}
//         title={semesterAll}
//         startDate={startDateAll}
//         endDate={endDateAll}
//         tbcm={averageAll}
//         hanhKiem={conductAll}
//         rank={rankAll}
//         onPress={() => {
//           console.log('TouchableOpacity pressed');
//         }}
//       />
//     </View>
//   );
// };

// export default ScoreFirstYear;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

//   touchable: {
//     height: 100,
//     margin: 10,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center', // Center content vertically
//     padding: 10, // Optional: add some padding for better appearance
//   },
//   imageContainer: {
//     width: '20%',
//     justifyContent: 'center', // Center image horizontally within the container
//     alignItems: 'center', // Center image horizontally within the container
//   },
//   image: {
//     width: 70,
//     height: 70,
//     resizeMode: 'contain', // Ensure the image fits within the container
//   },
//   textContainer: {
//     width: '80%',
//     justifyContent: 'center', // Center text vertically within the container
//     paddingLeft: 10, // Optional: add some padding for better appearance
//   },
//   text: {
//     fontSize: 16, // You can adjust the font size as needed
//     // You can add more styling to the text if needed
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Distribute space evenly between texts
//     marginTop: 5, // Optional: add some margin for better appearance
//   },
