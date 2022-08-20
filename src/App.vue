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
        <a-menu
            :selectedKeys="selectedKeys"
            @openChange="getLocalFile"
            @click="menuClick"
            theme="light"
            mode="inline">

          <a-sub-menu key="file">
            <template #title>
            <span>
              <file-outlined />
              <span>文件</span>
            </span>
            </template>

            <template v-for="file in fileList" :key="file.key">
              <template v-if="!file.children">
                <a-menu-item :key="file.key">
                  <span>{{file.name}}</span>
                </a-menu-item>
              </template>

              <template v-else>
                <sub-menu :key="file.key" :menu-info="file"/>
              </template>

            </template>

          </a-sub-menu>
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

import {localFile, readFiles,showFile} from "./readFile.js";
import { FileOutlined ,FolderOutlined} from '@ant-design/icons-vue';


const SubMenu={
  template:`
    <a-sub-menu :key="menuInfo.key">
      <template #icon><folder-outlined /></template>
      <template #title>{{menuInfo.name}}</template>
      <template v-for="item in menuInfo.children">
        <a-menu-item v-if="!item.children" :key="item.key">
          <span>{{ item.name }}</span>
        </a-menu-item>
        <sub-menu v-else :key="item.key+'1'" :menu-info="item" />
      </template>
    </a-sub-menu>
  `,
  name:'SubMenu',
  isSubMenu:true,
  props:{
    menuInfo:{
      type:Object,
      default:()=>({})
    }
  },
  components:{
    FolderOutlined,
  }

}

export default {
  name: 'App',

  components: {
    'sub-menu':SubMenu,

    //PieChartOutlined,
    //DesktopOutlined,
    //UserOutlined,
    //TeamOutlined,
    FileOutlined,
  },
  setup(){
    const formRef=ref();
    let fileList=ref()
    function submit(){
      visible.value = true;
    }
    function confirmSubmit(){
      formRef.value.validateFields().then(values => {
        console.log("value: ",values)
        visible.value = false;
        readFiles(formState.filename,article.text)
        formRef.value.resetFields();

        console.log({
          title:formState.filename,
          message: article.text,
          type: height.now
        })
      }).catch(info=>{
        console.log('failed:',info)
      })
    }

    function getLocalFile(){
      localFile("./data").then(function (r) {
        fileList.value=r
      })
    }
    function menuClick(arg){
      let f=0
      for(let i=1 ;i<arg.keyPath.length;i+=1){
        if (f.children===undefined){
          f=fileList.value[arg.keyPath[i]]
        }
        else{
          f=f.children[arg.keyPath[i]]
        }
      }
      showFile(f.path).then(function(r){
        article.text=r
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
      formRef,
      getLocalFile,
      menuClick,
      fileList
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
