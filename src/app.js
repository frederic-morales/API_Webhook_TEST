import { getProducts } from './services/dbService.js'
import {
  sendMessage,
  sendInteractiveButtons,
  sendDocument,
  sendTemplateText
} from './services/whatsappService.js'

async function sendMessageToClient() {
  const products = await getProducts()

  if (products.length > 0) {
    products.forEach(async (element, i) => {
      const message = `${i} te envio el siguiente producto: ${element.Nombre}`
      await sendMessage(message)
    })
  } else {
    console.log('No se encontraron productos para enviar')
  }
  await sendDocument(
    'https://w7.pngwing.com/pngs/540/203/png-transparent-iron-man-illustration-thor-marvel-comics-iron-man-superhero-marvel-universe-ironman-comics-heroes-black-widow-thumbnail.png'
  )
  await sendInteractiveButtons()
  await sendTemplateText()
}

sendMessageToClient()
