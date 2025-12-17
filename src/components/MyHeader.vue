<template>
<div class="header-main">
    <!-- logo部分 -->
    <div class="logo">
        <span class="logo_title">烟花易逝</span>
    </div>
    <div class="search-box">
        <el-input placeholder="请输入内容" v-model="input">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
    </div>
    <!-- 按钮部分 -->
    <div class="buttons">
        <div class="home-button" @click="to_home">
            <img src="../../public/images/home.png" alt="">
            <p>主页</p>
        </div>
        <div class="blog-button" @click="to_blog">
            <img src="../../public/images/blog.png" alt="">
            <p>博客</p>
<!--            <p>博客</p>-->
        </div>
        <div class="talk-button" @click="to_talk">
            <img src="../../public/images/talk.png" alt="">
            <a href="">说说</a>
        </div>
        <div class="music-button" @click="to_music">
            <img src="../../public/images/music.png" alt="">
            <p>音乐</p>
        </div>
        <div class="read-button" @click="to_read">
            <img src="../../public/images/read.png" alt="">
            <p>阅读</p>
        </div>
        <div class="head-image" @click="to_user_home">
             <img :src="this.user_avatar" alt="" class="avatar">
        </div>

    </div>
</div>
</template>

<script>
export default {
    name: "MyHeader",
    data() {
        return {
            input:'',
            user_avatar:'https://img0.baidu.com/it/u=1876211881,1944884224&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'
        }
    },
    mounted() {
        // let user = window.localStorage.getItem("userInfo");
        // user = JSON.parse(user);
        // console.log('用户头像:' + user.avatar)
        // this.user_avatar = user.avatar;
    },
    methods:{
        to_home(){
            //主页
            this.$router.push({path:'/'})
        },
        to_blog(){
            this.$router.push({path:'/blog'})
        },
        to_talk(){
            //说说
            console.log("to_home");
        },
        to_music(){
            //音乐
            this.$router.push({path:'/music'})
        },
        to_read(){
            //阅读
            console.log("to_home");
        },
        to_user_home(){
            //头像
            console.log("to_home");
        },
    }
}
</script>

<style scoped>
.buttons > div > img{
    width:30px;
    height:30px;
}
.avatar{        /*头像风格*/
    width: 50px !important;
    height: 50px !important;
    border-radius: 25px;
    transition-duration: 0.4s;
}
.avatar:hover{
    transition-duration: 0.2s;
    transform: scale(1.09);
}
.buttons > div > a{
    text-decoration: none;
}
.buttons > div{
    height: 100%;
    width: 16.69%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition-duration: 0.3s;
}
.buttons > div:hover{
    background-color: #dee2e0;
    transition-duration: 0.2s;
    cursor: pointer;
}
.el-input{
    margin-top: 10px;
    width: 90%;
    font-size: 19px;
}
.header-main {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.search-box {
    background-color: white;
    height: 100%;
    width: 40%;
}
.logo_title{
    letter-spacing: 3px;
    /* 文字格式设置 */
    font-size: 29px;
}

.logo {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: white;
    align-items: center;
}

.buttons {
    background-color: white;
    width: 40%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
