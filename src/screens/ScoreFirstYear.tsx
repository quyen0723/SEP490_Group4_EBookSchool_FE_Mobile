import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import TouchableOpacityComponent from '../components/TouchableOpacityComponent';
import {scoreByStudent} from '../mock/score';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreFirstYear'>;
}

interface SemesterData {
  id: number;
  semester: string;
  schoolYear: string;
  average: number;
  conduct: string;
  rank: number;
}

const ScoreFirstYear = ({navigation}: MyProps) => {
  const [semesters, setSemesters] = useState<SemesterData[]>([]);

  useEffect(() => {
    const fetchedSemesters = scoreByStudent.data.filter(item => item.id <= 3);
    setSemesters(fetchedSemesters);
  }, []);

  const handleSemesterPress = (semesterId: number) => {
    navigation.navigate('DetailScoreFirstYearOne', {semesterId: semesterId});
  };

  const renderSemesterComponents = () => {
    return semesters.map(semesterData => (
      <TouchableOpacityComponent
        key={semesterData.id}
        // imageSource={semesterData.average}
        imageSource={semesterData.average}
        title={semesterData.semester}
        startDate={getStartDate(semesterData.schoolYear)}
        endDate={getEndDate(semesterData.schoolYear)}
        tbcm={semesterData.average}
        hanhKiem={semesterData.conduct}
        rank={semesterData.rank}
        onPress={() => handleSemesterPress(semesterData.id)}
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

export default ScoreFirstYear;

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
