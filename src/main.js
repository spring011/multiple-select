import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design'
import '@/styles/common.less'
import '../my-theme/index.less'


Vue.use(ViewUI);


import MetaMultipleSelect from './component/index.js'
Vue.use(MetaMultipleSelect)


new Vue({
  render: h => h(App)
}).$mount('#app')
