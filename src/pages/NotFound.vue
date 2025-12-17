<template>
<div class="main">
    <div>
        您要找的页面不存在哦
    </div>
    <button @click="returnHome">返回首页</button>
</div>
</template>

<script>
export default {
    name: "NotFound",
    methods:{
        returnHome(){
            this.$router.push({
                name:"blog"
            })
        }
    }
}
</script>

<style scoped>
.main{
    display: flex;
    flex-direction: column;
}
</style>