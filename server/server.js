import dotenv from "dotenv";
import express from "express";
import routes from "./routes.js";
import {fileURLToPath} from 'url'
import * as path from "node:path";
import { sequelize } from "./data-source.js";


dotenv.config()

const app = express();
app.use(express.json())

app.use(express.urlencoded({extended: true}))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, '../client')))
app.use('/api/employees', routes)

const PORT = process.env.PORT || 3000

const connection = async () => {
    let connected = false;

    while (!connected) {
        try {
            console.log('connecting to db...')
            await sequelize.authenticate();
            await sequelize.sync();
            connected = true
            console.log('db was connected')

            app.listen(PORT, () => {
                console.log(`server started on http://localhost:${PORT}`)
            })
        } catch (e) {
            console.error('db unavailable. retrying in 3 seconds...')
            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

    }
}

connection()