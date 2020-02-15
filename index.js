const express = require ('express')
const cors = require ('cors')
const bodyParser = require('body-parser')

const PORT = 4000

const app = express()

app.use(cors())
app.use(bodyParser.json())

const {
    brandsRouter,
    userRouter
} = require('./Routers')

app.use('/brands',brandsRouter)
app.use('/users',userRouter)


app.listen(PORT, () => console.log(`API berhasil aktif di PORT ${PORT}`))
