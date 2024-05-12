import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RootNavigationProps} from './types';
import {StackNavigationProp} from '@react-navigation/stack';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Avatar, Card, useTheme} from 'react-native-paper';
import {colors} from '../assets/css/colors';
import {Theme} from '@react-navigation/native';
import {studentWeeklyTimeTableDates} from '../mock/weeklyTimeTable';
interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTable'>;
}

type Item = {
  name: string;
  height: number;
};

type Items = {
  [key: string]: Item[];
};

const timeToString = (time: number): string => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const WeeklyTimeTable = ({navigation}: MyProps) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'Thời khóa biểu',
      headerLeft: () => (
        // <Button onPress={() => navigation.goBack()} title="Go Back" />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [items, setItems] = useState<Items>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const agendaRef = useRef(null);
  const loadItems = (day: any) => {
    setTimeout(() => {
      let newItems: Items = {...items};

      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
          // const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < 10; j++) {
            newItems[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }

      setItems(newItems);
    }, 1000);
  };

  const renderItem = (item: Item) => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{item.name}</Text>
              <Avatar.Text label="J" />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
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
    const startDate = new Date(currentMonth);
    const endDate = new Date(currentMonth);
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
    console.log(weekRange);
    return (
      <View>
        <View style={styles.textCenter}>
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

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setDate(newMonth.getDate() - 7); // Di chuyển đến tuần trước đó
    } else {
      newMonth.setDate(newMonth.getDate() + 7); // Di chuyển đến tuần tiếp theo
    }
    setCurrentMonth(newMonth);
  };
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setDate(newMonth.getDate() - 7); // Chuyển đến tuần trước đó
    } else {
      newMonth.setDate(newMonth.getDate() + 7); // Chuyển đến tuần tiếp theo
    }
    setCurrentMonth(newMonth);
  };
  const handleDayPress = (day: any) => {
    // Cập nhật currentMonth với ngày được chọn
    setCurrentMonth(new Date(day.timestamp));
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

  // const customTheme: any = {
  //   dayTextColor: colors.primaryColor,
  //   textSectionTitleColor: theme.colors.onBackground,
  //   textMonthFontWeight: 'bold',
  //   dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  // };
  return (
    <View style={{flex: 1}}>
      <View style={styles.textCenter}>
        <Text style={styles.textSemester}>HỌC KỲ I</Text>
      </View>

      {renderCalendarHeader()}
      <Agenda
        key={agendaCurrentMonth.getTime()} // Sử dụng key duy nhất dựa trên thời gian của currentMonth
        ref={agendaRef}
        items={items}
        loadItemsForMonth={loadItems}
        selected={currentMonth.toISOString().split('T')[0]}
        renderItem={renderItem}
        current={currentMonth}
        onDayPress={handleDayPress}
        VisibleMonthsChange={handleVisibleMonthsChange}
        firstDay={1}
        // theme={{

        //   // calendarBackground: theme.colors.background,
        //   textSectionTitleColor: theme.colors.onBackground,
        //   textMonthFontWeight: 'bold',
        //   // selectedDayBackgroundColor: 'transparent',
        //   // selectedDayTextColor: theme.colors.onBackground,
        //   // todayTextColor: theme.colors.onBackground,
        //   // todayBackgroundColor: theme.colors.primary,
        //   dayTextColor: colors.primaryColor, //Disabled days
        //   // dotColor: theme.colors.primary,
        //   // selectedDotColor: theme.colors.onBackground,
        //   // monthTextColor: theme.colors.onBackground,
        // }}
        theme={{
          dayTextColor: colors.primaryColor,
          textSectionTitleColor: theme.colors.onBackground,
          textMonthFontWeight: 'bold',
        }}
      />
    </View>
  );
};

export default WeeklyTimeTable;
const styles = StyleSheet.create({
  textSemester: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackColor,
    margin: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {
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
