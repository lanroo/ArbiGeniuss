import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ExchangeCredentials } from '../types/exchange';

export const useExchangeStore = defineStore('exchange', () => {
  const binanceCredentials = ref<ExchangeCredentials | null>(null);
  const coinbaseCredentials = ref<ExchangeCredentials | null>(null);

  const setExchangeCredentials = async (credentials: {
    binance: ExchangeCredentials;
    coinbase: ExchangeCredentials;
  }) => {
    // Encrypt credentials before storing
    const encryptedBinance = await encryptCredentials(credentials.binance);
    const encryptedCoinbase = await encryptCredentials(credentials.coinbase);

    // Store encrypted credentials
    localStorage.setItem('binance_credentials', encryptedBinance);
    localStorage.setItem('coinbase_credentials', encryptedCoinbase);

    binanceCredentials.value = credentials.binance;
    coinbaseCredentials.value = credentials.coinbase;
  };

  const loadStoredCredentials = async () => {
    const storedBinance = localStorage.getItem('binance_credentials');
    const storedCoinbase = localStorage.getItem('coinbase_credentials');

    if (storedBinance) {
      binanceCredentials.value = await decryptCredentials(storedBinance);
    }

    if (storedCoinbase) {
      coinbaseCredentials.value = await decryptCredentials(storedCoinbase);
    }
  };

  // Helper functions for encryption/decryption
  const encryptCredentials = async (credentials: ExchangeCredentials): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(credentials));
    
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return JSON.stringify({
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    });
  };

  const decryptCredentials = async (encryptedData: string): Promise<ExchangeCredentials> => {
    const { encrypted, iv } = JSON.parse(encryptedData);
    
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(encrypted)
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  };

  return {
    binanceCredentials,
    coinbaseCredentials,
    setExchangeCredentials,
    loadStoredCredentials
  };
});