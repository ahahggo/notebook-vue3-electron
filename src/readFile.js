const {ipcRenderer} = require('electron');
export function readFiles(title,content){
    console.log("run function")
    let a={
        title:title,
        content:content
    }
    ipcRenderer.send('saveFile',a)
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

