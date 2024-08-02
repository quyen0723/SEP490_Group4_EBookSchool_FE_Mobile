import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import {colors} from '../assets/css/colors';

type Item = {
  name: string;
  slotTime: string;
  teacherOrClassroom: string; // Cập nhật để chứa thông tin giáo viên hoặc lớp học
  slot: string;
  status: string;
  numberOfSlotsWithData?: number;
};

interface MemoizedCardProps {
  item: Item;
}

const MemoizedCard: React.FC<MemoizedCardProps> = React.memo(({item}) => {
  let statusBackgroundColor;
  let statusTextColor = colors.whiteColor; // Mặc định là màu trắng
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
    <TouchableOpacity style={{marginRight: 10, marginTop: 17, height: 70}}>
      <Card>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
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
                  fontSize: 14,
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                }}>
                {item.teacherOrClassroom} {/* Sử dụng thuộc tính cập nhật */}
              </Text>
            </View>
            <View style={{flex: 3, alignItems: 'center'}}>
              <View
                style={{
                  height: 20,
                  width: statusWidth,
                  backgroundColor: statusBackgroundColor,
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
                  {item.status}
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
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
});

export default MemoizedCard;
