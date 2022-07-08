import { createApp } from 'vue'
import App from './App.vue'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 数据库

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

const app = createApp(App)
app.use(VueMarkdownEditor);
app.use(ElementPlus)

app.mount('#app')