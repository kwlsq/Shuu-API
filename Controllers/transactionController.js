const connection = require('../Databases');

module.exports = {
    addToCart: (req, res) => {
        console.log('mashuk pak eko')
        console.log(req.body)
        console.log(req.user)
        //untuk ambil value yang bisa dimanipulasi dari front end (price,weight)
        const sql = `SELECT p.id,p.stock,p.price,p.weight 
        FROM products p 
        WHERE p.id=${req.body.id};`

        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results[0])
            console.log(results[0].price * req.body.qty)
            console.log(results[0].weight * req.body.qty)
            const sql2 = `SELECT * FROM cart WHERE product_id='${results[0].id}'` //untuk cek apakah cart dari item yg dipilih kosong atau ad item yg sama
            connection.query(sql2, (err, results2) => {
                if (err) {
                    return res.status(500).send(err)
                }
                console.log(results2.length, 'length')
                if (results2.length === 0) { //kalo item yang dipilih masih kosong, berarti tinggal insert aja
                    console.log('masuk yg atas', req.user.id)
                    console.log('masuk yg atas', req.body.id)
                    const sql3 = `INSERT INTO cart(user_id,product_id,qty,total_weight,total_price) 
                    VALUES('${req.user.id}','${req.body.id}','${req.body.qty}','${results[0].weight * req.body.qty}','${results[0].price * req.body.qty}') `
                    connection.query(sql3, (err, results3) => {
                        console.log('disini masalahnya')
                        if (err) {
                            return res.status(500).send(err)
                        }
                        const sql4 = `
                        SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image,b.name
                        ,b.profilepic,c.qty,c.total_weight,c.total_price 
                        FROM cart c 
                        JOIN users u ON c.user_id=u.id 
                        JOIN products p ON c.product_id=p.id 
                        JOIN product_name pn ON p.product_name_id=pn.id 
                        JOIN brands b ON p.store_id=b.id;
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
                    const sql3 = `SELECT id,qty FROM cart WHERE id=${results2[0].id};` //sekarang kita cek qty dari produk yg dipilih
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
                        total_weight=total_weight+'${results[0].weight * req.body.qty}',
                        total_price=total_price+'${results[0].price * req.body.qty}'
                        WHERE id='${results3[0].id}';`
                        console.log(sql4)
                        connection.query(sql4, (err, results4) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).send(err)
                            }
                            console.log(results4)
                            const sql5 = `
                            SELECT c.id,c.user_id,c.product_id,u.username,pn.name,p.image
                            ,b.name,b.profilepic,c.qty,c.total_weight,c.total_price 
                            FROM cart c 
                            JOIN users u ON c.user_id=u.id 
                            JOIN products p ON c.product_id=p.id 
                            JOIN product_name pn ON p.product_name_id=pn.id 
                            JOIN brands b ON p.store_id=b.id;
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
    }
}