/** Get cart by cart id **/
function getCartById(req, res, cart_id) {
    req.getConnection(function (err, connection) {
        connection.query(`SELECT * FROM cart WHERE cart_id=${cart_id}`, function (err, rows) {
            if (err) throw new Error;
            if (rows.length === 0) {
                createNewCart(req, res);
            } else {
                res.send(rows);
            }
        });
    });
}

/** Get products by cart id **/
function getProductsByCartId(req, res, cart_id) {
    req.getConnection(function (err, connection) {
        connection.query(`SELECT c.cart_id, c.needUpdate, cp.product_id, cp.quantity FROM cart c LEFT JOIN cart_products cp ON (c.cart_id = cp.cart_id) WHERE cp.cart_id=${cart_id}`, function (err, rows) {
            if (err) throw new Error;

            let data = [];
            for (let i = 0; i < rows.length; i++) {
                data.push({id: rows[i].product_id, cnt: rows[i].quantity});
            }

            res.send(data);
        });
    });
}

/** Create new Cart **/
function createNewCart(req, res) {
    let data = {
        date_modified: null,
    };

    req.getConnection(function (err, connection) {
        connection.query('INSERT INTO cart SET ? ', [data], function (err, rows) {
            if (err) throw err;
            let cartID = rows['insertId'];

             /** Return new Cart **/
            getCartById(req, res, cartID);
        });
    });
}

/** Add product to Cart **/
function addProduct(req, res, cart_id, product_id) {
    let data = {
        cart_id,
        product_id,
        quantity: 1
    };

    req.getConnection(function (err, connection) {
        connection.query('INSERT INTO cart_products SET ? ', [data], function (err, row) {
            if (err) throw err;
            res.send(true);
        });
    });
}

/** Remove product to Cart **/
function removeProduct(req, res, cart_id, product_id) {
    req.getConnection(function (err, connection) {
        connection.query('DELETE FROM cart_products WHERE cart_id = ? AND product_id = ? ', [cart_id, product_id], function (err) {
            if (err) throw err;
            res.send(true);
        });
    });
}

/** Change product in Cart **/
function changeProduct(req, res, cart_id, product_id, quantity) {
    let data = {
        cart_id,
        product_id,
        quantity
    };

    req.getConnection(function (err, connection) {
        connection.query('UPDATE cart_products SET ? WHERE cart_id = ? AND product_id = ? ', [data, cart_id, product_id], function (err) {
            if (err) throw err;
            res.send(true);
        });
    });
}

function checkUnusableCart(req, res) {
    req.getConnection(function (err, connection) {
        connection.query(`SELECT * FROM cart`, function (err, rows) {
            if (err) throw new Error;
            let data = rows.filter((cart) => {
                let now = new Date().getTime();
                let my_date_added = (new Date(cart['date_added']).getTime() + (24 * 60 * 60 * 100));
                let my_date_modify = cart['date_modified'] !== null ? (new Date(cart['date_modified']).getTime() + (24 * 60 * 60 * 100)) : cart['date_modified'];

                if (my_date_modify !== null) {
                    return now > my_date_modify;
                } else {
                    return now > my_date_added;
                }
            });

            data.map(cart => {
                deleteCart(req, res, cart['id']);
            });

            res.end();
        });
    });
}

/** cleanCart **/
function cleanCart(req, res, cart_id) {
    req.getConnection(function (err, connection) {
        connection.query('DELETE FROM cart_products WHERE cart_id = ?', [cart_id], function (err) {
            if (err) throw err;
            res.send(true);
        });
    });
}

function updateCart(req, res, data, cart_id) {
    req.getConnection(function (err, connection) {
        connection.query(`UPDATE cart SET ? WHERE cart_id = ?`, [data, cart_id], function (err) {
            if (err) throw new Error;
        });
    });
}

function deleteCart(req, res, id) {
    req.getConnection(function (err, connection) {
        connection.query('DELETE FROM cart WHERE cart_id = ? ', [id], function (err) {
            if (err) throw new Error;
        });
    });
}

module.exports = {
    createNewCart,
    checkUnusableCart,
    getProductsByCartId,
    addProduct,
    changeProduct,
    removeProduct,
    getCartById,
    cleanCart,
    updateCart,
};