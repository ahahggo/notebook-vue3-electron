let express             = require('express');
const mysql = require ('mysql')
let app                 = express();
let bodyParse           = require('body-parser')

app.all('*', function (req, res, next){
    //res.header("Access-Control-Allow-Origin", 'http://10.21.202.109:8080');//允许源访问，本利前端访问路径为“http://localhost:8080”
    res.header("Access-Control-Allow-Origin", 'http://localhost:8080');//允许源访问，本利前端访问路径为“http://localhost:8080”
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

let createTodos = `create table if not exists notes(
                          name varchar(128) not null,
                          content MEDIUMTEXT,
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
    res.status(200).send("ok")
})

app.post('/uploadAllFile',function (req,res){
    console.log(req.body)
    res.status(200).send("ok")
})