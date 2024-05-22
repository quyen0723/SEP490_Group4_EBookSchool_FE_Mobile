import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import CircularProgressComponent from './CircularProgressComponent';

interface TouchableOpacityComponentProps {
  imageSource: ImageSourcePropType;
  title: string;
  startDate: string;
  endDate: string;
  tbcm: number;
  hanhKiem: string;
  rank: number;
  onPress: () => void;
}

const TouchableOpacityComponent: React.FC<TouchableOpacityComponentProps> = ({
  imageSource,
  title,
  startDate,
  endDate,
  tbcm,
  hanhKiem,
  rank,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.imageContainer}>
        <View style={{width: 20, height: 20}}>
          <CircularProgressComponent value={tbcm * 10} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.text, {fontWeight: 'bold'}]}>{title}</Text>
        <Text style={styles.text}>Ngày bắt đầu: {startDate}</Text>
        <Text style={styles.text}>Ngày kết thúc: {endDate}</Text>
        <View style={styles.row}>
          <Text style={styles.text}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>TBCM: </Text>
            {tbcm}
          </Text>
          <Text style={styles.text}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Hạnh kiểm: </Text>
            {hanhKiem}
          </Text>
          <Text style={styles.text}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Hạng: </Text>
            {rank}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TouchableOpacityComponent;

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    padding: 10,
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  imageContainer: {
    width: '25%',
    // marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  textContainer: {
    width: '75%',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
