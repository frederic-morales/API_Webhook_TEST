import { config } from 'dotenv'
import express from 'express'
// import { sendMessage } from './services/whatsappService.js'
import process from 'node:process'
import {
  sendMessage,
  sendMessageAfterResponse
} from './services/whatsappService.js'

config()
const app = express()
app.use(express.json())
// app.use(urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.send('Bienvenido al server')
})

app
  .route('/test')
  .get((req, res) => {
    if (req.query) {
      res.sendStatus(200)
      console.log(req.query)
    } else {
      res.sendStatus(403)
    }
  })
  .post((req, res) => {
    if (req.body) {
      console.log('Body: ', req.body)
      console.log('Query:', req.query)
      res.sendStatus(200)
    } else {
      res.sendStatus(403)
    }
  })

app
  .route('/webhook')
  .get((req, res) => {
    const VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']
    if (token === VERIFY_TOKEN) {
      if (mode === 'subscribe') {
        console.log('Webhook verificado')
        console.log({ mode, token, challenge })
        res.send(challenge)
      }
    } else {
      res.sendStatus(403).send('Error, verificacion fallida')
    }
  })
  .post('/webhook', (req, res) => {
    const webhookEvent = req.body
    let sendMessage = false
    // console.log("Body: ", webhookEvent);
    // console.log("Changes: ", webhookEvent.entry[0].changes);
    // console.log("Value: ", webhookEvent.entry[0].changes[0].value)
    // console.log("Metadata: ", webhookEvent.entry[0].changes[0].value.metadata)
    // console.log("Contacts: ", webhookEvent.entry[0].changes[0].value.contacts)
    // console.log("Messages: ", webhookEvent.entry[0].changes[0].value.messages)
    const stringText =
      webhookEvent.entry[0].changes[0].value.messages[0].text.body
    const messageArray = stringText.split(' ')
    messageArray.forEach((word) => {
      if (word === 'factura') {
        sendMessage = true
      }
    })
    console.log(messageArray)
    console.log(webhookEvent)
    console.log(sendMessage)
    if (webhookEvent.entry[0].changes[0].field === 'messages' && sendMessage) {
      const name =
        webhookEvent.entry[0].changes[0].value.contacts[0].profile.name
      const tel = webhookEvent.entry[0].changes[0].value.messages[0].from
      // console.log("Name:", name, "Tel:", tel);
      sendMessageAfterResponse(name, tel)
    }
    res.sendStatus(200)
  })

app.post('/SendTextMessage', (req, res) => {
  if (req.body) {
    const data = req.body
    console.log(data)
    res.sendStatus(200)
    sendMessage(data.message)
  } else {
    res.sendStatus(403).send('Error')
  }
})

//Iniciar el servidor
const PORT = process.env.PORT ?? 1243
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
