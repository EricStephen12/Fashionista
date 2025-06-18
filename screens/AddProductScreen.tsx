import React, { useState } from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../UserContext';
import { useNotifications } from '../NotificationContext';
import { ProductApprovalStatus, ProductVisibility } from '../models/Product';
import { validateContent } from '../src/utils/ContentFilter';

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

const ButtonContainer = styled.View`
  margin-top: 10px;
  margin-bottom: 40px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #7c4dff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  shadow-color: #7c4dff;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: white;
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

// Add a notice about product approval
const ApprovalNotice = styled.View`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px dashed #cbd5e1;
`;

const NoticeText = styled.Text`
  color: #64748B;
  font-size: 14px;
  line-height: 20px;
`;

const NoticeTitle = styled.Text`
  color: #334155;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

// Add new styled component for error text
const ErrorText = styled.Text`
  color: #FF4757;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const AddProductScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { addNotification } = useNotifications();
  
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
  
  // Content validation errors
  const [contentErrors, setContentErrors] = useState<{[key: string]: string | null}>({
    title: null,
    description: null,
    material: null,
    care: null,
    style: null,
    occasion: null,
    designFeatures: null
  });
  
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
  
  const validateField = (field: string, value: string): boolean => {
    const validation = validateContent(value);
    if (!validation.isValid) {
      setContentErrors(prev => ({
        ...prev,
        [field]: validation.errorMessage || null
      }));
      return false;
    }
    setContentErrors(prev => ({
      ...prev,
      [field]: null
    }));
    return true;
  };
  
  const handleSubmit = () => {
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
    
    if (!material.trim()) {
      Alert.alert('Error', 'Please enter product material');
      return;
    }
    
    if (!care.trim()) {
      Alert.alert('Error', 'Please enter care instructions');
      return;
    }
    
    if (colors.length === 0) {
      Alert.alert('Error', 'Please add at least one color');
      return;
    }
    
    // Check for sensitive content in all text fields
    let hasContentError = false;
    
    if (!validateField('title', title)) hasContentError = true;
    if (!validateField('description', description)) hasContentError = true;
    if (!validateField('material', material)) hasContentError = true;
    if (!validateField('care', care)) hasContentError = true;
    if (style && !validateField('style', style)) hasContentError = true;
    if (occasion && !validateField('occasion', occasion)) hasContentError = true;
    if (designFeatures && !validateField('designFeatures', designFeatures)) hasContentError = true;
    
    if (hasContentError) {
      Alert.alert(
        'Content Not Allowed', 
        'Some fields contain content that is not allowed on our platform. Please review the highlighted fields and remove any sensitive information like account numbers, phone numbers, or payment instructions.'
      );
      return;
    }
    
    // In a real app, this would send data to an API
    const productData = {
      title,
      description,
      price: Number(price),
      stock: stock ? Number(stock) : 0,
      mainImage,
      additionalImages,
      tags: selectedTags,
      visibility: isActive ? 'published' as ProductVisibility : 'draft' as ProductVisibility,
      approvalStatus: 'pending' as ProductApprovalStatus,
      material,
      care,
      style,
      occasion,
      designFeatures,
      colors,
      designerId: user?.id || '',
      designerName: user?.name || '',
      designerBrand: user?.brandName || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Product data to submit:', productData);
    
    // Add notification for product submission
    addNotification({
      type: 'system',
      title: 'Product Submitted for Review',
      message: `Your product "${title}" has been submitted for review. You will be notified once it's approved.`,
      data: { productId: 'temp-id', productTitle: title }
    });
    
    Alert.alert(
      'Success', 
      `Product "${title}" has been ${isActive ? 'submitted for review' : 'saved as draft'}!${
        isActive ? ' Our team will review it shortly.' : ''
      }`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };
  
  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <StatusBarBg />
      
      <Header>
        <TopBar>
          <BackButton onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </BackButton>
          <PageTitle>Add New Product</PageTitle>
        </TopBar>
      </Header>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Content showsVerticalScrollIndicator={false}>
          {isActive && (
            <ApprovalNotice>
              <NoticeTitle>Product Review Notice</NoticeTitle>
              <NoticeText>
                All new products require approval before they appear in the marketplace.
                Our team will review your submission within 24-48 hours.
              </NoticeText>
            </ApprovalNotice>
          )}
          
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
              onChangeText={(text) => {
                setTitle(text);
                validateField('title', text);
              }}
              style={contentErrors.title ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.title && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.title}
              </ErrorText>
            )}
            
            <InputLabel>Description</InputLabel>
            <DescriptionInput
              placeholder="Enter product description..."
              multiline
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                validateField('description', text);
              }}
              numberOfLines={5}
              style={contentErrors.description ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.description && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.description}
              </ErrorText>
            )}
            
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

            <InputLabel>Material</InputLabel>
            <InputField
              placeholder="Enter fabric/material (e.g., Cotton, Silk, Leather)"
              value={material}
              onChangeText={(text) => {
                setMaterial(text);
                validateField('material', text);
              }}
              style={contentErrors.material ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.material && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.material}
              </ErrorText>
            )}

            <InputLabel>Care Instructions</InputLabel>
            <InputField
              placeholder="Enter care instructions"
              value={care}
              onChangeText={(text) => {
                setCare(text);
                validateField('care', text);
              }}
              style={contentErrors.care ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.care && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.care}
              </ErrorText>
            )}

            <InputLabel>Style</InputLabel>
            <InputField
              placeholder="Enter style (e.g., Casual, Formal, Boho)"
              value={style}
              onChangeText={(text) => {
                setStyle(text);
                validateField('style', text);
              }}
              style={contentErrors.style ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.style && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.style}
              </ErrorText>
            )}

            <InputLabel>Occasion</InputLabel>
            <InputField
              placeholder="Enter occasion (e.g., Wedding, Casual, Work)"
              value={occasion}
              onChangeText={(text) => {
                setOccasion(text);
                validateField('occasion', text);
              }}
              style={contentErrors.occasion ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.occasion && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.occasion}
              </ErrorText>
            )}

            <InputLabel>Design Features</InputLabel>
            <InputField
              placeholder="Enter special design features"
              value={designFeatures}
              onChangeText={(text) => {
                setDesignFeatures(text);
                validateField('designFeatures', text);
              }}
              style={contentErrors.designFeatures ? { borderColor: '#FF4757', borderWidth: 1 } : {}}
            />
            {contentErrors.designFeatures && (
              <ErrorText>
                <Ionicons name="alert-circle" size={14} color="#FF4757" />
                {' '}{contentErrors.designFeatures}
              </ErrorText>
            )}
          </Section>
          
          <Section>
            <SectionTitle>Colors</SectionTitle>
            <ColorsContainer>
              {colors.map((color, index) => (
                <ColorPill key={index} color={color}>
                  <RemoveColorButton onPress={() => {
                    const newColors = [...colors];
                    newColors.splice(index, 1);
                    setColors(newColors);
                  }}>
                    <Ionicons name="close" size={14} color="#666" />
                  </RemoveColorButton>
                </ColorPill>
              ))}
            </ColorsContainer>
            
            <AddColorContainer>
              <ColorPreview color={tempColor} />
              <InputField
                placeholder="Enter color hex code (#RRGGBB)"
                value={tempColor}
                onChangeText={setTempColor}
                style={{ flex: 1, marginBottom: 0, marginRight: 10 }}
              />
              <AddColorButton onPress={() => {
                if (tempColor && tempColor.match(/^#?([0-9A-F]{6})$/i)) {
                  const formattedColor = tempColor.startsWith('#') ? tempColor : `#${tempColor}`;
                  setColors([...colors, formattedColor]);
                  setTempColor('');
                } else {
                  Alert.alert('Invalid Color', 'Please enter a valid hex color code (e.g., #FF5733)');
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
                <ToggleText selected={!isActive}>Save as Draft</ToggleText>
              </ToggleButton>
              <ToggleButton selected={isActive} onPress={() => setIsActive(true)}>
                <ToggleText selected={isActive}>Submit for Review</ToggleText>
              </ToggleButton>
            </DraftOrActiveRow>
            
            <ButtonContainer>
              <SubmitButton onPress={handleSubmit}>
                <ButtonText>Create Product</ButtonText>
              </SubmitButton>
            </ButtonContainer>
          </Section>
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AddProductScreen; 