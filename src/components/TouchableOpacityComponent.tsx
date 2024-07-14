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
import {colors} from '../assets/css/colors';
import {blue400} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface TouchableOpacityComponentProps {
  imageSource: ImageSourcePropType;
  subject: string;
  semester1Average: number;
  semester2Average: number;
  yearAverage: number;
  onPress: () => void;
}

const TouchableOpacityComponent: React.FC<TouchableOpacityComponentProps> = ({
  imageSource,
  subject,
  semester1Average,
  semester2Average,
  yearAverage,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.imageContainer}>
        <View style={{width: 20, height: 20}}>
          <CircularProgressComponent value={yearAverage * 10} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.text,
            {fontWeight: 'bold', fontSize: 18, color: colors.warningColor},
          ]}>
          {subject}
        </Text>
        <View style={styles.row}>
          <Text style={styles.text}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Học kỳ I: </Text>
            {semester1Average}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Học kỳ II: </Text>
            {semester2Average}
          </Text>
          <Text
            style={[
              styles.text,
              {
                paddingRight: 10,
                color: colors.primaryColor,
                fontWeight: 'bold',
              },
            ]}>
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Cả năm: </Text>
            {yearAverage}
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
    marginVertical: 10,
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
