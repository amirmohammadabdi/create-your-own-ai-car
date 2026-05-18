"use client"

import { useEffect, useRef } from "react"
import { MainPit } from "./main"

export default function Drive(){
    const brainCanvas = useRef<HTMLCanvasElement|null>(null)
    const pitCanvas = useRef<HTMLCanvasElement|null>(null)

    useEffect(() => {
        if(!brainCanvas.current || !pitCanvas.current ) return

        const main = new MainPit(pitCanvas.current, brainCanvas.current)
        main.start()

        return () => {
            main.stop()
        }
    },[])

    return(
        <main className="login-container" style={{marginTop: 0}}>
            <canvas className="brain-canvas" ref={pitCanvas}></canvas>
            <canvas className="brain-canvas" ref={brainCanvas}></canvas>
            <div className="btn-box">
                <button id="generate-random-threshholds">generate random threshhols</button>
                <button id="save-the-brain">save the brain</button>
                <button id="restart-the-car">restart the car</button>
            </div>
        </main>
    )
}