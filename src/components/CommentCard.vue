<template>
<!--    每一条评论的面板，用来显示每一条评论-->
    <div>
        <el-card class="box-card">
            <div class="main">
                <div class="avatar">
                    <img :src="this.parentUserInfo.avatar" class="parent_avatar" alt="">
                </div>
                <div class="comment">
                    <div class="user-info">
                        {{comment.username}}
                    </div>
                    <div class="rightBox">
                        <pre class="c_content">{{comment.content}}</pre>
                    </div>
                    <div class="other-info">
                        <div class="comment_time">{{comment.comment_time}}</div>
                        <div class="like_num">点赞数:{{comment.like_num}}</div>
                    </div>

<!--                    子评论区-->
                    <div class="sub-comment" v-show="comment !== null && comment.commentList !== null && comment.commentList.length !== 0">
                        <div v-for="(item,index) in comment.commentList" :key="index" class="sub-comment-card">
                            <div class="sub-haha">
                                <div class="sub-avatar">
                                    <img src="https://img0.baidu.com/it/u=3025041392,479110289&fm=253&fmt=auto&app=138&f=JPEG?w=632&h=500" class="sub-avatar-img" alt="">
                                </div>

                                <div class="sub-user-info">
                                    <div class="sub-username">
                                        {{item.username}}
                                    </div>
                                    <div class="sub-content">
                                        <pre class="c_content">{{item.content}}</pre>
                                    </div>
                                    <div class="other-info" style="margin-left: 0px;margin-top: 4px;margin-bottom: 5px">
                                        <div class="comment_time">{{comment.comment_time}}</div>
                                        <div class="like_num">点赞数:{{comment.like_num}}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>

export default {
    name: "CommentCard",
    props:['comment'],
    data(){
        return {
            parentUserInfo:{}
        }
    },
    mounted() {
        //根据所有评论中的user_id获取用户头像
        let user_id = this.comment.user_id;
        let url = '/user/user/info/' + user_id;
        this.$http.get(url).then(
            resp => {
                this.parentUserInfo = resp.data.data.userInfo;
            }
        )
    }

}
</script>

<style scoped>
.sub-haha{
    display: flex;

}
.c_content{
    all: initial;
    padding-top: 0px;
    height: auto;
    /*display:block; !*设置布局流，避免换行导致的错误布局*!*/
    white-space:pre-line; /*保留换行符，设置溢出换行*/
    font-size: 17px;
    letter-spacing: 1px;
    text-align: left;
    flex-wrap: nowrap;
    width: 100%;
}
.avatar{
    margin-right: 7px;
}
.parent_avatar{
    box-shadow: 3px 3px 13px 3px #c1c0c0;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-right: 15px;
}
.other-info{
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    justify-content:left;
    align-items: center;
}
/*评论时间*/
.comment_time{
    margin-right: 40px;
    font-size: 16px;
    color: gray;
}

/*点赞数量*/
.like_num{
    font-size: 16px;
    color:gray;
}

.sub-user-info{
    display: flex;
    flex-direction: column;
    width: 100%;
}
.sub-avatar{
    margin-right: 17px;

}
.sub-avatar-img{
    margin-left: 6px;
    margin-right: 3px;
    margin-top: 5px;
    box-shadow: 1px 1px 9px 3px #d2d2d4;
    width: 70px;
    height: 70px;
    border-radius: 35px;
}
.sub-username{
    text-align: left;
    margin-bottom: 5px;
    margin-top: 5px;
    font-weight: bold;
    width: 100%;
}
.sub-content{
    text-align: left;
    margin-bottom: 6px;
}
.sub-comment-card{
    margin-bottom: 7px;
    margin-top: 7px;
    box-shadow: 1px 1px 10px 1px #e9e9ee;
}

/*用户消息*/
.user-info{
    color: #4848e5;
    letter-spacing: 1px;
    font-size: 16px;
    text-align: left;
    font-weight: bold;
    margin-bottom: 6px;
    margin-left: 10px;
}
.box-card{
    margin-bottom: 4px;
}
/*评论内容*/
.rightBox{
    width: 100%;
    height: auto;
    /*background-color: deepskyblue;*/
    /*box-shadow: 1px 1px 18px 2PX #f6f4f4;*/
    /*border: 1px solid whitesmoke;*/
    padding-left: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
    text-align: left;
    margin-bottom: 7px;
    margin-top: 6px;
}

.comment{
    display: flex;
    flex-direction: column;
    width: 100%;
}
.main{
    display: flex;
    flex-direction: row;
}
.sub-comment{
    background-color: #f8f8f8;
    margin-top: 15px;
    margin-left: 10px;
}
</style>