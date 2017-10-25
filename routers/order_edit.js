//用户点击新增发送的get请求的new中间件函数
exports.new = function (req,res){
    res.render('order_edit',{code:'',errMsg:null,successMsg:null});
};
//用户点击编辑按钮时发送的get请求/edit/+订单编号的search中间件函数
exports.search = function (req,res){
    let d = domain.create();
    d.on('error',(err)=>{
        next(err);
    });
    d.run(()=>{
        db.connect(()=>{
            let order ={code:req.params.code};
            db.searchOrder(order,()=>{
                db.disconnect();
                res.render('order_edit',{code:req.body.code,order:db.orders[0],errMsg:null,successMsg:null});
            })
        })
    })
};
//用户点击追加按钮时,发送post请求，目标地址为/edit.服务器调用order_edit模块中的add中间件函数
exports.add = function (req,res,next){
    let d = domain.create();
    d.on('error',(err)=>{
        next(err);
    });
    d.run(()=>{
        db.connect(()=>{
            // 获取用户输入的订单信息
            let order = new Object();
            order.code =req.body.code;
            order.date = new Date(req.body.date);
            order.goodsCode = req.body.brandName;
            order.num = req.body.num;
            order.price = req.body.price;
            order.personName = req.body.personName;
            order.email = req.body.email;
            db.addOrder(order,()=>{
                db.disconnect();
                //订单已被占用,或者追加失败时
                if(db.errMsg){
                    res.render('order_edit',{code:req.body.code,order:order,errMsg:db.errMsg,successMsg:null});
                }else{
                    res.render('order_edit',{code:req.body.code,order:order,errMsg:null,successMsg:null});
                }
            })
        })
    })
};
//用户在订单编辑页面上面点击修改，发送post请求，地址为/edit/+订单编号，服务器接收到该请求后调用order_edit模块中的update中间件函数
exports.update = function(req,res,next){
    let d = domain.create();
    d.on('error',(err)=>{
        next(err);
    });
    d.run(()=>{
        db.connect(()=>{
            let order = new Object();
            order.code = req.body.code;
            order.date = new Date(req.body.date);
            order.goodsCode = req.body.goodsCode;
            order.brandName = req.body.brandName;
            order.num = req.body.num;
            order.price = req.body.price;
            order.personName = req.body.personName;
            order.email = req.body.email;
            db.updateOrder(order,()=>{
                db.disconnect();
                res.render('order_edit',{code:req.body.code,order:order,successMsg:'订单数据修改成功',errMsg:null});
            });
        });
    });
};
//用户点击删除按钮时，发送post请求，地址为/delete/+订单编号,服务器调用order_edit模块中的delete中间件函数
exports.delete = function(req,res,next){
    let d = domain.create();
    d.on('error',(err)=>{
        next(err);
    });
    d.run(()=>{
        db.connect(()=>{
            let order = new Object();
            order.code = req.body.code;
            db.deleteOrder(order,()=>{
                db.disconnect();
                if(req.session.code||req.session.date||req.session.goodsCode)
                    res.redirect('/search/');
                else{
                    res.render('order_search',{rows:new Array(),order:null});
                }
            })
        })
    })
};
//用户点击返回按钮时，发送POST请求目标地址为'return'，服务器接收到请求后调用order_edit模块中的return中间件函数
exports.return = function(req,res,next){
    if(req.session.code||req.session.date||req.session.goodsCode)
        res.redirect('/search/');
    else{
        res.render('order_search',{rows:new Array(),order:null});
    }
};
