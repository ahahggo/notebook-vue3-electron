<template>
  <div id="app" >
    <a-modal v-model:visible="visible" title="Basic Modal" @ok="confirmSubmit">
      <a-form :model="formState" ref="formRef">
        <a-form-item
            name="filename"
            label="文件名"
            :rules="[{required: true,message:'请输入文件名'}]"
        >
          <a-input v-model:value="formState.filename" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-layout style="min-height: 100vh" >
      <a-layout-sider v-model:collapsed="collapsed" collapsible theme="light">
        <div class="logo" />
        <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
          <a-menu-item key="1">
            <pie-chart-outlined />
            <span>Option 1</span>
          </a-menu-item>
          <a-menu-item key="2">
            <desktop-outlined />
            <span>Option 2</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
            <span>
              <user-outlined />
              <span>User</span>
            </span>
            </template>
            <a-menu-item key="3">Tom</a-menu-item>
            <a-menu-item key="4">Bill</a-menu-item>
            <a-menu-item key="5">Alex</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
            <span>
              <team-outlined />
              <span>Team</span>
            </span>
            </template>
            <a-menu-item key="6">Team 1</a-menu-item>
            <a-menu-item key="8">Team 2</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="9">
            <file-outlined />
            <span>File</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout >
<!--        <a-layout-header style="background: #fff; padding: 0" />-->
        <a-layout-content style="margin: 0 16px" >
          <v-md-editor v-model="article.text"
                       :height="height.now"
                       left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save"
                       class="my-v-md"
                       @save="submit()"
          ></v-md-editor>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>


import {reactive, ref} from 'vue'

import {readFiles} from "./readFile.js";
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons-vue';

export default {
  name: 'App',

  components: {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
  },
  setup(){
    const formRef=ref();
    function submit(){
      visible.value = true;
    }
    function confirmSubmit(){
      formRef.value.validateFields().then(values => {
        console.log("value: ",values)
        visible.value = false;
        formRef.value.resetFields();
        readFiles(formState.filename,article.text)
        console.log({
          title:'提交成功',
          message: article.text,
          type: height.now
        })
      }).catch(info=>{
        console.log('failed:',info)
      })


    }

    const article = reactive({
      text:''
    })
    let height=reactive({
      now:document.documentElement.clientHeight+'px'
    })
    const visible = ref(false);
    const formState=reactive({
      filename:'未命名文件'
    })



    return {
      article,
      submit,
      collapsed: ref(false),
      selectedKeys: ref(['1']),
      height,
      visible,
      confirmSubmit,
      formState,
      formRef
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
  margin-top: 0px;
  min-width: 600px;
}
.my-v-md{
  min-width: 400px;
  float: left;
}
 #components-layout-demo-side .logo {
   height: 32px;
   margin: 16px;
   background: rgba(255, 255, 255, 0.3);
 }

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

</style>
