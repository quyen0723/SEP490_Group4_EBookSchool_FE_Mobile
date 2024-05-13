import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RootNavigationProps} from './types';
import {StackNavigationProp} from '@react-navigation/stack';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import {Avatar, Card, useTheme} from 'react-native-paper';
import {colors} from '../assets/css/colors';
import {Theme} from '@react-navigation/native';
import {studentWeeklyTimeTableDates} from '../mock/weeklyTimeTable';
import {
  Col,
  ColProps,
  Row,
  Table,
  TableWrapper,
} from 'react-native-table-component';
interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTable'>;
}

type Item = {
  name: string;
  slotTime: string; // Thêm slotTime vào kiểu dữ liệu Item
  teacher: string;
  slot: string;
  // height: number;
};

type Items = {
  [key: string]: Item[];
};
interface CustomColProps extends ColProps {
  widthArr?: number[];
}

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
  const fromDate = studentWeeklyTimeTableDates.data.fromDate;
  const toDate = studentWeeklyTimeTableDates.data.toDate;

  const loadItems = (day: any) => {
    setTimeout(() => {
      let newItems: Items = {...items};

      const fromDate = studentWeeklyTimeTableDates.data.fromDate;
      const toDate = studentWeeklyTimeTableDates.data.toDate;

      const convertDateFormat = (dateString: string): string => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
      };
      const fromDateFormatted = new Date(convertDateFormat(fromDate));
      const toDateFormatted = new Date(convertDateFormat(toDate));

      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const currentDate = new Date(time);

        if (
          currentDate >= fromDateFormatted &&
          currentDate <= toDateFormatted
        ) {
          const strTime = timeToString(time);
          if (!newItems[strTime]) {
            newItems[strTime] = [];
            const slots = getSlotsForDay(currentDate);
            if (slots) {
              slots.forEach(slot => {
                if (slot) {
                  newItems[strTime].push({
                    name: `Môn học: ${slot.subject}`,
                    slotTime: slot.slotTime,
                    teacher: `Giáo viên: ${slot.teacher}`,
                    slot: `${slot.slot}`,
                    // height: Math.max(50, Math.floor(Math.random() * 150)),
                  });
                } else {
                  newItems[strTime].push({
                    name: `Không có tiết học`,
                    slotTime: ``,
                    teacher: ``,
                    slot: ``,
                    // height: Math.max(50, Math.floor(Math.random() * 150)),
                  });
                }
              });
            } else {
              newItems[strTime].push({
                name: `Không có tiết học`,
                slotTime: ``,
                teacher: ``,
                slot: ``,
                // height: Math.max(50, Math.floor(Math.random() * 150)),
              });
            }
          }
        } else {
          const strTime = timeToString(time);
          if (!newItems[strTime]) {
            newItems[strTime] = [];
            // for (let j = 0; j < 10; j++) {
            newItems[strTime].push({
              name: `Không có tiết học`,
              slotTime: ``,
              teacher: ``,
              slot: ``,
              // height: Math.max(50, Math.floor(Math.random() * 150)),
            });
            // }
          }
        }
      }

      setItems(newItems);
    }, 1000);
  };

  const getSlotsForDay = (date: Date): any[] | null => {
    const dayOfWeek = date.getDay();
    const dayDetails = studentWeeklyTimeTableDates.data.details.find(
      detail => detail.weekDate === getWeekDayName(dayOfWeek),
    );

    if (dayDetails) {
      return dayDetails.slots;
    }
    return null;
  };

  const getWeekDayName = (dayIndex: number): string => {
    switch (dayIndex) {
      case 0:
        return 'Sun';
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      default:
        return '';
    }
  };
  // const CustomCol: React.FC<CustomColProps> = ({widthArr, ...rest}) => {
  //   return <Col {...rest} />;
  // };
  const renderItem = (item: Item, index: number) => {
    const isFirstItemOfDay =
      index === 0 ||
      (index > 0 && Object.values(items)[index - 1]?.[0]?.slot !== item.slot);

    // Kiểm tra xem item đang được render có phải là ngày đầu tiên của tuần không
    const isFirstDayOfTheWeek =
      index === 0 ||
      Object.keys(items)[index] !== Object.keys(items)[index - 1];

    const tableContainerHeight = item.name.startsWith(`Không có tiết học`)
      ? 20
      : 70;

    return (
      <>
        {/* Phân cách giữa các ngày */}
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
        {/* Nội dung của mỗi item */}
        <TouchableOpacity
          style={{
            marginRight: 10,
            marginTop: 17,
            height: tableContainerHeight,
          }}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {item.name.startsWith(`Không có tiết học`) ? (
                  <Text>{item.name}</Text>
                ) : (
                  <>
                    <View style={{flex: 1}}>
                      <Text>{item.slot}</Text>
                    </View>
                    <View style={{flex: 7}}>
                      <Text
                        style={{
                          color: colors.warningColor,
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: colors.textColor,
                          fontSize: 16,
                          fontWeight: 'bold',
                          fontStyle: 'italic',
                        }}>
                        {item.teacher}
                      </Text>
                    </View>
                    <View style={{flex: 3, alignItems: 'center'}}>
                      <View
                        style={{
                          height: 20,
                          width: 70,
                          backgroundColor: 'green',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 20,
                        }}>
                        <Text
                          style={{
                            color: colors.whiteColor,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                          }}>
                          Có mặt
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 20,
                          width: 90,
                          backgroundColor: 'blue',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 3,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: colors.whiteColor,
                          }}>
                          {item.slotTime}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </>
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
    // console.log(weekRange);
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
        theme={{
          dayTextColor: colors.primaryColor,
          textSectionTitleColor: theme.colors.onBackground,
          textMonthFontWeight: 'bold',
          todayTextColor: colors.blackColor,
          textDayHeaderFontWeight: 'bold',
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
