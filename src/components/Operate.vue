<template>
  <div class="operate">
      <el-button @click="like">{{likeString}}</el-button>
      <el-button @click="collect">收藏</el-button>
  </div>
</template>

<script>
export default {
    name:"operate",
    props:['aid'],
    data(){
        return {
            myAid:'',
            uid:1,
            liked:false,    //用户是否点赞了该文章
            collected:false,
            likeString:'点赞'
        }
    },
    watch:{
        aid : {
            handler(newValue,oldValue){
                this.myAid = newValue;
                if(newValue !== undefined){
                    this.$http.get('/article/article/has_like?aid=' + newValue + '&uid=' + this.uid).then(
                        resp => {
                            this.liked = resp.data.flag;
                            if(this.liked === true)this.likeString = '取消点赞'
                            else this.likeString = '点赞'
                        },
                    );
                }
            },
        }
    },
    mounted() {
    },
    methods:{
        //刷新两个按钮的状态
        refresh(){
            this.$http.get('/article/article/has_like?aid=' + this.myAid + '&uid=' + this.uid).then(
                resp => {
                    this.liked = resp.data.flag;
                    if(this.liked === true)this.likeString = '取消点赞'
                    else this.likeString = '点赞'
                },
            );

        },
        //点赞
        like(){
            this.$http.post('article/article/like?aid=' + this.myAid + '&uid=' + this.uid).then(
                resp => {

                    this.refresh();
                }
            )

        },

        //收藏
        collect(){

        }
    }
}
</script>

<style>
.operate{
}
</style>