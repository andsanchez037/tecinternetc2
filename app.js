const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set("view engine", "ejs");

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    fs.readFile('alumnos.json', (err, data) => {
        if (err) throw err;
        let listado = JSON.parse(data);
        res.render("index", { titulo: "Listado de Alumnos", listado: listado });
    });
});
app.get("/practica1", (req, res) => {
    res.render("practica01", { numero: "" });
});

app.get("/cotizacion", (req, res) => {
    const params = {
        valor: req.query.valor,
        pinicial: req.query.pinicial,
        plazos: req.query.plazos,
    };
    res.render("practica02", params);
});

app.post("/cotizacion", (req, res) => {
    const params = {
        valor: req.body.valor,
        pinicial: req.body.pinicial,
        plazos: parseInt(req.body.plazos),
    };
    res.render("practica02", params);
});

app.get("/practica3", (req, res) => {
    res.render("practica03");
});

app.post("/p01", (req, res) => {
    const params = {
        numero: req.body.numero,
    };
    res.render("practica01", params);
});

app.get("/nomina", (req, res) => {
    res.render("practica03", {
        recibo: '',
        nombre: '',
        puesto: '',
        nivel: '',
        dias: ''
    });
});

app.post("/nomina", (req, res) => {
    const { recibo, nombre, puesto, nivel, dias } = req.body;
    res.render("practica03", {
        recibo,
        nombre,
        puesto: parseInt(puesto),
        nivel: parseInt(nivel),
        dias: parseInt(dias)
    });
});

app.get('/papeleria', (req, res) => {
    fs.readFile('productos.json', (err, data) => {
        if (err) throw err;
        let productos = JSON.parse(data);
        const tipo = req.query.tipo;
        if (tipo) {
            productos = productos.filter(producto => producto.tipo == tipo);
        }
        res.render('pre-examen', { titulo: 'Productos de Papelería', listado: productos });
    });
});

app.post('/papeleria', (req, res) => {
    fs.readFile('productos.json', (err, data) => {
        if (err) throw err;
        let productos = JSON.parse(data);
        const { id, producto, costo, costoVenta, cantidad, tipo } = req.body;
        productos.push({ id, producto, costo, costoVenta, cantidad, tipo });
        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) throw err;
            res.redirect('/papeleria');
        });
    });
});


const puerto = 3000;
app.listen(puerto, () => {
    console.log("El puerto te esta escuchando");
});