import { createApp } from 'vue'
import App from './App.vue'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue/es'


// 数据库

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

const app = createApp(App)
app.use(VueMarkdownEditor);

app.use(Antd)
app.mount('#app')