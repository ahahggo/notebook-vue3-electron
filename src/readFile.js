const {ipcRenderer} = require('electron');
import axios from 'axios'
const service = axios.create({
    baseURL: 'http://47.99.165.165:6002', // 所有的请求地址前缀部分
    //baseURL: 'http://127.0.0.1:6001',
    timeout: 600, // 请求超时时间毫秒
    withCredentials: true, // 异步请求携带cookie
    headers: {
        // 设置后端需要的传参类型
        'Content-Type': 'application/json',

        'X-Requested-With': 'XMLHttpRequest',
    },
})




export function getAllFileFromServer(){
    service({
        url:'/getAllFile',
        method:'post',
        data:{msg:'hello server'}
    }).then(function (res){
        console.log(res)
    })

}




export function readFiles(title,content){
    console.log("run function")
    let a={
        title:title,
        content:content
    }
    ipcRenderer.send('saveFile',a)
}

export function addFolders(title){
    console.log("run function")
    ipcRenderer.send('addFolder',title)
}

export function delFiles(title){

    ipcRenderer.send('delFile',title)
}

export function localFile(filepath){
    return new Promise(function (resolve){
        ipcRenderer.send("local",filepath)
        ipcRenderer.on("file", function(event,args){
            resolve(args)
        })
    })
}

export function showFile(filepath){
    return new Promise(function (resolve){
        ipcRenderer.send("show",filepath)
        ipcRenderer.on("sendfile", function(event,args){
            resolve(args)
        })
    })
}

