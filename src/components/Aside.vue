<template>
<div class="aside-main">

    <el-card class="box-card" shadow="always">
        <div class="avatar">
            <img src="../../public/images/head.jpg" alt="">
        </div>
        <div class="username">
            <p>长野原烟花店</p>
        </div>
        <div class="signature">
            <p>烟花易逝，人情长存</p>
        </div>
    </el-card>
    <article-class-panel></article-class-panel>
    <article-tags-panel></article-tags-panel>
</div>
</template>

<script>
import ArticleClassPanel from "@/components/ArticleClassPanel";
import ArticleTagsPanel from "@/components/ArticleTagsPanel";
export default {
    name: 'Aside',
    components:{
        ArticleClassPanel,
        ArticleTagsPanel
    }

}
</script>

<style scoped>
.username{
    letter-spacing: 1px;
}
.signature{
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    letter-spacing: 1px;
}
.avatar > img{
    background-repeat: no-repeat;
    height: 150px;
    width: 150px;
    border-radius: 75px;
}
.avatar{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; 
    height: 50%;
}
.box-card{
    width: 95%;
    margin-top: 5px;
}
.aside-main{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
