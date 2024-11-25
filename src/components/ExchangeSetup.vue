<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useExchangeStore } from '../stores/exchangeStore';

const store = useExchangeStore();
const visible = ref(false);
const loading = ref(false);

const credentials = ref({
  binance: {
    apiKey: '',
    apiSecret: ''
  },
  coinbase: {
    apiKey: '',
    apiSecret: ''
  }
});

const saveCredentials = async () => {
  loading.value = true;
  try {
    await store.setExchangeCredentials({
      binance: credentials.value.binance,
      coinbase: credentials.value.coinbase
    });
    visible.value = false;
  } catch (error) {
    console.error('Failed to save credentials:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="exchange-setup">
    <Button 
      icon="pi pi-cog" 
      label="Configure Exchanges" 
      @click="visible = true"
      severity="secondary"
    />
    
    <Dialog 
      v-model:visible="visible" 
      modal 
      header="Exchange Configuration" 
      :style="{ width: '50vw' }"
    >
      <div class="exchange-form">
        <div class="exchange-section">
          <h3>Binance API Configuration</h3>
          <div class="field">
            <label for="binance-key">API Key</label>
            <InputText 
              id="binance-key"
              v-model="credentials.binance.apiKey" 
              type="password"
              class="w-full"
            />
          </div>
          <div class="field">
            <label for="binance-secret">API Secret</label>
            <Password 
              id="binance-secret"
              v-model="credentials.binance.apiSecret" 
              toggleMask
              class="w-full"
            />
          </div>
        </div>

        <div class="exchange-section">
          <h3>Coinbase API Configuration</h3>
          <div class="field">
            <label for="coinbase-key">API Key</label>
            <InputText 
              id="coinbase-key"
              v-model="credentials.coinbase.apiKey" 
              type="password"
              class="w-full"
            />
          </div>
          <div class="field">
            <label for="coinbase-secret">API Secret</label>
            <Password 
              id="coinbase-secret"
              v-model="credentials.coinbase.apiSecret" 
              toggleMask
              class="w-full"
            />
          </div>
        </div>

        <div class="exchange-warning">
          <i class="pi pi-exclamation-triangle" style="color: #f59e0b;"></i>
          <p>
            Your API keys are stored securely in your browser's encrypted storage.
            Make sure to use API keys with trading permissions and appropriate IP restrictions.
          </p>
        </div>
      </div>

      <template #footer>
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          @click="visible = false" 
          text 
        />
        <Button 
          label="Save" 
          icon="pi pi-check" 
          @click="saveCredentials" 
          :loading="loading"
          severity="success"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.exchange-setup {
  margin-bottom: 1rem;
}

.exchange-form {
  padding: 1rem;
}

.exchange-section {
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
}

.field {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
}

.exchange-warning {
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
  background-color: #fef3c7;
  border-radius: 0.5rem;
  margin-top: 1rem;

  i {
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: #92400e;
  }
}
</style>