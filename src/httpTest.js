//ARCHIVO PARA HACER PETICIONES HTTP DE PRUEBA A MI SERVIDOR
import { config } from "dotenv";
import axios from "axios" 
// import process from "node:process"

config()

const url = "http://localhost:3000/webhook"

export async function webhookPOST_test(){
  try{
    axios.post(`${url}?nombre=Frederic&Edad=19`, {
      nombre: "Frederic",
      edad: 19,
      altura: 1.74,
      peso: "67 kg",
      Profesion: "Developer",
      messages: [
        {
          algo: "Algo"
        }
      ]
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  catch (err){
    console.log('Error:', err.response ? err.response.data : err.message);
  }
}

export async function webhookGET_test() {
  try{
    axios.get(`${url}?hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=StQq1YrzOjkB0HMxfoX5cKkMQ7b8EeeccIkJTtJWQPuv0aaXg4`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  catch (err) {
    console.log('Error:', err.response ? err.response.data : err.message);
  }
}

export async function getGlitchTest() {
  axios.get("https://vast-fabulous-marimba.glitch.me")
    .then(res => {
      console.log(res.data);
    })
    .catch(err =>{
      console.log(err);
    })
}

// webhookPOST_test()
webhookGET_test()
// getGlitchTest()


