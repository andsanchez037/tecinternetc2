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
    let totalCantidad = 0;
    let totalCosto = 0;
    let totalCostoVenta = 0;

    if (Object.keys(req.query).length === 0) {
        return res.render('pre-examen', { titulo: 'Productos de Papelería', listado: [], totalCantidad, totalCosto, totalCostoVenta });
    }

    fs.readFile('productos.json', (err, data) => {
        if (err) throw err;
        let productos = JSON.parse(data);
        const tipo = req.query.tipo;
        if (tipo) {
            productos = productos.filter(producto => producto.tipo == tipo);
        }
        productos.forEach(producto => {
            let costo = parseFloat(producto.costo) || 0;
            let costoVenta = costo * 1.15;
            let cantidad = parseInt(producto.cantidad) || 0;

            totalCosto += costo * cantidad;
            totalCostoVenta += costoVenta * cantidad;
            totalCantidad += cantidad;
        });
        res.render('pre-examen', { titulo: 'Productos de Papelería', listado: productos, totalCantidad, totalCosto, totalCostoVenta });
    });
});

app.post('/papeleria', (req, res) => {
    const { id, producto, costo, cantidad, tipo } = req.body;
    const costoVenta = parseFloat(costo) * 1.15;
    fs.readFile('productos.json', (err, data) => {
        if (err) throw err;
        let productos = JSON.parse(data);
        productos.push({ id: parseInt(id), producto, costo: parseFloat(costo), costoVenta, cantidad: parseInt(cantidad), tipo: parseInt(tipo) });
        fs.writeFile('productos.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) throw err;
            res.redirect('/papeleria');
        });
    });
});

app.get("/escuela", (req, res) => {
    let totalAlumnos = 0;
    let promedioGeneral = 0;
    let totalMenorIgual7 = 0;
    let totalMayorIgual7 = 0;

    fs.readFile('alumnos2.json', (err, data) => {
        if (err) throw err;
        let alumnos = JSON.parse(data);
        const nivel = req.query.Nivel;
        const turno = req.query.Turno;
        const vista = req.query.Vista;

        if (nivel) {
            alumnos = alumnos.filter(alumno => alumno.nivel == nivel);
        }
        if (turno) {
            alumnos = alumnos.filter(alumno => alumno.turno == turno);
        }

        totalAlumnos = alumnos.length;
        promedioGeneral = totalAlumnos > 0 ? alumnos.reduce((acc, alumno) => acc + alumno.promedio, 0) / totalAlumnos : 0;
        totalMenorIgual7 = alumnos.filter(alumno => alumno.promedio <= 7).length;
        totalMayorIgual7 = alumnos.filter(alumno => alumno.promedio > 7).length;

        res.render('examenc2', { titulo: vista == "0" ? 'Detalle de Alumnos' : 'Resumen de Alumnos', listado: alumnos, totalAlumnos, promedioGeneral, totalMenorIgual7, totalMayorIgual7, vista });
    });
});

const puerto = 3000;
app.listen(puerto, () => {
    console.log("El puerto te esta escuchando");
});