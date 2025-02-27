import React from 'react';
import { ScrollView as RNScrollView, ScrollViewProps } from 'react-native';

const ScrollView: React.FC<ScrollViewProps> = ({ children, ...props }) => {
  return (
    <RNScrollView {...props}>
      {children}
    </RNScrollView>
  );
};

export default ScrollView;