import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors} from '../assets/css/colors';

interface LoaderProps {
  visible: boolean;
}

const Loader = ({visible}: LoaderProps) => {
  return (
    <Modal transparent visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'white',
          }}>
          <ActivityIndicator size={'large'} color={colors.primaryColor} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
