const {ipcRenderer} = require('electron');
export function readFiles(title,content){
    console.log("run function")
    let a={
        title:title,
        content:content
    }
    ipcRenderer.send('123',a)
}

