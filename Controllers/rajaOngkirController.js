const { init } = require('rajaongkir-node-js')
const request = init('80d9407f9eb602362974e49ffcfe5c1c', 'starter')
const connection = require('../Databases');



module.exports = {
    getProvince: (req, res) => {
        const province = request.get('/province')
        province.then(prov => {
            let provinceArr = JSON.parse(prov)
            console.log(provinceArr)
            // console.log(provinceArr.rajaongkir.results)

            res.status(200).send(provinceArr.rajaongkir.results)
        })
    },
    getCityByProvince: (req, res) => {
        const allCityInProvince = request.get(`/city?&province=${req.params.id}`)
        allCityInProvince.then(city => {
            let cityArr = JSON.parse(city)
            // console.log(cityArr.rajaongkir.results)

            res.status(200).send(cityArr.rajaongkir.results)
        })
    },
    getCity: (req, res) => {
        const city = request.get(`/city`)
        city.then(city => {
            let cityArr = JSON.parse(city)

            res.status(200).send(cityArr.rajaongkir.results)
        })
    },
    shippingCost: (req, res) => {
        const form = req.body;
        if (form.courier === 'DEFAULT') {
            form.courier = 'jne'
        }
        console.log(form)
        const data = {
            origin: form.origin,
            destination: form.destination,
            weight: form.weight,
            courier: form.courier // bisa merequest satu atau beberapa kurir sekaligus
        }
        console.log(data, 'data')
        const cost = request.post('cost', data)
        cost.then(cst => {
            let cstN = JSON.parse(cst)
            let costPrice = cstN.rajaongkir.results[0].costs[1].cost[0].value //hanya ambil biaya
            console.log(costPrice)

            const sql = `UPDATE cart 
            SET 
            total_ongkir='${costPrice}',
            courier='${form.courier}'
            WHERE id=${req.body.id}`
            connection.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }
                const sql2 = `SELECT SUM(total_ongkir) AS total_ongkir FROM cart WHERE transaction_id=0;`
                connection.query(sql2, (err, results2) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    console.log(results2)
                    return res.status(200).send(results2[0]);
                })
            })
        }).catch((err) => {
            console.log(err)
        })
    }
}