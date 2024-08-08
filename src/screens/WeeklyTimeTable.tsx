import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, useTheme} from 'react-native-paper';
import {ColProps} from 'react-native-table-component';
import {colors} from '../assets/css/colors';
import MemoizedCard from '../components/MemoizedCard';
import {useTab} from '../components/TabContext';
import {RootNavigationProps, TimeTableData} from './types';

import {useQueryClient} from '@tanstack/react-query';
interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTable'>;
  route: RouteProp<
    {params: {year: string; semesterId: number; timeTableData: TimeTableData}},
    'params'
  >;
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
  const {year, timeTableData} = route.params;
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

  const [fromDatee, setFromDatee] = useState<string | null>(
    timeTableData?.fromDate || null,
  );
  const [toDatee, setToDatee] = useState<string | null>(
    timeTableData?.toDate || null,
  );
  const [classData, setClassData] = useState<string | null>(
    timeTableData?.class || null,
  );
  const [teacherData, setTeacherData] = useState<string | null>(
    timeTableData?.mainTeacher || null,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [items, setItems] = useState<Items>({});
  const [currentMonth, setCurrentMonth] = useState(getMondayOfCurrentWeek());
  const [cachedWeeks, setCachedWeeks] = useState<{
    [key: string]: TimeTableData;
  }>({});
  const queryClient = useQueryClient();
  const [shouldRenderAgenda, setShouldRenderAgenda] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const agendaRef = useRef(null);

  const processTimeTableData = useCallback(
    (timeTableData: TimeTableData['details'], roles: string[]): Items => {
      const newItems: Items = {};
      const isTeacherOrAdmin =
        roles.includes('Subject Teacher') ||
        roles.includes('Admin') ||
        roles.includes('HomeroomTeacher');

      if (timeTableData) {
        timeTableData.forEach(detail => {
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

  const fetchTimeTable = useCallback(
    async (userId: string, monday: string) => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const roles = JSON.parse(
          (await AsyncStorage.getItem('userRoles')) || '[]',
        );
        let url = '';

        if (roles.includes('Student') || roles.includes('Parent')) {
          url = `https://orbapi.click/api/Schedules/Student?studentID=${userId}&schoolYear=${year}&fromDate=${monday}`;
        } else if (
          roles.includes('Subject Teacher') ||
          roles.includes('Admin')
        ) {
          url = `https://orbapi.click/api/Schedules/SubjectTeacher?teacherID=${userId}&schoolYear=${year}&fromDate=${monday}`;
        } else if (roles.includes('HomeroomTeacher')) {
          url = `https://orbapi.click/api/Schedules/HomeroomTeacher?teacherID=${userId}&schoolYear=${year}&fromDate=${monday}`;
        }

        if (url) {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const textResponse = await response.text();

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
            const fetchedTimeTableData = JSON.parse(textResponse);

            if (fetchedTimeTableData) {
              const processedItems = processTimeTableData(
                fetchedTimeTableData.details,
                roles,
              );
              setWeeklyTimeTable(fetchedTimeTableData);
              setItems(prevItems => ({...prevItems, ...processedItems}));
              setFromDatee(fetchedTimeTableData.fromDate);
              setToDatee(fetchedTimeTableData.toDate);
              setClassData(fetchedTimeTableData.class);
              setTeacherData(fetchedTimeTableData.mainTeacher);
              setShouldRenderAgenda(true);
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
    [year, processTimeTableData], // dependency array
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
              if (!timeTableData) {
                fetchTimeTable(storedUserId, monday);
              } else {
                const processedItems = processTimeTableData(
                  timeTableData.details,
                  roles,
                );
                setItems(processedItems);
                setWeeklyTimeTable(timeTableData);
                setShouldRenderAgenda(true);
              }
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
    }, [
      fetchTimeTable,
      currentTab,
      year,
      timeTableData,
      monday,
      processTimeTableData,
    ]),
  );

  const convertDateFormat = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    const newDateString = `${year}-${month}-${day}`;
    console.log('Converted date:', newDateString);
    return `${year}-${month}-${day}`;
  };

  const loadItems = useCallback(
    (day: any) => {
      setTimeout(() => {
        const newItems: Items = {...items};
        if (
          fromDatee &&
          toDatee &&
          weeklyTimeTable &&
          weeklyTimeTable.details
        ) {
          const fromDate = new Date(convertDateFormat(fromDatee));
          const toDate = new Date(convertDateFormat(toDatee));
          console.log('SAU KHI MAP', fromDate);
          for (
            let date = new Date(fromDate);
            date <= toDate;
            date.setDate(date.getDate() + 1)
          ) {
            const strTime = timeToString(date.getTime());
            console.log('SAU KHI MAP', fromDate);
            if (!newItems[strTime]) {
              newItems[strTime] = [];
              const dayDetail = weeklyTimeTable.details.find(
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
  useEffect(() => {
    const fetchInitialData = async () => {
      if (userId && monday) {
        fetchTimeTable(userId, monday); // Fetch initial data when component mounts
      }
    };

    fetchInitialData();
  }, [userId, monday, fetchTimeTable]);

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
      console.log(getFormattedDate(currentMonday));
      setSelectedDate(timeToString(currentMonday.getTime()));
      setItems({});
      if (userId) {
        fetchTimeTable(userId, getFormattedDate(currentMonday)); // Gọi API khi người dùng chuyển tuần
      }
    },
    [currentMonth, monday, userId, fetchTimeTable],
  );

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
        if (userId) {
          fetchTimeTable(userId, getFormattedDate(mondayOfSelectedDate)); // Gọi API khi người dùng chọn một ngày khác ngoài tuần hiện tại
        }
      } else {
        setSelectedDate(timeToString(selectedDate.getTime()));
      }
    },
    [currentMonth, userId, fetchTimeTable],
  );

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

    const weekRange = `${startMonth}/${startDay} - ${endMonth}/${endDay}`;
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
          {userRoles.includes('Student') || userRoles.includes('Parent')
            ? classData
            : teacherData}
        </Text>
      </View>

      {renderCalendarHeader()}
      {shouldRenderAgenda && (
        <Agenda
          key={agendaCurrentMonth.getTime()}
          ref={agendaRef}
          items={items}
          loadItemsForMonth={loadItems}
          selected={currentMonth.toISOString().split('T')[0]}
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
      )}
    </View>
  );
};

export default WeeklyTimeTable;

const styles = StyleSheet.create({
  col: {
    justifyContent: 'center', // Canh giữa nội dung của cột
    alignItems: 'center', // Canh giữa theo chiều dọc của cột
  },
  wrapper: {flexDirection: 'row'},
  tableContainer: {
    flex: 1,
    padding: 5,
    paddingTop: 30,
    margin: 0,
  },
  row: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: colors.whiteColor,
  },
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
