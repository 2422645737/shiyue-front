<template>
<div class="main">
    <template v-if="hasArticles">
        <Card v-for="(item,index) in articles" :key="index" :article="item"></Card>
        <el-pagination
            v-show="showPagination"
            background
            layout="prev, pager, next"
            :total="pageInfo.total"
            :page-size="pageInfo.size"
            :current-page="pageInfo.current"
            @current-change="current_change"
        >
        </el-pagination>
    </template>
    <template v-else>
        <el-empty :description="emptyText"></el-empty>
    </template>
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
    computed: {
        hasArticles() {
            return Array.isArray(this.articles) && this.articles.length > 0;
        },
        showPagination() {
            return this.pageInfo.total > this.pageInfo.size;
        },
        emptyText() {
            const query = this.$route.query || {};
            if (query.tagId !== undefined && query.tagId !== null && query.tagId !== "") {
                return "该标签下暂无文章";
            }
            if (query.tag_id !== undefined && query.tag_id !== null && query.tag_id !== "") {
                return "该标签下暂无文章";
            }
            if (query.class_id !== undefined && query.class_id !== null && query.class_id !== "") {
                return "该分类下暂无文章";
            }
            return "暂无文章";
        }
    },
    components: {
        Card
    },
    methods: {
        getPage(current, size, queryOverride) {
            const query = queryOverride || this.$route.query || {};
            const classId = query.class_id;
            const tagId = query.tagId ?? query.tag_id ?? query.tagID;

            let url = "";
            if (tagId !== undefined && tagId !== null && tagId !== "") {
                url =
                    "tag/findArticlesByTagId?" +
                    "tagId=" + encodeURIComponent(tagId) +
                    "&pageNum=" + encodeURIComponent(current) +
                    "&pageSize=" + encodeURIComponent(size);
            } else {
                url = "article/findByClassId?";
                if (classId !== undefined && classId !== null && classId !== "") {
                    url += "classId=" + encodeURIComponent(classId) + "&";
                }
                url += "current=" + current + "&size=" + size;
            }

            this.$http.get(url).then(
                response => {
                    const payload = response?.data?.data;
                    let list = [];
                    let total = 0;

                    if (Array.isArray(payload)) {
                        list = payload;
                        total = payload.length;
                    } else if (payload && typeof payload === "object") {
                        if (Array.isArray(payload.records)) list = payload.records;
                        else if (Array.isArray(payload.list)) list = payload.list;
                        else if (Array.isArray(payload.articles)) list = payload.articles;
                        else if (payload.articles && Array.isArray(payload.articles.records)) list = payload.articles.records;

                        total =
                            Number(payload.total) ||
                            Number(payload?.articles?.total) ||
                            list.length;

                        if (payload.pageNum !== undefined && payload.pageNum !== null && payload.pageNum !== "") {
                            this.pageInfo.current = Number(payload.pageNum) || current;
                        }
                        if (payload.pageSize !== undefined && payload.pageSize !== null && payload.pageSize !== "") {
                            this.pageInfo.size = Number(payload.pageSize) || size;
                        }
                    }

                    this.articles = list;
                    this.pageInfo.total = total;
                }
            )
        },
        current_change(val) { //页面跳转事件
            this.pageInfo.current = val;
            this.getPage(val,this.pageInfo.size);
        }

    },
    beforeRouteUpdate(to,from,next){
        next();
        this.pageInfo.current = 1;
        this.getPage(this.pageInfo.current,this.pageInfo.size, to.query);
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
