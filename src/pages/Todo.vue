<template>
<div class="main_page">
  <el-container>
    <el-header>
      <my-header></my-header>
    </el-header>
    <el-main>
      <div class="todo-wrapper">
        <div class="todo-header">
          <input
            class="todo-input"
            v-model="form.title"
            type="text"
            placeholder="添加新待办"
            @keyup.enter="addTodo"
          />
          <select class="todo-select" v-model.number="form.priority">
            <option :value="3">高</option>
            <option :value="2">中</option>
            <option :value="1">低</option>
          </select>
          <input
            class="todo-datetime"
            v-model="form.dueLocal"
            type="datetime-local"
          />
          <button class="ghost-btn" @click="showNewSub = !showNewSub">
            {{ showNewSub ? '收起子项目' : '添加子项目' }}
          </button>
          <button class="add-btn" @click="addTodo">添加</button>
        </div>
        <div class="todo-remark">
          <textarea
            class="remark-textarea"
            v-model="form.remark"
            maxlength="500"
            placeholder="备注（可选，≤500字）"
          ></textarea>
        </div>
        <div v-if="showNewSub" class="subtasks-editor">
          <div class="sub-add">
            <input
              class="sub-input"
              v-model="newSubName"
              type="text"
              placeholder="添加子项目名称"
              @keyup.enter="addDraftSub"
            />
            <button class="ghost-btn" @click="addDraftSub">添加子项目</button>
          </div>
          <ul class="sub-list">
            <li v-for="(s,idx) in draftSubs" :key="idx" class="sub-item">
              <span class="dot"></span>
              <span class="sub-name">{{ s.name }}</span>
              <button class="mini-del" @click="removeDraftSub(idx)">移除</button>
            </li>
          </ul>
        </div>

        <ul class="todo-list">
          <li
            v-for="item in todos"
            :key="item.todoId"
            class="todo-item"
            :class="{ done: item.completed }"
          >
            <div class="todo-main" @click="openEditModal(item)">
              <span class="todo-text">{{ item.title }}</span>
              <span class="todo-meta">
                <span class="badge" :class="'p-' + item.priority">优先级 {{ item.priority }}</span>
                <span class="due" v-if="item.dueTime">截止 {{ item.dueTime }}</span>
                <span class="sub-count" v-if="subCount(item)">子项目 {{ subCount(item) }}</span>
              </span>
            </div>
            <div class="actions">
              <button class="toggle-btn" @click.stop="toggle(item)">
                {{ item.completed ? '标为未完成' : '标为完成' }}
              </button>
              <button class="delete-btn" @click.stop="remove(item.todoId)">删除</button>
            </div>
          </li>
        </ul>

        <div class="todo-footer">
          已完成 {{ completedCount }} / {{ totalCount }}
        </div>
      </div>
      <el-dialog
        :visible.sync="editVisible"
        width="640px"
        :close-on-click-modal="false"
        center
        title="编辑待办"
        custom-class="neo-dialog"
      >
        <div class="dialog-body">
          <div class="form-row">
            <el-input v-model="editForm.title" placeholder="标题"></el-input>
          </div>
          <div class="form-row form-grid">
            <el-select v-model="editForm.priority" placeholder="优先级">
              <el-option :value="3" label="高"></el-option>
              <el-option :value="2" label="中"></el-option>
              <el-option :value="1" label="低"></el-option>
            </el-select>
            <el-date-picker
              v-model="editForm.dueTimeServer"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="截止时间"
              :editable="false"
            ></el-date-picker>
          </div>
          <div class="form-row">
            <el-input
              v-model="editForm.remark"
              type="textarea"
              :rows="4"
              maxlength="500"
              show-word-limit
              placeholder="备注（≤500字）"
            ></el-input>
          </div>
          <div class="subtasks-block">
            <div class="sub-head">
              <span>子项目</span>
              <div class="sub-add-inline">
                <el-input
                  v-model="subDraft[editingId]"
                  placeholder="添加子项目"
                  @keyup.enter.native="addSub(editingId)"
                ></el-input>
                <button class="ghost-btn" @click="addSub(editingId)">添加</button>
              </div>
            </div>
            <ul class="sub-list">
              <li v-for="sub in subMap[editingId]" :key="sub.subTaskId" class="sub-item">
                <label class="sub-line">
                  <input type="checkbox" v-model="sub.completed" @change="updateSub(editingId, sub)" />
                  <input class="sub-name-input" v-model="sub.name" @blur="updateSub(editingId, sub)" />
                </label>
                <button class="mini-del" @click="deleteSub(editingId, sub.subTaskId)">删除</button>
              </li>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveEditModal">保 存</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</div>
</template>

<script>
import MyHeader from '@/components/MyHeader.vue'

export default {
  name: 'TodoPage',
  components: { MyHeader },
  data() {
    return {
      form: {
        title: '',
        priority: 2,
        dueLocal: '',
        remark: ''
      },
      showNewSub: false,
      newSubName: '',
      draftSubs: [],
      todos: [],
      editingId: null,
      editVisible: false,
      editForm: {
        title: '',
        priority: 2,
        dueTimeServer: '',
        remark: ''
      },
      subMap: {},
      subDraft: {}
    }
  },
  computed: {
    completedCount() {
      return this.todos.filter(t => t.completed).length
    },
    totalCount() {
      return this.todos.length
    }
  },
  mounted() {
    this.fetchTodos()
  },
  methods: {
    formatToServer(dtLocal) {
      if (!dtLocal) return ''
      const s = dtLocal.replace('T', ' ')
      return s.length === 16 ? s + ':00' : s
    },
    formatToLocal(serverStr) {
      if (!serverStr) return ''
      return serverStr.replace(' ', 'T')
    },
    fetchTodos() {
      const body = {
        orderByPriority: true
      }
      this.$http.post('todo/query', body).then(resp => {
        if (resp.data && resp.data.success) {
          const arr = Array.isArray(resp.data.data) ? resp.data.data : []
          this.todos = arr
          // 将返回中的子项目预加载到本地 subMap，避免再次请求
          arr.forEach(t => {
            const roots = this.normalizeRootSubs(t.subTasks)
            this.subMap[t.todoId] = roots
            // 标准化 item.subTasks，便于列表展示数量
            t.subTasks = roots
          })
        } else {
          this.$message && this.$message.error('加载失败')
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    normalizeRootSubs(subTasks) {
      if (!Array.isArray(subTasks)) return []
      return subTasks
        .filter(s => s && s.parentId == null)
        .map(s => ({
          ...s,
          children: Array.isArray(s.children) ? s.children : []
        }))
    },
    subCount(item) {
      const arr = Array.isArray(item && item.subTasks) ? item.subTasks : []
      return arr.filter(s => s && s.parentId == null).length
    },
    addDraftSub() {
      const name = (this.newSubName || '').trim()
      if (!name) return
      this.draftSubs.push({ name, completed: false })
      this.newSubName = ''
    },
    removeDraftSub(idx) {
      this.draftSubs.splice(idx, 1)
    },
    addTodo() {
      const title = (this.form.title || '').trim()
      if (!title) {
        this.$message && this.$message.warning('请填写待办内容')
        return
      }
      if (!this.form.dueLocal) {
        this.$message && this.$message.warning('请选择截止时间')
        return
      }
      const payload = {
        title,
        remark: this.form.remark || '',
        dueTime: this.formatToServer(this.form.dueLocal),
        priority: this.form.priority,
        completed: false,
        subTasks: this.draftSubs.map(s => ({ name: s.name, completed: !!s.completed }))
      }
      this.$http.post('todo/add', payload).then(resp => {
        if (resp.data && resp.data.success) {
          const created = resp.data.data
          this.todos.unshift(created)
          this.form.title = ''
          this.form.dueLocal = ''
          this.form.priority = 2
           this.form.remark = ''
           this.draftSubs = []
           this.showNewSub = false
        } else {
          this.$message && this.$message.error('新增失败')
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    toggle(item) {
      const original = item.completed
      item.completed = !item.completed
      const payload = {
        todoId: item.todoId,
        title: item.title,
        remark: item.remark,
        dueTime: item.dueTime,
        priority: item.priority,
        completed: item.completed,
        subTasks: item.subTasks || []
      }
      this.$http.post('todo/update', payload).then(resp => {
        if (!(resp.data && resp.data.success)) {
          item.completed = original
          this.$message && this.$message.error('更新失败')
        } else if (resp.data.data) {
          Object.assign(item, resp.data.data)
        }
      }).catch(() => {
        item.completed = original
        this.$message && this.$message.error('网络异常')
      })
    },
    remove(id) {
      this.$http.post('todo/delete', null, { params: { todoId: id } }).then(resp => {
        if (resp.data && resp.data.success) {
          this.todos = this.todos.filter(x => x.todoId !== id)
        } else {
          this.$message && this.$message.error('删除失败')
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    openEditModal(item) {
      this.editingId = item.todoId
      this.editForm = {
        title: item.title,
        priority: item.priority,
        dueTimeServer: item.dueTime || '',
        remark: item.remark || ''
      }
      if (Array.isArray(item.subTasks) && item.subTasks.length) {
        this.subMap[item.todoId] = this.normalizeRootSubs(item.subTasks)
      } else if (!this.subMap[item.todoId]) {
        this.listSub(item.todoId)
      }
      this.editVisible = true
    },
    saveEditModal() {
      const item = this.todos.find(t => t.todoId === this.editingId)
      if (!item) {
        this.editVisible = false
        return
      }
      const data = this.editForm
      const payload = {
        todoId: this.editingId,
        title: (data.title || '').trim(),
        remark: data.remark || '',
        dueTime: data.dueTimeServer || '',
        priority: data.priority,
        completed: item.completed
      }
      if (!payload.title) {
        this.$message && this.$message.warning('标题不可为空')
        return
      }
      this.$http.post('todo/update', payload).then(resp => {
        if (resp.data && resp.data.success) {
          const result = resp.data.data || payload
          Object.assign(item, result)
          this.editVisible = false
        } else {
          this.$message && this.$message.error('保存失败')
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    listSub(todoId) {
      this.$http.post('todo/sub/list', null, { params: { todoId } }).then(resp => {
        if (resp.data && resp.data.success) {
          const arr = Array.isArray(resp.data.data) ? resp.data.data : []
          this.subMap[todoId] = arr.filter(x => x.parentId == null)
        } else {
          this.subMap[todoId] = []
        }
      }).catch(() => {
        this.subMap[todoId] = []
      })
    },
    addSub(todoId) {
      const name = (this.subDraft[todoId] || '').trim()
      if (!name) return
      const payload = {
        todoId,
        parentId: null,
        name,
        completed: false
      }
      this.$http.post('todo/sub/add', payload).then(resp => {
        if (resp.data && resp.data.success) {
          if (!this.subMap[todoId]) this.subMap[todoId] = []
          this.subMap[todoId].push(resp.data.data)
          this.subDraft[todoId] = ''
          this.syncSubTasks({ todolistId: todoId })
        } else {
          this.$message && this.$message.error('子项目新增失败')
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    updateSub(todoId, sub) {
      const payload = {
        subTaskId: sub.subTaskId,
        todoId,
        parentId: null,
        name: sub.name,
        completed: sub.completed
      }
      this.$http.post('todo/sub/update', payload).then(resp => {
        if (!(resp.data && resp.data.success)) {
          this.$message && this.$message.error('子项目更新失败')
        } else {
          this.syncSubTasks({ todolistId: todoId })
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    deleteSub(todoId, subTaskId) {
      this.$http.post('todo/sub/delete', null, { params: { subTaskId } }).then(resp => {
        if (resp.data && resp.data.success) {
          this.subMap[todoId] = (this.subMap[todoId] || []).filter(s => s.subTaskId !== subTaskId)
          this.syncSubTasks({ todolistId: todoId })
        } else {
          this.$message && this.$message.error('子项目删除失败')
        }
      }).catch(() => {
        this.$message && this.$message.error('网络异常')
      })
    },
    syncSubTasks({ todolistId }) {
      const item = this.todos.find(t => t.todoId === todolistId)
      if (item) {
        item.subTasks = (this.subMap[todolistId] || []).slice()
      }
    }
  }
}
</script>

<style scoped>
.main_page {
  min-height: 100%;
  width: 100%;
  background: #f6f7f9;
  display: flex;
  flex-direction: column;
}
.el-header {
  padding-left: 0;
  padding-right: 0;
  background: #fff;
}
.el-main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 12px;
}

.todo-wrapper {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border: 1px solid #e6e8eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  font-family: Inter, "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
  color: #1f2d3d;
}

.todo-header {
  display: flex;
  gap: 12px;
  position: relative;
  flex-wrap: wrap;
}

.todo-input {
  flex: 1 1 auto;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #1f2d3d;
  font-size: 16px;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.05s ease;
}
.todo-input:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.12);
}

.todo-select,
.todo-datetime {
  height: 44px;
  padding: 0 10px;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  background: #fff;
  color: #1f2d3d;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.todo-select:focus,
.todo-datetime:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.12);
  outline: none;
}

.ghost-btn {
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  background: #fff;
  color: #2c3e50;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: border-color 0.15s ease, color 0.15s ease, box-shadow 0.2s ease, transform 0.05s ease;
}
.ghost-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.add-btn {
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #4A90E2 0%, #6AA9F2 100%);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.05s ease;
}
.add-btn:hover {
  filter: brightness(1.05);
}
.add-btn:active {
  transform: scale(0.99);
}

.todo-remark {
  margin-top: 10px;
}
.remark-textarea {
  width: 100%;
  min-height: 72px;
  padding: 10px 12px;
  border: 1px solid #d9dfe6;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  color: #2c3e50;
}
.remark-textarea:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.12);
  outline: none;
}

.subtasks-editor {
  margin-top: 10px;
  border: 1px dashed #e1e6eb;
  border-radius: 10px;
  padding: 10px;
}
.sub-add, .sub-add-inline {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}
.sub-input {
  flex: 1 1 auto;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d9dfe6;
  border-radius: 8px;
  font-size: 14px;
}
.sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
}
.sub-item:hover {
  background: #f7f8fa;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4A90E2;
  margin-right: 8px;
}
.sub-name {
  color: #2c3e50;
}
.mini-del {
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid #f0d5d8;
  background: #fff;
  color: #d84353;
  cursor: pointer;
}
.mini-del:hover {
  background: #ffeff1;
  border-color: #e5737f;
}

.todo-list {
  margin: 14px 0 10px;
  padding: 0;
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, transform 0.05s ease, background-color 0.15s ease, border-color 0.15s ease;
}
.todo-item + .todo-item {
  margin-top: 8px;
}
.todo-item:hover {
  background: #fff;
  border-color: #e6e8eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.todo-main {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.todo-edit {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  background: #fafbfc;
}
.edit-row {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}
.edit-title {
  flex: 1 1 auto;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d9dfe6;
  border-radius: 8px;
  font-size: 14px;
}
.edit-select, .edit-datetime {
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d9dfe6;
  border-radius: 8px;
  font-size: 14px;
}
.edit-remark {
  width: 100%;
  min-height: 60px;
  padding: 8px 10px;
  border: 1px solid #d9dfe6;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}
.subtasks-block .sub-name-input {
  height: 32px;
  border: 1px solid #d9dfe6;
  border-radius: 6px;
  padding: 0 8px;
  font-size: 14px;
}
.sub-line {
  display: flex;
  gap: 8px;
  align-items: center;
}
.edit-actions {
  display: flex;
  justify-content: flex-end;
}

.todo-text {
  font-size: 16px;
  line-height: 1.5;
  color: #2c3e50;
  word-break: break-word;
}
.done .todo-text {
  text-decoration: line-through;
  color: #9aa4af;
}

.todo-meta {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: #6b7785;
  font-size: 13px;
}
.badge {
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #d9dfe6;
  color: #4A90E2;
  background: #f0f6fe;
}
.badge.p-3 { filter: saturate(1.2); }
.badge.p-2 { opacity: 0.9; }
.badge.p-1 { opacity: 0.8; }
.due {
  color: #748191;
}
.sub-count {
  color: #4A90E2;
}

.actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.todo-item:hover .actions {
  opacity: 1;
}

.toggle-btn,
.delete-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #e6e8eb;
  background: #fff;
  color: #2c3e50;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.2s ease, transform 0.05s ease;
}
.toggle-btn:hover {
  border-color: #4A90E2;
  color: #4A90E2;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}
.delete-btn {
  border-color: #f0d5d8;
}
.delete-btn:hover {
  background: #ffeff1;
  border-color: #e5737f;
  color: #d84353;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.todo-footer {
  margin-top: 8px;
  text-align: right;
  font-size: 14px;
  color: #606f7b;
}

@media (max-width: 640px) {
  .el-main {
    padding-top: 72px;
  }
  .todo-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #ffffff;
    padding-top: 8px;
    padding-bottom: 8px;
    gap: 8px;
  }
  .todo-select,
  .todo-datetime {
    flex: 1 1 100%;
  }
}

.dialog-body {
  font-family: Inter, "Microsoft YaHei", Arial, sans-serif;
}
.form-row {
  margin-bottom: 12px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

::v-deep .neo-dialog {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
::v-deep .neo-dialog .el-dialog__header {
  border-bottom: none;
  padding-bottom: 0;
}
::v-deep .neo-dialog .el-dialog__title {
  color: #1f2d3d;
  font-weight: 600;
}
::v-deep .neo-dialog .el-dialog__body {
  padding-top: 8px;
}

::v-deep .neo-dialog .el-input__inner,
::v-deep .neo-dialog .el-textarea__inner,
::v-deep .neo-dialog .el-select .el-input__inner,
::v-deep .neo-dialog .el-date-editor .el-input__inner {
  background: #ffffff;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  color: #2c3e50;
}
::v-deep .neo-dialog .el-input.is-active .el-input__inner,
::v-deep .neo-dialog .el-input__inner:focus,
::v-deep .neo-dialog .el-textarea__inner:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.12);
}

::v-deep .neo-dialog .el-button {
  background: #ffffff;
  border: 1px solid #e6e8eb;
  color: #2c3e50;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.05s ease, box-shadow 0.2s ease;
}
::v-deep .neo-dialog .el-button:hover {
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}
::v-deep .neo-dialog .el-button:active {
  transform: scale(0.98);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}
::v-deep .neo-dialog .el-button--primary {
  background: linear-gradient(145deg, #4A90E2, #6AA9F2);
  color: #fff;
  border: none;
  box-shadow: 0 6px 12px rgba(74, 144, 226, 0.25);
}
::v-deep .neo-dialog .el-button--primary:hover {
  box-shadow: 0 8px 16px rgba(74, 144, 226, 0.28);
}
::v-deep .neo-dialog .el-button--primary:active {
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.24);
}

::v-deep .neo-dialog .el-textarea__inner,
::v-deep .neo-dialog .el-input__inner {
  padding-left: 14px;
  padding-right: 14px;
}

.sub-item {
  background: #ffffff;
  border: 1px solid #e6e8eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.sub-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.sub-name-input {
  background: #ffffff;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  box-shadow: none;
}
.sub-name-input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.12);
}
</style>

