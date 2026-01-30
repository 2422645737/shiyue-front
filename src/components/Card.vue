<template>
<div>
    <el-card class="box-card">
        <blog-card :article="article"></blog-card>
        <!-- <talk-card v-show="article.type === 'talk'" :article="article"></talk-card> -->
    </el-card>
</div>
</template>

<script>
import BlogCard from './BlogCard.vue'
import TalkCard from './TalkCard.vue'
export default {
    name: 'Card',
    components:{
        BlogCard,
        TalkCard
    },
    props: ['article']
}
</script>

<style lang="less" scoped>
.box-card {
    margin-bottom: 10px;
    transition-duration: 0.3s;
}
.box-card:hover{
    transition-duration: 0.1s;
    box-shadow: 1px 1px 4px 3px #c4bfbf;
}
/deep/.el-card__body{
    padding:8px
}

</style>