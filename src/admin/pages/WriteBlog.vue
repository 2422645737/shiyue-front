<template>
  <div class="document-manager-container">
    <!-- 主布局容器 -->
    <div class="main-layout">
      <!-- 左侧目录导航面板 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">
            <i class="el-icon-folder"></i>
            文档管理
          </h2>
        </div>
        <div class="sidebar-content">
          <el-tree
            :data="catalogTree"
            node-key="id"
            default-expand-all
            @node-click="handleCatalogSelect"
            :class="['custom-catalog-tree']"
            :expand-on-click-node="false"
            @node-contextmenu="handleNodeContextMenu"
          >
            <template slot-scope="{ node, data }">
              <span class="tree-node-content">
                <i :class="['el-icon', data.children ? 'el-icon-folder' : 'el-icon-document']"></i>
                <span :class="['node-text', { 'selected-node': selectedCatalogId === data.id }]">
                  {{ node.label }}
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧文章编辑区域 -->
      <div class="editor-panel">
        <!-- 顶部编辑工具栏 -->
        <div class="editor-header">
          <div class="title-section">
            <el-input 
              v-model="article.title" 
              placeholder="请输入文章标题"
              :class="['title-input', { 'focused': titleFocused }]"
              @focus="titleFocused = true"
              @blur="titleFocused = false"
            ></el-input>
          </div>
          <div class="meta-section">
            <div class="meta-item">
              <label class="meta-label">分类</label>
              <el-select 
                v-model="article.class_name" 
                placeholder="请选择分类" 
                @change="set_class"
                :class="['custom-select', 'inline-select']"
                size="small"
              >
                <el-option
                  v-for="item in article_class"
                  :key="item.id"
                  :label="item.className"
                  :value="item.className"
                ></el-option>
              </el-select>
              <el-button 
                @click="add_class_dialog = true" 
                type="primary" 
                size="small"
                :class="['custom-button', 'inline-button']"
              >
                新建
              </el-button>
            </div>
            <div class="meta-item">
              <label class="meta-label">标签</label>
              <el-select
                v-model="tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择或创建标签"
                @change="add_tags"
                :class="['custom-select', 'inline-select', 'tags-select']"
                :loading="loading.tags"
                :disabled="loading.tags"
                size="small"
              >
                <template v-if="loading.tags">
                  <el-option label="加载中..." value=""></el-option>
                </template>
                <template v-else-if="error.tags">
                  <el-option label="加载失败，请刷新重试" value=""></el-option>
                </template>
                <template v-else>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </template>
              </el-select>
              <el-button 
                @click="add_tag_dialog = true" 
                type="primary" 
                size="small"
                :class="['custom-button', 'inline-button']"
              >
                新建
              </el-button>
            </div>
          </div>
        </div>

        <!-- 内容编辑区域 -->
        <div class="content-section">
          <div class="editor-container">
            <mavon-editor 
              v-model="article.content"
              code-style="github"
              :subfield="true"
              font-size="16px"
              :toolbarsFlag="true"
              defaultOpen="preview"
              ref="md"
              :class="['mavon-editor-custom']"
            />
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="editor-footer">
          <el-button 
            type="default" 
            @click="saveAsDraft"
            :class="['custom-button', 'action-button', 'draft-button']"
            :loading="saving"
            :disabled="saving"
          >
            <i class="el-icon-document"></i>
            保存为草稿
          </el-button>
          <el-button 
            type="primary" 
            @click="publishArticle"
            :class="['custom-button', 'action-button', 'publish-button']"
            :loading="saving"
            :disabled="saving"
          >
            <i class="el-icon-send"></i>
            发布
          </el-button>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div v-if="contextMenuVisible" :style="contextMenuStyle" class="context-menu">
      <ul>
        <li @click="createNewArticle">
          <i class="el-icon-plus"></i>
          新建文章
        </li>
        <li @click="createNewFolder">
          <i class="el-icon-folder-add"></i>
          新建文件夹
        </li>
      </ul>
    </div>

    <!-- 添加分类对话框 -->
    <el-dialog 
      title="添加分类" 
      :visible.sync="add_class_dialog"
      :class="['custom-dialog']"
      width="500px"
    >
      <el-form :model="add_class_name">
        <el-form-item label="分类名称">
          <el-input 
            v-model="add_class_name" 
            placeholder="请输入分类名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_class_dialog = false" :class="['custom-button']">取 消</el-button>
        <el-button type="primary" @click="add_class" :class="['custom-button']">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加标签对话框 -->
    <el-dialog 
      title="添加标签" 
      :visible.sync="add_tag_dialog"
      :class="['custom-dialog']"
      width="500px"
    >
      <el-form :model="add_tag_name">
        <el-form-item label="标签名称">
          <el-input 
            v-model="add_tag_name" 
            placeholder="请输入标签名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_tag_dialog = false" :class="['custom-button']">取 消</el-button>
        <el-button type="primary" @click="add_tag" :class="['custom-button']">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 文件分隔线 -->
    <div class="file-separator"></div>
  </div>
</template>

<script>
export default {
    name: "WriteBlog",
    data(){
        return{
            // 标签数据
            options: [],
            tags: [],
            // 加载状态
            loading: {
                tags: false
            },
            // 错误状态
            error: {
                tags: ''
            },
            // 数据缓存
            cachedData: {
                tags: null
            },
            // 对话框状态
            add_class_dialog:false,         //控制添加分类的窗口是否显示
            add_tag_dialog:false,           //控制添加标签的窗口是否显示
            add_class_name:'',                 //添加的分类名称
            add_tag_name:'',                   //添加的标签名称
            titleFocused: false,              //标题输入框焦点状态
            saving: false,                     //保存状态
            // 目录树相关
            catalogTree: [],                    //目录树数据
            selectedCatalogId: null,           //选中的目录id
            // 右键菜单相关
            contextMenuVisible: false,         //右键菜单是否可见
            contextMenuStyle: {},              //右键菜单位置
            selectedNode: null,                //当前选中的节点
            article:{
                content:'',
                title:'',
                publish_time:'',
                type:'blog',
                summary:'',
                quantity:0,
                class_name:'',
                tags:[],
                cover:'https://gd-hbimg.huaban.com/f8e4669b1681703ac5697a119ef51e17f7d0872f551e8c-bT5Ut8',
            },
            article_class:[],        //从后台获取到的所有分类
        }
    },
    methods:{
        // 处理节点右键菜单
        handleNodeContextMenu(event, data, node, component) {
            event.preventDefault();
            event.stopPropagation();
            
            this.selectedNode = data;
            this.contextMenuStyle = {
                left: event.clientX + 'px',
                top: event.clientY + 'px'
            };
            this.contextMenuVisible = true;
            
            // 点击其他地方关闭右键菜单
            setTimeout(() => {
                document.addEventListener('click', this.closeContextMenu);
            }, 0);
        },
        
        // 关闭右键菜单
        closeContextMenu() {
            this.contextMenuVisible = false;
            document.removeEventListener('click', this.closeContextMenu);
        },
        
        // 新建文章
        createNewArticle() {
            this.closeContextMenu();
            // 重置文章数据
            this.article = {
                content:'',
                title:'',
                publish_time:'',
                type:'blog',
                summary:'',
                quantity:0,
                class_name:'',
                tags:[],
                cover:'https://gd-hbimg.huaban.com/f8e4669b1681703ac5697a119ef51e17f7d0872f551e8c-bT5Ut8',
            };
            // 清空标签
            this.tags = [];
            // 如果选中了目录，设置目录id
            if (this.selectedNode) {
                this.selectedCatalogId = this.selectedNode.id;
                this.article.catalogId = this.selectedNode.id;
            }
        },
        
        // 新建文件夹
        createNewFolder() {
            this.closeContextMenu();
            // 这里可以添加新建文件夹的逻辑
            this.$message.info('新建文件夹功能待实现');
        },
        
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
                        this.$message.success('分类添加成功！');
                        this.add_class_dialog = false;
                        // 重新获取分类数据
                        this.fetchCategories();
                    },
                    error => {
                        this.$message.error('分类添加失败，请稍后重试');
                    }
                )
            }

        },
        add_tag(){
            //添加标签功能
            if(this.add_tag_name === null || this.add_tag_name.split(" ").join("").length === 0 || this.add_tag_name === undefined){
                //啥也不干
            }
            else{
                this.$http.post('tag/save',{tag_name:this.add_tag_name}).then(
                    resp => {
                        this.$message.success('标签添加成功！');
                        this.add_tag_dialog = false;
                        // 重新获取标签数据
                        this.fetchTags();
                    },
                    error => {
                        this.$message.error('标签添加失败，请稍后重试');
                    }
                )
            }

        },
        set_class(value){      //分类选择事件
            this.article.class_name = value;
        },
        // 保存文章（通用方法）
        async saveArticle(status) {
            // 前端验证
            if (!this.article.title || this.article.title.trim() === '') {
                this.$message.error('请输入文章标题');
                return;
            }
            
            if (!this.article.content || this.article.content.trim() === '') {
                this.$message.error('请输入文章内容');
                return;
            }
            
            // 构建请求参数
            const saveData = {
                articleId: this.article.id || null,
                catalogId: this.article.catalogId || null,
                title: this.article.title,
                content: this.article.content,
                tagList: this.buildTagList(),
                classId: this.getSelectedClassId(),
                summary: this.article.summary || '',
                cover: this.article.cover || '',
                invalidFlag: '0', // 默认有效
                status: status // 状态值：0-草稿，1-已发布
            };
            
            try {
                this.saving = true;
                const resp = await this.$http.post('article/save', saveData);
                if (resp.data && resp.data.success) {
                    const message = status === 0 ? '文章已保存为草稿！' : '文章发布成功！';
                    this.$message.success(message);
                    // 保存成功后更新文章id
                    if (resp.data.data && resp.data.data.articleId) {
                        this.article.id = resp.data.data.articleId;
                    }
                } else {
                    this.$message.error(resp.data.message || '操作失败');
                }
            } catch (error) {
                console.error('操作失败:', error);
                this.$message.error('网络异常，请稍后重试');
            } finally {
                this.saving = false;
            }
        },
        
        // 保存为草稿
        saveAsDraft() {
            this.saveArticle(0);
        },
        
        // 发布文章
        publishArticle() {
            this.saveArticle(1);
        },
        
        // 获取当前目录路径
        getCurrentCatalogPath() {
            if (!this.selectedCatalogId) {
                return '未选择目录';
            }
            
            // 查找当前目录
            const findCatalogPath = (tree, id, path = []) => {
                for (const node of tree) {
                    if (node.id === id) {
                        return [...path, node.label];
                    }
                    if (node.children) {
                        const result = findCatalogPath(node.children, id, [...path, node.label]);
                        if (result) {
                            return result;
                        }
                    }
                }
                return null;
            };
            
            const path = findCatalogPath(this.catalogTree, this.selectedCatalogId);
            return path ? path.join(' / ') : '未找到目录';
        },
        
        // 构建标签列表
        buildTagList() {
            if (!this.tags || this.tags.length === 0) {
                return [];
            }
            
            return this.tags.map(tagName => {
                // 查找标签id
                const tag = this.options.find(opt => opt.value === tagName);
                return {
                    tagId: tag ? tag.id : null,
                    tagName: tagName,
                    invalidFlag: '0',
                    nums: 0
                };
            });
        },
        
        // 获取选中的分类id
        getSelectedClassId() {
            if (!this.article.class_name) {
                return null;
            }
            const selectedClass = this.article_class.find(cls => cls.className === this.article.class_name);
            return selectedClass ? selectedClass.id : null;
        },
        cancel(){
            // 取消操作，返回上一页
            this.$router.back();
        },
        getTime() {
            // 获取当前时间
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        
        // 获取分类数据
        async fetchCategories() {
            this.error.categories = '';
            
            try {
                const resp = await this.$http.get('class/findAllClass');
                if (resp.data && resp.data.data && resp.data.data.length > 0) {
                    // 按count字段排序
                    const sortedCategories = [...resp.data.data].sort((a, b) => (b.count || 0) - (a.count || 0));
                    // 保留所有分类数据
                    this.article_class = sortedCategories.map(item => ({
                        id: item.id,
                        className: item.className
                    }));
                    // 自动选择频率最高的分类作为默认选项
                    if (sortedCategories.length > 0) {
                        this.article.class_name = sortedCategories[0].className;
                    }
                } else {
                    // 无分类数据
                    this.article_class = [];
                    this.article.class_name = '';
                }
            } catch (error) {
                console.error('获取分类失败:', error);
                this.error.categories = '';
                this.article_class = [];
                this.article.class_name = '';
            }
        },
        
        // 获取标签数据
        async fetchTags() {
            // 检查缓存
            if (this.cachedData.tags) {
                this.options = this.cachedData.tags;
                return;
            }
            
            this.loading.tags = true;
            this.error.tags = '';
            
            try {
                const resp = await this.$http.get('tag/findAllTags');
                if (resp.data && resp.data.data) {
                    // 格式化数据为下拉框需要的格式
                    this.options = resp.data.data.map(item => ({
                        id: item.id,
                        value: item.tagName,
                        label: item.tagName
                    }));
                    // 缓存数据
                    this.cachedData.tags = this.options;
                }
            } catch (error) {
                console.error('获取标签失败:', error);
                this.error.tags = '获取标签数据失败，请稍后重试';
                this.$message.error('获取标签数据失败');
            } finally {
                this.loading.tags = false;
            }
        },
        
        // 初始化目录树数据
        initCatalogTree() {
            // 模拟的多级目录数据
            this.catalogTree = [
                {
                    id: 1,
                    label: '前端开发',
                    children: [
                        {
                            id: 2,
                            label: 'HTML/CSS',
                            children: [
                                {
                                    id: 3,
                                    label: 'HTML基础'
                                },
                                {
                                    id: 4,
                                    label: 'CSS进阶'
                                }
                            ]
                        },
                        {
                            id: 5,
                            label: 'JavaScript',
                            children: [
                                {
                                    id: 6,
                                    label: 'ES6+'
                                },
                                {
                                    id: 7,
                                    label: '异步编程'
                                }
                            ]
                        },
                        {
                            id: 8,
                            label: '前端框架',
                            children: [
                                {
                                    id: 9,
                                    label: 'Vue'
                                },
                                {
                                    id: 10,
                                    label: 'React'
                                },
                                {
                                    id: 11,
                                    label: 'Angular'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 12,
                    label: '后端开发',
                    children: [
                        {
                            id: 13,
                            label: 'Java',
                            children: [
                                {
                                    id: 14,
                                    label: 'Spring Boot'
                                },
                                {
                                    id: 15,
                                    label: 'MyBatis'
                                }
                            ]
                        },
                        {
                            id: 16,
                            label: 'Python',
                            children: [
                                {
                                    id: 17,
                                    label: 'Django'
                                },
                                {
                                    id: 18,
                                    label: 'Flask'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 19,
                    label: '数据库',
                    children: [
                        {
                            id: 20,
                            label: 'MySQL'
                        },
                        {
                            id: 21,
                            label: 'PostgreSQL'
                        },
                        {
                            id: 22,
                            label: 'MongoDB'
                        }
                    ]
                },
                {
                    id: 23,
                    label: '其他',
                    children: [
                        {
                            id: 24,
                            label: 'DevOps'
                        },
                        {
                            id: 25,
                            label: '面试经验'
                        },
                        {
                            id: 26,
                            label: '技术随笔'
                        }
                    ]
                }
            ];
        },
        
        // 处理目录选择
        handleCatalogSelect(data) {
            this.selectedCatalogId = data.id;
            this.article.catalogId = data.id;
        },
    },
    mounted() {
        //页面创建的时候，获取分类和标签数据
        this.fetchCategories();
        this.fetchTags();
        // 初始化目录树数据
        this.initCatalogTree();
    }
}
</script>

<style scoped>
/* 主容器 */
.document-manager-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  overflow: hidden;
}

/* 主布局 */
.main-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* 左侧边栏 */
.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

/* 边栏头部 */
.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 边栏内容 */
.sidebar-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 右侧编辑器面板 */
.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 编辑器头部 */
.editor-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 24px 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 5;
}

/* 标题区域 */
.title-section {
  margin-bottom: 24px;
}

/* 标题输入框 */
.title-input {
  font-size: 24px;
  font-weight: 600;
  padding: 16px 24px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  width: 100%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  color: #0f172a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.title-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.title-input:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  outline: none;
}

.title-input.focused {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

/* 元数据区域 */
.meta-section {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

/* 元数据项 */
.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 元数据标签 */
.meta-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

/* 内容区域 */
.content-section {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: #f8fafc;
}

/* 编辑器容器 */
.editor-container {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.editor-container:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

/* 编辑器样式 */
.mavon-editor-custom {
  min-height: 600px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 编辑器底部 */
.editor-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 24px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

/* 操作按钮 */
.action-button {
  min-width: 120px;
  font-size: 16px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 保存为草稿按钮 */
.draft-button {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
}

.draft-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

/* 发布按钮 */
.publish-button {
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  border: 2px solid #4361ee;
  color: white;
}

.publish-button:hover {
  background: linear-gradient(135deg, #3a0ca3 0%, #4361ee 100%);
  border-color: #3a0ca3;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 150px;
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.context-menu li:hover {
  background: #f1f5f9;
  color: #4361ee;
}

/* 目录树样式 */
.custom-catalog-tree {
  width: 100%;
  background-color: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
}

.custom-catalog-tree .el-tree-node {
  padding: 6px 0;
  border-bottom: 1px solid #e2e8f0;
}

.custom-catalog-tree .el-tree-node:last-child {
  border-bottom: none;
}

.custom-catalog-tree .el-tree-node.is-current > .el-tree-node__content {
  background-color: #e0f2fe;
  border-radius: 6px;
  margin: 0 8px;
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  transform: translateX(4px);
}

.custom-catalog-tree .el-tree-node__content {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.custom-catalog-tree .el-tree-node__content:hover {
  background-color: #f1f5f9;
  margin: 0 8px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tree-node-content {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
}

.node-text {
  flex: 1;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
}

.selected-node {
  font-weight: 700;
  color: #2563eb;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.custom-catalog-tree .el-tree-node__expand-icon {
  font-size: 16px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 4px;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.custom-catalog-tree .el-tree-node__expand-icon:hover {
  color: #4361ee;
}

/* 内联选择器 */
.inline-select {
  min-width: 150px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 6px 12px;
}

.inline-select:hover {
  border-color: #4361ee;
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.12);
}

/* 内联按钮 */
.inline-button {
  padding: 6px 16px;
  font-size: 14px;
  min-width: 80px;
}

/* 统一按钮样式 */
.custom-button {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 250px;
  }
  
  .editor-header {
    padding: 20px 24px;
  }
  
  .content-section {
    padding: 24px;
  }
  
  .editor-footer {
    padding: 20px 24px;
  }
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .sidebar-content {
    overflow-y: auto;
  }
  
  .editor-header {
    padding: 16px 20px;
  }
  
  .meta-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .meta-item {
    justify-content: space-between;
  }
  
  .inline-select {
    flex: 1;
  }
  
  .content-section {
    padding: 16px;
  }
  
  .mavon-editor-custom {
    min-height: 400px;
  }
  
  .editor-footer {
    padding: 16px 20px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>