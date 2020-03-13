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
            const sql2 = `SELECT * FROM cart WHERE product_id='${results[0].id}'` //untuk cek apakah cart kosong atau ad item yg sama
            connection.query(sql2, (err, results2) => {
                if (err) {
                    return res.status(500).send(err)
                }
                console.log(results2.length, 'length')
                if (results2.length === 0) {
                    console.log('masuk yg atas', req.user.id)
                    console.log('masuk yg atas', req.body.id)
                    const sql3 = `INSERT INTO cart(user_id,product_id,qty,total_weight,total_price) 
                    VALUES('${req.user.id}','${req.body.id}','${req.body.qty}','${results[0].weight * req.body.qty}','${results[0].price * req.body.qty}') `
                    connection.query(sql3, (err, results3) => {
                        console.log('disini masalahnya')
                        if (err) {
                            return res.status(500).send(err)
                        }
                        console.log(results3)
                        //sql get cart

                        // return res.status(200).send(results[0])
                    })
                }
                const sql3 = `SELECT qty FROM cart WHERE id=${results2[0].id};`
                connection.query(sql3, (err, results3) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    if (results3[0].qty > results[0].stock) {
                        return res.status(500).send({ message: 'Quantity err' }, err)
                    }
                    console.log('masuk yg bawah', results2[0].id)
                    const sql4 = `UPDATE cart 
                    SET qty=qty+'${req.body.qty}',
                    total_weight=total_weight+'${results[0].weight * req.body.qty}',
                    total_price=total_price+'${results[0].price * req.body.qty}'
                    WHERE id=${results2[0].id}`
                    connection.query(sql4, (err, results4) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send(err)
                        }
                        //sql get cart
                        // return res.status(200).send(results[0])
                    })

                })



            })
        })
    }
}