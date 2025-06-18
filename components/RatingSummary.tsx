import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface RatingSummaryProps {
  rating: number;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  color?: string;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StarContainer = styled.View`
  flex-direction: row;
`;

const RatingText = styled.Text<{ size: 'small' | 'medium' | 'large', color?: string }>`
  font-weight: bold;
  margin-right: 4px;
  font-size: ${props => props.size === 'small' ? '12px' : props.size === 'medium' ? '14px' : '16px'};
  color: ${props => props.color || '#FFB800'};
`;

const CountText = styled.Text<{ size: 'small' | 'medium' | 'large' }>`
  color: #64748B;
  margin-left: 4px;
  font-size: ${props => props.size === 'small' ? '10px' : props.size === 'medium' ? '12px' : '14px'};
`;

const RatingSummary = ({ 
  rating = 0, 
  count = 0, 
  size = 'medium', 
  showCount = true,
  color = '#FFB800'
}: RatingSummaryProps) => {
  // Ensure rating is a valid number
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
  
  // Get star sizes based on component size
  const getStarSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 18;
      default: return 14;
    }
  };
  
  const starSize = getStarSize();
  
  // Round rating to nearest half star
  const roundedRating = Math.round(safeRating * 2) / 2;
  
  // Create array of stars
  const renderStars = () => {
    const stars = [];
    
    // Full stars
    const fullStars = Math.floor(roundedRating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons 
          key={`full-${i}`} 
          name="star" 
          size={starSize} 
          color={color} 
        />
      );
    }
    
    // Half star
    if (roundedRating % 1 !== 0) {
      stars.push(
        <Ionicons 
          key="half" 
          name="star-half" 
          size={starSize} 
          color={color} 
        />
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(roundedRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons 
          key={`empty-${i}`} 
          name="star-outline" 
          size={starSize} 
          color={color} 
        />
      );
    }
    
    return stars;
  };
  
  return (
    <Container>
      <RatingText size={size} color={color}>{safeRating.toFixed(1)}</RatingText>
      <StarContainer>
        {renderStars()}
      </StarContainer>
      {showCount && count > 0 && (
        <CountText size={size}>({count})</CountText>
      )}
    </Container>
  );
};

export default RatingSummary; 