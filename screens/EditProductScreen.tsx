import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { 
  View, 
  Text, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../UserContext';
import { RootStackParamList } from '../src/MainTabs';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #f8fafd;
`;

const StatusBarBg = styled.View`
  height: ${StatusBar.currentHeight || 0}px;
  background-color: #7c4dff;
`;

const Header = styled.View`
  padding: 20px;
  padding-top: ${Platform.OS === 'ios' ? '60px' : '20px'};
  background-color: #7c4dff;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const TopBar = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const PageTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 50px;
`;

const Section = styled.View`
  margin-bottom: 25px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 15px;
`;

const ImageSelector = styled.TouchableOpacity`
  width: 100%;
  height: 200px;
  border-radius: 15px;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  overflow: hidden;
  border: 1px dashed #ccc;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ImagePlaceholder = styled.View`
  align-items: center;
  justify-content: center;
`;

const ImageSelectorText = styled.Text`
  color: #64748B;
  font-size: 16px;
  margin-top: 8px;
`;

const ThumbsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const ImageThumb = styled.TouchableOpacity`
  width: ${(width - 60) / 4}px;
  height: ${(width - 60) / 4}px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
`;

const ThumbImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const AddIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #E0E7FF;
  align-items: center;
  justify-content: center;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  color: #4B5563;
  margin-bottom: 8px;
`;

const InputField = styled.TextInput`
  background-color: white;
  padding: 12px 15px;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a2e;
  margin-bottom: 15px;
  border: 1px solid #E5E7EB;
`;

const DescriptionInput = styled.TextInput`
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  font-size: 16px;
  color: #1a1a2e;
  margin-bottom: 15px;
  min-height: 120px;
  text-align-vertical: top;
  border: 1px solid #E5E7EB;
`;

const PriceRow = styled.View`
  flex-direction: row;
`;

const PriceInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 0 15px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  flex: 1;
`;

const CurrencySymbol = styled.Text`
  font-size: 18px;
  color: #4B5563;
  margin-right: 5px;
`;

const PriceInput = styled.TextInput`
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  color: #1a1a2e;
`;

const StockContainer = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

const TagButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#7c4dff20' : '#F3F4F6'};
  border-radius: 20px;
  padding: 8px 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: ${props => props.selected ? '1px solid #7c4dff' : '1px solid transparent'};
`;

const TagText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? '#7c4dff' : '#4B5563'};
  font-size: 14px;
  font-weight: ${props => props.selected ? '500' : 'normal'};
`;

const DraftOrActiveRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const ToggleButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  background-color: ${props => props.selected ? '#7c4dff' : 'white'};
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  margin: 0 5px;
  border: 1px solid ${props => props.selected ? '#7c4dff' : '#E5E7EB'};
`;

const ToggleText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : '#4B5563'};
  font-size: 16px;
  font-weight: 500;
`;

const ButtonsContainer = styled.View`
  margin-top: 10px;
  margin-bottom: 40px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #7c4dff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  shadow-color: #7c4dff;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  elevation: 5;
  margin-bottom: 15px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: #FEE2E2;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const DeleteButtonText = styled.Text`
  color: #DC2626;
  font-size: 18px;
  font-weight: bold;
`;

const ColorPill = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.color};
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  position: relative;
`;

const RemoveColorButton = styled.TouchableOpacity`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border: 1px solid #E5E7EB;
`;

const ColorsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

const AddColorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const ColorPreview = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.color || '#CCCCCC'};
  margin-right: 10px;
  border: 1px solid #E5E7EB;
`;

const AddColorButton = styled.TouchableOpacity`
  background-color: #7c4dff20;
  padding: 8px 16px;
  border-radius: 8px;
`;

const AddColorText = styled.Text`
  color: #7c4dff;
  font-weight: 500;
`;

// Available tags for products
const availableTags = [
  'Evening Wear', 'Casual', 'Formal', 'Summer', 'Winter', 
  'Handcrafted', 'Eco-friendly', 'Premium', 'Limited Edition', 'Sale'
];

// Mock product data (in a real app, this would be fetched from an API)
const mockProduct = {
  id: 'dp1',
  title: 'Summer Floral Dress',
  price: '120',
  description: 'This elegant summer dress features a beautiful floral pattern and is perfect for any occasion. Made from lightweight, breathable fabric with a flattering silhouette.',
  image: 'https://images.unsplash.com/photo-1534302624301-d6897b45d108?auto=format&fit=crop&w=800&q=80',
  additionalImages: [
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
  ],
  status: 'active' as const,
  stock: 15,
  tags: ['Summer', 'Premium', 'Handcrafted'],
  colors: ['#FF5733', '#3366FF', '#33FF57'],
  material: 'Premium Cotton',
  care: 'Machine Wash Cold',
  style: 'Casual Elegant',
  occasion: 'Summer Party',
  designFeatures: 'Flutter sleeves, Empire waist'
};

type EditProductRouteProp = RouteProp<RootStackParamList, 'EditProduct'>;

const EditProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditProductRouteProp>();
  const { productId } = route.params;
  const { user } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  
  // New fields
  const [colors, setColors] = useState<string[]>([]);
  const [material, setMaterial] = useState('');
  const [care, setCare] = useState('');
  const [style, setStyle] = useState('');
  const [occasion, setOccasion] = useState('');
  const [designFeatures, setDesignFeatures] = useState('');
  const [tempColor, setTempColor] = useState('');
  
  // Simulate fetching product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // In a real app, this would be an API call
        // For now, use mock data
        setTimeout(() => {
          setTitle(mockProduct.title);
          setDescription(mockProduct.description);
          setPrice(mockProduct.price);
          setStock(String(mockProduct.stock));
          setMainImage(mockProduct.image);
          setAdditionalImages(mockProduct.additionalImages || []);
          setSelectedTags(mockProduct.tags || []);
          setIsActive(mockProduct.status === 'active');
          
          // Set new fields
          setColors(mockProduct.colors || []);
          setMaterial(mockProduct.material || '');
          setCare(mockProduct.care || '');
          setStyle(mockProduct.style || '');
          setOccasion(mockProduct.occasion || '');
          setDesignFeatures(mockProduct.designFeatures || '');
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'Failed to load product details');
        navigation.goBack();
      }
    };

    fetchProductDetails();
  }, [productId]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleImagePick = async (isMain = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (isMain) {
          setMainImage(result.assets[0].uri);
        } else {
          setAdditionalImages([...additionalImages, result.assets[0].uri]);
        }
      }
    } catch (error) {
      console.log('Error picking image: ', error);
      Alert.alert('Error', 'There was an error selecting the image.');
    }
  };
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSave = () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a product title');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a product description');
      return;
    }
    
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    
    if (!mainImage) {
      Alert.alert('Error', 'Please select a main product image');
      return;
    }
    
    // In a real app, this would update the product via API
    // Create a product object with all fields
    const updatedProduct = {
      id: productId,
      title,
      description,
      price,
      stock: parseInt(stock) || 0,
      image: mainImage,
      additionalImages,
      tags: selectedTags,
      status: isActive ? 'active' : 'draft',
      colors,
      material,
      care,
      style,
      occasion,
      designFeatures
    };
    
    console.log('Saving product:', updatedProduct);
    
    Alert.alert(
      'Success', 
      `Product "${title}" has been updated!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete the product via API
            Alert.alert('Success', 'Product has been deleted.');
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <Container>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <StatusBarBg />
        
        <Header>
          <TopBar>
            <BackButton onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </BackButton>
            <PageTitle>Edit Product</PageTitle>
          </TopBar>
        </Header>
        
        <LoadingContainer>
          <ActivityIndicator size="large" color="#7c4dff" />
          <Text style={{ marginTop: 15, color: '#4B5563' }}>Loading product details...</Text>
        </LoadingContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StatusBarBg />
      
      <Header>
        <TopBar>
          <BackButton onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </BackButton>
          <PageTitle>Edit Product</PageTitle>
        </TopBar>
      </Header>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Content showsVerticalScrollIndicator={false}>
          <Section>
            <SectionTitle>Product Images</SectionTitle>
            <ImageSelector onPress={() => handleImagePick(true)}>
              {mainImage ? (
                <ProductImage source={{ uri: mainImage }} resizeMode="cover" />
              ) : (
                <ImagePlaceholder>
                  <Ionicons name="image-outline" size={50} color="#64748B" />
                  <ImageSelectorText>Tap to add main product image</ImageSelectorText>
                </ImagePlaceholder>
              )}
            </ImageSelector>
            
            <ThumbsRow>
              {additionalImages.map((img, index) => (
                <ImageThumb key={index}>
                  <ThumbImage source={{ uri: img }} resizeMode="cover" />
                </ImageThumb>
              ))}
              
              {additionalImages.length < 4 && (
                <ImageThumb onPress={() => handleImagePick(false)}>
                  <AddIcon>
                    <Ionicons name="add" size={24} color="#7c4dff" />
                  </AddIcon>
                </ImageThumb>
              )}
            </ThumbsRow>
          </Section>
          
          <Section>
            <SectionTitle>Product Details</SectionTitle>
            
            <InputLabel>Product Title</InputLabel>
            <InputField
              placeholder="Enter product title"
              value={title}
              onChangeText={setTitle}
            />
            
            <InputLabel>Description</InputLabel>
            <DescriptionInput
              placeholder="Enter product description..."
              multiline
              value={description}
              onChangeText={setDescription}
              numberOfLines={5}
            />
            
            <PriceRow>
              <View style={{ flex: 1 }}>
                <InputLabel>Price</InputLabel>
                <PriceInputContainer>
                  <CurrencySymbol>$</CurrencySymbol>
                  <PriceInput
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </PriceInputContainer>
              </View>
              
              <StockContainer>
                <InputLabel>Stock</InputLabel>
                <InputField
                  placeholder="Quantity"
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                />
              </StockContainer>
            </PriceRow>
            
            {/* New Material Field */}
            <InputLabel>Material</InputLabel>
            <InputField
              placeholder="Cotton, Silk, etc."
              value={material}
              onChangeText={setMaterial}
            />
            
            {/* New Care Instructions Field */}
            <InputLabel>Care Instructions</InputLabel>
            <InputField
              placeholder="Dry Clean Only, Machine Wash, etc."
              value={care}
              onChangeText={setCare}
            />
            
            {/* New Style Field */}
            <InputLabel>Style</InputLabel>
            <InputField
              placeholder="Casual, Formal, etc."
              value={style}
              onChangeText={setStyle}
            />
            
            {/* New Occasion Field */}
            <InputLabel>Occasion</InputLabel>
            <InputField
              placeholder="Party, Wedding, Everyday, etc."
              value={occasion}
              onChangeText={setOccasion}
            />
            
            {/* New Design Features Field */}
            <InputLabel>Design Features</InputLabel>
            <DescriptionInput
              placeholder="Describe special design elements..."
              multiline
              value={designFeatures}
              onChangeText={setDesignFeatures}
              numberOfLines={3}
            />
          </Section>
          
          <Section>
            <SectionTitle>Colors</SectionTitle>
            <ColorsContainer>
              {colors.map((color, index) => (
                <ColorPill key={index} color={color}>
                  <RemoveColorButton onPress={() => setColors(colors.filter((_, i) => i !== index))}>
                    <Ionicons name="close" size={12} color="#64748B" />
                  </RemoveColorButton>
                </ColorPill>
              ))}
            </ColorsContainer>
            <AddColorContainer>
              <ColorPreview color={tempColor} />
              <InputField
                placeholder="#RRGGBB"
                value={tempColor}
                onChangeText={setTempColor}
                style={{ flex: 1, marginRight: 10 }}
              />
              <AddColorButton onPress={() => {
                if (tempColor && !colors.includes(tempColor)) {
                  setColors([...colors, tempColor]);
                  setTempColor('');
                }
              }}>
                <AddColorText>Add</AddColorText>
              </AddColorButton>
            </AddColorContainer>
          </Section>
          
          <Section>
            <SectionTitle>Tags</SectionTitle>
            <TagsContainer>
              {availableTags.map((tag) => (
                <TagButton 
                  key={tag} 
                  selected={selectedTags.includes(tag)}
                  onPress={() => handleTagToggle(tag)}
                >
                  <TagText selected={selectedTags.includes(tag)}>{tag}</TagText>
                </TagButton>
              ))}
            </TagsContainer>
          </Section>
          
          <Section>
            <SectionTitle>Product Status</SectionTitle>
            <DraftOrActiveRow>
              <ToggleButton selected={!isActive} onPress={() => setIsActive(false)}>
                <ToggleText selected={!isActive}>Draft</ToggleText>
              </ToggleButton>
              <ToggleButton selected={isActive} onPress={() => setIsActive(true)}>
                <ToggleText selected={isActive}>Active</ToggleText>
              </ToggleButton>
            </DraftOrActiveRow>
            
            <ButtonsContainer>
              <SaveButton onPress={handleSave}>
                <ButtonText>Save Changes</ButtonText>
              </SaveButton>
              
              <DeleteButton onPress={handleDelete}>
                <DeleteButtonText>Delete Product</DeleteButtonText>
              </DeleteButton>
            </ButtonsContainer>
          </Section>
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default EditProductScreen; 