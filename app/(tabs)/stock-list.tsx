import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getStockList, Stock } from '@/services/mockApi';

export default function StockList() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stocks);
    }
  }, [searchQuery, stocks]);

  const loadStocks = async () => {
    try {
      const data = await getStockList();
      setStocks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stocks:', error);
      Alert.alert('Error', 'Unable to load stock data');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStocks();
    setRefreshing(false);
  };

  const handleStockPress = (stock: Stock) => {
    router.push({
      pathname: '/stock-detail',
      params: { symbol: stock.symbol }
    });
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity
      style={[styles.stockItem, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}
      onPress={() => handleStockPress(item)}
    >
      <View style={styles.stockInfo}>
        <Text style={[styles.symbol, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.symbol}
        </Text>
        <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.name}
        </Text>
      </View>
      <View style={styles.stockPrice}>
        <Text style={[styles.price, { color: Colors[colorScheme ?? 'light'].text }]}>
          ₹{item.price.toFixed(2)}
        </Text>
        <Text style={[
          styles.change,
          { color: item.change >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading stocks...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Stock Market
        </Text>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].text
            }
          ]}
          placeholder="Search stocks..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  change: {
    fontSize: 12,
    marginTop: 2,
  },
});
