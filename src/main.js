// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import { message, Modal,empty } from 'ant-design-vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import permission from './directive/permission'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@/components/ProLayout'
import FooterToolBar from '@/components/FooterToolbar'
import themePluginConfig from '../config/themePluginConfig'
import VueCookies from 'vue-cookies'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'
import '@/assets/styles/antv-theme.less'
import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import draggable from '@/utils/drag'
import './global.less' // global style
import { getDicts, getAllDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import { parseTime, formatDuration, findNodeId, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, downloadTask, downloadByPath, handleTree, appendTreeNode, removeTreeNode, expandTree,dragTable } from '@/utils/sakura'
import Highlight from './utils/highlight'
import uuidv1 from 'uuid/v1'
import './mock'
import VueLazyload from 'vue-lazyload'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn')
// 挂载全局使用的方法
import VueDraggableResizable from 'vue-draggable-resizable'

// 全局方法挂载
Vue.prototype.moment = moment // 挂载到当前vue实例对象
Vue.prototype.uuidv1 = uuidv1
Vue.prototype.findNodeId = findNodeId
Vue.prototype.getDicts = getDicts
Vue.prototype.getAllDicts = getAllDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.formatDuration = formatDuration
Vue.prototype.dragTable = dragTable
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.downloadTask = downloadTask
Vue.prototype.downloadByPath = downloadByPath
Vue.prototype.handleTree = handleTree
Vue.prototype.appendTreeNode = appendTreeNode
Vue.prototype.removeTreeNode = removeTreeNode
Vue.prototype.expandTree = expandTree
Vue.prototype.$message = message
Vue.prototype.$Modal = Modal
message.config({
  duration: 2, // 持续时间
  top: `100px`, // 到页面顶部距离
  maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
})

// 全局组件挂载
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('footer-tool-bar', FooterToolBar)
Vue.component('Empty', empty)
Vue.component('vue-draggable-resizable', VueDraggableResizable)

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(Highlight)
Vue.use(draggable)
Vue.use(permission)
Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.use(VueCookies)

// VueLazyload 图片懒加载配置项
// Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  error: require('./assets/images/loading/svg/loading.svg'),
  loading: require('./assets/images/loading/svg/loading.svg')
})

Vue.config.productionTip = false
window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
