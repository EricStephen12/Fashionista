import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Modal, 
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useUser } from '../UserContext';
import RatingSummary from './RatingSummary';
import { validateContent } from '../src/utils/ContentFilter';

const { width } = Dimensions.get('window');

// Mock review data
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  userHelpfulVote?: boolean;
}

interface DesignerReviewsProps {
  designerId: string;
  designerName: string;
}

// Styled components
const Container = styled.View`
  background-color: #fff;
  border-radius: 16px;
  margin: 8px 20px 16px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 4;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const RatingValue = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #1a1a2e;
  margin-right: 12px;
`;

const RatingStars = styled.View`
  flex-direction: row;
`;

const RatingCount = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-left: 8px;
`;

const ReviewItem = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f1f5f9;
`;

const ReviewHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 12px;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a2e;
`;

const ReviewDate = styled.Text`
  font-size: 12px;
  color: #64748B;
`;

const ReviewRating = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const ReviewComment = styled.Text`
  font-size: 14px;
  color: #374151;
  line-height: 20px;
`;

const ReviewActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
`;

const HelpfulButton = styled.TouchableOpacity<{ voted: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  background-color: ${props => props.voted ? '#EBF5FF' : '#f1f5f9'};
`;

const HelpfulText = styled.Text<{ voted: boolean }>`
  font-size: 12px;
  color: ${props => props.voted ? '#3B82F6' : '#64748B'};
  margin-left: 4px;
`;

const AddReviewButton = styled.TouchableOpacity`
  background-color: #3B82F6;
  padding: 12px 16px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const AddReviewText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
  margin-left: 8px;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  width: ${width - 40}px;
  max-height: ${width * 1.2}px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const RatingSelector = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
`;

const RatingStar = styled.TouchableOpacity`
  padding: 4px;
`;

const CommentInput = styled.TextInput`
  border-width: 1px;
  border-color: #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #1a1a2e;
  min-height: 100px;
  text-align-vertical: top;
  margin-bottom: 16px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #3B82F6;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const SubmitText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const EmptyReviewsContainer = styled.View`
  padding: 20px 0;
  align-items: center;
`;

const EmptyReviewsText = styled.Text`
  font-size: 14px;
  color: #64748B;
  text-align: center;
  margin-bottom: 16px;
`;

// Add new styled components for error messages
const ErrorMessage = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background-color: #FFE9EC;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ErrorText = styled.Text`
  color: #FF4757;
  font-size: 12px;
  margin-left: 6px;
  flex: 1;
`;

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Absolutely love the designs from this store! The quality is exceptional and the customer service was outstanding. Will definitely be ordering more pieces in the future.',
    date: '2024-03-15',
    helpful: 12
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Michael Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    rating: 4,
    comment: 'Great designs and good quality materials. Shipping was a bit slower than expected, but the product was worth the wait.',
    date: '2024-03-10',
    helpful: 5
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Jessica Williams',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: "I've purchased several items from this designer and have been impressed every time. The attention to detail is remarkable.",
    date: '2024-03-05',
    helpful: 8
  }
];

const DesignerReviews = ({ designerId, designerName }: DesignerReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [contentError, setContentError] = useState<string | null>(null);
  const { user } = useUser();

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const formattedRating = averageRating.toFixed(1);

  const handleHelpfulPress = (reviewId: string) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const voted = review.userHelpfulVote || false;
        return {
          ...review,
          helpful: voted ? review.helpful - 1 : review.helpful + 1,
          userHelpfulVote: !voted
        };
      }
      return review;
    }));
  };

  const handleAddReview = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to leave a review.');
      return;
    }
    setModalVisible(true);
    setContentError(null);
  };

  const handleSubmitReview = () => {
    if (newRating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.');
      return;
    }

    if (newComment.trim().length < 5) {
      Alert.alert('Comment Required', 'Please write a comment of at least 5 characters.');
      return;
    }

    // Validate review content
    const validation = validateContent(newComment);
    if (!validation.isValid) {
      setContentError(validation.errorMessage || null);
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user?.id || 'unknown',
      userName: user?.name || 'Anonymous User',
      userAvatar: user?.profileImage || 'https://via.placeholder.com/100',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewComment('');
    setContentError(null);
    setModalVisible(false);
    
    Alert.alert('Thank You!', 'Your review has been submitted successfully.');
  };

  const renderStar = (filled: boolean) => (
    <Ionicons 
      name={filled ? 'star' : 'star-outline'} 
      size={16} 
      color={filled ? '#FFB800' : '#CBD5E1'} 
    />
  );

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <View key={star}>
            {renderStar(star <= rating)}
          </View>
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <ReviewItem>
      <ReviewHeader>
        <UserInfo>
          <UserAvatar source={{ uri: item.userAvatar }} />
          <View>
            <UserName>{item.userName}</UserName>
            <ReviewDate>{item.date}</ReviewDate>
          </View>
        </UserInfo>
        <ReviewRating>
          <RatingSummary 
            rating={item.rating} 
            showCount={false}
            size="small"
          />
        </ReviewRating>
      </ReviewHeader>
      <ReviewComment>{item.comment}</ReviewComment>
      <ReviewActions>
        <HelpfulButton 
          voted={item.userHelpfulVote || false}
          onPress={() => handleHelpfulPress(item.id)}
        >
          <Ionicons 
            name={item.userHelpfulVote ? 'thumbs-up' : 'thumbs-up-outline'} 
            size={14} 
            color={item.userHelpfulVote ? '#3B82F6' : '#64748B'} 
          />
          <HelpfulText voted={item.userHelpfulVote || false}>
            Helpful ({item.helpful})
          </HelpfulText>
        </HelpfulButton>
      </ReviewActions>
    </ReviewItem>
  );

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Customer Reviews</SectionTitle>
      </SectionHeader>
      
      <RatingContainer>
        <RatingValue>{formattedRating}</RatingValue>
        <RatingStars>
          <RatingSummary 
            rating={averageRating} 
            count={reviews.length}
            size="medium"
          />
        </RatingStars>
      </RatingContainer>
      
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <EmptyReviewsContainer>
          <EmptyReviewsText>
            No reviews yet. Be the first to review {designerName}!
          </EmptyReviewsText>
        </EmptyReviewsContainer>
      )}
      
      <AddReviewButton onPress={handleAddReview}>
        <Ionicons name="create-outline" size={18} color="white" />
        <AddReviewText>Write a Review</AddReviewText>
      </AddReviewButton>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Review {designerName}</ModalTitle>
              <CloseButton onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </CloseButton>
            </ModalHeader>
            
            <RatingSelector>
              {[1, 2, 3, 4, 5].map(star => (
                <RatingStar 
                  key={star} 
                  onPress={() => setNewRating(star)}
                >
                  <Ionicons 
                    name={star <= newRating ? 'star' : 'star-outline'} 
                    size={32} 
                    color={star <= newRating ? '#FFB800' : '#CBD5E1'} 
                  />
                </RatingStar>
              ))}
            </RatingSelector>
            
            <CommentInput
              placeholder="Share your experience with this designer..."
              multiline
              value={newComment}
              onChangeText={(text) => {
                setNewComment(text);
                setContentError(null);
              }}
              style={contentError ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            
            {contentError && (
              <ErrorMessage>
                <Ionicons name="alert-circle" size={16} color="#FF4757" />
                <ErrorText>{contentError}</ErrorText>
              </ErrorMessage>
            )}
            
            <SubmitButton onPress={handleSubmitReview}>
              <SubmitText>Submit Review</SubmitText>
            </SubmitButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default DesignerReviews; 