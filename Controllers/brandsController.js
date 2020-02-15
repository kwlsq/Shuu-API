const { conn } = require('../databases')

module.exports={
    getAllBrands:(req,res)=>{
        const query = `SELECT * FROM brands`

        conn.query(query,(err,results)=>{
            if(err){
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
        })
    }
}