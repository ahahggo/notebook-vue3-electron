'use strict'
import { app, protocol, BrowserWindow ,ipcMain} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import * as electron from "electron";


let fs = require('fs');
//import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'



// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  electron.Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    width: 1920,
    height: 1024,
    minWidth: 1200,
    webPreferences:{
            nodeIntegration: true,  //完全使用nodeapi
            contextIsolation:false,  //由于新版electron把这个默认属性改为true 官给出解释大概意思是保证渲染进程太容易访问主进程要保证安主进程全性隔离
          }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')

  }
  ipcMain.on("local",async function (event, args){
    let k = 0
    async function readContent(path) {
      let filename=[]
      let dir = await fs.promises.opendir(path);
      for await (let dirent of dir) {
        if (dirent.isDirectory()){
          filename.push({
            key:k,
            name:dirent.name,
            path:path+"/"+dirent.name,
            children:await readContent(path+"/"+dirent.name)
          })
          k+=1
        }
        else{
          filename.push({
            key:k,
            name:dirent.name,
            path:path+"/"+dirent.name,
            children:null

          })
          k+=1
        }

      }
      return filename
    }
    let all=await readContent(args).catch(reason => {console.log(reason)})
    win.webContents.send("file",all) //
  })

  ipcMain.on("show",function(event, args){
    fs.readFile(args,(err,data)=>{
      if (err){
        console.log("读取失败")
      }
      else{
        data=data.toString()
        console.log(data)
        win.webContents.send("sendfile",data)
      }
    })
  })
}



ipcMain.on('saveFile',function (event, arg){
  console.log("receive")
  console.log(arg)
  let fd = fs.openSync(arg.title+'.md','w');
  fs.writeSync(fd,arg.content);
  fs.closeSync(fd);
})

ipcMain.on('addFolder',function (event, arg){
  console.log("receive")
  console.log(arg)
  fs.mkdir(arg,(err)=>{
    if (err){
      console.log(err)
    }
  })
})

ipcMain.on('delFile',function (event, arg){
  const path=require('path')
  function rmdir(dir,cb){
    fs.stat(dir,function (err,stateObj){
      if(stateObj.isDirectory()){
        fs.readdir(dir,function (err,dirs){
          dirs=dirs.map(item=>path.join(dir,item))
          let index = 0
          function step(){
            if(index===dirs.length){
              return fs.rmdir(dir,cb)
            }
            rmdir(dirs[index++],step)
          }
          step()
        })
      } else{
        fs.unlink(dir,cb)
      }
    })
  }
  rmdir(arg,function (){
    console.log("delete finish")
  })
})



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS3_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

