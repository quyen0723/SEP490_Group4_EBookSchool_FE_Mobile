import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Row, Rows, Table} from 'react-native-table-component';

const ExampleTable = () => {
  const [tableHead, setTableHead] = useState([
    'Head',
    'Head2',
    'Head3',
    'Head4',
  ]);
  const [tableData, setTableData] = useState([
    ['1', '2', '3', '4'],
    ['a', 'b', 'c', 'd'],
    ['1', '2', '3', '456\n789'],
    ['a', 'b', 'c', 'd'],
  ]);

  return (
    <View style={styles.container}>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  );
};
export default ExampleTable;
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, color: 'red'},
});
