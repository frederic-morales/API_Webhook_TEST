import { config } from "dotenv";
import express, { json } from 'express'
// import { sendMessage } from './services/whatsappService.js'
import process from "node:process"

config()
const app = express()
app.use(json())

app.get("/", (req, res) => {
    res.send("Bienvenido al server")
})

app.get("/test", (req, res) => {
    if(req.query){
        res.sendStatus(200)
        console.log(req.query)
    }
    else{
        res.sendStatus(403)
    }
})

app.post("/test", (req, res) => {
    if(req.body){
        console.log("Body: ", req.body);
        console.log("Query:", req.query);
        res.sendStatus(200)
    }
    else{
        res.sendStatus(403)
    }
})

app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        console.log("Webhook verificado");
        res.status(200).send(challenge)
    } else {
        res.sendStatus(403)
    }
})

app.post("/webhook", (req, res) => {
    const webhookEvent = req.body
    console.log("Evento recibido");
    
    if (webhookEvent.messages) {
        const message = webhookEvent.messages[0]
        console.log("Mensaje recibdo: ", message);
    }
    res.sendStatus(200)
})

//Iniciar el servidor
const PORT = process.env.PORT ?? 1243
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})

