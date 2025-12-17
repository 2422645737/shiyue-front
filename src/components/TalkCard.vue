<template>
<div>
    <div class="content">{{article.content}}</div>
    <div class="images">
        <!-- 图片 -->
        <!-- 这里展示一行图片 -->
        <!-- <img v-for="(item,index) in article.cover" :key="index" :src="item" alt=""> -->

    </div>
    <div class="footer" v-if="article">
        <!-- 底部横幅内容 -->
        <div class="footer_time" v-if="article.publish_time">{{article.publish_time}}</div>
        <div class="fill"></div>
        <div class="footer_count">
            <img src="../../public/images/article_icon/count.png" alt="">
            阅读:{{article.quantity}}
        </div>
        <div class="footer_like" v-if="article.likes">
            <img src="../../public/images/article_icon/like.png" alt="">
            点赞:{{article.likes.length}}
        </div>
        <div class="footer_comment" v-if="article.comments">
            <img src="../../public/images/article_icon/comment.png" alt="">
            评论:{{article.comments.length}}
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'talk_card',
    props: ['article']
}
</script>

<style scoped>
/* 文章内容样式 */
.content {
    text-align: left;
    background-color: red;
}

/* 图片样式，可能不止一张哦 */
.images{
    display: flex;
    justify-content: left;
    align-items: center;
}
.images > img{
    width: 100px;
    height: 100px;
    margin-left: 10px;
}
/* 底部内容样式 */
.footer {
    background-color: chartreuse;
    display: flex;
    justify-content: left;
}

.footer>div {
    margin-left: 10px;
    display: flex;
    justify-content: left;
    align-items: center;
}

.footer>div>img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.footer>.footer_time {
    background-color: red;
    margin-left: 2px;
}

.footer>.footer_count {
    background-color: green;
}

.footer>.footer_like {
    background-color: yellow;
    margin-left: 20px;
}

.footer>.footer_comment {
    background-color: aqua;
    margin-left: 20px;
}

.footer>.fill {
    width: 60%;
}
</style>
