<template>
<div class="main_page">
    <el-container>
        <el-header>
            <my-header class="myheader"></my-header>
        </el-header>
        <div class="class-panel-wrap" v-show="$route.path === '/' || $route.path.startsWith('/blog')">
            <article-class-panel></article-class-panel>
        </div>
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
import ArticleClassPanel from "@/components/ArticleClassPanel";
export default {
    name: 'Index',
    components:{
        MyHeader,
        Aside,
        Main,
        ArticleClassPanel
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
.class-panel-wrap{
    padding: 8px 10px 4px 10px;
}
.el-aside{
    height: 100%;
    width: 350px !important;
}
.el-main{
    padding-top: 2px;
    padding-left: 4px;
    padding-right: 4px;
}
</style>
