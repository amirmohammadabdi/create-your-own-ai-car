import { Graph } from "./brain/graph"
import { GraphEditor } from "./brain/graphEditor"

export class MainBrain{
    private brainCtx: CanvasRenderingContext2D
    private animationId: number = 0
    private brainGraph:Graph
    private brainGraphEditor: GraphEditor
    constructor(private brainCanvas: HTMLCanvasElement){
        this.brainCanvas.width = 500
        this.brainCanvas.height = 400
        
        const brainCtx = this.brainCanvas.getContext('2d')
        if(!brainCtx) throw new Error('ctx not found')
        
        this.brainCtx = brainCtx

        let prevPoints = []
        let prevSegs = []
        let brain = localStorage.getItem('brain')
        if(brain){
            prevPoints = JSON.parse(brain).points
            prevSegs = JSON.parse(brain).segs
        }
        this.brainGraph = new Graph(prevPoints, prevSegs)
        this.brainGraphEditor = new GraphEditor(this.brainGraph, this.brainCanvas)

    }
    draw(){
        this.brainGraph.draw(this.brainCtx)
    }
    private loop = ()=>{
        this.brainCtx.clearRect(0, 0, this.brainCanvas.width, this.brainCanvas.height)
        this.draw()
        this.animationId = requestAnimationFrame(this.loop)
    }
    public start(){
        this.loop()
    }
    public stop(){
        cancelAnimationFrame(this.animationId)
    }
}