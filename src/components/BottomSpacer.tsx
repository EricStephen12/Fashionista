import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Platform } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

const SpacerView = styled.View`
  height: ${TAB_BAR_HEIGHT}px;
`;

const BottomSpacer = () => {
  return <SpacerView />;
};

export default BottomSpacer; 