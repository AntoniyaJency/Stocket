// AI Module for stock trading decisions
// This will be replaced with actual AI/ML model

import { Portfolio } from "./mockApi";

export interface AIDecision {
  action: "BUY" | "SELL" | "HOLD";
  stock: string;
  reason: string;
  confidence: number; // 0-100
  risk: "Low" | "Medium" | "High";
  timestamp: Date;
}

// Mock AI signals based on simple heuristics
export const generateAIDecision = async (
  portfolio: Portfolio | null,
  riskLevel: string,
  budget: number,
): Promise<AIDecision> => {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const stocks = [
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "INFY",
    "ICICIBANK",
    "HINDUNILVR",
    "SBIN",
    "BAJFINANCE",
  ];
  const randomStock = stocks[Math.floor(Math.random() * stocks.length)];

  // Simple mock AI logic
  const random = Math.random();
  let action: "BUY" | "SELL" | "HOLD";
  let reason: string;
  let confidence: number;
  let risk: "Low" | "Medium" | "High";

  if (random < 0.4) {
    action = "BUY";
    reason = generateBuyReason(randomStock, riskLevel);
    confidence = 60 + Math.random() * 30; // 60-90%
  } else if (random < 0.7) {
    action = "SELL";
    reason = generateSellReason(randomStock, riskLevel);
    confidence = 55 + Math.random() * 35; // 55-90%
  } else {
    action = "HOLD";
    reason = generateHoldReason(randomStock, riskLevel);
    confidence = 70 + Math.random() * 25; // 70-95%
  }

  // Adjust confidence based on risk level
  if (riskLevel === "Low") {
    confidence = Math.min(confidence, 75);
  } else if (riskLevel === "High") {
    confidence = Math.max(confidence, 65);
  }

  risk = riskLevel as "Low" | "Medium" | "High";

  return {
    action,
    stock: randomStock,
    reason,
    confidence: Math.round(confidence),
    risk,
    timestamp: new Date(),
  };
};

// Generate buy reasons
const generateBuyReason = (stock: string, riskLevel: string): string => {
  const reasons = [
    `Strong momentum detected in ${stock} with increasing volume`,
    `${stock} showing bullish patterns on technical indicators`,
    `Fundamental analysis suggests ${stock} is undervalued`,
    `${stock} breaking key resistance levels with positive sentiment`,
    `Market conditions favorable for ${stock} based on sector analysis`,
  ];

  if (riskLevel === "Low") {
    return reasons[0] + " (Conservative approach)";
  } else if (riskLevel === "High") {
    return reasons[2] + " (Aggressive opportunity)";
  }

  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Generate sell reasons
const generateSellReason = (stock: string, riskLevel: string): string => {
  const reasons = [
    `${stock} showing bearish divergence with declining momentum`,
    `Technical indicators suggest overbought conditions for ${stock}`,
    `Profit-taking opportunity identified for ${stock}`,
    `${stock} approaching key resistance levels`,
    `Sector rotation indicates potential weakness in ${stock}`,
  ];

  if (riskLevel === "Low") {
    return reasons[3] + " (Risk management)";
  } else if (riskLevel === "High") {
    return reasons[1] + " (High conviction sell)";
  }

  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Generate hold reasons
const generateHoldReason = (stock: string, riskLevel: string): string => {
  const reasons = [
    `${stock} trading in consolidation range - wait for breakout`,
    `Mixed signals for ${stock} - better to wait for clarity`,
    `${stock} at key support levels - monitor for reversal`,
    `Market uncertainty suggests holding ${stock} position`,
    `${stock} fundamentals remain strong despite short-term volatility`,
  ];

  if (riskLevel === "Low") {
    return reasons[2] + " (Patient approach)";
  } else if (riskLevel === "High") {
    return reasons[0] + " (Waiting for optimal entry)";
  }

  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Advanced AI analysis (placeholder for real ML model)
export const performTechnicalAnalysis = async (
  symbol: string,
): Promise<{
  rsi: number;
  macd: number;
  bollinger: number;
  volume: number;
  trend: "BULLISH" | "BEARISH" | "SIDEWAYS";
}> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    rsi: 30 + Math.random() * 40, // 30-70
    macd: -2 + Math.random() * 4, // -2 to 2
    bollinger: 0.8 + Math.random() * 0.4, // 0.8-1.2
    volume: 0.5 + Math.random() * 1.5, // 0.5-2.0
    trend: ["BULLISH", "BEARISH", "SIDEWAYS"][
      Math.floor(Math.random() * 3)
    ] as any,
  };
};

// Sentiment analysis placeholder
export const analyzeSentiment = async (
  symbol: string,
): Promise<{
  news: number; // -1 to 1
  social: number; // -1 to 1
  overall: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
}> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const news = -1 + Math.random() * 2;
  const social = -1 + Math.random() * 2;
  const avg = (news + social) / 2;

  return {
    news,
    social,
    overall: avg > 0.2 ? "POSITIVE" : avg < -0.2 ? "NEGATIVE" : "NEUTRAL",
  };
};

// Risk assessment
export const assessRisk = async (
  symbol: string,
  action: "BUY" | "SELL",
): Promise<{
  risk: "Low" | "Medium" | "High";
  volatility: number;
  liquidity: number;
  recommendation: string;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const volatility = Math.random();
  const liquidity = Math.random();

  let risk: "Low" | "Medium" | "High";
  if (volatility < 0.3 && liquidity > 0.7) {
    risk = "Low";
  } else if (volatility > 0.7 || liquidity < 0.3) {
    risk = "High";
  } else {
    risk = "Medium";
  }

  const recommendations = {
    Low: "Safe investment with stable returns expected",
    Medium: "Moderate risk with potential for good returns",
    High: "High risk, high reward opportunity - monitor closely",
  };

  return {
    risk,
    volatility,
    liquidity,
    recommendation: recommendations[risk],
  };
};

// Portfolio optimization
export const optimizePortfolio = async (
  portfolio: Portfolio,
): Promise<{
  suggestions: {
    action: "BUY" | "SELL" | "HOLD";
    symbol: string;
    reason: string;
    priority: number; // 1-10
  }[];
  rebalancingNeeded: boolean;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const suggestions = [];

  // Generate mock suggestions based on portfolio
  portfolio.holdings.forEach((holding) => {
    if (holding.plPercent < -5) {
      suggestions.push({
        action: "SELL" as const,
        symbol: holding.symbol,
        reason: `Underperforming position with ${holding.plPercent.toFixed(2)}% loss`,
        priority: 7,
      });
    } else if (holding.plPercent > 10) {
      suggestions.push({
        action: "SELL" as const,
        symbol: holding.symbol,
        reason: `Take profits on ${holding.plPercent.toFixed(2)}% gain`,
        priority: 6,
      });
    }
  });

  // Add some buy suggestions
  const stocks = ["RELIANCE", "TCS", "HDFCBANK"];
  const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
  suggestions.push({
    action: "BUY" as const,
    symbol: randomStock,
    reason: "Strong technical indicators and positive market sentiment",
    priority: 8,
  });

  return {
    suggestions: suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3),
    rebalancingNeeded: suggestions.length > 2,
  };
};
