import dotenv from "dotenv";
import express from "express";
import * as path from "node:path";
import {fileURLToPath} from "url";
import {sequelize} from "./data-source.js";
import routes from "./routes.js";

dotenv.config()

const app = express();
app.use(express.json())

app.use(express.urlencoded({extended: true}))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use('/api/employees', routes);

app.use(express.static(path.join(__dirname, '../client/build')));

const PORT = process.env.PORT

const connection = async () => {
    let connected = false;

    while (!connected) {
        try {
            console.log('connecting to db...')
            await sequelize.authenticate()
            await sequelize.sync()
            connected = true
            console.log('db was connected')

            app.listen(PORT, () => {
                console.log(`server started on http://localhost:${PORT}`)
            })
        } catch (e) {
            console.error('db unavailable. retrying in 3 seconds...')
            await new Promise(resolve => setTimeout(resolve, 3000))
        }
    }
}

connection()