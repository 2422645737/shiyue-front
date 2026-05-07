<template>
    <div class="main">
        <!-- 主要是标签卡片，用来展示文章标签 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>标签</span>
            </div>
            <div class="all">
                <div
                    v-for="(item,index) in this.tags"
                    :key="index"
                    :class="['items', { active: String(getItemTagId(item)) === String(currentTagId) }]"
                    @click="getTags(item)"
                >
                    <span>
                        {{item.tagName}}
                    </span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "ArticleTagsPanel",
    mounted() {
        this.syncCurrentFromRoute();
        this.retryTimes = 0;
        this.scheduleFetch();
    },
    beforeDestroy() {
        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = null;
        }
    },
    methods:{
        syncCurrentFromRoute() {
            const query = this.$route?.query || {};
            const tagId = query.tagId ?? query.tag_id ?? query.tagID;
            if (tagId === undefined || tagId === null || tagId === "") {
                this.currentTagId = null;
                return;
            }
            this.currentTagId = tagId;
        },
        getItemTagId(item) {
            if (!item) return undefined;
            return item.tagId ?? item.id ?? item.tag_id ?? item.tagID;
        },
        buildQueryWithoutTag(query) {
            const cleaned = { ...(query || {}) };
            delete cleaned.tagId;
            delete cleaned.tag_id;
            delete cleaned.tagID;
            delete cleaned.tagName;
            delete cleaned.tag_name;
            delete cleaned.tag;
            return cleaned;
        },
        getActiveClassId() {
            const query = this.$route.query || {};
            return query.class_id;
        },
        scheduleFetch() {
            const route = this.$route || {};
            const path = route.path || "";
            if (!path.startsWith("/blog")) return;

            const classId = this.getActiveClassId();
            if (classId !== undefined && classId !== null && classId !== "") {
                this.fetchTagsByClass(classId);
                return;
            }

            if (this.retryTimes < 20) {
                this.retryTimes += 1;
                this.retryTimer = setTimeout(() => {
                    this.scheduleFetch();
                }, 50);
                return;
            }

            this.fetchTagsByClass();
        },
        fetchTagsByClass(classId) {
            let url = "tag/findAllTags";
            if (classId !== undefined && classId !== null && classId !== "") {
                url += "?classId=" + encodeURIComponent(classId);
            }
            this.$http.get(url).then(resp => {
                this.tags = resp.data.data || [];
            });
        },
        getTags(item){
            const selectedId = this.getItemTagId(item);
            if (selectedId === undefined || selectedId === null || selectedId === "") return;

            const query = this.$route?.query || {};
            const nextQueryBase = this.buildQueryWithoutTag(query);

            if (String(this.currentTagId) === String(selectedId)) {
                this.currentTagId = null;
                this.$router.push({
                    path: "/blog",
                    query: nextQueryBase
                });
                return;
            }

            this.currentTagId = selectedId;
            this.$router.push({
                path: "/blog",
                query: {
                    ...nextQueryBase,
                    tagId: selectedId,
                    tagName: item?.tagName
                }
            });
        }
    },
    watch: {
        "$route.query.class_id"() {
            this.syncCurrentFromRoute();
            this.retryTimes = 0;
            this.scheduleFetch();
        },
        "$route.query.tagId"() {
            this.syncCurrentFromRoute();
        },
        "$route.query.tag_id"() {
            this.syncCurrentFromRoute();
        }
    },
    data(){
        return {
            tags:[],
            currentTagId: null,
            retryTimes: 0,
            retryTimer: null
        }
    }
}
</script>

<style scoped lang="less">
.main {
    margin-top: 8px;
    width: 95%;
}

/deep/ .box-card.el-card {
    border: 1px solid rgba(17, 24, 39, 0.06);
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
    transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease;
    overflow: hidden;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
}

/deep/ .box-card.el-card:hover {
    border-color: rgba(17, 24, 39, 0.10);
    box-shadow: 0 14px 34px rgba(17, 24, 39, 0.14);
    transform: translateY(-2px);
}

/deep/ .box-card .el-card__header {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(17, 24, 39, 0.06);
    background: linear-gradient(180deg, rgba(2, 132, 199, 0.08) 0%, rgba(2, 132, 199, 0.00) 100%);
}

/deep/ .box-card .el-card__header span {
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #0f172a;
}

.all {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 6px 2px 2px;
}

.items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 34px;
    padding: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
    border: 1px solid rgba(17, 24, 39, 0.06);
    box-shadow: 0 8px 16px rgba(17, 24, 39, 0.08);
    transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease, border-color 200ms ease, color 200ms ease;
}

.items span {
    color: #111827;
    font-size: 13px;
    line-height: 18px;
}

.items:hover {
    transform: translateY(-1px) translateX(2px);
    border-color: rgba(2, 132, 199, 0.25);
    background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
    box-shadow: 0 14px 26px rgba(2, 132, 199, 0.18);
}

.items.active {
    background: linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%);
    border-color: rgba(2, 132, 199, 0.35);
    box-shadow: 0 14px 28px rgba(2, 132, 199, 0.22);
}

.items.active span {
    color: #0b3b63;
    font-weight: 600;
}
</style>
