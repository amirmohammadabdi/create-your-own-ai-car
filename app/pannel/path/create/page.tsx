"use client"

import { useEffect, useRef, useState } from "react"
import { MainClass } from "./roadLib/main"
import { BtnState } from "@/app/lib/interface"
import { useRouter } from "next/navigation"

export default function CreatePath(){
    const canvas = useRef<HTMLCanvasElement|null>(null)
    const [btn, setBtn] = useState<BtnState>(BtnState.pen)
    const router = useRouter()

    useEffect(() => {
        if(!canvas.current) return

        const main = new MainClass(canvas.current)

        main.start()

        return () => {
            if(main){
                main.stop()
            }
        }
    }, [])

    return(
        <main className="login-container">
            <canvas ref={canvas} className="path-canvas"></canvas>
            <div className="btn-box">
                <button id="startBtn" className={btn==BtnState.start?'selected':''} onClick={() => {
                    let change = btn==BtnState.start?BtnState.pen:BtnState.start
                    setBtn(change)
                }}>add a starting point</button>
                <button id="stopBtn" className={btn==BtnState.stop?'selected':''} onClick={() => {
                    let change = btn==BtnState.stop?BtnState.pen:BtnState.stop
                    setBtn(change)
                }}>add an ending point</button>
            </div>
            <div className="btn-box">
                <button id="done-btn" onClick={() => {
                    // router.push('/pannel')
                }}>Done</button>
                <button id="clear-btn">clear the board</button>
            </div>
        </main>
    )
}