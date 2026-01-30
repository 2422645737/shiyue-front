<template>
    <div class="panel">
        <!--    阅读面板-->
        <div class="title">{{ article.title }}</div>
        <!-- 总结摘要内容 -->
        <div class="content">
            <template v-if="loading">
                <i class="el-icon-loading"></i>
                正在生成摘要...
            </template>
            <template v-else>
                <div class="summary-container">
                    <div class="summary-title">文章摘要</div>
                    <div class="summary-content" v-html="summary"></div>
                </div>
            </template>
        </div>
        <div class="editor">
            <mavon-editor :value="article.content" code-style="github" :subfield="false" font-size="19px"
                :toolbarsFlag="false" defaultOpen="preview" ref="md" />
        </div>
        <operate class="opearte" :aid="article.id"></operate>
        <comment-area class="comment-area" :article_id="article.id"></comment-area>
    </div>
</template>

<script>
import Operate from "@/components/Operate";
import CommentArea from "@/components/CommentArea";
export default {
    name: 'ReadPanel',
    props: ['article'],
    components: {
        Operate,
        CommentArea
    },
    methods: {
        // 从缓冲区逐字符渲染
        renderFromBuffer() {
            // 如果已经在渲染中，或者缓冲区为空，直接返回
            if (this.isRendering || !this.dataBuffer) {
                return;
            }

            this.isRendering = true;

            // 创建渲染函数
            const renderNextChar = () => {
                if (!this.dataBuffer) {
                    // 渲染完成
                    this.isRendering = false;
                    return;
                }

                // 取一个字符
                const nextChar = this.dataBuffer.charAt(0);
                // 追加到summary
                this.summary += nextChar;
                // 从缓冲区移除
                this.dataBuffer = this.dataBuffer.slice(1);

                // 继续渲染下一个字符
                setTimeout(renderNextChar, this.renderSpeed);
            };

            // 开始渲染
            renderNextChar();
        },

        // SSE请求获取文章摘要
        getSummary() {
            // 重置状态
            this.summary = '';
            this.dataBuffer = '';
            this.isRendering = false;
            this.loading = true;

            // 防止重复连接
            if (this.eventSource) {
                this.eventSource.close();
            }

            const content = encodeURIComponent(this.article.content);
            const url = `/agent/summary?content=${content}`;

            // 基本的SSE实现
            this.eventSource = new EventSource(url);

            // 接收流式数据
            this.eventSource.onmessage = (event) => {
                console.log('Received SSE data:', event.data);
                
                if (event.data === '[DONE]') {
                    this.loading = false;
                    this.eventSource.close();
                    // 如果还有剩余数据，继续渲染
                    if (this.dataBuffer) {
                        this.renderFromBuffer();
                    }
                    return;
                }

                // 将数据存入缓冲区
                this.dataBuffer += event.data;
                // 开始渲染
                this.renderFromBuffer();
            };

            // 异常处理
            this.eventSource.onerror = (err) => {
                console.error('SSE Error:', err);
                this.loading = false;
                this.eventSource.close();
                this.summary = '摘要生成失败，请稍后重试';
            };
        }
    },
    data() {
        return {
            summary: '',
            loading: false,
            eventSource: null,
            dataBuffer: '',
            isRendering: false,
            renderSpeed: 100 // 控制渲染速度，100ms/字符 = 10字符/秒
        }
    },
    mounted() {
        // 组件挂载时调用
        this.getSummary();
    },
    beforeUnmount() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    },
    watch: {
        // 监听article变化时重新调用
        // summary: {
        //     handler() {
        //         this.getSummary();
        //     },
        //     deep: true
        // }
    }

}
</script>

<style scoped>
.title {
    font-size: 29px;
    font-weight: bold;
    margin-bottom: 10px;
}

.panel {
    width: 100%;
    height: 100%;
}

.editor {
    margin-left: 3px;
}

.content {
    width: 100%;
    background-color: aqua;
    text-align: left;
    word-break: break-all;
    padding: 10px;
    border-radius: 5px;
}


/* 摘要容器样式 */
.summary-container {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

/* 摘要容器悬停效果 */
.summary-container:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 摘要标题样式 */
.summary-title {
  font-size: 20px;
  font-weight: bold;
  color: #495057;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #dee2e6;
}

/* 摘要内容样式 */
.summary-content {
  font-size: 16px;
  line-height: 1.8;
  color: #343a40;
  font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
}

/* 摘要内容中的段落样式 */
.summary-content p {
  margin-bottom: 12px;
}

/* 摘要内容中的标题样式 */
.summary-content h1, .summary-content h2, .summary-content h3 {
  font-weight: bold;
  margin: 16px 0 8px;
  color: #2c3e50;
}

.summary-content h1 { font-size: 24px; }
.summary-content h2 { font-size: 20px; }
.summary-content h3 { font-size: 18px; }

/* 摘要内容中的列表样式 */
.summary-content ul, .summary-content ol {
  padding-left: 24px;
  margin-bottom: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .summary-container {
    padding: 15px;
    margin: 10px 0;
  }
  
  .summary-title {
    font-size: 18px;
  }
  
  .summary-content {
    font-size: 15px;
    line-height: 1.7;
  }
}

@media (max-width: 480px) {
  .summary-container {
    padding: 12px;
    margin: 8px 0;
    border-radius: 6px;
  }
  
  .summary-title {
    font-size: 16px;
  }
  
  .summary-content {
    font-size: 14px;
    line-height: 1.6;
  }
}

.el-icon-loading {
    margin-right: 5px;
    animation: rotating 1s linear infinite;
}

@keyframes rotating {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.opearte {
    margin-top: 10px;
}

.comment-area {
    margin-bottom: 20px;
}
</style>
