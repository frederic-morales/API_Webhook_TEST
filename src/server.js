import { config } from "dotenv";
import express, { json, urlencoded } from "express"
// import { sendMessage } from './services/whatsappService.js'
import process from "node:process"

config()
const app = express()
app.use(json())
app.use(urlencoded({ extended: true}))

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

app.post("/webhook", (req, res) => {
    const webhookEvent = req.body
    console.log("Evento recibido");
    console.log(webhookEvent.entry[0].changes);
    console.log("Metada: ", webhookEvent.entry[0].changes[0].value.metadata[0]);
    console.log("Contacts: ", webhookEvent.entry[0].changes[0].value.contacts[0]);
    console.log("Messages: ",webhookEvent.entry[0].changes[0].value.messages[0]);
    console.log("Messages: ",webhookEvent.entry[0].changes[0].value.messages[0].text);
    res.sendStatus(200)
})

//Iniciar el servidor
const PORT = process.env.PORT ?? 1243
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})


//Webhook verificado correctamente por meta
//Server corriendo en render.com
//Proximo paso: 
//   1.Recibir un webhook cuando un usuario de WhatsApp envie un mensaje
