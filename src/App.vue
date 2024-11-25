<script setup lang="ts">
import ArbitrageTable from './components/ArbitrageTable.vue';
import ExchangeStatus from './components/ExchangeStatus.vue';
</script>

<template>
  <div class="layout">
    <header class="header">
      <h1>ArbiGenius Crypto Arbitrage Monitor</h1>
    </header>
    
    <main class="main">
      <div class="container">
        <ExchangeStatus />
        <ArbitrageTable />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--surface-ground);
}

.header {
  background: var(--surface-card);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: var(--primary-color);
  margin: 0;
}

.main {
  padding: 0 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>