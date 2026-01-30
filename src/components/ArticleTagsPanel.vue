<template>
    <div class="main">
        <!-- 主要是标签卡片，用来展示文章标签 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>标签</span>
            </div>
            <div class="all">
                <div v-for="(item,index) in this.tags" @click="getTags(item)" :key="index" class="items">
                    <span>
                        {{item.tagName}}
                    </span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "ArticleTagsPanel",
    mounted() {
        //获取所有标签
        this.$http.get('tag/findAllTags').then(
            resp => {
                this.tags = resp.data.data;
                console.log(resp.data);
                
            }
        );
    },
    methods:{
        getTags(item){
            if(this.clicked){
                this.clicked = false;
                this.$router.push({
                    name:'blog'
                })
            }else{
                this.clicked = true;
                this.$router.push({
                    path:'/blog',
                    query:{
                        tag:item
                    }
                })

            }
        }
    },
    data(){
        return {
            tags:[],
            clicked:false
        }
    }
}
</script>

<style scoped lang="less">
.main{
    margin-top: 5px;
    width: 95%;
}
.all{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.items{
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 28px;
    margin-bottom: 4px;
    background-color: bisque;
    cursor: pointer;
}
.items :hover{
    color: deepskyblue;

}
</style>