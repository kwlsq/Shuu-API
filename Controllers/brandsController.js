const connection = require('../Databases')

module.exports = {
    getAllBrands: (req, res) => {
        const sql = `SELECT * 
        FROM brands
        WHERE profilepic != '/default/default.jpg'`

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