import axios from 'axios';
import crypto from 'crypto-js';
import type { ExchangeCredentials, TradeResult } from '../types/exchange';

export class TradingService {
  private static async executeBinanceTrade(
    credentials: ExchangeCredentials,
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number
  ): Promise<TradeResult> {
    try {
      const timestamp = Date.now();
      const params = new URLSearchParams({
        symbol,
        side,
        type: 'MARKET',
        quantity: quantity.toString(),
        timestamp: timestamp.toString()
      });

      const signature = crypto.HmacSHA256(
        params.toString(),
        credentials.apiSecret
      ).toString();

      const response = await axios.post(
        `https://api.binance.com/api/v3/order?${params.toString()}&signature=${signature}`,
        null,
        {
          headers: {
            'X-MBX-APIKEY': credentials.apiKey
          }
        }
      );

      return {
        success: true,
        orderId: response.data.orderId,
        details: {
          price: parseFloat(response.data.price),
          quantity: parseFloat(response.data.executedQty),
          total: parseFloat(response.data.cummulativeQuoteQty)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static async executeCoinbaseTrade(
    credentials: ExchangeCredentials,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number
  ): Promise<TradeResult> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const requestPath = '/v2/trades';
      const body = {
        product_id: symbol.replace('USDT', '-USD'),
        side,
        funds: amount.toString()
      };

      const message = timestamp + 'POST' + requestPath + JSON.stringify(body);
      const signature = crypto.HmacSHA256(message, credentials.apiSecret).toString();

      const response = await axios.post(
        `https://api.coinbase.com${requestPath}`,
        body,
        {
          headers: {
            'CB-ACCESS-KEY': credentials.apiKey,
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp.toString()
          }
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        details: {
          price: parseFloat(response.data.price),
          quantity: parseFloat(response.data.size),
          total: parseFloat(response.data.funds)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public static async executeArbitrageTrade(
    buyExchange: string,
    sellExchange: string,
    symbol: string,
    quantity: number,
    credentials: {
      binance: ExchangeCredentials;
      coinbase: ExchangeCredentials;
    }
  ): Promise<{
    buyResult: TradeResult;
    sellResult: TradeResult;
  }> {
    // Execute buy order
    const buyResult = await (buyExchange === 'Binance'
      ? this.executeBinanceTrade(credentials.binance, symbol, 'BUY', quantity)
      : this.executeCoinbaseTrade(credentials.coinbase, symbol, 'buy', quantity));

    if (!buyResult.success) {
      return {
        buyResult,
        sellResult: {
          success: false,
          error: 'Buy order failed, sell order not attempted'
        }
      };
    }

    // Execute sell order
    const sellResult = await (sellExchange === 'Binance'
      ? this.executeBinanceTrade(credentials.binance, symbol, 'SELL', quantity)
      : this.executeCoinbaseTrade(credentials.coinbase, symbol, 'sell', quantity));

    return { buyResult, sellResult };
  }
}