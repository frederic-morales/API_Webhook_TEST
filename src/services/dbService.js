import sql from "mssql";
import { config } from "dotenv";
import process from "node:process"

config()

const conf = {
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
}

export async function getProducts() {
    try{
        let pool = await sql.connect(conf)
        let result = await pool.request().query("SELECT TOP 10 CodigoProducto, Nombre FROM INV_PRODUCTOS")
        console.log("Resultados: ", result.recordset)
        await pool.close()
        return result.recordset
    }
    catch(error){
        console.error("Error en la consulta: ", error);
    }
}