let express = require('express');
let app = express();
domain = require('domain');
db = require('./db');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
//处理文件上传首先要用npm下载multer@0.1.8的版本模块和path模块
let multer = require("multer");
let order_search = require('./routers/order_search');
let order_edit = require('./routers/order_edit');
app.set('view engine','ejs');//设置模板引擎
//使用express-session中间件
app.use(session({
    secret:'testApplication',cookie:{maxAge:1200000}
}));
//使用cookieParser中间件
app.use(cookieParser());
//使用bodyParsers中间件
app.use(bodyParser());
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({
    extended: false,
}));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type'}));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html'}));

//使用multer@0.1.8中间件
app.use(multer());

//利用static内置中间件可以让客户端可以访问应用程序根目录的images文件夹
app.use('/images',express.static(__dirname+'/images/'));

//自定义错误中间件，当domain捕获到异步发生的错误时调用的中间件
app.use((err,req,res,next)=>{
res.send(500,err.message);
});

/*app.use(express.static(__dirname + '/public'));*/
app.get('/',order_search.get);//打开首页
app.post('/search',order_search.search);//查询订单信息
app.get('/search',order_search.search);//在订单编辑页面返回来的时候
app.get('/new',order_edit.new);//在订单查询页面点击新增
app.get('/edit/:code',order_edit.search);//在订单查询页面点击编辑
app.post('/edit',order_edit.add);//在订单编辑页面点击追加
app.post('/edit/:code',order_edit.update);//在订单编辑页面点击修改
app.post('/delete/:code',order_edit.delete);//在订单编辑页面点击删除
app.get('/return',order_edit.return);//在订单编辑页面点击返回
app.listen(1337,'localhost');