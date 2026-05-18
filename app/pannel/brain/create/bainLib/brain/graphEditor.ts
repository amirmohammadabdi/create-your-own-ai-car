import { NeuronState, NeuronType } from "@/app/lib/interface";
import { Graph } from "./graph";
import { Point, Segment, SensorPoint } from "./point";
import { getIntersection } from "@/app/lib/lib";

export class GraphEditor{
    private drag:boolean = false
    public btnType:NeuronState = NeuronState.wire
    constructor(
        public graph: Graph,
        public canvas: HTMLCanvasElement
    ){
        document.getElementById("generate-random")?.addEventListener("click", () => {
            this.graph.generateRandom()
        })
        document.getElementById("save-brain-btn")?.addEventListener("click", () => {
            localStorage.setItem('brain', JSON.stringify({points: this.graph.points, segs: this.graph.segs}))
            alert('saved the brain')
        })
        document.getElementById("sensor-btn")?.addEventListener("click", ()=>{
            this.btnType = NeuronState.sensor
        })
        document.getElementById("middle-btn")?.addEventListener("click", ()=>{
            this.btnType = NeuronState.middle
        })
        document.getElementById("wire-btn")?.addEventListener("click", ()=>{
            this.btnType = NeuronState.wire
        })
        this.canvas.addEventListener("contextmenu", (e:MouseEvent) => {
            e.preventDefault()
        })
        this.canvas.addEventListener("mousedown", (e:MouseEvent) => {
            if(e.button == 0 && !e.altKey){
                if(this.graph.hover){
                    if(this.graph.selected){
                        this.graph.tryToPushSegment()
                        this.graph.selected = this.graph.hover
                    }
                    else{
                        this.graph.selected = this.graph.hover
                    }
                    this.drag = true
                }
                else{
                    if(this.btnType != NeuronState.wire){
                        const newPoint = this.graph.createPoint(this.btnType, e)
                        this.graph.points.push(newPoint!)
                        // this.graph.selected = newPoint!
                    }
                }
                
            }
            else if(e.button == 2){
                console.log(this.graph.segs)
                if(this.graph.hover){
                    this.graph.deletePoint()
                }
                else if(this.graph.segHover){
                    this.graph.segs = this.graph.segs.filter(s => s!=this.graph.segHover)
                    this.graph.segHover = null
                }
                else{
                    this.graph.selected = null
                }
            }
        })
        this.canvas.addEventListener("mousemove", (e:MouseEvent) => {
            if(!this.drag){
                this.graph.endPoint = null
                this.graph.hover = null
                this.graph.points.forEach(p => {
                    let dis = Math.hypot(
                        e.offsetX - p.x,
                        e.offsetY - p.y
                    )
                    if(dis<15){
                        this.graph.hover = p
                    }
                })
                if(this.graph.hover){
                    this.graph.endPoint = this.graph.hover
                }
                else{
                    this.graph.endPoint = new SensorPoint(e.offsetX, e.offsetY)
                }

                this.graph.segHover = null
                this.graph.segs.forEach(s => {
                    let angel = Math.atan2(s.p2.y-s.p1.y, s.p2.x-s.p1.x)
                    let points = []
                    points.push(new Point(
                        s.p2.x + Math.cos(angel - Math.PI/2)*5,
                        s.p2.y + Math.sin(angel - Math.PI/2)*5,
                    ))
                    points.push(new Point(
                        s.p2.x + Math.cos(angel + Math.PI/2)*5,
                        s.p2.y + Math.sin(angel + Math.PI/2)*5,
                    ))
                    points.push(new Point(
                        s.p1.x + Math.cos(angel + Math.PI/2)*5,
                        s.p1.y + Math.sin(angel + Math.PI/2)*5,
                    ))
                    points.push(new Point(
                        s.p1.x + Math.cos(angel - Math.PI/2)*5,
                        s.p1.y + Math.sin(angel - Math.PI/2)*5,
                    ))

                    let counter = 0
                    let outerPoint = new Point(100000, 100000)
                    let cursor = new Point(e.offsetX, e.offsetY)
                    for(let i=0; i<4; i++){
                        if(getIntersection(
                            points[i],
                            points[(i+1)%4],
                            cursor,
                            outerPoint
                        )){
                            counter++
                        }
                    }
                    if(counter%2){
                        this.graph.segHover = s
                    }
                })
            }
            else{
                if(this.graph.hover?.type == NeuronType.action){
                    return this.drag = false
                }
                this.graph.hover!.x = e.offsetX
                this.graph.hover!.y = e.offsetY
            }
        })
        this.canvas.addEventListener("mouseup", () => {
            if(this.drag){
                this.drag = false
            }
        })

        this.canvas.addEventListener("wheel", (e:WheelEvent) => {
            let sign = Math.sign(e.deltaY)
                let step = .1
            if(this.graph.hover && this.graph.hover.type != NeuronType.sensor){
                this.graph.hover.threshHold += sign*step
                this.graph.hover.threshHold = Math.max(-1, Math.min(1, this.graph.hover.threshHold))
            }
            else if(this.graph.segHover){
                this.graph.segHover.weight += sign*step
                this.graph.segHover.weight = Math.max(-1, Math.min(1, this.graph.segHover.weight))
            }
        })
    }
}