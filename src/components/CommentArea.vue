<template>
    <div class="main">
        <div class="comment-area">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 2}"
                placeholder="请输入内容"
                resize="none"
                v-model="comment_content">
            </el-input>
            <el-button type="primary" @click="comment">评论</el-button>
        </div>
        <div>
            <div class="comment">
                <comment-card v-for="(item,index) in comments" :key="index" :comment="item"></comment-card>
            </div>
        </div>

    </div>
</template>

<script>
import CommentCard from "@/components/CommentCard";
export default {
    inject:['refresh'],
    name: "CommentArea",
    components:{CommentCard},
    props:['article_id'],
    watch:{
        article_id:{
            handler(newVal){
                this.aid = newVal;
                this.$http.get('article/comment/aid/' + newVal).then(
                    resp => {
                        this.comments = resp.data.data.comment;
                    }
                );
            }
        }
    },
    data(){
        return {
            comment_content:'',
            comments:[],           //所有评论
            aid:''
        }
    },
    mounted() {
    },
    methods:{
        comment(){
            if(this.comment_content === null || this.comment_content === undefined || this.comment_content.split(" ").join("").length === 0){
                return;
            }
            //完成用户评论功能
            let current_user_id = 1;
            let cmt = {
                article_id:this.article_id,
                user_id: current_user_id,
                comment_time:this.getTime(),
                content:this.comment_content,
                parent_id:'',
                like_num:0
            }
            let url = 'comment/comment/comment';
            this.$http.post(url,cmt).then(
                resp => {
                    //刷新评论区
                    this.$http.get('article/comment/aid/' + this.aid).then(
                        resp => {
                            this.comments = resp.data.data.comment;
                        }
                    );
                    this.comment_content = ''
                    if(resp.data.flag === true){
                        this.$message.success("评论成功");
                    }else{
                    }
                }
            )
        }

    }
}
</script>

<style scoped>
.comment{
    width: 100%;
}
.main{
    display: flex;
    flex-direction: column;
}
.comment-area{
    display: flex;

    width: 100%;
    margin-bottom: 20px;
    margin-top: 20px;
}
.el-button{
    margin-left: 10px;
}
</style>