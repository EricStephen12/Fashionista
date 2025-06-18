import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { validateContent } from '../utils/ContentFilter';

interface ContentFilterWrapperProps {
  children: React.ReactElement<TextInputProps>;
  onValidationChange?: (isValid: boolean) => void;
  onFilteredTextChange?: (text: string) => void;
  showError?: boolean;
}

/**
 * A wrapper component that adds content filtering to any text input component
 * to prevent users from sharing sensitive payment information.
 */
const ContentFilterWrapper: React.FC<ContentFilterWrapperProps> = ({
  children,
  onValidationChange,
  onFilteredTextChange,
  showError = true,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Create a modified onChange handler
  const handleTextChange = useCallback((text: string) => {
    // Validate the text content
    const validation = validateContent(text);
    
    // Update error state
    setErrorMessage(validation.isValid ? null : validation.errorMessage || null);
    
    // Notify parent component about validation state if needed
    if (onValidationChange) {
      onValidationChange(validation.isValid);
    }
    
    // Pass the filtered text to parent if needed
    if (onFilteredTextChange) {
      onFilteredTextChange(text);
    }
    
    // Call the original onChangeText handler from the child
    if (children.props.onChangeText) {
      children.props.onChangeText(text);
    }
  }, [children.props.onChangeText, onValidationChange, onFilteredTextChange]);
  
  // Clone the child element with our modified props
  const childWithFilter = React.cloneElement(children, {
    onChangeText: handleTextChange,
    style: [
      children.props.style,
      errorMessage ? styles.errorInput : null
    ],
  });
  
  return (
    <View style={styles.container}>
      {childWithFilter}
      
      {showError && errorMessage && (
        <ErrorContainer>
          <Ionicons name="alert-circle" size={14} color="#FF4757" />
          <ErrorText>{errorMessage}</ErrorText>
        </ErrorContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorInput: {
    borderColor: '#FF4757',
    borderWidth: 1,
  },
});

const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const ErrorText = styled.Text`
  color: #FF4757;
  font-size: 12px;
  margin-left: 6px;
  flex: 1;
`;

export default ContentFilterWrapper; 