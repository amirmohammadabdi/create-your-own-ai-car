"use client"

import { useEffect, useRef, useState } from "react"
import { MainBrain } from "./bainLib/main"
import { NeuronState } from "@/app/lib/interface"

export default function CreateBrain(){
    const brainCanvas = useRef<HTMLCanvasElement|null>(null)
    const [nState, setNState] = useState<NeuronState>(NeuronState.wire)

    useEffect(() => {
        let main:MainBrain|null = null
        if(brainCanvas.current){
            main = new MainBrain(brainCanvas.current)
            main.start()
        }
        return () => {
            if(main){
                main.stop()
            }
        }
    }, [])
    return(
        <main className="login-container">
            <canvas className="brain-canvas" ref={brainCanvas}></canvas>
            <div className="btn-box">
                <button id="sensor-btn" className={nState==NeuronState.sensor?'selected':''} onClick={()=>{
                    setNState(
                        NeuronState.sensor
                    )
                }}>add sensor</button>
                <button id="middle-btn" className={nState==NeuronState.middle?'selected':''} onClick={()=>{
                    setNState(
                        NeuronState.middle
                    )
                }}>add middle neuron</button>
            </div>
            <div className="btn-box">
                <button id="save-brain-btn">save the brain</button>
                <button id="generate-random">generate random threshholds</button>
            </div>
        </main>
    )
}