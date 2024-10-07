import { config } from "dotenv";
import axios from "axios" 
import process from "node:process"

config()

const url = process.env.META_URL
const headers = {
  'Authorization': process.env.CLOUD_API_ACCESS_TOKEN,
  'Content-Type': 'application/json'
};

export async function sendMessage(message) {
  try{
    const data = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: process.env.CLIENT_NUMBER,
          type: "text",
          text: {
            preview_url: false,
            body: message
          }
    }
    axios.post(url, data, { headers })
      .then(response => {
        console.log('Success:', response.data);
        console.log(data.text.body);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });
  }
  catch(error){
    console.error(error)
  }
}

export async function sendDocument(doc){
  try {
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: process.env.CLIENT_NUMBER,
      type: "document",
      document: {
        link: doc,
        caption: "Imagen Iron Man",
        filename: "Docs.png"
      }
    }
    axios.post(url, data, { headers })
      .then(res => {
        console.log('Success: ', res.data);
      })
      .catch( err => {
        console.log('Error:', err.response ? err.response.data : err.message);
      })
  } catch (err) {
    console.log('Error:', err.response ? err.response.data : err.message);
  }
}

export async function sendTemplateText() {
  try {
    const data ={
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: process.env.CLIENT_NUMBER,
      type: "template",
      template: {
        name: "hello_world",
        language: {
            code: "en_US"
        }
      }
    };
    axios.post(url, data, { headers })
      .then(res => {
        console.log('Success: ', res.data);
      })
      .catch( err => {
        console.log('Error:', err.response ? err.response.data : err.message);
      })
  } catch (err) {
    console.log('Error:', err.response ? err.response.data : err.message);
  }
}

export async function sendMessageAfterResponse(name, tel){
  try{
    const data = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: tel,
          type: "text",
          text: {
            preview_url: false,
            body: `Hola ${name} recibimos tu mensaje`
          }
    }
    axios.post(url, data, { headers })
      .then(response => {
        console.log('Success:', response.data);
        console.log(data.text.body);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });
  }
  catch(error){
    console.error(error)
  }
}

export async function sendInteractiveButtons() {
  try{
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "50254673367",
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "image", 
          image: {
              link: "https://w7.pngwing.com/pngs/540/203/png-transparent-iron-man-illustration-thor-marvel-comics-iron-man-superhero-marvel-universe-ironman-comics-heroes-black-widow-thumbnail.png",
          } 
        },
        body: {
          text: "Este es un mensaje enviado con la API de WhatsApp"
        },
        footer: {
          text: "Catalogo de productos"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "cancel-button",
                title: "Cancel"
              }
            },
            {
              type: "reply",
              reply: {
                id: "change-button",
                title: "Change"
              }
            }
          ]
        }
      }
    }
    axios.post(url, data, { headers })
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });
  }
  catch(error){
    console.error(error);
  }
}