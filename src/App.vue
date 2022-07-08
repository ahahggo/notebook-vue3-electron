<template>

  <v-md-editor v-model="article.text" height="400px"></v-md-editor>

  <el-button @click=submit()>
    提交
  </el-button>

</template>

<script>



import { reactive } from 'vue'
import { ElNotification } from 'element-plus'
import {readFiles} from "./readFile.js";


export default {
  name: 'App',

  components: {

  },
  setup(){
    function submit(){

      readFiles('hello',article.text)
        ElNotification({
          title:'提交成功',
          message: article.text,
          type: 'success'
        })
    }
    const article = reactive({
      text:''
    })
    return {
      article,
      submit
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
  margin-top: 60px;
}
</style>
