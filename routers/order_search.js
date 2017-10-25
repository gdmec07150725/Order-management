exports.get = function(req,res){
    //摧毁之前保存的session
    req.session.destroy();
    //渲染订单管理页面order_search.ejs.并传递参数
    res.render('order_search',{rows:new Array(),order:null})
};
exports.search = function  (req,res,next){
    //创建domain实例对象,捕获异步发生的错误
    let d = domain.create();
    d.on('error',(err)=>{
        next(err);
    });
    d.run(()=>{
        db.connect(()=>{
            //connect方法回调执行函数
            let order = new Object();
            //如果客户端提交的是post方法
            if(req.method =='POST'){
                //获取客户端提交的code值
                if(req.body.code){
                    order.code = req.body.code;
                    //写入session
                    req.session.code = req.body.code;
                }else{
                    req.session.code = null;
                }
                //获取客户端提交的date
                if(req.body.date){
                    order.date = new Date(req.body.date);
                    req.session.date = req.body.date;
                }else{
                    req.session.date = null;
                }
                //获取客户端提交的goodsCode
                if(req.body.goodsCode){
                    order.goodsCode = req.body.goodsCode;
                    req.session.goodsCode = req.body.goodsCode;
                }else{
                    req.session.goodsCode = null;
                }
            }else{//如果客户端没有提交post请求那就用之前服务器session保存的数据
                if(req.session.code){
                    order.code = req.session.code;
                }
                if(req.session.date){
                    order.date = req.session.date;
                }
                if(req.session.goodsCode){
                    order.goodsCode = req.session.goodsCode;
                }
            }
            db.searchOrder(order,()=>{
                //检索成功后执行的代码
                //断开数据库连接
                db.disconnect();
                //选人order_serach页面
                res.render('order_search',{rows:db.orders,order:order});
            });
        });
    });
};
