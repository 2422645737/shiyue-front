<template>
    <div class="class-bar">
        <div class="bar-title">博客目录</div>
        <div class="bar-scroll">
            <div class="bar-list">
                <div
                    v-for="(item, index) in classData"
                    :key="getItemId(item) || index"
                    class="bar-item"
                    :class="{ 'is-active': isSameId(currentId, getItemId(item)) }"
                    :style="itemStyle"
                    @click="getClass(item)"
                >
                    <span class="name">{{ item.className }}</span>
                    <span class="count">({{ item.count }})</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ArticleClassPanel",
    created() {
        this.fetchClasses();
    },
    computed: {
        itemStyle() {
            const count = this.classData.length;
            if (count <= 6) {
                return {
                    flex: "1 1 0",
                    minWidth: "120px"
                };
            }
            return {
                flex: "0 0 160px"
            };
        }
    },
    methods:{
        fetchClasses() {
            this.$http.get("class/findAllClass").then(response => {
                const payload = response?.data?.data;
                let list = [];
                if (Array.isArray(payload)) {
                    list = payload;
                } else if (payload && typeof payload === "object") {
                    if (Array.isArray(payload.records)) list = payload.records;
                    else if (Array.isArray(payload.list)) list = payload.list;
                    else if (Array.isArray(payload.data)) list = payload.data;
                }
                this.classData = list;
                this.syncCurrentFromRoute();
                this.ensureDefaultSelected();
            })
        },
        ensureDefaultSelected() {
            const route = this.$route || {};
            const path = route.path || "";
            const query = route.query || {};

            if (!(path === "/" || path.startsWith("/blog"))) return;
            if (query.class_id !== undefined && query.class_id !== null && query.class_id !== "") return;
            if (query.title !== undefined && query.title !== null && query.title !== "") return;
            if (query.tag !== undefined && query.tag !== null && query.tag !== "") return;
            if (query.tagId !== undefined && query.tagId !== null && query.tagId !== "") return;
            if (query.tag_id !== undefined && query.tag_id !== null && query.tag_id !== "") return;
            if (!Array.isArray(this.classData) || this.classData.length === 0) return;

            const firstId = this.getItemId(this.classData[0]);
            if (firstId === undefined || firstId === null || firstId === "") return;

            this.currentId = firstId;
            this.$router.replace({
                path: "/blog",
                query: {
                    ...query,
                    class_id: firstId
                }
            })
        },
        getItemId(item) {
            if (!item) return undefined;
            return item.id ?? item.classId ?? item.class_id ?? item.classID ?? item.classid;
        },
        syncCurrentFromRoute() {
            const route = this.$route || {};
            const query = route.query || {};
            const classId = query.class_id;
            if (classId === undefined || classId === null || classId === "") {
                this.currentId = -1;
                return;
            }
            this.currentId = classId;
        },
        isSameId(a, b) {
            return String(a) === String(b);
        },
        //处理分类点击事件
        getClass(item){
            const selectedId = this.getItemId(item);
            if (selectedId === undefined || selectedId === null || selectedId === "") return;
            //点击之后，需要界面重新加载Main窗口
            if(this.isSameId(this.currentId, selectedId)){
                //如果当前分类已经被选中过了，则取消当前分类的选择，改为全部文章
                this.currentId = -1;    //清空currentId，代表重新开始选择
                this.$router.push({
                    path:'/blog'
                })
            }else{
                this.currentId = selectedId;
                this.$router.push({
                    path:'/blog',
                    query:{
                        class_id:selectedId
                    }
                })
            }
        }
    },
    watch: {
        "$route.query.class_id"() {
            this.syncCurrentFromRoute();
        }
    },
    data(){
        return {
            classData:[],
            currentId:-1
        }
    }
}
</script>

<style scoped lang="less">
.class-bar{
    width: 100%;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.bar-title{
    flex: 0 0 auto;
    font-size: 14px;
    font-weight: 700;
    color: #303133;
    letter-spacing: 1px;
    white-space: nowrap;
}

.bar-scroll{
    flex: 1 1 auto;
    overflow-x: auto;
    overflow-y: hidden;
}

.bar-scroll::-webkit-scrollbar{
    height: 6px;
}
.bar-scroll::-webkit-scrollbar-thumb{
    background: rgba(0, 0, 0, 0.12);
    border-radius: 10px;
}

.bar-list{
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 100%;
}

.bar-item{
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
}

.bar-item:hover{
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
    border-color: rgba(64, 158, 255, 0.35);
}

.bar-item.is-active{
    background: linear-gradient(180deg, #ecf5ff 0%, #e6f0ff 100%);
    border-color: rgba(64, 158, 255, 0.45);
    box-shadow: 0 10px 24px rgba(64, 158, 255, 0.22);
    color: #409eff;
}

.name{
    font-size: 13px;
    font-weight: 600;
}

.count{
    font-size: 12px;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .class-bar{
        border-radius: 8px;
        padding: 8px 10px;
        gap: 10px;
    }
    .bar-item{
        padding: 7px 9px;
        border-radius: 9px;
    }
}
</style>
