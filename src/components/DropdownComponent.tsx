import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useRef, useState} from 'react';

const schoolYears = [
  {schoolYear: '2015-2016'},
  {schoolYear: '2016-2017'},
  {schoolYear: '2017-2018'},
  {schoolYear: '2018-2019'},
  {schoolYear: '2019-2020'},
  {schoolYear: '2020-2021'},
  {schoolYear: '2021-2022'},
  {schoolYear: '2023-2024'},
  {schoolYear: '2025-2026'},
  {schoolYear: '2026-2027'},
  {schoolYear: '2028-2029'},
  {schoolYear: '2030-2031'},
  {schoolYear: '2032-2033'},
  {schoolYear: '2034-2035'},
];
const DropdownComponent = () => {
  const [selectedYear, setSelectedYear] = useState('Năm học');
  const [isClicked, setIsClicked] = useState(false);
  const [data, setData] = useState(schoolYears);
  const searchRef = useRef<TextInput>(null);
  const onSearch = (txt: string) => {
    if (txt !== '') {
      let tempData = data.filter(item => {
        return item.schoolYear.toLowerCase().indexOf(txt.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(schoolYears);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>dropdownComponent</Text>
      <TouchableOpacity
        style={styles.dropdownSelector}
        onPress={() => {
          setIsClicked(!isClicked);
        }}>
        <Text>{selectedYear}</Text>
        {isClicked ? (
          <Image
            source={require('../assets/images/icons/upload.png')}
            style={styles.icon}
          />
        ) : (
          <Image
            source={require('../assets/images/icons/dropdown.png')}
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
      {isClicked ? (
        <View style={styles.dropdownArea}>
          <TextInput
            ref={searchRef}
            placeholder="Tìm kiếm"
            style={styles.searchInput}
            onChangeText={txt => {
              onSearch(txt);
            }}
          />
          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.yearItem}
                  onPress={() => {
                    setSelectedYear(item.schoolYear);
                    onSearch('');
                    setIsClicked(false);
                    if (searchRef.current) {
                      searchRef.current.clear();
                    }
                  }}>
                  <Text>{item.schoolYear}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 100,
    alignSelf: 'center',
  },
  dropdownSelector: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#8e8e8e',
    alignSelf: 'center',
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  icon: {
    height: 20,
    width: 20,
  },
  dropdownArea: {
    width: '90%',
    height: 300,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
  },
  searchInput: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#8e8e8e',
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 15,
  },
  yearItem: {
    width: '85%',
    height: 50,
    borderBottomWidth: 0.2,
    borderBlockColor: '#8e8e8e',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
