import { Platform, Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

export const theme = {
  colors: {
    primary: '#7c4dff',
    secondary: '#ff4757',
    background: '#f8fafd',
    text: '#1a1a2e',
    textSecondary: '#64748B',
    border: '#E5E7EB',
    white: '#ffffff',
    error: '#FF4757',
    success: '#4CAF50',
  },
};

export const SafeBottomPadding = styled.View`
  height: ${TAB_BAR_HEIGHT}px;
`; 