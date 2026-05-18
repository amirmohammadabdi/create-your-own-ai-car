import { Point } from "../pannel/path/create/roadLib/road/point"

export interface UserState{
    username: string,
    _id: string
}

export interface UserContext{
    userState: UserState | null,
    setUserState: (Value: UserState) => void,
}

export interface DragInterface{
    start: Point,
    end: Point,
    offest: Point,
    active: boolean
}

export enum BtnState{
    start="start",
    stop="stop",
    pen="pen"
}

export enum NeuronState{
    sensor="sensor",
    middle="middle",
    wire="wire",
}
export enum NeuronType{
    sensor="sensor",
    middle="middle",
    action="action"
}