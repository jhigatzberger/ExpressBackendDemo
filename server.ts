import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


function logger(req: Request, res: Response, next: any) : void {
    console.log(req.originalUrl)
    next()
}

app.use(logger)

app.get('/', (req: Request, res: Response) => {
    res.json({"epic":"victory royale"})
})

const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(port);