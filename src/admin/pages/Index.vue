<template>
<div class="main">
<!--    这里是我后台主页-->
    <el-container>
        <el-header>
            <welcome-header></welcome-header>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <aside-tool></aside-tool>
            </el-aside>
            <el-container>
                <el-main>

                </el-main>
            </el-container>
        </el-container>
    </el-container>
</div>
</template>

<script>
import Write from "@/admin/pages/WriteBlog";
import WelcomeHeader from "@/admin/components/WelcomeHeader";
import AsideTool from "@/admin/components/AsideTool";
export default {
    components:{Write,WelcomeHeader,AsideTool},
    data() {
        return {

        }
    }
}
</script>

<style scoped>
.main{
    height: 100%;
}
.el-header{
    background-color: red;
}
.el-aside{
    background-color: pink;
}
.el-main{
    background-color: aqua;
}
.el-container{
    height: 100%;
}
</style>
