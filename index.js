const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bearerToken = require('express-bearer-token')

const PORT = 4000

const app = express()

app.use(cors())
app.use(bearerToken())
app.use(bodyParser.json())
app.use(express.static('public'))

const {
    brandsRouter,
    userRouter,
    productRouter,
    editProfileRouter,
    rajaOngkirRouter
} = require('./Routers')

app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang di API SHUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU</h1>')
})

app.use('/brands', brandsRouter)
app.use('/products', productRouter)
app.use('/users', userRouter)
app.use('/editprofile', editProfileRouter)
app.use('/rajaongkir', rajaOngkirRouter)


app.listen(PORT, () => console.log(`API berhasil aktif di PORT ${PORT}`))
