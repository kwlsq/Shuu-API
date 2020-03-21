const connection = require('../Databases');
const { uploader } = require('../Helpers/uploader');
const fs = require('fs')

module.exports = {
    addToCart: (req, res) => {
        console.log('mashuk pak eko')
        console.log(req.body)
        console.log(req.user)
        //untuk ambil value yang bisa dimanipulasi dari front end (price,weight)
        const sql = `SELECT p.id,p.stock,p.price,p.weight 
        FROM products p 
        WHERE p.id='${req.body.id}';`

        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results[0])
            console.log(results[0].price * req.body.qty)
            console.log(results[0].weight * req.body.qty)
            const sql2 = `SELECT * FROM cart WHERE product_id='${results[0].id}' AND transaction_id=0` //untuk cek apakah cart dari item yg dipilih kosong atau ad item yg sama
            connection.query(sql2, (err, results2) => {
                if (err) {
                    return res.status(500).send(err)
                }
                console.log(results2.length, 'length')
                if (results2.length === 0) { //kalo item yang dipilih masih kosong, berarti tinggal insert aja
                    console.log('masuk yg atas', req.user.id)
                    console.log('masuk yg atas', req.body.id)
                    const sql3 = `INSERT INTO cart(user_id,product_id,qty,total_weight,total_price,total_ongkir) 
                    VALUES('${req.user.id}','${req.body.id}','${req.body.qty}','${results[0].weight * req.body.qty}',
                    '${results[0].price * req.body.qty}',0)`
                    connection.query(sql3, (err, results3) => {
                        if (err) {
                            console.log('disini masalahnya')
                            return res.status(500).send(err)
                        }
                        const sql4 = `
                        SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
                        ,b.name as brands,b.profilepic,s.size,p.price,p.stock,c.qty,c.total_weight,c.total_price 
                        FROM cart c 
                        JOIN users u ON c.user_id=u.id 
                        JOIN products p ON c.product_id=p.id 
                        JOIN sizes s ON p.size_id=s.id
                        JOIN product_name pn ON p.product_name_id=pn.id 
                        JOIN brands b ON p.store_id=b.id
                        WHERE c.user_id='${req.user.id}' AND transaction_id=0;
                        `
                        console.log(results3)
                        connection.query(sql4, (err, results4) => {
                            if (err) {
                                return res.status(500).send(err)
                            }
                            console.log(results4, 'FINAL BOSSSSSSSSSSS')
                            return res.status(200).send(results4[0])
                        })
                    })
                } else {
                    console.log(results[0].id, 'idiiddidi')
                    const sql3 = `SELECT id,qty FROM cart WHERE id=${results2[0].id} && user_id=${req.user.id};` //sekarang kita cek qty dari produk yg dipilih
                    connection.query(sql3, (err, results3) => {
                        if (err) {
                            return res.status(500).send(err)
                        }
                        console.log(req.body.qty, 'picked qty')
                        console.log(results[0].stock, 'STOCK')
                        console.log(results3[0].qty, 'QTYYYYYY')
                        if (parseInt(req.body.qty) + parseInt(results3[0].qty) > results[0].stock) { //kalo qty yg dimasukkan ke cart sudah melebihi stock, maka error
                            return res.status(500).send({ error: 'You added too much items' })
                        }
                        console.log(results3, 'res3')
                        //kalo qty aman, tinggal update isi dari cartnya, tambahkan qty,weight,price sebelumnya dengan q,w,p baru
                        console.log('masuk yg bawah', results3[0].id)
                        const sql4 = `UPDATE cart 
                        SET qty=qty+'${req.body.qty}',
                        total_weight=total_weight+'${parseInt(results[0].weight) * parseInt(req.body.qty)}',
                        total_price=total_price+'${parseInt(results[0].price) * parseInt(req.body.qty)}'
                        WHERE id='${results3[0].id}' && user_id='${req.user.id}';`
                        console.log(sql4)
                        connection.query(sql4, (err, results4) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).send(err)
                            }
                            console.log(results4, 'okkk')
                            const sql5 = `
                            SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
                            ,b.name,b.profilepic,s.size,p.price,p.stock,c.qty,c.total_weight,c.total_price 
                            FROM cart c 
                            JOIN users u ON c.user_id=u.id 
                            JOIN products p ON c.product_id=p.id
                            JOIN sizes s ON p.size_id=s.id
                            JOIN product_name pn ON p.product_name_id=pn.id 
                            JOIN brands b ON p.store_id=b.id
                            WHERE c.user_id='${req.user.id}' AND transaction_id=0;
                            `
                            console.log(results3)
                            connection.query(sql5, (err, results5) => {
                                if (err) {
                                    return res.status(500).send(err)
                                }
                                console.log(results5, 'FINAL BOSSSSSSSSSSS')
                                return res.status(200).send(results5[0])
                            })
                        })

                    })
                }
            })
        })
    },
    getCartValuesByUserId: (req, res) => {
        console.log(req.user, 'masuk ke sini')
        const sql = `SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
            ,b.name as brands,b.profilepic,s.size,p.price,p.stock,c.qty,c.total_weight,c.total_price,
            bd.province,bd.province_id ,bd.city,bd.city_id ,bd.address_detail
            FROM cart c 
            JOIN users u ON c.user_id=u.id 
            JOIN products p ON c.product_id=p.id
            JOIN sizes s ON p.size_id=s.id
            JOIN product_name pn ON p.product_name_id=pn.id 
            JOIN brands b ON p.store_id=b.id
            JOIN brands_detail bd ON bd.brand_id=b.id
            WHERE c.user_id=${req.user.id} AND transaction_id=0
        ;`

        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log('kena', results)
            return res.status(200).send(results)
        })
    },
    getCartValuesByTransactionId: (req, res) => {
        console.log(req.user, 'masuk ke sini')
        console.log(req.body)
        const sql = `SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
            ,b.name as brands,b.profilepic,s.size,p.price,p.stock,c.qty,c.total_weight,c.total_price,
            bd.province,bd.province_id ,bd.city,bd.city_id ,bd.address_detail
            FROM cart c 
            JOIN users u ON c.user_id=u.id 
            JOIN products p ON c.product_id=p.id
            JOIN sizes s ON p.size_id=s.id
            JOIN product_name pn ON p.product_name_id=pn.id 
            JOIN brands b ON p.store_id=b.id
            JOIN brands_detail bd ON bd.brand_id=b.id
            WHERE c.user_id=${req.user.id} && transaction_id=${req.body.t_id}
        ;`

        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log('kena', results)
            return res.status(200).send(results)
        })
    },
    changeQty: (req, res) => {
        console.log(parseInt(req.body.newQty), req.body.p_id, 'newkity')
        const sql = `UPDATE cart SET 
        qty=${req.body.newQty},
        total_price=${parseInt(req.body.price)}*${req.body.newQty},
        total_weight=${req.body.newQty}*1000 
        WHERE product_id=${req.body.p_id} && user_id=${req.user.id};`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            const sql2 = `SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
            ,b.name as brands,b.profilepic,s.size,p.price,p.stock,c.qty,c.total_weight,c.total_price 
            FROM cart c 
            JOIN users u ON c.user_id=u.id 
            JOIN products p ON c.product_id=p.id 
            JOIN sizes s ON p.size_id=s.id
            JOIN product_name pn ON p.product_name_id=pn.id 
            JOIN brands b ON p.store_id=b.id
            WHERE c.user_id=${req.user.id} && transaction_id=0
            ;`
            connection.query(sql2, (err, results2) => {
                if (err) {
                    return res.status(500).send(err)
                }
                const sql3 = `SELECT id,sum(total_price) AS total_payment FROM cart WHERE user_id = ${req.user.id};`
                connection.query(sql3, (err, results3) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    return res.status(200).send({ results2, results3 })
                })
            })
        })
    },
    getTotalPayment: (req, res) => {
        console.log(req.user.id)
        const sql = `SELECT id,user_id,SUM(total_price) AS total_payment 
        FROM cart WHERE user_id = ${req.user.id} && transaction_id=0;`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results[0])
        })
    },
    deleteAllByUserId: (req, res) => {
        const sql = `DELETE FROM cart 
        WHERE user_id=${req.user.id} && transaction_id=0`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    deleteProduct: (req, res) => {
        const sql = `DELETE FROM cart
        WHERE user_id=${req.user.id} && product_id=${req.body.p_id} && transaction_id=0;`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            const sql2 = `SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
            ,b.name as brands,b.profilepic,s.size,p.price,p.stock,c.qty,c.total_weight,c.total_price 
            FROM cart c 
            JOIN users u ON c.user_id=u.id 
            JOIN products p ON c.product_id=p.id 
            JOIN sizes s ON p.size_id=s.id
            JOIN product_name pn ON p.product_name_id=pn.id 
            JOIN brands b ON p.store_id=b.id
            WHERE c.user_id=${req.user.id} && transaction_id=0
            ;`
            connection.query(sql2, (err, results2) => {
                if (err) {
                    return res.status(500).send(err)
                }
                const sql3 = `SELECT id,sum(total_price) AS total_payment 
                FROM cart 
                WHERE user_id = ${req.user.id};`
                connection.query(sql3, (err, results3) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    return res.status(200).send({ results2, results3 })
                })
            })
        })

    },
    uploadPaymentReceipt: (req, res) => {
        console.log(req.user)

        const path = '/payment';
        const upload = uploader(path, 'PAYMENT').fields([{ name: 'image' }]);
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).send({ message: 'Upload file failed !', error: err.message });
            }
            const { image } = req.files;
            console.log(image, 'ini image')

            console.log(req.body, 'ini req.body')
            req.body.image = `${path}/${image[0].filename}`
            console.log(req.body.image)
            console.log(req.body.total_price)


            const x = new Date()
            const date = `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()} ${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}`
            //Pertama kita masukin data2 untuk table transaction
            const sql = `INSERT INTO 
            transaction(user_id,total_price,transaction_date,payment_receipt) 
            VALUES ('${req.user.id}','${req.body.total_price}','${date}','${req.body.image}')`

            connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err, 'yah gagal')
                    fs.unlinkSync('./public' + path + '/' + image[0].filename)
                    return res.status(500).send({ message: 'Add Post Failed!', err })
                }
                console.log(results, 'yesss acil')
                //abis itu ambil datanya, mau pake id nya buat dimasukkin ke cart
                const sql2 = `SELECT * FROM transaction;`
                connection.query(sql2, (err, results2) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    console.log(results2[0], 'berhasil ngambil data transacton')

                    //terus kita update transaction id di cart, supaya cart yang sudah di checkout tidak muncul lagi
                    //oh iya jangan lupa update jumlah nya, abis kirim bukti transaksi di kurangin qty nya
                    //tapi nanti pas di action admin confirmation di cek lagi, kalo bukti transfer salah, maka stock balik lg
                    console.log(results2.length, 'LENGTH')
                    const sql3 = `UPDATE cart SET transaction_id='${results2[results2.length - 1].id}' WHERE transaction_id=0`
                    connection.query(sql3, (err, results3) => {
                        if (err) {
                            return res.status(500).send(err)
                        }
                        console.log(results3)
                        return res.status(200)
                    })
                })
            })
        })
    },
    updateStock: (req, res) => {
        console.log(req.body, 'updateStock')
        const sql = `UPDATE stockchange 
        SET stock=stock-${req.body.qty} 
        WHERE product_name_id=${req.body.p_id} AND size=${req.body.size};`

        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },

    getTransactionHistory: (req, res) => {
        console.log(req.user, 'transacthistory')
        const sql = `SELECT * FROM transaction WHERE user_id = ${req.user.id};`

        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results[0])
            return res.status(200).send(results)
        })
    }
}