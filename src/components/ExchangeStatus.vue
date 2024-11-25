<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ExchangeService } from '../services/ExchangeService';

const binanceStatus = ref<'online' | 'offline' | 'checking'>('checking');
const coinbaseStatus = ref<'online' | 'offline' | 'checking'>('checking');
const timer = ref<number>();

const checkStatus = async () => {
  binanceStatus.value = await ExchangeService.checkBinanceStatus() ? 'online' : 'offline';
  coinbaseStatus.value = await ExchangeService.checkCoinbaseStatus() ? 'online' : 'offline';
};

onMounted(() => {
  checkStatus();
  timer.value = setInterval(checkStatus, 30000); // Check every 30 seconds
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<template>
  <div class="exchange-status">
    <div class="status-item">
      <span class="exchange-name">Binance:</span>
      <span class="status-indicator" :class="binanceStatus">
        {{ binanceStatus === 'checking' ? 'Checking...' : binanceStatus }}
      </span>
    </div>
    <div class="status-item">
      <span class="exchange-name">Coinbase:</span>
      <span class="status-indicator" :class="coinbaseStatus">
        {{ coinbaseStatus === 'checking' ? 'Checking...' : coinbaseStatus }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.exchange-status {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.exchange-name {
  font-weight: 600;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  
  &.online {
    background-color: #dcfce7;
    color: #166534;
  }
  
  &.offline {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  &.checking {
    background-color: #f3f4f6;
    color: #374151;
  }
}
</style>