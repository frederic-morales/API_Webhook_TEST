import { getProducts } from "./services/dbService.js";
import { sendMessage } from "./services/whatsappService.js";

async function sendMessageToClient() {
  const products = await getProducts()

  if (products > 0) {
    products.forEach(async (element) => {
        const message = `Te envio el siguiente producto: ${element.Nombre}`
        await sendMessage(message)
    });
  } else{
    console.log('No se encontraron productos para enviar');
  }
}

sendMessageToClient()
