// IMGRenderer.tsx
import React from 'react';
import IMGElement from './IMGElement';

interface IMGRendererProps {
  source?: any;
}

const IMGRenderer: React.FC<IMGRendererProps> = ({
  source = require('./default-image.png'),
}) => {
  return <IMGElement source={source} />;
};

export default IMGRenderer;
