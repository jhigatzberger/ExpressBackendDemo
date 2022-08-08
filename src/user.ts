import { Request } from 'express'

export interface User{
    username: string,
    id?: number
}

export interface UserRequest extends Request{
    user?: User
}
