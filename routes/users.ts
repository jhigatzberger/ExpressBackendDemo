import express, { Router, Request, Response } from 'express';
const router: Router = express.Router()

interface User{
    name: string
}

interface UserRequest extends Request{
    user?: User
}

router.get('/', (req: Request, res: Response) => {
    res.json(users)
})

router.route("/:id")
.get((req: UserRequest, res: Response) => {
    res.json({"get":req.user})
})
.delete((req: UserRequest, res: Response) => {
    res.json({"delete":req.user})
})
.put((req: UserRequest, res: Response) => {
    res.json({"put":req.user})
})

router.post('/', (req: UserRequest, res: Response) => {
    res.json({"new":"user"})
})

const users: User[] = [{name: "dude1"}, {name: "dude2"}]

router.param("id",(req: UserRequest, res: Response, next, id: number ) =>{
    req.user = users[id]
    next()
})

module.exports = router;