import Vue from 'vue';
import App from './App.vue';
import router from '../router';
import store from '../store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import './custom.scss';

import { Quasar } from 'quasar';
import '../styles/quasar.scss';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Quasar);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
