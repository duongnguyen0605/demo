var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.session.user;
  var mydb = req.app.locals.mydb.products;
  res.render('index', { title: 'HOME' ,products:mydb, user:user});
});
/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'CONTACT' });
});

// login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN' });
});

router.post('/login', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  req.app.locals.mydb.user.forEach(function(item){
    if(item.username == username && item.password == password){
      req.session.user = item;
      if(item.role == "admin"){
        res.redirect('/admin');
      }else if(item.role == "user"){
        res.redirect('/');        
      }
      
    }
  })
  res.render('login', { title: 'LOGIN',message:"Username or Password is incorrect" });
})

router.get('/logout',function(req, res, next){
  req.session.destroy((err)=>{
    console.log(err);
  })
  res.redirect('/');
})

// end login

// admin
router.get('/admin', function(req, res, next) {
  var user = req.session.user;
  res.render('admin', { title: 'ADMIN',user:user });
});

//user
router.get('/admin/users', function(req, res, next) {
  var user = req.session.user;
  var users = req.app.locals.mydb.user;
  res.render('../views/listusers', { title: 'ADMIN',users:users, user:user });
});

router.get('/admin/adduser', function(req, res, next) {
  var user = req.session.user;
  res.render('../views/adduser', { title: 'ADD USER', user:user });
});

router.post('/admin/adduser',function(req, res, next){
  var userAdmin = req.session.user;
  var users = req.app.locals.mydb.user;
  var user = req.body;
  var check = 0;
  users.forEach((item)=>{
    if(item.username == user.username){
      check++;
    }
  })
  if(check != 0){
    res.render('../views/adduser', { title: 'ADD USER',message:"Username exited! Please choose another usernane",user:userAdmin });
  }else{
    req.app.locals.mydb.user.push(user);
    res.render('../views/adduser', { title: 'ADD USER',message:"Add a user success!",user:userAdmin });
  }
})
router.get('/admin/deluser.:id', function(req, res, next) {
  var user = req.session.user;
  var id = req.params.id;
  var users = req.app.locals.mydb.user;
  var index = 0;
  users.forEach((item)=>{
    if(item.userID == id){
      req.app.locals.mydb.user.splice(index,1);
      res.render('../views/listusers', { title: 'ADMIN',users:users,message:"Delete a user success!",user:user });
    }
    index++;
  })
  res.redirect('/admin/users');
});

router.get('/admin/updateuser-:id',function(req, res, next){
  var user = req.session.user;
  var id = req.params.id;
  var users = req.app.locals.mydb.user;
  users.forEach((item)=>{
    if(item.userID == id){
      res.render('../views/updateuser',{title:"UPDATE USER", _1user:item, user:user});
    }
  })
  
});

router.post('/admin/updateuser',function(req, res, next){
  var userAdmin = req.session.user;
  var users = req.app.locals.mydb.user;
  var user = req.body;
  var index = 0;
  users.forEach((item)=>{
    if(item.userID == user.userID){
      req.app.locals.mydb.user[index].username = user.username;
      req.app.locals.mydb.user[index].password = user.password;
      req.app.locals.mydb.user[index].name = user.name;
      req.app.locals.mydb.user[index].role = user.role;
      res.render('../views/listusers', { title: 'ADMIN',users:users,message:"Update a user success!",user:userAdmin });
    }
    index++;
  })
});

//product
router.get('/admin/products', function(req, res, next) {
  var user = req.session.user;
  var products = req.app.locals.mydb.products;
  res.render('../views/listproducts', { title: 'ADMIN', products:products,user:user });
});

router.get('/admin/addproduct', function(req, res, next) {
  var user = req.session.user;
  res.render('../views/addproduct', { title: 'ADD PRODUCT',user:user });
});

router.post('/admin/addproduct', function(req, res, next) {
  var user = req.session.user;
  var product = req.body;
  product.productImage = 'images/'+req.body.productImage;
  req.app.locals.mydb.products.push(product);
  res.render('../views/addproduct', { title: 'ADD PRODUCT',message:"Add a product success! ", user:user });
});

router.get('/admin/delproduct.:id', function(req, res, next) {
  var user = req.session.user;
  var id = req.params.id;
  var products = req.app.locals.mydb.products;
  var index = 0;
  products.forEach((item)=>{
    if(item.productID == id){
      req.app.locals.mydb.products.splice(index,1);
      res.render('../views/listproducts', { title: 'ADMIN',products:products,message:"Delete a products success!",user:user });
    }
    index++;
  })
  res.redirect('/admin/products');
});

router.get('/admin/updateproduct-:id', function(req, res, next) {
  var user = req.session.user;
  var id = req.params.id;
  var products = req.app.locals.mydb.products;
  products.forEach((item)=>{
    if(item.productID == id){
      res.render('../views/updateproduct', { title: 'ADMIN',product:item,user:user});
    }
  })
  
});

router.post('/admin/updateproduct', function(req, res, next) {
  var user = req.session.user;
  var products = req.app.locals.mydb.products;
  var product = req.body;
  var index = 0;
  products.forEach((item)=>{
    if(item.productID == product.productID){
      req.app.locals.mydb.products[index].productName = product.productName;
      req.app.locals.mydb.products[index].productImage = product.productImage;
      req.app.locals.mydb.products[index].category = product.category;
      req.app.locals.mydb.products[index].price = product.price;
      res.render('../views/listproducts', { title: 'ADMIN', products:products,message:"Update a user success!", user:user });
    }
    index++;
  })
});

module.exports = router;
