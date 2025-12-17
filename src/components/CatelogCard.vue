<template>
<div class="catelog">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{article.title}}</span>
        </div>
    </el-card>
</div>
</template>

<script>
export default {
    name: 'CatelogCard',
    props:['article'],
    data() {
        return {

        }
    },


}
</script>

<style scoped>
.catelog{
    margin-top: 5px;
    position: fixed;
    width: 400px;
}
.box-card{
    margin-top: 70px;
    margin-left: 20px;
}
</style>
