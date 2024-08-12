import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {colors} from '../assets/css/colors';
import TouchableOpacityComponent from '../components/TouchableOpacityComponent';
import {RootNavigationProps} from './types';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreFirstYear'>;
  route: RouteProp<{params: {year: string}}, 'params'>;
}

interface SubjectData {
  subject: string;
  semester1Average: string;
  semester2Average: string;
  yearAverage: string;
}

const ScoreFirstYear = ({navigation, route}: MyProps) => {
  const {year} = route.params;
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
    const fetchScores = async (userId: string) => {
      setLoading(true);
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `https://orbapi.click/api/Scores/AVGByStudentAllSubject?schoolYear=${year}&studentID=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
          throw new Error('API response is empty');
        }

        const data: SubjectData[] = JSON.parse(text);
        // console.log('Fetched data:', data);

        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }

        const filteredData = data.filter(
          subjectData =>
            parseFloat(subjectData.semester1Average) !== -1 ||
            parseFloat(subjectData.semester2Average) !== -1 ||
            parseFloat(subjectData.yearAverage) !== -1,
        );

        setSubjects(filteredData);
      } catch (error) {
        console.error('Error fetching scores data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, [year, userId]);

  const handleSubjectPress = (subject: string) => {
    navigation.navigate('DetailScoreFirstYearOne', {year, subject});
  };

  const renderSubjectComponents = () => {
    return subjects.map((subjectData, index) => (
      <TouchableOpacityComponent
        key={index}
        imageSource={parseFloat(subjectData.yearAverage)} // Cập nhật đường dẫn icon
        subject={subjectData.subject}
        semester1Average={subjectData.semester1Average}
        semester2Average={subjectData.semester2Average}
        yearAverage={subjectData.yearAverage}
        onPress={() => handleSubjectPress(subjectData.subject)}
      />
    ));
  };

  return (
    <View style={styles.containerMain}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primaryColor} />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {renderSubjectComponents()}
        </ScrollView>
      )}
    </View>
  );
};

export default ScoreFirstYear;

const styles = StyleSheet.create({
  containerMain: {flex: 1, width: '100%', justifyContent: 'center'},
  container: {
    flex: 1,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
