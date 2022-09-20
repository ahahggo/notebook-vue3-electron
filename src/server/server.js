let express             = require('express');
const mysql = require ('mysql')
let app                 = express();
let bodyParse           = require('body-parser')

app.all('*', function (req, res, next){
    //res.header("Access-Control-Allow-Origin", 'http://10.21.202.109:8080');//允许源访问，本利前端访问路径为“http://localhost:8080”
    //res.header("Access-Control-Allow-Origin", 'http://localhost:8080' );//允许源访问，本利前端访问路径为“http://localhost:8080”
    let allowedOrigins = ['http://localhost:8080', 'http://localhost:8081','http://www.liuws.cn'];
    let origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1');
    next();
});

//使用bodyParse解释前端提交数据
app.use(bodyParse.urlencoded({extended:true})) ;
app.use(bodyParse.json());



//创建连接
let conn=mysql.createConnection({
    //主机地址
    host:'localhost',
    //用户名
    user:'todo',
    //密码
    password:'sAF5yjE25Tx84Cnd',
    //数据库名称
    database:'todo'
})
//获取连接
conn.connect((err)=>{
    if(err) throw err;
    console.log('连接成功');
})


// 监听6001端口
let server=app.listen(6002);
console.log("服务器已运行",server);
console.log("监听网址为:6002");

let deleteTable='drop table notes'
conn.query(deleteTable,function (err){
    if (err){
        console.log(err)
    }
})

let createTodos = `create table if not exists notes(
                          name varchar(128) not null,
                          content MEDIUMTEXT,
                          number int not null,
                          primary key(name)
                      )`;

conn.query(createTodos, function(err) {
    if (err) {
      console.log(err.message);
    }
    else{
        conn.query('show tables', function(err, results) {
            if (err) {
                console.log(err.message);
            }
            else{
                console.log(results)
            }
        })
    }
  })

app.post('/getAllFile',function (req,res){
    console.log(req.body)
    let getFile='select * from notes'
    conn.query(getFile,function (err,data){
        if (err) {
            console.log(err.message)
        }
        res.status(200).send(data)
        console.log(data)
    })
})

app.post('/getFile',function (req,res){
    console.log(req.body)
    let getFile='select content from notes where name ='+mysql.escape(req.body.filename)
    conn.query(getFile,function (err,data){
        if (err) {
            console.log(err.message)
        }
        res.status(200).send(data)
    })
})



app.post('/uploadAllFile',function (req,res){
    console.log(req.body)
    let allFile=req.body.filename

    for (let i=0;i<allFile.length;i+=1){
        let saveAllFile='insert into notes values '
        saveAllFile+= '('+mysql.escape(allFile[i].name)+','+mysql.escape(allFile[i].content)+',1)'

        conn.query(saveAllFile,function (err){
            if (err) {
                let updateNote='update notes set content='+'"'+mysql.escape(allFile[i].content)+'"'+'where name ='+'"'+mysql.escape(allFile[i].name)+'"'
                conn.query(updateNote,function (err){
                    if(err){
                        console.log(err.message)
                    }

                })

            }
        })
    }

    res.status(200).send("ok")
})