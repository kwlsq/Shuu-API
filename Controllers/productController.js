const connection = require('../Databases')

module.exports = {
    showcase: (req, res) => {
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        WHERE p.image != '/default/default.jpg'
        GROUP BY product_name_id
        ORDER BY RAND()
        LIMIT 0,10
        ;
        `
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
        const sql = `SELECT p.id,p.product_name_id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
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
    },
    detailProductBySize: (req, res) => {
        console.log(req.body, 'parampamapmapm')
        const sql = `SELECT p.id,p.product_name_id as pn_id,pn.name,b.name as brands,p.image,b.profilepic,s.size,p.price,p.stock,p.views  
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        JOIN sizes s ON p.size_id=s.id
        WHERE p.product_name_id ='${req.body.id}' && s.size='${req.body.size}';`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results[0])
            res.status(200).send(results[0])
        })
    },

    menShowcase: (req, res) => {
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views,g.id as genderId
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        JOIN gender g ON p.gender_id=g.id
        WHERE p.image != '/default/default.jpg' AND (g.id=1 OR g.id=3)
        GROUP BY product_name_id
        ORDER BY RAND()
        LIMIT 0,10;`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },
    womenShowcase: (req, res) => {
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views,g.id as genderId
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        JOIN gender g ON p.gender_id=g.id
        WHERE p.image != '/default/default.jpg' AND (g.id=2 OR g.id=3)
        GROUP BY product_name_id
        ORDER BY RAND()
        LIMIT 0,10;`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },
    loadMore: (req, res) => {
        console.log(req.body, 'bodiii')
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        WHERE p.image != '/default/default.jpg'
        GROUP BY product_name_id
        ORDER BY RAND()
        LIMIT ${req.body.length},5
        ;
        `
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results, 'hasyil')
            res.status(200).send(results)
        })
    },
    showcaseFilterPrice: (req, res) => {
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        WHERE p.price>=${req.body.min} AND p.price<=${req.body.max}
        GROUP BY product_name_id
        ORDER BY p.price ASC
        limit 0,10;`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results, 'hasyil')
            res.status(200).send(results)
        })
    },


    searchProduct: (req, res) => {
        console.log(req.body, 'masuk')
        const sql = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
        FROM products p 
        JOIN product_name pn ON p.product_name_id=pn.id 
        JOIN brands b ON p.store_id=b.id
        WHERE pn.name LIKE '%${req.body.productName}%'
        GROUP BY product_name_id
       ;`
        console.log(sql)
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            const sql2 = `SELECT p.id,pn.id as pn_id,pn.name,b.name AS brands,p.image,b.profilepic,p.price,p.stock,p.views 
            FROM products p 
            JOIN product_name pn ON p.product_name_id=pn.id 
            JOIN brands b ON p.store_id=b.id
            WHERE pn.name LIKE '%${req.body.productName}%'
            GROUP BY product_name_id
            LIMIT ${req.body.page * 5},5
            ;`
            connection.query(sql2, (err, results2) => {
                if (err) {
                    return res.status(500).send(err)
                }
                res.status(200).send({ results, results2 })
            })
        })
    },


}