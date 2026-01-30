<template>
<div class="main_page">
    <el-container>
        <el-header>
            <my-header></my-header>
        </el-header>

        <el-container>
            <el-aside>
                <catelog-card v-show="article.type === 'blog'" :article="article"></catelog-card>
            </el-aside>

            <el-main>
                <read-panel class="read-panel" :article="article"></read-panel>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
import MyHeader from '../components/MyHeader.vue'
import Aside from '../components/Aside.vue'
import CatelogCard from '../components/CatelogCard.vue'
import ReadPanel from '../components/ReadPanel.vue'
import CommentCard from "@/components/CommentCard";
export default {
    name: 'Read',
    components: {
        MyHeader,
        Aside,
        CatelogCard,
        ReadPanel,
        Comment,
        CommentCard
    },
    mounted() {
        //页面创建时请求文章数据
        this.$http.get("article/findById?articleId=" + this.$route.query.id).then(
            response => {
                this.article = response.data.data;
                if(this.article === null){
                    this.$router.push({
                        name:'not_found'
                    })
                }
            }, error => {
            }
        )

    },
    data() {
        return {
            article: {}
        }
    },
}
</script>

<style scoped>
.comment{
    width: 100%;
}
.el-container {
    height: auto;
}

.main_page {
    height: 100%;
}

.el-header {
    padding-left: 0px;
    padding-right: 0px;
}

.el-aside {
    height: auto;
    width: 400px !important;
}

.el-main {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
