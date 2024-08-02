import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {RootNavigationProps} from './types';
import {colors} from '../assets/css/colors';
import {studentScore as templateScore} from '../mock/templateScore';

interface CalculateProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Calculate'>;
  route: RouteProp<{params?: {scores: StudentScores}}, 'params'>;
}

interface Score {
  id: string;
  key: string;
  value: string;
  indexCol: number;
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

const Calculate = ({navigation, route}: CalculateProps) => {
  const [editableScores, setEditableScores] = useState<StudentScores | null>(
    null,
  );
  const [addCount, setAddCount] = useState<{[key: string]: number}>({});

  const generateScoresWithId = (scores: StudentScores) => {
    return scores.details.map(subject => ({
      ...subject,
      scores: subject.scores.map(score => ({
        ...score,
        id: `${score.semester}-${score.key}-${score.indexCol}-${
          Date.now() + Math.random()
        }`,
      })),
    }));
  };

  const resetScores = useCallback(() => {
    const initialScores = route.params?.scores || templateScore.data;
    setEditableScores({
      ...initialScores,
      details: generateScoresWithId(initialScores),
    });
    setAddCount({});
  }, [route.params]);

  useFocusEffect(resetScores);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: 'Tính điểm',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              resetScores();
              navigation.goBack();
            }}>
            <Image
              style={styles.imge}
              source={require('../assets/images/icons/Back.png')}
            />
          </TouchableOpacity>
        ),
      });
    }, [navigation, resetScores]),
  );

  const handleScoreChange = (
    subjectIndex: number,
    scoreId: string,
    newValue: string,
  ) => {
    if (
      isNaN(Number(newValue)) ||
      Number(newValue) < 0 ||
      Number(newValue) > 10
    ) {
      return;
    }

    const updatedScores = {...editableScores};
    const score = updatedScores.details[subjectIndex].scores.find(
      s => s.id === scoreId,
    );
    if (score) {
      score.value = newValue;
      setEditableScores(updatedScores);
    }
  };

  const handleAddScore = (
    subjectIndex: number,
    key: string,
    semester: string,
  ) => {
    const keySemester = `${subjectIndex}-${key}-${semester}`;
    const currentCount = addCount[keySemester] || 0;
    if (currentCount >= 2) {
      return;
    }

    const updatedScores = {...editableScores};
    const newScore = {
      id: `${semester}-${key}-${Date.now() + Math.random()}`,
      key,
      value: '',
      indexCol: updatedScores.details[subjectIndex].scores.length + 1,
      semester,
    };
    updatedScores.details[subjectIndex].scores.push(newScore);
    setEditableScores(updatedScores);
    setAddCount(prevAddCount => ({
      ...prevAddCount,
      [keySemester]: currentCount + 1,
    }));
  };

  const handleDeleteScore = (subjectIndex: number, scoreId: string) => {
    const updatedScores = {...editableScores};
    const scores = updatedScores.details[subjectIndex].scores;
    const scoreIdx = scores.findIndex(s => s.id === scoreId);
    if (scoreIdx !== -1) {
      const deletedScore = scores[scoreIdx];
      const keySemester = `${subjectIndex}-${deletedScore.key}-${deletedScore.semester}`;
      const currentCount = addCount[keySemester] || 0;

      scores.splice(scoreIdx, 1);
      setEditableScores(updatedScores);
      setAddCount(prevAddCount => ({
        ...prevAddCount,
        [keySemester]: Math.max(0, currentCount - 1),
      }));
    }
  };

  const calculateGPA = () => {
    let totalScoreSemester1 = 0;
    let totalScoreSemester2 = 0;
    let subjectCountSemester1 = 0;
    let subjectCountSemester2 = 0;

    editableScores.details.forEach(subject => {
      const scoresSemester1 = subject.scores.filter(
        score => score.semester === 'Học kỳ I' && score.value !== '',
      );
      const scoresSemester2 = subject.scores.filter(
        score => score.semester === 'Học kỳ II' && score.value !== '',
      );

      const calculateSubjectAverage = (scores: Score[]) => {
        let totalScore = 0;
        let count = 0;

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
          totalScore += parseFloat(score.value);
          count += 1;
        });

        hs2Scores.forEach(score => {
          totalScore += parseFloat(score.value) * 2;
          count += 2;
        });

        finalScores.forEach(score => {
          totalScore += parseFloat(score.value) * 3;
          count += 3;
        });

        return count === 0 ? 0 : totalScore / count;
      };

      const avgSemester1 = calculateSubjectAverage(scoresSemester1);
      const avgSemester2 = calculateSubjectAverage(scoresSemester2);

      if (avgSemester1) {
        totalScoreSemester1 += avgSemester1;
        subjectCountSemester1 += 1;
      }

      if (avgSemester2) {
        totalScoreSemester2 += avgSemester2;
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

    if (!gpaSemester1 || !gpaSemester2) {
      return {
        gpaSemester1: gpaSemester1.toFixed(2),
        gpaSemester2: gpaSemester2.toFixed(2),
        gpaYear: '0.00',
      };
    }

    const gpaYear = (gpaSemester1 + gpaSemester2) / 2;

    return {
      gpaSemester1: gpaSemester1.toFixed(2),
      gpaSemester2: gpaSemester2.toFixed(2),
      gpaYear: gpaYear.toFixed(2),
    };
  };

  const groupScoresBySemester = (scores: Score[]) => {
    const grouped: {[semester: string]: {[key: string]: Score[]}} = {};

    scores.forEach(score => {
      if (score.value !== '-1') {
        if (!grouped[score.semester]) {
          grouped[score.semester] = {};
        }
        if (!grouped[score.semester][score.key]) {
          grouped[score.semester][score.key] = [];
        }
        grouped[score.semester][score.key].push(score);
      }
    });

    return grouped;
  };

  if (!editableScores) {
    return null; // Hoặc bạn có thể trả về một component loading nếu muốn
  }

  const GPA = calculateGPA();

  return (
    <View style={styles.container}>
      <Text style={styles.headingTitle}>Điểm trung bình</Text>
      <View style={styles.gpaContainer}>
        <Text style={styles.gpaText}>Học kỳ I: {GPA.gpaSemester1}</Text>
        <Text style={styles.gpaText}>Học kỳ II: {GPA.gpaSemester2}</Text>
        <Text style={styles.gpaText}>Cả năm: {GPA.gpaYear}</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {editableScores &&
          editableScores.details.map(
            (subjectScore: Subject, subjectIndex: number) => (
              <View key={subjectIndex} style={styles.subjectContainer}>
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
                                {groupedScores[semester][key].map(score => (
                                  <View
                                    key={score.id}
                                    style={styles.scoreInputContainer}>
                                    <TextInput
                                      style={styles.keyValueInput}
                                      value={score.value}
                                      onChangeText={newValue =>
                                        handleScoreChange(
                                          subjectIndex,
                                          score.id,
                                          newValue,
                                        )
                                      }
                                      keyboardType="numeric"
                                    />
                                    <TouchableOpacity
                                      style={styles.deleteButton}
                                      onPress={() =>
                                        handleDeleteScore(
                                          subjectIndex,
                                          score.id,
                                        )
                                      }>
                                      <Text style={styles.deleteButtonText}>
                                        X
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                ))}
                                <TouchableOpacity
                                  style={styles.addButton}
                                  onPress={() =>
                                    handleAddScore(subjectIndex, key, semester)
                                  }>
                                  <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>
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
                {subjectIndex < editableScores.details.length && (
                  <View style={styles.horizontalLine} />
                )}
              </View>
            ),
          )}
      </ScrollView>
    </View>
  );
};

export default Calculate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    marginLeft: 120,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
    marginLeft: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
    marginTop: 10,
  },
  scrollView: {
    maxHeight: '90%',
    marginBottom: 50,
  },
  scrollViewContent: {
    paddingTop: 16,
  },
  gpaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  gpaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  goBackButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'black',
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primaryColor,
  },
  semesterHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  keyText: {
    color: 'black',
    fontWeight: '500',
  },
  keyValueInput: {
    color: 'black',
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: '#999',
    padding: 5,
    marginHorizontal: 5,
  },
  scoreInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    marginLeft: 5,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 5,
    marginLeft: 5,
    borderRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#999999',
    marginVertical: 8,
  },
  titleEvaluate: {
    color: 'black',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  titleEvaluateDetail: {
    color: 'black',
    paddingHorizontal: 10,
  },
});
