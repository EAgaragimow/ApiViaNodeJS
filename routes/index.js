let modelCart = require('../cartModel');

module.exports.index = function(req, res) {
    modelCart.checkUnusableCart(req, res);

    res.send(`
        <h1>API react</h1>
        <p><a href="/products/all">Get all products</a></p>
        <p><a href="/cart/load">Get cart by id, or new</a></p>
        <p><a href="/cart/loadProducts">Get products by cart id</a></p>
    `);
};

module.exports.productsAll = function (req, res) {
    /**
     * Return all products
     */
    req.getConnection(function (err, connection) {
        connection.query('SELECT * FROM products', function (err, rows) {
            if (err) throw new Error;
            res.send(rows);
        });
    });
};

module.exports.cart = function (req, res) {
    let cart_id = req.query.cart_id !== undefined ? req.query.cart_id : '';
    if (cart_id !== '') {
        /** Update needUpdate **/
        modelCart.updateCart(req, res, {needUpdate: 0}, cart_id);

        /** Return Cart by ID **/
        modelCart.getCartById(req, res, cart_id);
    } else {
        modelCart.createNewCart(req, res);
    }
};

module.exports.cart_products = function (req, res) {
    let cart_id = req.query.cart_id !== undefined ? req.query.cart_id : '';
    if (cart_id !== '') {
        /** Return Cart by ID **/
        modelCart.getProductsByCartId(req, res, cart_id);
    }
};

module.exports.addProduct = function (req, res) {
    // for dev, make some delay
    setTimeout(function () {
        let cart_id = req.query.cart_id !== undefined ? req.query.cart_id : '';
        let product_id = req.query.product_id !== undefined ? req.query.product_id : '';

        if (cart_id !== '' && product_id !== '') {
            /** Return Cart by ID **/
            modelCart.addProduct(req, res, cart_id, product_id);
        }
    }, 200);
};

module.exports.changeProduct = function (req, res) {
    // for dev, make some delay
    setTimeout(function () {
        let cart_id = req.query.cart_id !== undefined ? req.query.cart_id : '';
        let product_id = req.query.product_id !== undefined ? req.query.product_id : '';
        let quantity = req.query.quantity !== undefined ? req.query.quantity : '';

        if (cart_id !== '' && product_id !== '' && quantity !== '') {
            /** Return Cart by ID **/
            modelCart.changeProduct(req, res, cart_id, product_id, quantity);
        }
    }, 200);
};

module.exports.removeProduct = function (req, res) {
    // for dev, make some delay
    setTimeout(function () {
        let cart_id = req.query.cart_id !== undefined ? req.query.cart_id : '';
        let product_id = req.query.product_id !== undefined ? req.query.product_id : '';

        if (cart_id !== '' && product_id !== '') {
            /** Return Cart by ID **/
            modelCart.removeProduct(req, res, cart_id, product_id);
        }
    }, 200);
};

module.exports.cleanCart = function (req, res) {
    let cart_id = req.query.cart_id !== undefined ? req.query.cart_id : '';

    if (cart_id !== '') {
        /** Return Cart by ID **/
        modelCart.cleanCart(req, res, cart_id);
    }
};

// module.exports.add = function (req, res) {
// //     res.render('add_customer', {page_title: 'Добавить пользователя в CRM систему'});
// // };
// // module.exports.save = function (req, res) {
// //     var input = req.body;
// //     req.getConnection(function (err, connection) {
// //         var data = {
// //             name    : input.name,
// //             address : input.address,
// //             email   : input.email,
// //             phone   : input.phone
// //         };
// //         connection.query('INSERT INTO customers SET ? ', [data], function (err, rows) {
// //             if (err) throw new Error;
// //             res.redirect('/customers');
// //         });
// //     });
// // };

// module.exports.edit = function (req, res) {
//     var id = req.params.id;
//     req.getConnection(function (err, connection) {
//         connection.query('SELECT * FROM customers WHERE id = ?', [id], function (err, rows) {
//             if (err) throw new Error;
//             res.render('edit_customer', {page_title: 'Изменить пользователя в CRM системе', data: rows});
//         });
//     });
// };
//
// module.exports.edit_save = function (req, res) {
//     var input = req.body;
//     var id = req.params.id;
//     req.getConnection(function (err, connection) {
//         var data = {
//             name    : input.name,
//             address : input.address,
//             email   : input.email,
//             phone   : input.phone
//         };
//         connection.query('UPDATE customers SET ? WHERE id = ? ', [data, id], function (err, rows) {
//             if (err) throw new Error;
//             res.redirect('/customers');
//         });
//     });
// };

// module.exports.delete = function (req, res) {
//     var id = req.params.id;
//     req.getConnection(function (err, connection) {
//         connection.query('DELETE FROM customers  WHERE id = ? ', [id], function (err, rows) {
//             if (err) throw new Error;
//             res.redirect('/customers');
//         });
//     });
// };