// Mock API service for stock trading app
// This will be replaced with actual SmartAPI integration

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  currentValue: number;
  pl: number;
  plPercent: number;
}

export interface Portfolio {
  balance: number;
  totalValue: number;
  pl: number;
  plPercent: number;
  holdings: Holding[];
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
}

// Mock stock data
const mockStocks: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.78, change: 23.45, changePercent: 0.96, volume: 12543200, marketCap: 1645000000000 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3456.90, change: -12.34, changePercent: -0.36, volume: 8765400, marketCap: 1280000000000 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1567.89, change: 8.76, changePercent: 0.56, volume: 15432000, marketCap: 987000000000 },
  { symbol: 'INFY', name: 'Infosys', price: 1234.56, change: 15.67, changePercent: 1.29, volume: 9876500, marketCap: 765000000000 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 890.12, change: -5.43, changePercent: -0.61, volume: 12345600, marketCap: 654000000000 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2345.67, change: 18.90, changePercent: 0.81, volume: 3456700, marketCap: 543000000000 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 567.89, change: 3.45, changePercent: 0.61, volume: 23456700, marketCap: 521000000000 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6789.01, change: 45.67, changePercent: 0.68, volume: 1234500, marketCap: 432000000000 },
];

// Mock portfolio data
const mockPortfolio: Portfolio = {
  balance: 25000.00,
  totalValue: 125000.00,
  pl: 8500.00,
  plPercent: 7.30,
  holdings: [
    { symbol: 'RELIANCE', quantity: 10, avgPrice: 2400.00, currentPrice: 2456.78, currentValue: 24567.80, pl: 567.80, plPercent: 2.37 },
    { symbol: 'TCS', quantity: 5, avgPrice: 3500.00, currentPrice: 3456.90, currentValue: 17284.50, pl: -215.50, plPercent: -1.23 },
    { symbol: 'HDFCBANK', quantity: 15, avgPrice: 1500.00, currentPrice: 1567.89, currentValue: 23518.35, pl: 1018.35, plPercent: 4.52 },
    { symbol: 'INFY', quantity: 8, avgPrice: 1200.00, currentPrice: 1234.56, currentValue: 9876.48, pl: 276.48, plPercent: 2.87 },
    { symbol: 'ICICIBANK', quantity: 20, avgPrice: 900.00, currentPrice: 890.12, currentValue: 17802.40, pl: -195.60, plPercent: -1.09 },
  ]
};

// Mock trades
const mockTrades: Trade[] = [
  { id: '1', symbol: 'RELIANCE', type: 'BUY', quantity: 10, price: 2400.00, timestamp: new Date(Date.now() - 3600000), status: 'EXECUTED' },
  { id: '2', symbol: 'TCS', type: 'SELL', quantity: 3, price: 3470.00, timestamp: new Date(Date.now() - 7200000), status: 'EXECUTED' },
  { id: '3', symbol: 'HDFCBANK', type: 'BUY', quantity: 5, price: 1550.00, timestamp: new Date(Date.now() - 10800000), status: 'EXECUTED' },
];

// API Functions (to be replaced with SmartAPI)

export const getStockList = async (): Promise<Stock[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add some random price changes to simulate real-time data
  return mockStocks.map(stock => ({
    ...stock,
    price: stock.price + (Math.random() - 0.5) * 10,
    change: stock.change + (Math.random() - 0.5) * 2,
    changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1,
  }));
};

export const getStockDetails = async (symbol: string): Promise<Stock | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStocks.find(stock => stock.symbol === symbol) || null;
};

export const getPortfolioData = async (): Promise<Portfolio> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Update portfolio values based on current stock prices
  const updatedHoldings = mockPortfolio.holdings.map(holding => {
    const currentStock = mockStocks.find(s => s.symbol === holding.symbol);
    if (currentStock) {
      const currentValue = holding.quantity * currentStock.price;
      const pl = currentValue - (holding.quantity * holding.avgPrice);
      const plPercent = (pl / (holding.quantity * holding.avgPrice)) * 100;
      
      return {
        ...holding,
        currentPrice: currentStock.price,
        currentValue,
        pl,
        plPercent
      };
    }
    return holding;
  });

  const totalHoldingsValue = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalValue = mockPortfolio.balance + totalHoldingsValue;
  const totalCost = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
  const pl = totalValue - (mockPortfolio.balance + totalCost);
  const plPercent = (pl / (mockPortfolio.balance + totalCost)) * 100;

  return {
    ...mockPortfolio,
    holdings: updatedHoldings,
    totalValue,
    pl,
    plPercent
  };
};

export const placeOrder = async (symbol: string, type: 'BUY' | 'SELL', quantity: number, price?: number): Promise<Trade> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const stock = mockStocks.find(s => s.symbol === symbol);
  if (!stock) {
    throw new Error('Stock not found');
  }

  const orderPrice = price || stock.price;
  const trade: Trade = {
    id: Date.now().toString(),
    symbol,
    type,
    quantity,
    price: orderPrice,
    timestamp: new Date(),
    status: Math.random() > 0.1 ? 'EXECUTED' : 'FAILED' // 90% success rate
  };

  if (trade.status === 'FAILED') {
    throw new Error('Order execution failed');
  }

  return trade;
};

export const getTradeHistory = async (): Promise<Trade[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTrades;
};

// WebSocket placeholder for real-time updates
export const subscribeToStockUpdates = (callback: (stock: Stock) => void) => {
  // This would be replaced with actual WebSocket connection to SmartAPI
  const interval = setInterval(async () => {
    const stocks = await getStockList();
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    callback(randomStock);
  }, 2000);

  return () => clearInterval(interval);
};

// SmartAPI placeholder functions
export const smartAPI = {
  // Login to Angel One SmartAPI
  login: async (clientId: string, password: string, totp: string) => {
    // TODO: Implement actual SmartAPI login
    console.log('SmartAPI login placeholder');
  },

  // Get session token
  getSession: async () => {
    // TODO: Implement actual session retrieval
    console.log('SmartAPI getSession placeholder');
  },

  // Place order
  placeOrder: async (orderDetails: any) => {
    // TODO: Implement actual order placement
    console.log('SmartAPI placeOrder placeholder', orderDetails);
  },

  // Modify order
  modifyOrder: async (orderId: string, modifications: any) => {
    // TODO: Implement actual order modification
    console.log('SmartAPI modifyOrder placeholder', orderId, modifications);
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    // TODO: Implement actual order cancellation
    console.log('SmartAPI cancelOrder placeholder', orderId);
  },

  // Get holdings
  getHoldings: async () => {
    // TODO: Implement actual holdings retrieval
    console.log('SmartAPI getHoldings placeholder');
  },

  // Get positions
  getPositions: async () => {
    // TODO: Implement actual positions retrieval
    console.log('SmartAPI getPositions placeholder');
  }
};
