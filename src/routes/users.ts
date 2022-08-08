import express, { Router, Response } from 'express'
import { ColumnValue } from 'tedious'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'

import { runSQL } from '../sqldb'
import { createUser, createUserCrypto, fetchUser } from '../sqls'
import { User, UserRequest } from '../user'

const userRouter: Router = express.Router()

userRouter.use(bodyParser.urlencoded({ extended: true }))
userRouter.use(express.json())

userRouter.post('/login', async (req: UserRequest, res: Response) => {
  const user: User = { username: req.body.username }
  const data: ColumnValue[] = await runSQL(fetchUser(user.username))
  const verified: boolean = await bcrypt.compare(req.body.password, data[2].value)
  if (verified) {
    user.id = data[0].value
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '')
    res.json({ accessToken })
  } else {
    res.sendStatus(500)
  }
})

userRouter.post('/', async (req: UserRequest, res: Response) => {
  try {
    const user: User = { username: req.body.username }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10)
    await runSQL(createUser(user.username, encryptedPassword))
    const data: ColumnValue[] = await runSQL(fetchUser(user.username))
    user.id = data[0].value
    if (user.id != null) { await runSQL(createUserCrypto(user.id)) }
    res.sendStatus(200)
  } catch {
    res.sendStatus(500)
  }
})

module.exports = userRouter
