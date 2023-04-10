import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import config from './config'
import router from './router'
import errorMiddleware from './middleware/error'

import mongooseConnect from './db/dbConnect'
import mock from './utils/mock/mock'

mongooseConnect().then(async () => {
  console.log('mongoose connected')
  const {appPort} = config

  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(morgan('tiny'))
  app.use(router)
  app.use(errorMiddleware)

  // await mock()
  
  app.listen(appPort, () => console.log('listening on ', appPort))
})


