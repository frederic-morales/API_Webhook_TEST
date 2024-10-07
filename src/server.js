import { config } from "dotenv";
import express, { json, urlencoded } from "express"
// import { sendMessage } from './services/whatsappService.js'
import process from "node:process"
import { sendMessage, sendMessageAfterResponse } from "./services/whatsappService.js";

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
    console.log("Body: ")
    console.log(webhookEvent);
    console.log(webhookEvent.entry[0].changes);
    console.log("Value: ", webhookEvent.entry[0].changes[0].value)
    console.log("Metadata: ", webhookEvent.entry[0].changes[0].value.metadata)
    console.log("Statuses: ", webhookEvent.entry[0].changes[0].value.statuses[0])
    console.log("Contacts: ", webhookEvent.entry[0].changes[0].value.statuses[0].pricing[0])
    // console.log("Contacts: ", webhookEvent.entry[0].changes[0].value.contacts[0])
    // console.log("Messages: ", webhookEvent.entry[0].changes[0].value.messages[0])
    console.log("text: ", webhookEvent.entry[0].changes[0].value.messages[0].text)
    const name = webhookEvent.entry[0].changes[0].value.contacts[0].profile.name
    const tel = webhookEvent.entry[0].changes[0].value.messages[0].from
    res.sendStatus(200)
    sendMessageAfterResponse(name, tel)
})

/* OBJETO QUE RECIBE EL SERVER CUANDO UN USUARIO DE WHATSAPP MANDA UN MENSAJE

req.body = {
    object: 'whatsapp_business_account',
    entry: [ { id: '0', changes: [Array] } ]
}
Objeto recibido en la primera posicion de changes "changes[0]": 
{
  "field": "messages",
  "value": {
    "messaging_product": "whatsapp",
    "metadata": {
      "display_phone_number": "16505551111",
      "phone_number_id": "123456123"
    },
    "contacts": [
      {
        "profile": {
          "name": "test user name"
        },
        "wa_id": "16315551181"
      }
    ],
    "messages": [
      {
        "from": "16315551181",
        "id": "ABGGFlA5Fpa",
        "timestamp": "1504902988",
        "type": "text",
        "text": {
          "body": "this is a text message"
        }
      }
    ]
  }
}
*/