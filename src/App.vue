<template>
  <div id="app" @click="ifLeftClick">
    <a-layout style="min-height: 100vh" has-sider>

<!--      侧边栏-->
      <a-layout-sider v-model:collapsed="collapsed" collapsible theme="light" :style="{ overflow: 'auto', height: '100vh'}">
        <div class="logo" />
<!--        全部目录-->
        <a-menu
            :selectedKeys="selectedKeys"
            @openChange="getLocalFile"
            @click="menuClick"
            theme="light"
            mode="inline"
            :inlineIndent="16"
            >

<!--          文件目录-->
          <a-sub-menu key="file" :disabled="collapsed">

            <template #title>
            <span>
              <file-outlined />
              <span>文件</span>
            </span>
            </template>

<!--            全部文件-->
            <sub-menu :menu-info="fileList" @rightClick="rightClick"></sub-menu>

          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

<!--      编辑器栏-->
      <a-layout >
        <a-layout-content style="margin: 0 16px" >
          <v-md-editor v-model="article.text"
                       :height="height.now"
                       left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save"
                       class="my-v-md"
                       @save="submit()"

          ></v-md-editor>
        </a-layout-content>
      </a-layout>

    </a-layout>

<!--    上传下载按钮-->
    <a-button type="circle" size="large" @click="getRemoteFile" style="position:fixed; bottom: 30px; right: 30px"><cloud-download-outlined /></a-button>
    <a-button type="circle" size="large" @click="uploadLocalFile" style="position:fixed; bottom: 80px; right: 30px"><cloud-upload-outlined /></a-button>

<!--    右键菜单-->
    <transition name="menu">
      <div :style="menuStyle" v-show="menuVisible">
        <a-row style="min-width: 60px;margin: 5px">
          <a-button shape="normal" block style="border-color: white" @click="addFile">
            <template #icon><file-add-outlined /></template>
            <span style="text-align: right">新建文件</span>
          </a-button>
        </a-row>
        <a-row style="min-width: 60px;margin: 5px">
          <a-button shape="normal" block style="border-color: white" @click="addFolder">
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
          <a-button shape="normal" block style="border-color: white" @click="delFile">
            <template #icon><delete-outlined /></template>
            <span style="text-align: right">删除</span>
          </a-button>
        </a-row>
      </div>
    </transition>


<!--  对话框-->
<!--      储存确认对话框-->
    <a-modal v-model:visible="saveConfirmVisible" title="Basic Modal" @ok="confirmSubmit">
      <a-form :model="formState" ref="saveConfirmFormRef">
        <a-form-item
            name="filename"
            label="文件名"
            :rules="[{required: true,message:'请输入文件名'}]"
        >
          <a-input v-model:value="formState.filename" />
        </a-form-item>
      </a-form>
    </a-modal>

<!--      新建文件确认对话框-->
    <a-modal v-model:visible="addFileConfirmVisible" title="Basic Modal" @ok="addFileConfirm">
      <a-form :model="formState" ref="saveConfirmFormRef">
        <a-form-item
            name="filename"
            label="文件名"
            :rules="[{required: true,message:'请输入文件名'}]"
        >
          <a-input v-model:value="formState.filename" />
        </a-form-item>
      </a-form>
    </a-modal>

<!--      删除确认对话框-->
    <a-modal v-model:visible="delConfirmVisible" title="Basic Modal" @ok="delConfirm">
      <p>确认删除吗？</p>
    </a-modal>

    <!--      新建文件夹确认对话框-->
    <a-modal v-model:visible="addFolderConfirmVisible" title="Basic Modal" @ok="addFolderConfirm">
      <a-form :model="addFolderFormState" ref="addFolderConfirmFormRef">
        <a-form-item
            name="folderName"
            label="文件夹名"
            :rules="[{required: true,message:'请输入文件夹名'}]"
        >
          <a-input v-model:value="addFolderFormState.folderName" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import SubMenu from "./components/SubMenu";
import {reactive, ref} from 'vue'
import {localFile, readFiles,showFile,delFiles,addFolders,getAllFileFromServer,uploadAllFileToServer} from "./readFile.js";
import { FileOutlined ,FileAddOutlined,FolderAddOutlined,DeleteOutlined,EditOutlined,CloudDownloadOutlined,CloudUploadOutlined} from '@ant-design/icons-vue';



export default {
  name: 'App',
  components: {
    'sub-menu':SubMenu,
    FileOutlined,
    FileAddOutlined,
    FolderAddOutlined,
    DeleteOutlined,
    EditOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined
  },

  setup(){
    const selectedKeys=ref([])
    const saveConfirmFormRef=ref();
    const addFolderConfirmFormRef=ref();
    let fileList=ref()
    function getRemoteFile(){
      getAllFileFromServer()
    }
    function uploadLocalFile(){
      uploadAllFileToServer()
    }
    function submit(){
      saveConfirmVisible.value = true;
    }
    function confirmSubmit(){
      saveConfirmFormRef.value.validateFields().then(values => {
        console.log("value: ",values)
        saveConfirmVisible.value = false;
        readFiles('./data/'+formState.filename,article.text)
        saveConfirmFormRef.value.resetFields();

        console.log({
          title:formState.filename,
          message: article.text,
          type: height.now
        })
      }).catch(info=>{
        console.log('failed:',info)
      })
    }
    function ifLeftClick(){
      menuVisible.value=false
    }
    function getLocalFile(){
      localFile("./data").then(function (r) {
        fileList.value=r
        console.log(r)
      })
    }
    function menuClick(arg){
      console.log(arg,arg.keyPath[1])
      let f
      for (let k=0;k<fileList.value.length;k+=1){
        if (fileList.value[k].key===arg.keyPath[1]){
          f=fileList.value[k]
        }
      }
      console.log(f)
      for(let i=2 ;i<arg.keyPath.length;i+=1){
        if (f.children!==undefined){
          for (let j=0;j<f.children.length;j+=1){
            console.log(arg.keyPath[i],f.children[j])
            if (arg.keyPath[i]===f.children[j].key){
              f=f.children[j]
              break
            }
          }
        }
      }
      console.log(f)
      showFile(f.path).then(function(r){
        shownFile.value=f.path
        article.text=r
        selectedKeys.value=[arg.key]
      })
      formState.filename=f.name.slice(0,-3)
    }
    function rightClick(x,y,filePath){
      menuStyle.left=x
      menuStyle.top=y
      menuVisible.value=true
      selectedFile.value=filePath
      console.log("右键father",x,y,filePath)
    }
    const article = reactive({
      text:''
    })
    let height=reactive({
      now:document.documentElement.clientHeight+'px'
    })
    const saveConfirmVisible = ref(false);
    const addFileConfirmVisible = ref(false);
    const addFolderConfirmVisible = ref(false);
    const delConfirmVisible = ref(false);
    const renameConfirmVisible = ref(false);
    function addFile() {
      addFileConfirmVisible.value=true
    }
    function addFileConfirm(){
      saveConfirmFormRef.value.validateFields().then(values => {
        console.log("value: ",values)
        addFileConfirmVisible.value = false;
        let content=selectedFile.value
        for (let i=content.length-1;i>=0;i-=1){
          if(content[i]==='/'){
            content=content.slice(0,i)
            break
          }
        }
        readFiles(content+'/'+formState.filename,"")
        saveConfirmFormRef.value.resetFields();
        console.log({
          title:formState.filename,
          message: "",
          type: height.now
        })
        getLocalFile()
      }).catch(info=>{
        console.log('failed:',info)
      })
    }
    function delFile(){
      delConfirmVisible.value=true
    }
    function delConfirm() {
      delConfirmVisible.value=false
      delFiles(selectedFile.value)
      setTimeout(getLocalFile,20)
    }
    function addFolder(){
      addFolderConfirmVisible.value=true
    }
    function addFolderConfirm() {
      addFolderConfirmFormRef.value.validateFields().then(values => {
        console.log("value: ",values)
        addFolderConfirmVisible.value=false
        let content=selectedFile.value
        for (let i=content.length-1;i>=0;i-=1){
          if(content[i]==='/'){
            content=content.slice(0,i)
            break
          }
        }
        addFolders(content+'/'+addFolderFormState.folderName)
        addFolderConfirmFormRef.value.resetFields();
        getLocalFile()
      }).catch(info=>{
        console.log('failed:',info)
      })
    }
    const formState=reactive({
      filename:'未命名文件'
    })
    const addFolderFormState=reactive({
      folderName:'未命名文件夹'
    })
    let selectedFile=ref("")
    let shownFile=ref("")
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
    let collapsed= ref(false)





    return {
      article,
      submit,
      collapsed,
      selectedKeys,
      height,
      saveConfirmVisible,
      addFolderConfirmVisible,
      addFileConfirmVisible,
      delConfirmVisible,
      renameConfirmVisible,
      confirmSubmit,
      formState,
      saveConfirmFormRef,
      getLocalFile,
      menuClick,
      rightClick,
      fileList,
      menuStyle,
      menuVisible,
      ifLeftClick,
      addFile,
      selectedFile,
      shownFile,
      addFileConfirm,
      delFile,
      delConfirm,
      addFolder,
      addFolderConfirm,
      addFolderConfirmFormRef,
      addFolderFormState,
      getRemoteFile,
      uploadLocalFile
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
