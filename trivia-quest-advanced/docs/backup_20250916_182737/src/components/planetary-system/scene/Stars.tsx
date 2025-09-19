import { Stars } from '@react-three/drei';
import React from 'react';

const StarField: React.FC<React.ComponentProps<typeof Stars>> = (props) => {
  return <Stars {...props} />;
};

export default StarField;