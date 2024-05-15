import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootNavigationProps} from './types';
import {colors} from '../assets/css/colors';
import {scoreByStudent} from '../mock/score';

interface DetailScoreFirstYearOneProps {
  navigation: StackNavigationProp<
    RootNavigationProps,
    'DetailScoreFirstYearOne'
  >;
  route: RouteProp<RootNavigationProps, 'DetailScoreFirstYearOne'>;
}

const DetailScoreFirstYearOne = ({
  navigation,
  route,
}: DetailScoreFirstYearOneProps) => {
  const {semesterId} = route.params;

  // Tìm kiếm thông tin của học kỳ có ID tương ứng
  const selectedSemester = scoreByStudent.data.find(
    semester => semester.id === semesterId,
  );

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
          <Text style={styles.semesterIdText}>
            {selectedSemester?.semester}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.semesterIdText}>
            TBCM: {selectedSemester?.average}
          </Text>
          <Text style={styles.semesterIdText}>
            Hạnh kiểm: {selectedSemester?.conduct}
          </Text>
          <Text style={styles.semesterIdText}>
            Hạng: {selectedSemester?.rank}
          </Text>
        </View>

        {/* Hiển thị thông tin điểm của các môn học */}
        {selectedSemester &&
          selectedSemester.scores.map((subjectScore, index) => (
            <View key={index} style={styles.subjectContainer}>
              <Text style={styles.subjectText}>{subjectScore.subject}</Text>
              {subjectScore.scoreDetail.map((detail, detailIndex) => (
                <Text key={detailIndex} style={styles.detailText}>
                  {detail.key}: {detail.value}
                </Text>
              ))}
            </View>
          ))}
      </View>
    </View>
  );
};

export default DetailScoreFirstYearOne;

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
    marginLeft: 100,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semesterIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    flex: 1,
  },
  subjectContainer: {
    backgroundColor: colors.whiteColor,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
