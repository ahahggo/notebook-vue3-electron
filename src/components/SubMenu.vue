<template>
  <div>

    <template v-for="file in menuInfo" :key="file.key">
      <template v-if="!file.children">
        <a-menu-item :key="file.key" @contextmenu.prevent="rightClick(file.path,$event)">
          <span>{{file.name}}</span>
        </a-menu-item>
      </template>

      <!--              递归搜索文件夹-->
      <template v-else>
        <a-sub-menu :key="file.key" >
          <template #icon><folder-outlined /></template>
          <template #title>
            <div @contextmenu.prevent="rightClick(file.path,$event)">
              {{file.name}}
            </div>

          </template>

          <SubMenu  :key="file.key" :menu-info="file.children" @rightClick="callbackRightClick"/>
        </a-sub-menu>
    </template>
    </template>

  </div>

</template>

<script>
import {FolderOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";

export default {
  name: "SubMenu",
  isSubMenu:true,
  props:{
    menuInfo:{

    }
  },
  components:{
    FolderOutlined,
  },

  setup(props,context){

    let selected=ref()





    function rightClick(filePath,e){

      selected.value= {x:e.pageX + "px", y:e.pageY + "px", f:filePath}
      context.emit('rightClick',selected.value.x,selected.value.y,selected.value.f)
      console.log("右键",filePath,e)
    }
    function callbackRightClick(x,y,f){
      context.emit('rightClick',x,y,f)
    }
    function leftClick(f,e) {
      console.log(f,e)
    }
    return{
      rightClick,
      leftClick,
      selected,
      callbackRightClick

    }
  }
}
</script>

<style scoped>

</style>