import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import App from './App.vue';

// PrimeVue styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(PrimeVue, { ripple: true });

// Register PrimeVue components
app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputText', InputText);
app.component('Password', Password);

app.mount('#app');

// Acessando variáveis de ambiente no código
const apiKey = import.meta.env.VITE_BINANCE_API_KEY;
// const apiSecret = import.meta.env.VITE_BINANCE_API_SECRET;

console.log('Binance API Key:', apiKey);
