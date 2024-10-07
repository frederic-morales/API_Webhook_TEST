import { config } from "dotenv";
import express, { json } from "express"
// import { sendMessage } from './services/whatsappService.js'
import process from "node:process"
import { sendMessage, sendMessageAfterResponse } from "./services/whatsappService.js";

config()
const app = express()
app.use(json())
// app.use(urlencoded({ extended: true}))

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
    const VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN
    const mode = req.query["hub.mode"]
    const token = req.query["hub.verify_token"]
    const challenge = req.query["hub.challenge"]

    if (token === VERIFY_TOKEN) {
        if(mode === "subscribe" ) {
            console.log("Webhook verificado");
            console.log({mode, token, challenge});
            res.send(challenge)
        } 
    } else {
        res.sendStatus(403).send("Error, verificacion fallida")
    }
})

//Iniciar el servidor
const PORT = process.env.PORT ?? 1243
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})

app.post("/SendTextMessage", (req, res) => {
    if(req.body){
        const data = req.body
        console.log(data);
        res.sendStatus(200)
        sendMessage(data.message)
    }else{
        res.sendStatus(403).send("Error")
    }
})

app.post("/webhook", (req, res) => {
    const webhookEvent = req.body
    // console.log("Body: ", webhookEvent);
    // console.log("Changes: ", webhookEvent.entry[0].changes);
    // console.log("Value: ", webhookEvent.entry[0].changes[0].value)
    // console.log("Metadata: ", webhookEvent.entry[0].changes[0].value.metadata)
    // console.log("Contacts: ", webhookEvent.entry[0].changes[0].value.contacts)
    // console.log("Messages: ", webhookEvent.entry[0].changes[0].value.messages)
    if(webhookEvent.entry[0].changes.field === 'messages') {
        const name = webhookEvent.entry[0].changes[0].value.contacts[0].profile.name
        const tel = webhookEvent.entry[0].changes[0].value.messages[0].from
        console.log("Name:", name, "Tel:", tel);
        sendMessageAfterResponse(name, tel)
    }
    res.sendStatus(200)
})
