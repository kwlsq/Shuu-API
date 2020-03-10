const connection = require('../Databases')

module.exports = {
    showcase: (req, res) => {
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id;`

        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
        })
    },
    detailProduct: (req, res) => {
        console.log(req.body)
        const sql = `SELECT p.id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        WHERE p.id=${req.body.id};`
        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results[0])
        })
    },
    availableSize: (req, res) => {
        const sql = `SELECT p.id,s.size
        FROM products p 
        JOIN sizes s ON p.size_id=s.id 
        JOIN product_name pn ON p.product_name_id=pn.id
        WHERE p.product_name_id=${req.body.id}
        GROUP BY s.size;`
        connection.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
        })
    }
}