<template>
  <div id="app">
    <router-view v-if="isRresh"></router-view>
  </div>
</template>

<script>
export default {
    name: 'App',
    data: ()=>({
        isRresh: true
    }),
    provide() {
        return {
            refresh: this.refresh
        }
    },
    methods: {
        refresh() {
            this.isRresh = false;
            this.$nextTick(() => {
                this.isRresh = true;
            })
        }
    }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

/* 文件分隔线样式 */
.file-separator {
  width: 100%;
  height: 1px;
  background-color: #e2e8f0;
  margin: 24px 0;
  transition: all 0.3s ease;
  position: relative;
}

.file-separator:hover {
  background-color: #4361ee;
  height: 2px;
  box-shadow: 0 0 8px rgba(67, 97, 238, 0.3);
}
</style>
