<template>

  <v-md-editor v-model="article.text" height="400px"></v-md-editor>

</template>

<script>



import { reactive } from 'vue'
export default {
  name: 'App',

  components: {

  },
  setup(){
    const article = reactive({
      text:''
    })
    return {
      article
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
