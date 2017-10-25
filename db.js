//使用mongoose
let mongoose = require('mongoose');
Schema = mongoose.Schema;
//利用mongoose定义数据架构
let orderSchema = new Schema({
    code:String,
    date:Date,
    goodsCode:String,
    brandName:String,
    num:Number,
    price:Number,
    personName:String,
    email:String
});
exports.connect = function (callback){
    //连接myDatabase数据库
    mongoose.connect('mongodb://localhost:27017/myDatabase',(err)=>{
        if(err) throw(err);
        else callback();
    });
};
//创建表orders
let Orders = mongoose.model('orders',orderSchema);
//连接数据库

//查询数据
exports.searchOrder = function(order,callback){
    Orders.find(order,(err,orders)=>{
        if(err) throw  err;
        else{
            //导出数据
            exports.orders = orders;
            //回调函数继续执行下面的代码
            callback();
        }
    });
};
//插入数据
exports.addOrder = function(order,callback){
    Orders.find({code:order.code},(err,orders)=>{
        if(err) throw  err;
        else{
            //检查订单编号是否已经存在
            if(orders.length>0){
                exports.errMsg = '该订单编号已被占用';
                callback();
            }
            else{
                Orders.create(order,(err)=>{
                    if(err) throw(err);
                    else{
                        exports.errMsg = '';
                        callback();
                    }
                });
            }
        }
    });
};
//修改数据
exports.updateOrder = function (order,callback){
    Orders.update({code:order.code},order,(err)=>{
        if(err) throw err;
        //更新成功后执行的回调函数
        else callback();
    });
};
//删除数据
exports.deleteOrder = function(order,callback){
    Orders.findOne({code:order.code},(err,order)=>{
        if(err) throw err;
        else{
            //删除数据
            order.remove();
            callback();
        }
    })
};
//自定义disconnect函数，断开数据库连接
exports.disconnect=function(){
    mongoose.disconnect();
};
