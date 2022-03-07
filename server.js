const express = require('express')
const axios = require('axios')
const moment = require('moment')
const fs = require('fs').promises
const uuid = require('uuid')

const app = express()
app.use(express.static('public'))

app.use(express.json());
//pp.use( express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.post('/roommates', async (req, res) => {
    const { data } = await axios.get("https://randomuser.me/api/")
    const name = data.results[0].name.first;
    const lastname = data.results[0].name.last
    const nombre = (`${name} ${lastname}`)
    const debe = 0;
    const recibe = 0
    const id = uuid.v4()
    let roommates = {
        id,
        nombre,
        debe,
        recibe
    }
    let datos = await fs.readFile('db.json', 'utf-8')
    datos = JSON.parse(datos)
    //agregamos los datos al arreglo db.json
    datos.roommates.push(roommates)
    let stri = JSON.stringify(datos)
    await fs.writeFile('db.json', stri, 'utf-8')

    res.json({ atributo: "valor" })
})

app.post('/gastos/', async (req, res) => {
    let body = ""
    req.on('data', function (data) {
        body += data
    })
    req.on('end', async function (data) {
        const datos = Object.values(JSON.parse(body));
        res.json({ todo: 'OK' })
        // *******************************************
        let prueba = await fs.readFile("db.json", "utf-8");
        prueba = JSON.parse(prueba);
        let roommates_id = "";
        /*  let contar=0; */
        /* contar+=1; */
        let debe2 = datos[2] / prueba.roommates.length;
        for (let i = 0; i < prueba.roommates.length; i++) {

            console.log(datos);
            //console.log();
            let pruebas = prueba.roommates[i].nombre;
            if ((datos[0]) == pruebas) {
                roommates_id = prueba.roommates[i].id;
                //prueba.roommates[i].debe = debe2
                prueba.roommates[i].recibe = datos[2] - debe2
            }
            prueba.roommates[i].debe = debe2 + prueba.roommates[i].debe
        }

        //prueba.roommates.push(debe);
        await fs.writeFile("db.json", JSON.stringify(prueba), "utf-8");
        // *********************************
        let roommates = (datos[0])
        let descripcion = (datos[1])
        let monto = (datos[2]);
        let id = uuid.v4()
        let gastos = {
            id,
            roommates,
            roommates_id,
            descripcion,
            monto,
        };
        let dato = await fs.readFile('db.json', 'utf-8')
        dato = JSON.parse(dato)
        //agregamos los datos al arreglo db.json
        dato.gastos.push(gastos)

        let stri = JSON.stringify(dato)
        await fs.writeFile('db.json', stri, 'utf-8')

        res.json({ atributo: "valor" })
    })
})

app.get('/roommates', async (req, res) => {
    let datos = await fs.readFile('db.json', 'utf-8')
    datos = JSON.parse(datos)

    res.json({ roommates: datos.roommates })
})
app.get('/gastos', async (req, res) => {
    let datos = await fs.readFile('db.json', 'utf-8')
    datos = JSON.parse(datos)

    res.json({ gastos: datos.gastos })
})
app.put('/gastos', (req, res) => {
    let body = ""
    req.on('data', function (data) {
        body += data
    })
    req.on('end', async function (data) {
        const datos = Object.values(JSON.parse(body));
       // res.json({ todo: 'OK' })
        let prueba = await fs.readFile("db.json", "utf-8");
        prueba = JSON.parse(prueba);
        let debe2 = datos[2] / prueba.roommates.length;
        for (let i = 0; i < prueba.roommates.length; i++) {
            console.log();
            let pruebas = prueba.roommates[i].nombre;
            prueba.gastos[i].roommates = datos[0]
            prueba.gastos[i].descripcion = datos[1]
            prueba.gastos[i].monto = datos[2]
            prueba.roommates[i].debe = debe2 + prueba.roommates[i].debe
            if ((datos[0]) == pruebas) {
                prueba.roommates[i].recibe = datos[2] - debe2
            }
        }
        await fs.writeFile("db.json", JSON.stringify(prueba), "utf-8");

        res.json({ atributo: "valor" })
    })
})

app.delete('/gastos', (req, res) => {
    res.json({ gastos: [] })
})

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});