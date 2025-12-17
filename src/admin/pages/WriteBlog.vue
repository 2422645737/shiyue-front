<template>
<!--    这是我写博客的地方-->
    <div>
        <div class="header">
            写文章
        </div>
        <div class="title">
            <div class="title_label">标题</div>
            <el-input v-model="article.title" placeholder="请输入标题"></el-input>
        </div>
        <div class="editor">
            <div style="text-align: left">内容</div>
            <mavon-editor v-model="article.content"
                          code-style="github"
                          :subfield="true"
                          font-size="19px"
                          :toolbarsFlag="true"
                          defaultOpen="preview" ref="md"/>

            <div class="type">
                <div>
                    文章分类:
                </div>
                <el-select v-model="article.class_name" placeholder="请选择" @change="set_class">
                    <el-option
                        v-for="item in article_class"
                        :key="item.id"
                        :label="item.class_name"
                        :value="item.class_name">
                    </el-option>
                </el-select>
<!--                添加分类功能-->
                <el-button style="margin-left: 20px" @click="add_class_dialog = true" type="primary" icon="el-icon-circle-plus-outline">添加分类</el-button>
                <el-dialog title="添加分类" :visible.sync="add_class_dialog">
                    <el-form :model="add_class_name">
                        <el-form-item label="新增分类名称">
                            <el-input v-model="add_class_name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="add_class_dialog = false">取 消</el-button>
                        <el-button type="primary" @click="add_class">确 定</el-button>
                    </div>
                </el-dialog>
            </div>

            <div class="tags">
                标签:
                <el-select
                    v-model="tags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择文章标签" @change="add_tags">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="buttons">
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "WriteBlog",
    data(){
        return{
            //标签暂时写死了，后期改动再说
            options: [{
                value: 'Java',
                label: 'Java'
            }, {
                value: 'Vue',
                label: 'Vue'
            }, {
                value: '栈',
                label: '栈'
            }],
            tags: [],
            add_class_dialog:false,         //控制添加分类的窗口是否显示
            add_class_name:'',                 //添加的分类名称
            article:{
                content:'hello world',
                title:'测试标题',
                publish_time:'',
                type:'blog',
                summary:'测试摘要',
                quantity:0,
                class_name:'',
                tags:[],
                cover:'https://gd-hbimg.huaban.com/f8e4669b1681703ac5697a119ef51e17f7d0872f551e8c-bT5Ut8',
            },
            article_class:[],        //从后台获取到的所有分类
        }
    },
    methods:{
        add_tags(){
            this.article.tags = this.tags;
        },
        add_class(){
            //添加分类功能
            if(this.add_class_name === null || this.add_class_name.split(" ").join("").length === 0 || this.add_class_name === undefined){
                //啥也不干
            }
            else{
                this.$http.post('class/class/save',{class_name:this.add_class_name}).then(
                    resp => {
                    }
                )
            }

        },
        set_class(value){      //分类选择事件
            this.article.class_name = value;
        },
        save(){//保存文章
            let time = new Date();
            this.article.publish_time = this.getTime();
            console.log('封装好的文章如下：' + JSON.stringify(this.article))
            this.$http.post('article/article/save',this.article).then(
                resp => {
                }
            )
        },
    },
    mounted() {
        //页面创建的时候，应该获取系统所有的分类，方便用户选择
        this.$http.get('class/class/count').then(
            resp => {
                this.article_class = resp.data.data.class;
            }
        )
    }
}
</script>

<style scoped lang="less">
.tags{
    display: flex;
    justify-content: left;
    align-items: center;
}
.type{
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: left;
    margin-bottom: 10px;
}
.title_label{
    text-align: left;
    margin-bottom: 5px;
}
.title{
    margin: 20px 6px;
}
.el-input{
}
.buttons{
    display: flex;

}
.header{
    background-color: red;
    text-align: left;
}
.editor{
    background-color: pink;
}
</style>