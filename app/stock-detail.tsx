import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getStockDetails, placeOrder, Stock } from '@/services/mockApi';
import { generateAIDecision } from '@/services/aiModule';
import { LineChart } from 'react-native-chart-kit';

export default function StockDetail() {
  const { symbol } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [aiDecision, setAiDecision] = useState(null);

  useEffect(() => {
    if (symbol) {
      loadStockDetails();
    }
  }, [symbol]);

  const loadStockDetails = async () => {
    try {
      const data = await getStockDetails(symbol as string);
      setStock(data);
      setPrice(data?.price?.toString() || '');
      setLoading(false);
    } catch (error) {
      console.error('Error loading stock details:', error);
      Alert.alert('Error', 'Unable to load stock details');
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!stock) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const tradePrice = price ? parseFloat(price) : stock.price;

    try {
      const trade = await placeOrder(stock.symbol, tradeType, qty, tradePrice);
      Alert.alert(
        'Trade Executed',
        `${tradeType} ${qty} shares of ${stock.symbol} at ₹${tradePrice.toFixed(2)}`,
        [{ text: 'OK', onPress: () => setShowTradeModal(false) }]
      );
    } catch (error) {
      Alert.alert('Trade Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleAIDecision = async () => {
    if (!stock) return;

    try {
      const decision = await generateAIDecision(null, 'Medium', 10000);
      setAiDecision(decision);
      
      Alert.alert(
        'AI Analysis',
        `Recommendation: ${decision.action}\nReason: ${decision.reason}\nConfidence: ${decision.confidence}%`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to generate AI analysis');
    }
  };

  // Mock chart data
  const chartData = {
    labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
    datasets: [
      {
        data: stock ? [
          stock.price - 10,
          stock.price - 5,
          stock.price + 3,
          stock.price + 8,
          stock.price + 2,
          stock.price
        ] : [],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading stock details...
        </Text>
      </View>
    );
  }

  if (!stock) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Stock not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.symbol, { color: Colors[colorScheme ?? 'light'].text }]}>
          {stock.symbol}
        </Text>
        <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
          {stock.name}
        </Text>
        <Text style={[styles.price, { color: Colors[colorScheme ?? 'light'].text }]}>
          ₹{stock.price.toFixed(2)}
        </Text>
        <Text style={[
          styles.change,
          { color: stock.change >= 0 ? '#4CAF50' : '#F44336' }
        ]}>
          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
        </Text>
      </View>

      {/* Chart */}
      <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
        <Text style={[styles.cardTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Price Chart
        </Text>
        <LineChart
          data={chartData}
          width={350}
          height={200}
          chartConfig={{
            backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
            backgroundGradientFrom: Colors[colorScheme ?? 'light'].cardBackground,
            backgroundGradientTo: Colors[colorScheme ?? 'light'].cardBackground,
            decimalPlaces: 2,
            color: (opacity = 1) => Colors[colorScheme ?? 'light'].text,
            labelColor: (opacity = 1) => Colors[colorScheme ?? 'light'].text,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#007AFF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Stock Details */}
      <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
        <Text style={[styles.cardTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Stock Details
        </Text>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>Volume:</Text>
          <Text style={[styles.value, { color: Colors[colorScheme ?? 'light'].text }]}>
            {(stock.volume / 1000000).toFixed(2)}M
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>Market Cap:</Text>
          <Text style={[styles.value, { color: Colors[colorScheme ?? 'light'].text }]}>
            ₹{(stock.marketCap / 10000000000).toFixed(2)}T
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => { setTradeType('BUY'); setShowTradeModal(true); }}
        >
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sellButton, { backgroundColor: '#F44336' }]}
          onPress={() => { setTradeType('SELL'); setShowTradeModal(true); }}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.aiButton, { backgroundColor: '#007AFF' }]}
          onPress={handleAIDecision}
        >
          <Text style={styles.buttonText}>AI Analysis</Text>
        </TouchableOpacity>
      </View>

      {/* Trade Modal */}
      <Modal
        visible={showTradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {tradeType} {stock.symbol}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                Quantity:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].text
                  }
                ]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                Price (₹):
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].text
                  }
                ]}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="Market Price"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTradeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  tradeType === 'BUY' ? styles.confirmBuyButton : styles.confirmSellButton
                ]}
                onPress={handleTrade}
              >
                <Text style={styles.confirmButtonText}>
                  {tradeType}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    alignItems: 'center',
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    marginTop: 5,
    opacity: 0.7,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  change: {
    fontSize: 18,
    marginTop: 5,
  },
  text: {
    fontSize: 16,
  },
  card: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  buyButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  sellButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  aiButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmBuyButton: {
    backgroundColor: '#4CAF50',
  },
  confirmSellButton: {
    backgroundColor: '#F44336',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
