const { init } = require('rajaongkir-node-js')
const request = init('80d9407f9eb602362974e49ffcfe5c1c', 'starter')


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
            // console.log(cityArr.rajaongkir.results)

            res.status(200).send(cityArr.rajaongkir.results)
        })
    },
    // shippingCost: (req, res) => {
    //     const form = req.body;
    //     const data = {
    //         origin: form.origin,
    //         destination: form.destination,
    //         weight: form.weight,
    //         courier: form.courier // bisa merequest satu atau beberapa kurir sekaligus
    //     }
    //     const cost = request.post('cost', data)
    //     cost.then(cst => {
    //         let cstN = JSON.parse(cst)
    //         let costPrice = cstN.rajaongkir.results[0].costs[1].cost[0].value //hanya ambil biaya
    //         console.log(costPrice)
    //         return res.send({ price: costPrice });
    //     })
    // }
}