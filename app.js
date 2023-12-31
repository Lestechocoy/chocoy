const express = require('express');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/1.0/', require('./app/rutas'));
app.listen(PORT, ()=>{
    console.log('api escuchando en el puerto', PORT)
})