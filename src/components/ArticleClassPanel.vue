<template>
    <div class="main">
        <!-- 主要是目录卡片，用来展示分类目录 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>博客目录</span>
            </div>
            <div class="all">
                <div v-for="(item,index) in this.classData" @click="getClass(item)" :key="index" class="items">
                    <span>
                        {{item.className}}（{{item.count}}）
                    </span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "ArticleClassPanel",
    created() {
        this.$http.get("class/findAllClass").then(
            response => {
                this.classData = response.data.data;
            },
        )
    },
    methods:{
        //处理分类点击事件
        getClass(item){
            //点击之后，需要界面重新加载Main窗口
            if(this.currentId === item.id){
                //如果当前分类已经被选中过了，则取消当前分类的选择，改为全部文章
                this.currentId = -1;    //清空currentId，代表重新开始选择
                this.$router.push({
                    path:'/blog'
                })
            }else{
                this.currentId = item.id;
                this.$router.push({
                    path:'/blog',
                    query:{
                        class_id:item.id
                    }
                })
            }
        }
    },
    data(){
        return {
            classData:[],
            currentId:-1
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