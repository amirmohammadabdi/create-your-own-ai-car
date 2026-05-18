import { BtnState } from "@/app/lib/interface"
import { Graph } from "./graph"
import { GraphEditor } from "./graphEditor"
import { View } from "./view"

export class MainClass{
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private animationId: number = 0
    private graph: Graph
    private view: View
    private graphEditor: GraphEditor

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas
        this.canvas.width = 500
        this.canvas.height = 500

        const ctx = this.canvas.getContext('2d');
        if(!ctx){
            throw new Error("couldn't get the 2d context")
        }

        
        if(localStorage.getItem('path')){
            let {points, segs} = JSON.parse(localStorage.getItem('path')!)
            this.graph = new Graph(points, segs)
            console.log(points)
        }
        else{
            this.graph = new Graph()
        }

        this.view = new View(this.canvas)
        this.graphEditor = new GraphEditor(this.view, this.graph, this.canvas)

        this.ctx = ctx
    }

    start(){
        this.loop()
    }
    stop(){
        cancelAnimationFrame(this.animationId)
    }

    private draw(){
        this.view.restore(this.ctx)
        this.graph.draw(this.ctx)
    }

    private loop = () => { // it need to be an arrow function for 'this' not to be lost when it get calles using animationframe
        this.draw()
        this.animationId = requestAnimationFrame(this.loop)
    }

}