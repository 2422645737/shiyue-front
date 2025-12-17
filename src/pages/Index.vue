<template>
<div class="main_page">
    <el-container>
        <el-header>
            <my-header class="myheader"></my-header>
        </el-header>
        <el-container>
            <el-aside>
                <Aside></Aside>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
import MyHeader from '../components/MyHeader.vue'
import Aside from '../components/Aside.vue'
import Main from '../components/Main.vue'
export default {
    name: 'Index',
    components:{
        MyHeader,
        Aside,
        Main
    },
    mounted() {
        let user = window.localStorage.getItem('userInfo');
    }
}
</script>

<style scoped>
.el-container{
    height: auto;
}
.main_page{
    height: 100%;
    width: 100%;
    background-size: cover;
}
.el-header{
    padding: 0;
}
.el-aside{
    height: 100%;
    width: 350px !important;
}
.el-main{
    padding-top: 6px;
    padding-left: 4px;
    padding-right: 4px;
}
</style>
