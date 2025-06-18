import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../src/MainTabs';
import { mockService, Product as MockProduct } from '../src/services/mockData';

// Define our component's product type that maps to the mock service's product
interface Product {
  id: string;
  name: string;
  designer: string;
  price: string;
  imageUrl: string;
  description?: string;
  category?: string;
}

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const navigation = useNavigation<SearchScreenNavigationProp>();

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await mockService.getProducts();
        // Map the mock products to our component's product format
        const mappedProducts = products.map(p => ({
          id: p.id,
          name: p.title,
          designer: mockService.getDesignerById(p.designerId)
            .then(d => d?.name || 'Unknown Designer')
            .catch(() => 'Unknown Designer'),
          price: p.price,
          imageUrl: p.image,
          description: p.description,
          category: p.category
        }));
        
        // Resolve all designer name promises
        const resolvedProducts = await Promise.all(
          mappedProducts.map(async p => ({
            ...p,
            designer: await p.designer
          }))
        );
        
        setAllProducts(resolvedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products when search query changes
  useEffect(() => {
    // Simulate API search
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        // Filter products based on search query
        setTimeout(() => {
          const filteredResults = allProducts.filter(
            item => 
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              item.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setResults(filteredResults);
          setIsLoading(false);
        }, 300);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, allProducts]);

  const handleSearchClear = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      {item.imageUrl && (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.designerName}>{item.designer}</Text>
        {item.category && (
          <Text style={styles.categoryText}>{item.category}</Text>
        )}
      </View>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products, designers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleSearchClear}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.resultsList}
          />
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found for "{searchQuery}"</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="#ddd" />
            <Text style={styles.emptyStateText}>Search for products or designers</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  designerName: {
    fontSize: 14,
    color: '#666',
  },
  categoryText: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  loader: {
    marginTop: 40,
  },
});

export default SearchScreen; 