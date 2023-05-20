import express from 'express'
import initApp from './src/utils/initiateApp.js'
import path from 'path'
import { config } from 'dotenv'
config({ path: path.resolve('config/config.env') })

const app = express()

initApp(app, express)


