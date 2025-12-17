<template>
<div class="panel">
<!--    阅读面板-->
    <div class="title">{{article.title}}</div>
    <div class="editor">
        <mavon-editor v-model="article.content"
                      code-style="github"
                      :subfield="false"
                      font-size="19px"
                      :toolbarsFlag="false"
                      defaultOpen="preview" ref="md"/>
    </div>
    <operate class="opearte" :aid="article.id"></operate>
    <comment-area class="comment-area" :article_id="article.id"></comment-area>
</div>
</template>

<script>
import Operate from "@/components/Operate";
import CommentArea from "@/components/CommentArea";
export default {
    name: 'ReadPanel',
    props: ['article'],
    components:{
        Operate,
        CommentArea
    },
    methods:{
        getContent(){
          const s = this.$refs.md.d_value;
        }
    },
    data() {
        return {
        }
    }

}
</script>

<style>
.title{
    font-size: 29px;
    font-weight: bold;
    margin-bottom: 10px;
}
.panel {
    width: 100%;
    height: 100%;
}
.editor{
    margin-left: 3px;
}
.content {
    width: 100%;
    background-color: aqua;
    text-align: left;
    word-break: break-all;
}
.opearte{
    margin-top: 10px;
}
.comment-area{
    margin-bottom: 20px;
}
</style>
