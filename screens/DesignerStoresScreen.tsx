import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { 
  View, 
  Text, 
  FlatList, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  ImageBackground,
  Image,
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../src/MainTabs';
import RatingSummary from '../components/RatingSummary';

const { width, height } = Dimensions.get('window');

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

const Container = styled.View`
  flex: 1;
  background-color: #f8fafd;
`;

const Header = styled.View`
  background-color: #7c4dff;
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '30px'};
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  margin-bottom: 10px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 10px 15px;
  align-items: center;
  margin-bottom: 15px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  color: white;
  font-size: 16px;
  margin-left: 10px;
`;

const CategoryScroll = styled.ScrollView`
  margin-bottom: 15px;
`;

const CategoryButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 25px;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

const CategoryText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? '#7c4dff' : 'white'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 14px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 0;
`;

const BottomSpacer = styled.View`
  height: ${TAB_BAR_HEIGHT}px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #1a1a2e;
  margin-top: 15px;
  margin-bottom: 15px;
  padding-left: 10px;
`;

const TrendingDesignersContainer = styled.View`
  margin-bottom: 25px;
  padding: 0 10px;
`;

const TrendingDesigner = styled(Animated.View)`
  width: ${width * 0.9}px;
  height: 240px;
  margin-right: 15px;
  border-radius: 20px;
  overflow: hidden;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  shadow-offset: 0px 5px;
  elevation: 6;
`;

const DesignerImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  justify-content: flex-end;
`;

const DesignerOverlay = styled(LinearGradient)`
  width: 100%;
  padding: 25px;
`;

const DesignerName = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
`;

const DesignerInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DesignerStat = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 6px 10px;
  border-radius: 20px;
`;

const DesignerStatText = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  margin-left: 5px;
`;

const VerifiedBadge = styled.View`
  background-color: #10B981;
  padding: 4px 8px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-bottom: 10px;
`;

const VerifiedText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
`;

const PopularStoresContainer = styled.View`
  margin-bottom: 25px;
  padding: 0 10px;
`;

const StoreCard = styled(Animated.View)`
  background-color: white;
  border-radius: 20px;
  margin-bottom: 30px;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 15px;
  shadow-offset: 0px 5px;
  elevation: 5;
  overflow: hidden;
`;

const StoreHeader = styled.View`
  height: 150px;
`;

const StoreCoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const StoreLogo = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  border-width: 3px;
  border-color: white;
  position: absolute;
  bottom: -30px;
  left: 20px;
`;

const StoreContent = styled.View`
  padding: 15px 20px;
  padding-top: 35px;
`;

const StoreBody = styled.View`
  padding: 15px 20px;
  padding-top: 40px;
`;

const StoreLogoContainer = styled.View`
  position: absolute;
  top: -35px;
  left: 20px;
`;

const StoreInfo = styled.View`
  margin-left: 80px;
`;

const StoreNameRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StatItem = styled.View`
  align-items: center;
  flex: 1;
`;

const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1a1a2e;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #64748B;
`;

const StatDivider = styled.View`
  width: 1px;
  height: 30px;
  background-color: #E5E7EB;
  margin-horizontal: 10px;
`;

const StoreName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1a1a2e;
`;

const LikeButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
`;

const StoreDescription = styled.Text`
  font-size: 14px;
  color: #64748B;
  margin-bottom: 15px;
  line-height: 20px;
`;

const StoreStats = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

const StoreTag = styled.View`
  background-color: #f1f5f9;
  padding: 6px 12px;
  border-radius: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const StoreTagText = styled.Text`
  color: #64748B;
  font-size: 12px;
`;

const ViewStoreButton = styled.TouchableOpacity`
  background-color: #7c4dff;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  margin-top: 5px;
`;

const ViewStoreText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const ProductsPreviewContainer = styled.View`
  margin: 15px 0;
`;

const ProductsRow = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const ProductThumb = styled.Image`
  width: ${(width - 80) / 3}px;
  height: ${(width - 80) / 3}px;
  border-radius: 10px;
  margin-right: 10px;
`;

const MoreProductsButton = styled.View`
  width: ${(width - 80) / 3}px;
  height: ${(width - 80) / 3}px;
  border-radius: 10px;
  background-color: rgba(124, 77, 255, 0.1);
  align-items: center;
  justify-content: center;
`;

const MoreProductsText = styled.Text`
  color: #7c4dff;
  font-weight: bold;
  font-size: 12px;
  margin-top: 5px;
`;

const FollowDesignerButton = styled.TouchableOpacity<{ following: boolean }>`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: ${props => props.following ? 'rgba(124, 77, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)'};
  padding: 8px 16px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  z-index: 5;
  border: 1px solid ${props => props.following ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
`;

const FollowButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
  margin-left: 4px;
`;

// Add the missing styled components
const StoreActions = styled.View`
  flex-direction: row;
  padding: 15px 20px;
  border-top-width: 1px;
  border-top-color: #F3F4F6;
`;

const ActionButton = styled.TouchableOpacity<{ primary: boolean }>`
  flex: 1;
  background-color: ${props => props.primary ? '#7c4dff' : '#F3F4F6'};
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-horizontal: 5px;
`;

const ActionButtonText = styled.Text<{ primary: boolean }>`
  color: ${props => props.primary ? 'white' : '#64748B'};
  font-weight: bold;
  font-size: 14px;
  margin-left: 5px;
`;

// Mock data for trending designers
const mockTrendingDesigners = [
  {
    id: 'd1',
    name: 'Luna Couture',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    followers: 12500,
    products: 45,
    verified: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 'td2',
    name: 'Modern Threads',
    image: 'https://images.unsplash.com/photo-1571513788330-a29b10cdf079?auto=format&fit=crop&w=800&q=80',
    followers: 8500,
    products: 32,
    verified: true,
    rating: 4.5,
    reviewCount: 87
  },
  {
    id: 'td3',
    name: 'Haute & Bold',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    followers: 5600,
    products: 28,
    verified: false,
    rating: 4.2,
    reviewCount: 56
  },
];

// Update the mockPopularStores to include the followed property
const mockPopularStores = [
  {
    id: 's1',
    name: 'Urban Edge',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1511200016789-e7b694d0783f?auto=format&fit=crop&w=100&q=80',
    description: 'Contemporary streetwear with a unique twist.',
    followers: 8700,
    products: 32,
    liked: false,
    featured: true,
    rating: 4.6,
    reviewCount: 87,
    followed: false
  },
  {
    id: 's2',
    name: 'Urban Drift',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80',
    description: 'Street-inspired fashion for the contemporary individual. Bold designs that make a statement while maintaining comfort and functionality.',
    followers: 7800,
    rating: 4.6,
    reviewCount: 38,
    products: 38,
    tags: ['Streetwear', 'Casual', 'Urban'],
    liked: true,
    featured: false,
    followed: true,
    productPreviews: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1608228088998-57828365d486?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1588117305388-c2631a279f82?auto=format&fit=crop&w=200&q=80',
    ]
  },
];

// Available categories
const categories = [
  'All',
  'Trending',
  'Luxury',
  'Casual',
  'Formal',
  'Sustainable',
  'Vintage',
  'Streetwear'
];

const DesignerStoresScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useUser();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedStores, setLikedStores] = useState<{ [key: string]: boolean }>({
    s1: false,
    s2: true,
  });
  const [followingDesigners, setFollowingDesigners] = useState<{ [key: string]: boolean }>({
    td1: false,
    td2: true,
    td3: false,
    s1: false,
    s2: true
  });
  const [refreshing, setRefreshing] = useState(false);
  
  const handleStorePress = (storeId: string) => {
    console.log("Navigating to store with ID:", storeId);
    navigation.navigate('Store', { storeId });
  };
  
  const toggleLike = (storeId: string) => {
    setLikedStores(prev => ({
      ...prev,
      [storeId]: !prev[storeId]
    }));
  };
  
  const toggleFollow = (designerId: string) => {
    setFollowingDesigners(prev => ({
      ...prev,
      [designerId]: !prev[designerId]
    }));
    
    // Find designer/store info from either trending designers or popular stores
    const designer = mockTrendingDesigners.find(d => d.id === designerId);
    const store = mockPopularStores.find(s => s.id === designerId);
    const name = designer?.name || store?.name || 'Designer';
    
    const isNowFollowing = !followingDesigners[designerId];
    
    Alert.alert(
      isNowFollowing ? 'Following' : 'Unfollowed',
      isNowFollowing 
        ? `You are now following ${name}` 
        : `You have unfollowed ${name}`
    );
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
      // In a real app, you would fetch fresh data here
    }, 1500);
  };
  
  const renderTrendingDesigner = ({ item, index }: { item: typeof mockTrendingDesigners[0], index: number }) => (
    <TrendingDesigner
      entering={FadeInUp.delay(index * 100).duration(400)}
    >
      <DesignerImageBackground
        source={{ uri: item.image }}
        resizeMode="cover"
      >
        <DesignerOverlay
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {item.verified && (
              <VerifiedBadge>
                <Ionicons name="checkmark-circle" size={12} color="white" />
                <VerifiedText>Verified</VerifiedText>
              </VerifiedBadge>
            )}
            <DesignerName>{item.name}</DesignerName>
            <DesignerInfo>
              <DesignerStat>
              <Ionicons name="people" size={14} color="rgba(255,255,255,0.9)" />
              <DesignerStatText>{formatNumber(item.followers)}</DesignerStatText>
            </DesignerStat>
            <DesignerStat>
              <Ionicons name="shirt" size={14} color="rgba(255,255,255,0.9)" />
              <DesignerStatText>{item.products}</DesignerStatText>
              </DesignerStat>
              <DesignerStat>
              <RatingSummary 
                rating={item.rating} 
                count={item.reviewCount} 
                size="small" 
                color="rgba(255,255,255,0.9)"
              />
              </DesignerStat>
            </DesignerInfo>
          </DesignerOverlay>
        </DesignerImageBackground>
    </TrendingDesigner>
  );
  
  const renderStoreCard = ({ item, index }: { item: typeof mockPopularStores[0], index: number }) => (
    <StoreCard
      entering={FadeInDown.delay(index * 100).duration(400)}
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => handleStorePress(item.id)}
      >
      <StoreHeader>
          <StoreCoverImage source={{ uri: item.coverImage }} />
        </StoreHeader>
        <StoreBody>
          <StoreLogoContainer>
        <StoreLogo source={{ uri: item.logo }} />
          </StoreLogoContainer>
          <StoreInfo>
        <StoreNameRow>
          <StoreName>{item.name}</StoreName>
              {item.featured && (
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              )}
            </StoreNameRow>
            <StoreDescription numberOfLines={2}>{item.description}</StoreDescription>
            <StoreStats>
              <StatItem>
                <StatValue>{item.products}</StatValue>
                <StatLabel>Products</StatLabel>
              </StatItem>
              <StatDivider />
              <StatItem>
                <StatValue>{formatNumber(item.followers)}</StatValue>
                <StatLabel>Followers</StatLabel>
              </StatItem>
              <StatDivider />
              <StatItem>
                <RatingSummary 
                  rating={item.rating} 
                  count={item.reviewCount} 
                  size="small" 
                />
              </StatItem>
            </StoreStats>
          </StoreInfo>
        </StoreBody>
        <StoreActions>
          <ActionButton 
            primary={true}
            onPress={() => handleStorePress(item.id)}
          >
            <ActionButtonText primary={true}>Visit Store</ActionButtonText>
          </ActionButton>
          <ActionButton 
            primary={false}
            onPress={() => toggleFollow(item.id)}
          >
            <Ionicons 
              name={item.followed ? "person-remove" : "person-add"} 
              size={16} 
              color="#64748B" 
            />
            <ActionButtonText primary={false}>
              {item.followed ? "Unfollow" : "Follow"}
            </ActionButtonText>
          </ActionButton>
        </StoreActions>
      </TouchableOpacity>
    </StoreCard>
  );

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <Header>
        <HeaderTitle>Explore Designers</HeaderTitle>
        
        <SearchContainer>
          <Ionicons name="search" size={20} color="white" />
          <SearchInput
            placeholder="Search designers..."
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </SearchContainer>
        
        <CategoryScroll horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <CategoryButton 
              key={index} 
              active={activeCategory === category}
              onPress={() => setActiveCategory(category)}
            >
              <CategoryText active={activeCategory === category}>{category}</CategoryText>
            </CategoryButton>
          ))}
        </CategoryScroll>
      </Header>
      
      <Content 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7c4dff']}
            tintColor={'#7c4dff'}
          />
        }
      >
        <TrendingDesignersContainer>
          <SectionTitle>Trending Designers</SectionTitle>
          <FlatList
            data={mockTrendingDesigners}
            renderItem={renderTrendingDesigner}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 10, paddingRight: 5 }}
          />
        </TrendingDesignersContainer>
        
        <PopularStoresContainer>
          <SectionTitle>Popular Stores</SectionTitle>
          <FlatList
            data={mockPopularStores}
            renderItem={renderStoreCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </PopularStoresContainer>
        
        <BottomSpacer />
      </Content>
    </Container>
  );
};

export default DesignerStoresScreen; 