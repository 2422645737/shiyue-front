import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);       //应用Vuex插件

//用于相应组件中的动作
const actions = {}

//用于操作数据
const mutations = {}

//用来存储全局数据
const state = {

}

export default new Vuex.Store({
    actions:actions,
    mutations:mutations,
    state:state
})