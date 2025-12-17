<template>
<div>
    <form>
        <label for="">用户名</label>
        <input type="text" name="name" v-model="name">
        <br>
        <label for="">密码&emsp;</label>
        <input type="text" name="pwd" v-model="pwd">
        <br>
        <input type="button" @click="submit" value="登录">
    </form>
</div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
          name:'hello',
          pwd:'world'
        }
    },
    methods: {
        submit(){
            let user = {
                username:this.name,
                password:this.pwd
            }
            this.$http.post('/user/user/login',user).then(
                resp => {
                    console.log(resp.data);
                    if(resp.data.code === 100){
                        //登录成功
                        //将用户登录信息保存到localStorage中
                        window.localStorage.setItem('userInfo',JSON.stringify(resp.data.data.user));
                        this.$router.push({
                            path:'/'
                        });

                    }else{
                        //登录失败
                    }
                }
            )
        }
    }
}
</script>

<style>

</style>
