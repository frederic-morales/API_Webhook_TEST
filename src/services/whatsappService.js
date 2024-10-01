import { config } from "dotenv";
import axios from "axios" 
import process from "node:process"

config()

export async function sendMessage(message) {
    try{
    //   let text = ''
    //   message.forEach(element => {
    //       text += element.Nombre + "\n"
    //   });

      const url = process.env.META_URL;
      const headers = {
        'Authorization': process.env.CLOUD_API_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      };
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
