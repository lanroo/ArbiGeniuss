<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { ExchangeService } from '../services/ExchangeService';
import { TradingService } from '../services/TradingService';
import { useExchangeStore } from '../stores/exchangeStore';
import type { ArbitrageOpportunity, ExchangePrice } from '../types/exchange';

const store = useExchangeStore();
const opportunities = ref<ArbitrageOpportunity[]>([]);
const loading = ref(true);
const timer = ref<number>();
const error = ref<string>('');
const tradeAmount = ref<number>(100); 
const tradeAmountString = computed({ 
  get: () => tradeAmount.value.toString(),
  set: (val: string) => {
    tradeAmount.value = parseFloat(val) || 0; 
  }
});
const executingTrade = ref<string | null>(null);
const tradeResult = ref<{ success: boolean; message: string } | null>(null);

const symbols = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'DOGEUSDT'
];

const updatePrices = async () => {
  try {
    loading.value = true;
    error.value = '';
    const allPrices: ExchangePrice[] = [];
    
    for (const symbol of symbols) {
      const prices = await ExchangeService.getPrices(symbol);
      allPrices.push(...prices);
    }
    
    opportunities.value = ExchangeService.findArbitrageOpportunities(allPrices);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching prices';
    opportunities.value = [];
  } finally {
    loading.value = false;
  }
};

const executeTrade = async (opportunity: ArbitrageOpportunity) => {
  if (!store.binanceCredentials || !store.coinbaseCredentials) {
    tradeResult.value = {
      success: false,
      message: 'Please configure your exchange API keys first'
    };
    return;
  }

  executingTrade.value = opportunity.symbol;
  tradeResult.value = null;

  try {
    const result = await TradingService.executeArbitrageTrade(
      opportunity.buyExchange,
      opportunity.sellExchange,
      opportunity.symbol,
      tradeAmount.value,
      {
        binance: store.binanceCredentials,
        coinbase: store.coinbaseCredentials
      }
    );

    if (result.buyResult.success && result.sellResult.success) {
      const buyTotal = result.buyResult.details?.total || 0;
      const sellTotal = result.sellResult.details?.total || 0;
      const profit = sellTotal - buyTotal;

      tradeResult.value = {
        success: true,
        message: `Trade executed successfully! Profit: $${profit.toFixed(2)}`
      };
    } else {
      tradeResult.value = {
        success: false,
        message: `Trade failed: ${result.buyResult.error || result.sellResult.error}`
      };
    }
  } catch (err) {
    tradeResult.value = {
      success: false,
      message: err instanceof Error ? err.message : 'An error occurred during trade execution'
    };
  } finally {
    executingTrade.value = null;
  }
};

onMounted(() => {
  updatePrices();
  timer.value = setInterval(updatePrices, 10000); // Update every 10 seconds
  store.loadStoredCredentials();
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<template>
  <div class="card">
    <div class="controls mb-4">
      <div class="trade-amount">
        <label for="trade-amount">Trade Amount ($)</label>
        <InputText
          id="trade-amount"
          v-model="tradeAmountString"
          type="number"
          min="10"
          step="10"
        />
      </div>
      <ExchangeSetup />
    </div>

    <div v-if="tradeResult" :class="['alert', tradeResult.success ? 'alert-success' : 'alert-error']">
      {{ tradeResult.message }}
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <DataTable
      :value="opportunities"
      :loading="loading"
      stripedRows
      showGridlines
      tableStyle="min-width: 50rem"
    >
      <Column field="symbol" header="Symbol" sortable></Column>
      <Column field="buyExchange" header="Buy On" sortable></Column>
      <Column field="sellExchange" header="Sell On" sortable></Column>
      <Column 
        field="buyPrice" 
        header="Buy Price" 
        sortable
      >
        <template #body="slotProps">
          ${{ slotProps.data.buyPrice.toFixed(2) }}
        </template>
      </Column>
      <Column 
        field="sellPrice" 
        header="Sell Price" 
        sortable
      >
        <template #body="slotProps">
          ${{ slotProps.data.sellPrice.toFixed(2) }}
        </template>
      </Column>
      <Column 
        field="profitPercentage" 
        header="Profit %" 
        sortable
      >
        <template #body="slotProps">
          <span :class="{'text-green-500': slotProps.data.profitPercentage > 1}">
            {{ slotProps.data.profitPercentage.toFixed(2) }}%
          </span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            label="Execute Trade"
            icon="pi pi-check"
            :loading="executingTrade === slotProps.data.symbol"
            @click="executeTrade(slotProps.data)"
            severity="success"
            size="small"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: var(--surface-card);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.trade-amount {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-weight: 500;
  }

  input {
    width: 150px;
  }
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #fee2e2;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  &.alert-success {
    background-color: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  &.alert-error {
    background-color: #fef2f2;
    color: #dc2626;
    border: 1px solid #fee2e2;
  }
}
</style>
