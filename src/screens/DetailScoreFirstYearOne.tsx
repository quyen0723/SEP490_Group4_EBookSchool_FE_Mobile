import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../assets/css/colors';
import {RootNavigationProps} from './types';

interface DetailScoreFirstYearOneProps {
  navigation: StackNavigationProp<
    RootNavigationProps,
    'DetailScoreFirstYearOne'
  >;
  route: RouteProp<{params: {year: string; subject: string}}, 'params'>;
}

interface Score {
  key: string;
  value: string;
  semester: string;
}

interface Subject {
  subject: string;
  average: string;
  scores: Score[];
}

interface StudentScores {
  fullName: string;
  schoolYear: string;
  className: string;
  details: Subject[];
}

const DetailScoreFirstYearOne = ({
  navigation,
  route,
}: DetailScoreFirstYearOneProps) => {
  const {year, subject} = route.params;

  const [studentScores, setStudentScores] = useState<StudentScores | null>(
    null,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [gpa, setGpa] = useState<{
    gpaSemester1: string;
    gpaSemester2: string;
    gpaYear: string;
  } | null>(null);

  useEffect(() => {
    const fetchScores = async (userId: string) => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `https://orbapi.click/api/Scores/ByStudentBySubject?schoolYear=${year}&studentID=${userId}&subject=${subject}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        console.log('Data fetched from API:', JSON.stringify(data, null, 2));
        if (data) {
          setStudentScores(data);
          calculateGPA(data.details);
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
          fetchScores(storedUserId);
        } else {
          console.error('No user ID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage', error);
      }
    };

    fetchUserId();
  }, [year, subject, userId]);

  const handleCalculate = () => {
    if (studentScores) {
      navigation.navigate('Calculate', {scores: studentScores});
    }
  };
  const roundGPA = (gpa: number) => {
    const integerPart = Math.floor(gpa);
    const decimalPart = gpa - integerPart;
    const roundedDecimalPart = Math.round(decimalPart * 10) / 10; // Làm tròn đến 1 chữ số thập phân
    return integerPart + roundedDecimalPart;
  };

  const calculateGPA = (details: Subject[]) => {
    let totalScoreSemester1 = 0;
    let totalScoreSemester2 = 0;
    let subjectCountSemester1 = 0;
    let subjectCountSemester2 = 0;
    let hasSpecialGradeSemester1 = false;
    let hasSpecialGradeSemester2 = false;

    details.forEach(subject => {
      const scoresSemester1 = subject.scores.filter(
        score => score.semester === 'Học kỳ I' && score.value !== '',
      );
      const scoresSemester2 = subject.scores.filter(
        score => score.semester === 'Học kỳ II' && score.value !== '',
      );

      const calculateSubjectAverage = (scores: Score[]) => {
        let totalScore = 0;
        let count = 0;
        let hasSpecialGrade = false;

        const hs1Scores = scores.filter(
          score =>
            (score.key === 'Miệng' || score.key === '15p') &&
            score.value !== '',
        );
        const hs2Scores = scores.filter(
          score => score.key === '1 Tiết' && score.value !== '',
        );
        const finalScores = scores.filter(
          score => score.key === 'Cuối kỳ' && score.value !== '',
        );

        hs1Scores.forEach(score => {
          if (score.value === 'Đ' || score.value === 'CĐ') {
            hasSpecialGrade = true;
          } else {
            totalScore += parseFloat(score.value);
            count += 1;
          }
        });

        hs2Scores.forEach(score => {
          if (score.value === 'Đ' || score.value === 'CĐ') {
            hasSpecialGrade = true;
          } else {
            totalScore += parseFloat(score.value) * 2;
            count += 2;
          }
        });

        finalScores.forEach(score => {
          if (score.value === 'Đ' || score.value === 'CĐ') {
            hasSpecialGrade = true;
          } else {
            totalScore += parseFloat(score.value) * 3;
            count += 3;
          }
        });

        return hasSpecialGrade ? 'Đ' : count === 0 ? 0 : totalScore / count;
      };

      const avgSemester1 = calculateSubjectAverage(scoresSemester1);
      const avgSemester2 = calculateSubjectAverage(scoresSemester2);

      if (avgSemester1 === 'Đ') {
        hasSpecialGradeSemester1 = true;
      } else if (avgSemester1) {
        totalScoreSemester1 += avgSemester1 as number;
        subjectCountSemester1 += 1;
      }

      if (avgSemester2 === 'Đ') {
        hasSpecialGradeSemester2 = true;
      } else if (avgSemester2) {
        totalScoreSemester2 += avgSemester2 as number;
        subjectCountSemester2 += 1;
      }
    });

    const gpaSemester1 =
      subjectCountSemester1 === 0
        ? 0
        : totalScoreSemester1 / subjectCountSemester1;
    const gpaSemester2 =
      subjectCountSemester2 === 0
        ? 0
        : totalScoreSemester2 / subjectCountSemester2;

    if (hasSpecialGradeSemester1 || hasSpecialGradeSemester2) {
      setGpa({
        gpaSemester1: hasSpecialGradeSemester1
          ? 'Đ'
          : roundGPA(gpaSemester1).toFixed(2),
        gpaSemester2: hasSpecialGradeSemester2
          ? 'Đ'
          : roundGPA(gpaSemester2).toFixed(2),
        gpaYear: '0.00',
      });
    } else {
      const gpaYear = (gpaSemester1 + gpaSemester2 * 2) / 3;
      setGpa({
        gpaSemester1: roundGPA(gpaSemester1).toFixed(2),
        gpaSemester2: roundGPA(gpaSemester2).toFixed(2),
        gpaYear: roundGPA(gpaYear).toFixed(2),
      });
    }
  };

  const groupScoresBySemester = (scores: Score[]) => {
    const grouped: {[semester: string]: {[key: string]: string[]}} = {};

    scores.forEach(score => {
      if (score.value !== '-1') {
        if (!grouped[score.semester]) {
          grouped[score.semester] = {};
        }
        if (!grouped[score.semester][score.key]) {
          grouped[score.semester][score.key] = [];
        }
        grouped[score.semester][score.key].push(score.value);
      }
    });

    return grouped;
  };

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
        <Text style={styles.headerTitle}>Chi tiết điểm</Text>
        <View style={{flex: 1}} />
      </View>
      <View>
        <View style={styles.row}>
          <Text style={styles.semesterText}>{subject}</Text>
        </View>

        <View style={[styles.row, {paddingHorizontal: 20}]}>
          <Text style={[styles.semesterIdText, {fontWeight: 'normal'}]}>
            <Text style={[styles.semesterIdText, {fontWeight: 'bold'}]}>
              Học kỳ I:{' '}
            </Text>
            {gpa?.gpaSemester1 === 'Đ' ? 'Đ' : gpa?.gpaSemester1}
          </Text>
          <Text style={[styles.semesterIdText, {fontWeight: 'normal'}]}>
            <Text style={[styles.semesterIdText, {fontWeight: 'bold'}]}>
              Học kỳ II:{' '}
            </Text>
            {gpa?.gpaSemester2 === 'Đ' ? 'Đ' : gpa?.gpaSemester2}
          </Text>
          <Text style={[styles.semesterIdText, {fontWeight: 'normal'}]}>
            <Text style={[styles.semesterIdText, {fontWeight: 'bold'}]}>
              Cả năm:{' '}
            </Text>
            {gpa?.gpaYear}
          </Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          {studentScores &&
            studentScores.details.map(
              (subjectScore: Subject, index: number) => (
                <View key={index} style={styles.subjectContainer}>
                  <Text style={styles.subjectText}>{subjectScore.subject}</Text>
                  {(() => {
                    const groupedScores = groupScoresBySemester(
                      subjectScore.scores,
                    );

                    return Object.keys(groupedScores).map(
                      (semester, semesterIndex) => (
                        <View key={semesterIndex}>
                          <Text style={styles.semesterHeader}>{semester}</Text>
                          {Object.keys(groupedScores[semester]).map(
                            (key, detailIndex) => (
                              <View key={detailIndex}>
                                <View style={styles.detailContainer}>
                                  <Text style={styles.keyText}>{key}:</Text>
                                  <Text style={styles.keyValueText}>
                                    {groupedScores[semester][key].join('   ')}
                                  </Text>
                                </View>
                                {detailIndex <
                                  Object.keys(groupedScores[semester]).length -
                                    1 && <View style={styles.horizontalLine} />}
                              </View>
                            ),
                          )}
                          {semesterIndex <
                            Object.keys(groupedScores).length - 1 && (
                            <View style={styles.horizontalLine} />
                          )}
                        </View>
                      ),
                    );
                  })()}
                  {index < studentScores.details.length && (
                    <View style={styles.horizontalLine} />
                  )}
                  <View>
                    {/* <Text style={styles.titleEvaluate}>Nhận xét:</Text> */}
                    <Text style={styles.titleEvaluateDetail}>
                      {/* {selectedSemester?.note} */}
                    </Text>
                  </View>
                </View>
              ),
            )}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={handleCalculate}>
        <Text style={styles.btnText}>Tính điểm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailScoreFirstYearOne;

const styles = StyleSheet.create({
  scrollView: {
    // flex: 1,
    maxHeight: '80%',
    marginBottom: 110,
  },
  scrollViewContent: {
    paddingTop: 16, // Add padding to avoid overlap with fixed content
  },
  semesterHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: 'black',
    paddingLeft: 10,
  },
  titleEvaluateDetail: {
    color: 'black',
    paddingHorizontal: 10,
  },
  titleEvaluate: {
    color: 'black',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  keyValueText: {
    color: 'black',
    fontWeight: '500',
  },
  keyText: {
    color: 'black',
    fontWeight: '500',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#999999',
    marginVertical: 8, // Điều chỉnh khoảng cách trên và dưới nếu cần
  },
  detailKey: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    flex: 3,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // your additional styles, if needed
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
    marginLeft: 100,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semesterText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    flex: 1,
    color: 'black',
  },
  semesterIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    flex: 1,
    color: 'black',
  },
  subjectContainer: {
    backgroundColor: colors.whiteColor,
    padding: 14,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
    paddingLeft: 10,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calculateButton: {
    position: 'absolute',
    right: 20,
    bottom: 170,
    backgroundColor: colors.primaryColor,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
