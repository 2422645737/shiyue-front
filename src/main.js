import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueRouter from 'vue-router'
import router from './router/index.js'
import 'element-ui/lib/theme-chalk/index.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import store from "@/store/index.js";


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(mavonEditor);
Vue.use(VueRouter);
Vue.prototype.$http = axios
axios.defaults.baseURL = '/'



// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.prototype.getTime = function (){

  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear() // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds() //秒
  // 给一位数的数据前面加 "0"
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes;
}

// 移除全局混入，避免导致组件模板出现多个根元素的问题
// 改为在需要的组件中手动添加文件分隔线
new Vue({
  axios,
  store,
  router:router,
  render: h => h(App)
}).$mount('#app')
