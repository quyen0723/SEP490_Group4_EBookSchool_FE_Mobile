import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RootNavigationProps, TimeTableData} from './types';
import {StackNavigationProp} from '@react-navigation/stack';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Avatar, Card, useTheme} from 'react-native-paper';
import {colors} from '../assets/css/colors';
import {RouteProp, Theme, useFocusEffect} from '@react-navigation/native';
import {studentWeeklyTimeTableDates} from '../mock/weeklyTimeTable';
import {
  Col,
  ColProps,
  Row,
  Table,
  TableWrapper,
} from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MemoizedCard from '../components/MemoizedCard';
import {useTab} from '../components/TabContext';
interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTable'>;
  route: RouteProp<{params: {year: string; semesterId: number}}, 'params'>;
}

type Item = {
  name: string;
  slotTime: string; // Thêm slotTime vào kiểu dữ liệu Item
  teacherOrClassroom: string;
  slot: string;
  status: string;
  numberOfSlotsWithData?: number;
  // height: number;
};

type Items = {
  [key: string]: Item[];
};
interface CustomColProps extends ColProps {
  widthArr?: number[];
}
const getFormattedDate = (date: Date): string => {
  const day: string = String(date.getDate()).padStart(2, '0');
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const year: number = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getMondayOfWeek = (date: Date): Date => {
  const currentDay: number = date.getDay();
  const distanceToMonday: number = (currentDay + 6) % 7; // Calculate the distance to the last Monday
  const monday: Date = new Date(date);
  monday.setDate(date.getDate() - distanceToMonday);
  return monday;
};

const getMondayOfCurrentWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const distanceToMonday = (dayOfWeek + 6) % 7; // Calculate distance to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  return monday;
};

const getFormattedMondayOfWeek = (date: Date): string => {
  return getFormattedDate(getMondayOfWeek(date));
};

const formattedMondayOfCurrentWeek: string = getFormattedMondayOfWeek(
  new Date(),
);

console.log(formattedMondayOfCurrentWeek);

const timeToString = (time: number): string => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const WeeklyTimeTable: React.FC<MyProps> = ({navigation, route}) => {
  // const [monday, setMonday] = useState(getFormattedMondayOfWeek(new Date()));
  const {year} = route.params;
  const {currentTab} = useTab(); // Use currentTab from useTab
  const [monday, setMonday] = useState(
    getFormattedDate(getMondayOfCurrentWeek()),
  );
  const [selectedDate, setSelectedDate] = useState(
    timeToString(getMondayOfCurrentWeek().getTime()),
  );
  const [weeklyTimeTable, setWeeklyTimeTable] = useState<TimeTableData | null>(
    null,
  );
  const [fromDatee, setFromDatee] = useState<string | null>();
  const [toDatee, setToDatee] = useState<string | null>();
  const [classData, setClassData] = useState<string | null>();
  const [teacherData, setTeacherData] = useState<string | null>();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [items, setItems] = useState<Items>({});
  const [currentMonth, setCurrentMonth] = useState(getMondayOfCurrentWeek());
  const agendaRef = useRef(null);
  // const [items, setItems] = useState<Items>({});
  // const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchTimeTable = useCallback(
    async (userId: string) => {
      console.log('AAAAAAAAAAAAAAAAAAAAAAA');
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const roles = JSON.parse(
          (await AsyncStorage.getItem('userRoles')) || '[]',
        );
        let url = '';

        if (roles.includes('Student')) {
          url = `https://orbapi.click/api/Schedules/Student?studentID=${userId}&schoolYear=${year}&fromDate=${monday}`;
        } else if (
          roles.includes('Subject Teacher') ||
          roles.includes('Admin')
        ) {
          url = `https://orbapi.click/api/Schedules/SubjectTeacher?teacherID=${userId}&schoolYear=${year}&fromDate=${monday}`;
        } else if (roles.includes('HomeroomTeacher')) {
          url = `https://orbapi.click/api/Schedules/HomeroomTeacher?teacherID=${userId}&schoolYear=${year}&fromDate=${monday}`;
        }
        console.log('yeyyyyyyyy', year);
        if (url) {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const textResponse = await response.text();
          console.log('Response:', textResponse);

          if (textResponse === 'Không tìm thấy lớp học') {
            const emptyItems: Items = {};
            const fromDate = new Date(monday.split('/').reverse().join('-'));
            const toDate = new Date(fromDate);
            toDate.setDate(fromDate.getDate() + 6);

            for (
              let date = fromDate;
              date <= toDate;
              date.setDate(date.getDate() + 1)
            ) {
              const strTime = timeToString(date.getTime());
              emptyItems[strTime] = [
                {
                  name: 'Không tìm thấy lớp học',
                  slotTime: '',
                  teacherOrClassroom: '',
                  slot: '',
                  status: '',
                },
              ];
            }
            setItems(emptyItems);
          } else {
            const timeTableData = JSON.parse(textResponse);
            console.log('Time table data:', timeTableData);

            if (timeTableData) {
              const processedItems = processTimeTableData(timeTableData, roles);
              setWeeklyTimeTable(timeTableData);
              setItems(processedItems);
              setFromDatee(timeTableData.fromDate);
              setToDatee(timeTableData.toDate);
              setClassData(timeTableData.class);
              setTeacherData(timeTableData.mainTeacher);
            } else {
              console.error('Received empty timetable data');
            }
          }
        } else {
          console.error('No valid role found for fetching timetable');
        }
      } catch (error) {
        console.error('Error fetching timetable data', error);
      }
    },
    [monday, year], // dependency array
  );
  useFocusEffect(
    useCallback(() => {
      const fetchUserIdAndRoles = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          const roles = JSON.parse(
            (await AsyncStorage.getItem('userRoles')) || '[]',
          );
          if (storedUserId) {
            setUserId(storedUserId);
            setUserRoles(roles);
            if (currentTab === year) {
              fetchTimeTable(storedUserId);
            }
          } else {
            console.error('No user ID found in AsyncStorage');
          }
        } catch (error) {
          console.error(
            'Error fetching user ID or roles from AsyncStorage',
            error,
          );
        }
      };

      fetchUserIdAndRoles();
    }, [fetchTimeTable, currentTab, year]),
  );

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: 'Thời khóa biểu',
  //     headerLeft: () => (
  //       <TouchableOpacity onPress={() => navigation.goBack()}>
  //         <Image
  //           style={styles.imge}
  //           source={require('../assets/images/icons/Back.png')}
  //         />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  const processTimeTableData = useCallback(
    (timeTableData: TimeTableData['data'], roles: string[]): Items => {
      const newItems: Items = {};
      const isTeacherOrAdmin =
        roles.includes('Subject Teacher') ||
        roles.includes('Admin') ||
        roles.includes('HomeroomTeacher');

      if (timeTableData.details) {
        timeTableData.details.forEach(detail => {
          const date = convertDateFormat(detail.date);
          const filteredSlots = detail.slots.filter(
            slot =>
              slot.subject !== '' &&
              slot.teacher !== '' &&
              slot.status !== '' &&
              slot.slotTime !== '',
          );

          if (filteredSlots.length === 0) {
            newItems[date] = [
              {
                name: 'Không có tiết học cho ngày hôm nay',
                slotTime: '',
                teacherOrClassroom: '',
                slot: '',
                status: '',
              },
            ];
          } else {
            newItems[date] = filteredSlots.map(slot => ({
              name: `Môn học: ${slot.subject}`,
              slotTime: slot.slotTime,
              teacherOrClassroom: isTeacherOrAdmin
                ? `Lớp: ${slot.classroom}`
                : `Giáo viên: ${slot.teacher}`,
              slot: `${slot.slot}`,
              status: `${slot.status}`,
            }));
          }
        });
      }
      return newItems;
    },
    [],
  );

  // const fromDate = studentWeeklyTimeTableDates.data.fromDate;
  // const toDate = studentWeeklyTimeTableDates.data.toDate;
  const convertDateFormat = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const loadItems = useCallback(
    (day: any) => {
      setTimeout(() => {
        const newItems: Items = {...items};
        if (fromDatee && toDatee && weeklyTimeTable && weeklyTimeTable.data) {
          const fromDate = new Date(convertDateFormat(fromDatee));
          const toDate = new Date(convertDateFormat(toDatee));

          for (
            let date = new Date(fromDate);
            date <= toDate;
            date.setDate(date.getDate() + 1)
          ) {
            const strTime = timeToString(date.getTime());
            if (!newItems[strTime]) {
              newItems[strTime] = [];
              const dayDetail = weeklyTimeTable.data.details.find(
                detail => convertDateFormat(detail.date) === strTime,
              );
              if (dayDetail) {
                const numberOfSlotsWithData = dayDetail.slots.filter(
                  slot => slot.subject !== '' && slot.teacher !== '',
                ).length;

                if (numberOfSlotsWithData === 0) {
                  newItems[strTime].push({
                    name: 'Không có tiết học cho ngày hôm nay',
                    slotTime: '',
                    teacherOrClassroom: '',
                    slot: '',
                    status: '',
                  });
                } else {
                  newItems[strTime] = dayDetail.slots
                    .filter(
                      slot =>
                        slot.subject !== '' &&
                        slot.teacher !== '' &&
                        slot.status !== '' &&
                        slot.slotTime !== '',
                    )
                    .map(slot => ({
                      name: `Môn học: ${slot.subject}`,
                      slotTime: slot.slotTime,
                      teacherOrClassroom: userRoles.includes('Student')
                        ? `Giáo viên: ${slot.teacher}`
                        : `Lớp: ${slot.classroom}`,
                      slot: `${slot.slot}`,
                      status: `${slot.status}`,
                    }));
                }
              } else {
                newItems[strTime].push({
                  name: 'Không có tiết học cho ngày hôm nay',
                  slotTime: '',
                  teacherOrClassroom: '',
                  slot: '',
                  status: '',
                });
              }
            }
          }
        }
        setItems(newItems);
      }, 1000);
    },
    [fromDatee, toDatee, weeklyTimeTable, items, convertDateFormat, userRoles],
  );

  const getSlotsForDay = (date: Date): any[] | null => {
    const dayOfWeek = date.getDay();
    const weekDate = getWeekDayName(dayOfWeek);
    if (weekDate !== '') {
      const dayDetails = weeklyTimeTable?.data.details.find(
        detail => detail.weekDate === weekDate,
      );

      if (dayDetails) {
        return dayDetails.slots;
      }
    }
    return null;
  };

  const vietnameseDayToNumberMapping: {[key: string]: number} = {
    'Chủ Nhật': 0,
    'Thứ Hai': 1,
    'Thứ Ba': 2,
    'Thứ Tư': 3,
    'Thứ Năm': 4,
    'Thứ Sáu': 5,
    'Thứ Bảy': 6,
  };

  const vietnameseDayToEnglishDayMapping: {[key: string]: string} = {
    'Chủ Nhật': 'Sun',
    'Thứ Hai': 'Mon',
    'Thứ Ba': 'Tue',
    'Thứ Tư': 'Wed',
    'Thứ Năm': 'Thu',
    'Thứ Sáu': 'Fri',
    'Thứ Bảy': 'Sat',
  };

  const vietnameseDayToNumber = (dayText: string): number | undefined => {
    return vietnameseDayToNumberMapping[dayText];
  };

  const getWeekDayName = (dayIndex: number): string => {
    const vietnameseDay = Object.keys(vietnameseDayToNumberMapping).find(
      key => vietnameseDayToNumberMapping[key] === dayIndex,
    );
    if (vietnameseDay) {
      return vietnameseDayToEnglishDayMapping[vietnameseDay];
    }
    return '';
  };
  // const CustomCol: React.FC<CustomColProps> = ({widthArr, ...rest}) => {
  //   return <Col {...rest} />;
  // };

  const renderItem = useCallback(
    (item: Item, index: number, numberOfSlotsWithData: number) => {
      const isFirstItemOfDay =
        index === 0 ||
        (index > 0 && Object.values(items)[index - 1]?.[0]?.slot !== item.slot);

      const isFirstDayOfTheWeek =
        index === 0 ||
        Object.keys(items)[index] !== Object.keys(items)[index - 1];

      const tableContainerHeight =
        item.name === ''
          ? 70
          : item.name.startsWith('Không có tiết học')
          ? 20
          : 70;
      if (item.name === 'Không tìm thấy lớp học') {
        return (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 17,
                height: tableContainerHeight,
              }}>
              <Card>
                <Card.Content>
                  <Text>Không tìm thấy thời khóa biểu cho năm học này</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
        );
      }

      if (item.name === '') {
        return (
          <>
            {isFirstDayOfTheWeek && (
              <View
                style={{
                  paddingTop: 50,
                  marginRight: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: 'gray',
                  width: '20%',
                }}
              />
            )}
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 17,
                height: tableContainerHeight,
              }}>
              <Card>
                <Card.Content>
                  <Text> </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </>
        );
      } else if (item.name.startsWith('Không có tiết học')) {
        return (
          <>
            {isFirstDayOfTheWeek && (
              <View
                style={{
                  paddingTop: 50,
                  marginRight: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: 'gray',
                  width: '20%',
                }}
              />
            )}
            <TouchableOpacity
              style={{
                marginRight: 10,
                marginTop: 17,
                height: tableContainerHeight,
              }}>
              <Card>
                <Card.Content>
                  <Text>{item.name}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </>
        );
      } else {
        let statusBackgroundColor;
        let statusTextColor = colors.whiteColor;
        let statusWidth = 70;

        if (item.status === 'Vắng') {
          statusBackgroundColor = 'red';
        } else if (item.status === 'Có mặt') {
          statusBackgroundColor = 'green';
        } else if (item.status === 'Chưa bắt đầu') {
          statusBackgroundColor = 'gray';
          statusWidth = 100;
        }

        return (
          <>
            {isFirstDayOfTheWeek && (
              <View
                style={{
                  paddingTop: 50,
                  marginRight: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: 'gray',
                  width: '20%',
                }}
              />
            )}
            <MemoizedCard
              key={item.slot + item.teacherOrClassroom + item.slotTime}
              item={item}
            />
          </>
        );
      }
    },
    [items],
  );

  const renderHeader = (date: any) => {
    const month = date.month ? date.month : date.toString().split(' ')[1];
    const year = date.year ? date.year : date.toString().split(' ')[3];
    return (
      <View style={{padding: 10, alignItems: 'center'}}>
        <Text>{`${month.padStart(2, '0')}/${year}`}</Text>
      </View>
    );
  };

  const getMonthName = (monthIndex: number): string => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthIndex];
  };
  const renderCalendarHeader = () => {
    const monthName = currentMonth.toLocaleString('default', {month: 'long'});
    const year = currentMonth.getFullYear();
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Ngày đầu tiên của tuần
    endDate.setDate(endDate.getDate() - endDate.getDay() + 7); // Ngày cuối cùng của tuần

    const formatter = new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: '2-digit',
    });
    const startDay = formatter.format(startDate).split('/')[0].padStart(2, '0'); // Ensure two digits
    const startMonth = formatter
      .format(startDate)
      .split('/')[1]
      .padStart(2, '0'); // Ensure two digits
    const endDay = formatter.format(endDate).split('/')[0].padStart(2, '0'); // Ensure two digits
    const endMonth = formatter.format(endDate).split('/')[1].padStart(2, '0'); // Ensure two digits

    // const weekRange = `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
    const weekRange = `${startMonth}/${startDay} - ${endMonth}/${endDay}`;
    // console.log(weekRange);
    return (
      <View>
        <View style={styles.textCenter}>
          <Text>Tuần hiện tại</Text>
          <Text style={styles.textCurrentWeek}>{weekRange}</Text>
        </View>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => handleWeekChange('prev')}>
            <Text style={styles.prevButton}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {monthName} {year}
          </Text>
          <TouchableOpacity onPress={() => handleWeekChange('next')}>
            <Text style={styles.nextButton}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleWeekChange = useCallback(
    (direction: 'prev' | 'next') => {
      const newMonth = new Date(currentMonth);
      const currentMonday = getMondayOfWeek(
        new Date(monday.split('/').reverse().join('-')),
      );
      if (direction === 'prev') {
        newMonth.setDate(newMonth.getDate() - 7);
        currentMonday.setDate(currentMonday.getDate() - 7);
      } else {
        newMonth.setDate(newMonth.getDate() + 7);
        currentMonday.setDate(currentMonday.getDate() + 7);
      }
      setCurrentMonth(newMonth);
      setMonday(getFormattedDate(currentMonday));
      setSelectedDate(timeToString(currentMonday.getTime()));
      setItems({});
    },
    [currentMonth, monday],
  );

  // const handleDayPress = (day: any) => {
  //   const selectedDate = new Date(day.timestamp);
  //   const monday = getMondayOfWeek(selectedDate);
  //   setCurrentMonth(monday);
  //   setMonday(getFormattedDate(monday));
  //   setSelectedDate(timeToString(monday.getTime()));
  //   setItems({});
  // };
  const handleDayPress = useCallback(
    (day: any) => {
      const selectedDate = new Date(day.timestamp);
      const mondayOfSelectedDate = getMondayOfWeek(selectedDate);

      const currentMonday = getMondayOfWeek(currentMonth);
      const currentSunday = new Date(currentMonday);
      currentSunday.setDate(currentSunday.getDate() + 6);

      if (selectedDate < currentMonday || selectedDate > currentSunday) {
        setCurrentMonth(mondayOfSelectedDate);
        setMonday(getFormattedDate(mondayOfSelectedDate));
        setSelectedDate(timeToString(mondayOfSelectedDate.getTime()));
        setItems({});
      }
    },
    [currentMonth],
  );

  const [agendaCurrentMonth, setAgendaCurrentMonth] = useState(new Date());
  const handleVisibleMonthsChange = (months: any[]) => {
    if (months.length > 0) {
      const newMonth = new Date(months[0].dateString);
      setCurrentMonth(newMonth);
      setAgendaCurrentMonth(newMonth); // Cập nhật agendaCurrentMonth
    }
  };
  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      <View style={styles.textCenter}>
        <Text style={styles.textSemester}>
          {userRoles.includes('Student') ? classData : teacherData}
        </Text>
      </View>

      {renderCalendarHeader()}
      <Agenda
        key={agendaCurrentMonth.getTime()} // Sử dụng key duy nhất dựa trên thời gian của currentMonth
        ref={agendaRef}
        items={items}
        loadItemsForMonth={loadItems}
        selected={currentMonth.toISOString().split('T')[0]}
        // selected={timeToString(getMondayOfCurrentWeek().getTime())}
        renderItem={renderItem}
        current={currentMonth}
        onDayPress={handleDayPress}
        VisibleMonthsChange={handleVisibleMonthsChange}
        firstDay={1}
        theme={{
          dayTextColor: colors.primaryColor,
          textSectionTitleColor: theme.colors.onBackground,
          textMonthFontWeight: 'bold',
          todayTextColor: colors.blackColor,
          todayDotColor: colors.blackColor,
          textDayHeaderFontWeight: 'bold',
          selectedDayBackgroundColor: 'transparent',
          selectedDayTextColor: colors.primaryColor,
        }}
      />
    </View>
  );
};

export default WeeklyTimeTable;

const styles = StyleSheet.create({
  col: {
    // Các thuộc tính style cho cột
    justifyContent: 'center', // Canh giữa nội dung của cột
    alignItems: 'center', // Canh giữa theo chiều dọc của cột
  },
  wrapper: {flexDirection: 'row'},
  tableContainer: {
    flex: 1,
    padding: 5,
    paddingTop: 30,
    margin: 0,
    // height: 80,
  },
  // Style cho row
  row: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: colors.whiteColor,
  },
  // Style cho text trong row
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textSemester: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackColor,
    marginBottom: 10,
    marginTop: 0,
  },
  textCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCurrentWeek: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryColor,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
    backgroundColor: colors.whiteColor,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.blackColor,
  },
  prevButton: {
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {
    paddingRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
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

//   const handleWeekChange = (direction: 'prev' | 'next') => {
//   const currentMonday = getMondayOfWeek(new Date(monday.split('/').reverse().join('-')));
//   if (direction === 'prev') {
//     currentMonday.setDate(currentMonday.getDate() - 7); // Di chuyển đến thứ Hai tuần trước
//   } else {
//     currentMonday.setDate(currentMonday.getDate() + 7); // Di chuyển đến thứ Hai tuần tiếp theo
//   }
//   setMonday(getFormattedDate(currentMonday));
// };

// const handleMonthChange = (direction: 'prev' | 'next') => {
//   const newMonth = new Date(currentMonth);
//   if (direction === 'prev') {
//     newMonth.setDate(newMonth.getDate() - 7); // Chuyển đến tuần trước đó
//   } else {
//     newMonth.setDate(newMonth.getDate() + 7); // Chuyển đến tuần tiếp theo
//   }
//   setCurrentMonth(newMonth);
// };
// const handleDayPress = (day: any) => {
//   const selectedDate = new Date(day.timestamp);
//   // Cập nhật currentMonth với ngày được chọn
//   setCurrentMonth(new Date(day.timestamp));
//   setMonday(getFormattedDate(selectedDate));
// };

// const getSubjectForId = (id: number): string => {
//   const dayDetails = studentWeeklyTimeTableDates.data.details.find(
//     detail => detail.id === id,
//   );

//   if (dayDetails) {
//     // Lấy ngày tương ứng với id
//     switch (id) {
//       case 1:
//         return 'Mon';
//       case 2:
//         return 'Tue';
//       case 3:
//         return 'Wed';
//       case 4:
//         return 'Thu';
//       case 5:
//         return 'Fri';
//       case 6:
//         return 'Sat';
//       case 7:
//         return 'Sun';
//       default:
//         return '';
//     }
//   }
//   return '';
// };

// const MONDAY = 1;
// const TUESDAY = 2;
// const WEDNESDAY = 3;
// const THURSDAY = 4;
// const FRIDAY = 5;
// const SATURDAY = 6;
// const SUNDAY = 7;

// const getSubjectForDay = (id: number): string => {
//   let day: string;
//   switch (id) {
//     case MONDAY:
//       day = 'Mon';
//       break;
//     case TUESDAY:
//       day = 'Tue';
//       break;
//     case WEDNESDAY:
//       day = 'Wed';
//       break;
//     case THURSDAY:
//       day = 'Thu';
//       break;
//     case FRIDAY:
//       day = 'Fri';
//       break;
//     case SATURDAY:
//       day = 'Sat';
//       break;
//     case SUNDAY:
//       day = 'Sun';
//       break;
//     default:
//       day = '';
//   }
//   // console.log('id:', id);

//   // console.log('dayyy:', day);

//   const dayDetails = studentWeeklyTimeTableDates.data.details.find(
//     detail => detail.id === id,
//   );

//   if (dayDetails) {
//     const subjectDetails = dayDetails.slots.find(slot => slot.id === id);
//     if (subjectDetails) {
//       return subjectDetails.subject;
//     }
//   }
//   return '';
// };

// Kết quả: "23/05/2024" (đối với ngày 20/05/2024)

// const getFormattedDate = (date: Date): string => {
//   const day: string = String(date.getDate()).padStart(2, '0');
//   const month: string = String(date.getMonth() + 1).padStart(2, '0');
//   return `${day}/${month}`;
// };

// const getWeeksInYear = (year: number): string[] => {
//   let currentDate: Date = new Date(year, 0, 1);
//   const weeks: string[] = [];

//   if (currentDate.getDay() !== 1) {
//     currentDate.setDate(
//       currentDate.getDate() -
//         currentDate.getDay() +
//         (currentDate.getDay() === 0 ? -6 : 1),
//     );
//   }

//   while (
//     currentDate.getFullYear() <= year ||
//     (currentDate.getFullYear() === year + 1 && currentDate.getDay() !== 1)
//   ) {
//     const weekStart: Date = new Date(currentDate);
//     currentDate.setDate(currentDate.getDate() + 6);
//     const weekEnd: Date = new Date(currentDate);

//     weeks.push(`${getFormattedDate(weekStart)}-${getFormattedDate(weekEnd)}`);

//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return weeks;
// };

// console.log(getWeeksInYear(2024));

// const customTheme: any = {
//   dayTextColor: colors.primaryColor,
//   textSectionTitleColor: theme.colors.onBackground,
//   textMonthFontWeight: 'bold',
//   dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
// };
