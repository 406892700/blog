import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import ElemntUI, { Loading, MessageBox, Notification, Message } from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import './src/common.scss';
import Vuex from 'vuex';
import storeConfig from './store';
Vue.use(ElemntUI);
Vue.use(Vuex);

Vue.config.productionTip = false;

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

const store = new Vuex.Store(storeConfig);

const globalVm = new Vue({
    el: '#root',
    router,
    store,
    template: '<App/>',
    components: { App },
});

// hmr
if (module.hot) {
    module.hot.accept();
}
