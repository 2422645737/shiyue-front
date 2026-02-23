import VueRouter from "vue-router";

import Read from '../pages/Read.vue'
import Index from '../pages/Index.vue'
import AdminIndex from '../admin/pages/Index'
import Main from "@/components/Main";
import Login from "@/pages/Login"
import WriteBlog from "@/admin/pages/WriteBlog";
import NotFound from "@/pages/NotFound";
import Music from "@/pages/Music";
import Todo from "@/pages/Todo";
export default new VueRouter({
    mode:'history',
    routes:[
        {
            // 主路由
            path:'/',
            component:Index,
            children:[
                {
                    name:'blog',
                    path:'blog',
                    component:Main
                },
            ]
        },
        {
            name:'todo',
            path:'/todo',
            component:Todo
        },
        {
            name:'music',
            path:'/music',
            component:Music
        },
        {
            //阅读页面路由
            name:'read',
            path:'/read',
            component:Read
        },
        {
            //阅读页面路由
            name:'write',
            path:'/write',
            component:WriteBlog
        },
        {
            name:'admin',
            path:'/admin',
            component:AdminIndex
        },
        {
            name:'not_found',
            path:'/not_found',
            component:NotFound

        },
        {
            name:'login',
            path:'/login',
            component:Login
        }
    ]
})
