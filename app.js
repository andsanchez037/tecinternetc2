
const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine','ejs');
let datos = JSON.parse(fs.readFileSync('datos.json', 'utf8'));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get('/',(req, res) => {
    res.render('index',{titulo: "Listado de Alumnos",listado:datos})
})

app.get('/practica1',(req,res) => {
    res.render('practica01', { numero: null })
})

app.get('/cotizacion',(req,res) => {
    res.render('practica02', {valor: req.query.valor, pinicial: req.query.pinicial, plazos: req.query.plazos})
})

app.get('/practica3',(req,res) => {
    res.render('practica03')
})
app.post('/p01', (req,res) => {
    // Parametros para recibir los datos
    const params = {
        numero:req.body.numero
    }
    // Body se usa cuando los datos vienen de un formulario por el metodo POST
    res.render('practica01', params)
})
app.post('/cotizacion',(req,res) => {
    const params = {
        valor: req.body.valor,
        pinicial:req.body.pinicial,
        plazos: parseInt(req.body.plazos)
    }
    res.render('practica02',params)
})

app.get('/practica02', (req, res) => {
    res.render('practica02')
});

app.get('/practica03', (req, res) => {
    res.render('practica03')
});


const puerto = process.env.PORT || 8080;
app.listen(puerto, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});
