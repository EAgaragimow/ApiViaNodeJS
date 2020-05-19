const app = require('express')(),
      cors = require('cors'),
      mysql = require('mysql'),
      routes = require('./routes'),
      connection = require('express-myconnection'),
      port = 4000;

app.use(cors());
app.use(connection(mysql, {
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306,
        database:'reactapi'
    },'pool') // or single
);

app.get('/', routes.index);
app.get('/products/all', routes.productsAll);
app.get('/cart/load', routes.cart);
app.get('/cart/loadProducts', routes.cart_products);
app.get('/cart/addProduct', routes.addProduct);
app.get('/cart/removeProduct', routes.removeProduct);
app.get('/cart/changeProduct', routes.changeProduct);
app.get('/cart/cleanCart', routes.cleanCart);

app.listen(port, function () {
    console.log('Listen on port: ' + port);
});