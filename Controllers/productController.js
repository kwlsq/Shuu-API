const connection = require('../Databases')

module.exports = {
    showcase: (req, res) => {
        const sql = `SELECT p.id,p.name,p.price,p.stock,p.image,b.name AS brands,b.profilepic 
        FROM products p 
        JOIN brands b ON p.store_id=b.id;
        `

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