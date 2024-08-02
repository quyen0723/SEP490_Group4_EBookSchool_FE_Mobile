// IMGElement.tsx
import React from 'react';
import {Image, ImageProps} from 'react-native';

interface IMGElementProps extends ImageProps {
  source?: any;
}

const IMGElement: React.FC<IMGElementProps> = ({
  source = require('./default-image.png'),
  ...props
}) => {
  return <Image source={source} {...props} />;
};

export default IMGElement;
