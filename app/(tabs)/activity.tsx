import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { getTradeHistory, Trade } from '@/services/mockApi';
import { generateAIDecision } from '@/services/aiModule';

export default function Activity() {
  const colorScheme = useColorScheme();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [aiDecisions, setAiDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      const [tradesData] = await Promise.all([
        getTradeHistory(),
      ]);

      // Mock AI decisions for demo
      const mockAIDecisions = [
        {
          id: 'ai1',
          action: 'BUY',
          stock: 'RELIANCE',
          reason: 'Strong momentum detected with increasing volume',
          confidence: 85,
          risk: 'Medium',
          timestamp: new Date(Date.now() - 1800000),
          type: 'AI_DECISION'
        },
        {
          id: 'ai2',
          action: 'SELL',
          stock: 'TCS',
          reason: 'Technical indicators suggest overbought conditions',
          confidence: 78,
          risk: 'Low',
          timestamp: new Date(Date.now() - 3600000),
          type: 'AI_DECISION'
        },
      ];

      setTrades(tradesData);
      setAiDecisions(mockAIDecisions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading activity data:', error);
      Alert.alert('Error', 'Unable to load activity data');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivityData();
    setRefreshing(false);
  };

  // Combine trades and AI decisions, sort by timestamp
  const allActivities = [
    ...trades.map(trade => ({ ...trade, type: 'TRADE' })),
    ...aiDecisions
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const renderActivityItem = ({ item }: { item: any }) => {
    const isTrade = item.type === 'TRADE';
    const isAI = item.type === 'AI_DECISION';

    return (
      <View style={[styles.activityItem, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
        <View style={styles.activityHeader}>
          <Text style={[styles.activityType, { color: Colors[colorScheme ?? 'light'].text }]}>
            {isTrade ? 'TRADE' : 'AI DECISION'}
          </Text>
          <Text style={[styles.timestamp, { color: Colors[colorScheme ?? 'light'].text }]}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.activityContent}>
          <View style={styles.actionRow}>
            <Text style={[
              styles.action,
              { 
                color: item.action === 'BUY' ? '#4CAF50' : 
                       item.action === 'SELL' ? '#F44336' : 
                       Colors[colorScheme ?? 'light'].text 
              }
            ]}>
              {item.action}
            </Text>
            <Text style={[styles.symbol, { color: Colors[colorScheme ?? 'light'].text }]}>
              {item.symbol}
            </Text>
          </View>

          {isTrade && (
            <View style={styles.tradeDetails}>
              <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Quantity: {item.quantity}
              </Text>
              <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
                Price: ₹{item.price.toFixed(2)}
              </Text>
              <Text style={[
                styles.status,
                { 
                  color: item.status === 'EXECUTED' ? '#4CAF50' : 
                         item.status === 'FAILED' ? '#F44336' : 
                         '#FF9800' 
                }
              ]}>
                {item.status}
              </Text>
            </View>
          )}

          {isAI && (
            <View style={styles.aiDetails}>
              <Text style={[styles.reason, { color: Colors[colorScheme ?? 'light'].text }]}>
                {item.reason}
              </Text>
              <View style={styles.aiMetrics}>
                <Text style={[styles.metric, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Confidence: {item.confidence}%
                </Text>
                <Text style={[
                  styles.risk,
                  { 
                    color: item.risk === 'Low' ? '#4CAF50' : 
                           item.risk === 'Medium' ? '#FF9800' : 
                           '#F44336' 
                  }
                ]}>
                  Risk: {item.risk}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Loading activity...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Activity Log
        </Text>
      </View>

      <FlatList
        data={allActivities}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id || item.symbol + item.timestamp}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
              No activity yet
            </Text>
          </View>
        }
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
  },
  text: {
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  activityItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityType: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityContent: {
    paddingLeft: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  action: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiDetails: {
    paddingLeft: 5,
  },
  reason: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  aiMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    fontSize: 14,
  },
  risk: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
