<template>
<div class="main">
    <Card v-for="(item,index) in articles" :key="index" :article="item"></Card>
    <el-pagination background layout="prev, pager, next" :total="pageInfo.total" @current-change="current_change">
    </el-pagination>
</div>
</template>

<script>
import Card from './Card.vue'
export default {
    name: 'Main',
    data() {
        return {
            pageInfo: {
                current: 1,
                size: 10,
                total: 0
            },
            articles: [
            ]
        }
    },
    components: {
        Card
    },
    methods: {
        getPage(current, size) {
            let type = 0;   //没有查询类型

            if(this.$route.query.class_id !== undefined){
                type = 1;     //按照文章类型查询
            }
            else if(this.$route.query.title !== undefined){
                type = 2;   //按照文章标题查询
            }
            else if(this.$route.query.tag !== undefined){
                type = 3;   //按照文章标签查询
            }else{
                //全部文章
            }
            
            type = 1
            let url = "article/findByClassId?";
            // if(type === 1)url += 'classId=' + this.$route.query.class_id + '&';
            if(type === 1)url += 'classId=1&'
            else if(type === 2)url += 'title=' + this.$route.query.title + '&';
            else if(type === 3)url += 'tag=' + this.$route.query.tag + '&';
            url += 'current='+ current + '&size=' + size;

            this.$http.get(url).then(
                response => {
                    this.articles = response.data.data;
                    // this.pageInfo.total = response.data.data.articles.total;
                }
            )
        },
        current_change(val) { //页面跳转事件
            this.getPage(val,this.pageInfo.size);
        }

    },
    beforeRouteUpdate(to,from,next){
        next();
        this.getPage(this.pageInfo.current,this.pageInfo.size);
    },
    mounted() {
        this.getPage(this.pageInfo.current,this.pageInfo.size)
    }
}
</script>

<style>

.main{
}
</style>
