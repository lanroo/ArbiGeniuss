import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Decimal } from 'decimal.js';
import type { ExchangePrice, ArbitrageOpportunity } from '../types/exchange';

// Create axios instances with retry configuration
const binanceApi = axios.create();
const coinbaseApi = axios.create();

axiosRetry(binanceApi, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
  }
});

axiosRetry(coinbaseApi, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
  }
});

export class ExchangeService {
  public static async checkBinanceStatus(): Promise<boolean> {
    try {
      await binanceApi.get('https://api.binance.com/api/v3/ping');
      return true;
    } catch {
      return false;
    }
  }

  public static async checkCoinbaseStatus(): Promise<boolean> {
    try {
      await coinbaseApi.get('https://api.coinbase.com/v2/currencies');
      return true;
    } catch {
      return false;
    }
  }

  private static async getBinancePrice(symbol: string): Promise<number> {
    try {
      const response = await binanceApi.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      return parseFloat(response.data.price) || 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Binance API error: ${error.message}`);
      }
      return 0;
    }
  }

  private static async getCoinbasePrice(symbol: string): Promise<number> {
    try {
      const coinbaseSymbol = symbol.replace('USDT', '-USD');
      const response = await coinbaseApi.get(`https://api.coinbase.com/v2/prices/${coinbaseSymbol}/spot`);
      return parseFloat(response.data.data.amount) || 0;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Coinbase API error: ${error.message}`);
      }
      return 0;
    }
  }

  public static async getPrices(symbol: string): Promise<ExchangePrice[]> {
    const timestamp = Date.now();
    try {
      const [binancePrice, coinbasePrice] = await Promise.all([
        this.getBinancePrice(symbol),
        this.getCoinbasePrice(symbol)
      ]);

      return [
        { exchange: 'Binance', symbol, price: binancePrice, timestamp },
        { exchange: 'Coinbase', symbol, price: coinbasePrice, timestamp }
      ].filter(price => price.price > 0);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching prices: ${error.message}`);
      }
      return [];
    }
  }

  public static findArbitrageOpportunities(prices: ExchangePrice[]): ArbitrageOpportunity[] {
    if (prices.length < 2) return [];

    const opportunities: ArbitrageOpportunity[] = [];
    const timestamp = Date.now();

    try {
      for (let i = 0; i < prices.length; i++) {
        for (let j = i + 1; j < prices.length; j++) {
          const price1 = new Decimal(prices[i].price);
          const price2 = new Decimal(prices[j].price);

          if (price1.isZero() || price2.isZero()) continue;

          if (price1.greaterThan(price2)) {
            const profitPercentage = price1.minus(price2).dividedBy(price2).times(100).toNumber();
            
            if (profitPercentage > 0.5) {
              opportunities.push({
                symbol: prices[i].symbol,
                buyExchange: prices[j].exchange,
                sellExchange: prices[i].exchange,
                buyPrice: price2.toNumber(),
                sellPrice: price1.toNumber(),
                profitPercentage,
                timestamp
              });
            }
          } else if (price2.greaterThan(price1)) {
            const profitPercentage = price2.minus(price1).dividedBy(price1).times(100).toNumber();
            
            if (profitPercentage > 0.5) {
              opportunities.push({
                symbol: prices[i].symbol,
                buyExchange: prices[i].exchange,
                sellExchange: prices[j].exchange,
                buyPrice: price1.toNumber(),
                sellPrice: price2.toNumber(),
                profitPercentage,
                timestamp
              });
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error calculating arbitrage: ${error.message}`);
      }
      return [];
    }

    return opportunities;
  }
}