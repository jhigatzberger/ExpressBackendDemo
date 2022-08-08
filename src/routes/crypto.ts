import express, { Router, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserRequest } from '../user'
import bodyParser from 'body-parser'
import { runSQL } from '../sqldb'
import { changeCrypto, fetchCrypto } from '../sqls'
import { ColumnValue } from 'tedious'

const cryptoRouter: Router = express.Router()

cryptoRouter.use(bodyParser.urlencoded({ extended: true }))

cryptoRouter.use(express.json())

cryptoRouter.use(authenticateToken)

cryptoRouter.post('/', async (req: UserRequest, res: Response) => {
  if (req.user?.id == null) return res.sendStatus(500)
  await runSQL(changeCrypto(req.user?.id, req.body.amount))
  res.send()
})

cryptoRouter.get('/', async (req: UserRequest, res: Response) => {
  if (req.user?.id == null) return res.sendStatus(500)
  const data: ColumnValue[] = await runSQL(fetchCrypto(req.user?.id))
  res.json({ amount: data[0].value })
})

function authenticateToken (req:UserRequest, res: Response, next:any) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader?.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = cryptoRouter
