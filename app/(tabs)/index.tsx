import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { generateAIDecision } from "@/services/aiModule";
import {
    getPortfolioData,
    Portfolio
} from "@/services/mockApi";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [autoTrade, setAutoTrade] = useState(false);
  const [riskLevel, setRiskLevel] = useState("Medium");
  const [budget, setBudget] = useState("10000");
  const [aiDecision, setAiDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
    const interval = setInterval(loadPortfolioData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPortfolioData = async () => {
    try {
      const data = await getPortfolioData();
      setPortfolio(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading portfolio:", error);
      Alert.alert("Error", "Unable to load portfolio data");
      setLoading(false);
    }
  };

  const handleViewAIDecision = async () => {
    try {
      const decision = await generateAIDecision(
        portfolio,
        riskLevel,
        parseFloat(budget),
      );
      setAiDecision(decision);

      Alert.alert(
        "AI Trading Decision",
        `Action: ${decision.action}\nStock: ${decision.stock}\nReason: ${decision.reason}\nConfidence: ${decision.confidence}%\nRisk: ${decision.risk}`,
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Error", "Unable to generate AI decision");
    }
  };

  const handleAutoTradeToggle = (value) => {
    if (value && !portfolio) {
      Alert.alert("Error", "Portfolio data required for auto-trading");
      return;
    }
    setAutoTrade(value);
    if (value) {
      Alert.alert(
        "Auto-Trade Enabled",
        "Trading will execute based on AI decisions within your risk and budget limits.",
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text
          style={[styles.text, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Loading portfolio...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Portfolio Dashboard
        </Text>
      </View>

      {/* Portfolio Summary */}
      <View
        style={[
          styles.card,
          { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Portfolio Summary
        </Text>
        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Balance:
          </Text>
          <Text
            style={[
              styles.value,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            ₹{portfolio?.balance?.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Total Value:
          </Text>
          <Text
            style={[
              styles.value,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            ₹{portfolio?.totalValue?.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            P&L:
          </Text>
          <Text
            style={[
              styles.value,
              { color: portfolio?.pl >= 0 ? "#4CAF50" : "#F44336" },
            ]}
          >
            ₹{portfolio?.pl?.toFixed(2)} ({portfolio?.plPercent?.toFixed(2)}%)
          </Text>
        </View>
      </View>

      {/* Top Holdings */}
      <View
        style={[
          styles.card,
          { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Top Holdings
        </Text>
        {portfolio?.holdings?.slice(0, 5).map((holding, index) => (
          <View key={index} style={styles.holdingRow}>
            <Text
              style={[
                styles.holdingSymbol,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              {holding.symbol}
            </Text>
            <Text
              style={[
                styles.holdingQty,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              {holding.quantity}
            </Text>
            <Text
              style={[
                styles.holdingValue,
                { color: holding.pl >= 0 ? "#4CAF50" : "#F44336" },
              ]}
            >
              ₹{holding.currentValue?.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Trading Controls */}
      <View
        style={[
          styles.card,
          { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Trading Controls
        </Text>

        <View style={styles.controlRow}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Auto-Trade
          </Text>
          <Switch
            value={autoTrade}
            onValueChange={handleAutoTradeToggle}
            trackColor={{ false: "#767577", true: "#4CAF50" }}
          />
        </View>

        <View style={styles.controlRow}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Risk Level
          </Text>
          <View style={styles.riskButtons}>
            {["Low", "Medium", "High"].map((risk) => (
              <TouchableOpacity
                key={risk}
                style={[
                  styles.riskButton,
                  riskLevel === risk && styles.riskButtonActive,
                  {
                    backgroundColor: riskLevel === risk ? "#007AFF" : "#E0E0E0",
                  },
                ]}
                onPress={() => setRiskLevel(risk)}
              >
                <Text
                  style={[
                    styles.riskButtonText,
                    { color: riskLevel === risk ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {risk}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlRow}>
          <Text
            style={[
              styles.label,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            Budget Limit
          </Text>
          <Text
            style={[
              styles.budgetText,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            ₹{budget}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.aiButton}
          onPress={handleViewAIDecision}
        >
          <Text style={styles.aiButtonText}>View AI Decision</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
  card: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  holdingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 5,
  },
  holdingSymbol: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  holdingQty: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  holdingValue: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  controlRow: {
    marginBottom: 20,
  },
  riskButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  riskButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskButtonActive: {
    backgroundColor: "#007AFF",
  },
  riskButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  budgetText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  aiButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  aiButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
