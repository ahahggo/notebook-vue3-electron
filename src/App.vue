<template>
  <div id="app" @click="ifClick">
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
                  <a-menu-item :key="file.key" @contextmenu.prevent="rightClick(file.path,$event)">
                    <span>{{file.name}}</span>
                  </a-menu-item>
              </template>
              <template v-else>
                <sub-menu :key="file.key" :menu-info="file" @contextmenu.prevent="rightClick(file.path,$event)"/>
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
    <transition name="menu">
      <div :style="menuStyle" v-show="menuVisible">
        <a-row style="min-width: 60px;margin: 5px">
          <a-button shape="normal" block style="border-color: white">
            <template #icon><file-add-outlined /></template>
            <span style="text-align: right">新建文件</span>
          </a-button>
        </a-row>
        <a-row style="min-width: 60px;margin: 5px">
          <a-button shape="normal" block style="border-color: white">
            <template #icon><folder-add-outlined /></template>
            <span style="text-align: right">新建文件夹</span>
          </a-button>
        </a-row>
        <a-row style="min-width: 60px;margin: 5px">
          <a-button shape="normal" block style="border-color: white">
            <template #icon><edit-outlined /></template>
            <span style="text-align: right">重命名</span>
          </a-button>
        </a-row>
        <a-row style="min-width: 60px;margin: 5px">
          <a-button shape="normal" block style="border-color: white">
            <template #icon><delete-outlined /></template>
            <span style="text-align: right">删除</span>
          </a-button>
        </a-row>
      </div>
    </transition>



  </div>
</template>

<script>


import {reactive, ref} from 'vue'

import {localFile, readFiles,showFile} from "./readFile.js";
import { FileOutlined ,FolderOutlined,FileAddOutlined,FolderAddOutlined,DeleteOutlined,EditOutlined} from '@ant-design/icons-vue';


const SubMenu={
  template:`
    <a-sub-menu :key="menuInfo.key">
      <template #icon><folder-outlined /></template>
      <template #title>{{menuInfo.name}}</template>
      <template v-for="item in menuInfo.children">
        <a-menu-item v-if="!item.children" :key="item.key" @contextmenu.prevent="rightClick(item.path)">
          <span>{{ item.name }}</span>
        </a-menu-item>
        <sub-menu v-else :key="item.key+'1'" :menu-info="item" @contextmenu.prevent="rightClick(item.path)"/>
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
  },
  setup(){
    function rightClick(filePath){
      console.log("右键",filePath)
    }
    return{
      rightClick
    }
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
    FileAddOutlined,
    FolderAddOutlined,
    DeleteOutlined,
    EditOutlined
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
    function ifClick(){
      menuVisible.value=false
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
    function rightClick(filePath,e){
      menuStyle.left=e.screenX+"px"
      menuStyle.top=e.screenY+"px"
      menuVisible.value=true
      console.log("右键",filePath,e)
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
    let menuStyle=reactive({
      position: "absolute",
      top:"0",
      left:"0",

      width:"150px",
      height:"155px",
      "background-color":"rgba(255,255,255,0.8)",
      "border-radius":"6px",
      "box-shadow":"2px 2px 5px 2px rgba(0,0,0,0.2)"
    })
    let menuVisible=ref(false)




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
      rightClick,
      fileList,
      menuStyle,
      menuVisible,
      ifClick
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
.menu-style {
  background-color: #c2c1c1;
}
.menu-enter-active {
  animation: fade-in-right 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}
.menu-leave-active{
  animation:scale-out-center 0.2s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
 #components-layout-demo-side .logo {
   height: 32px;
   margin: 16px;
   background: rgba(255, 255, 255, 0.3);
 }
@keyframes fade-in-right {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes scale-out-center {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 1;
  }
}
.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

</style>
