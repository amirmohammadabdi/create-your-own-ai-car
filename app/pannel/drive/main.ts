import { Graph } from "../brain/create/bainLib/brain/graph"
import { Car } from "./drivingLib/car"
import { Mind } from "./drivingLib/mind"
import { PathGraph } from "./drivingLib/pathGraph"

export class MainPit{
    private brainCtx: CanvasRenderingContext2D
    private pitCtx: CanvasRenderingContext2D
    private animationId: number = 0
    private brainGraph: Graph
    private pathGraph: PathGraph
    private car: Car
    private mind:Mind
    private zoom:number = 2
    constructor(
        private pitCanvas: HTMLCanvasElement,
        private brainCanvas: HTMLCanvasElement,
    ){
        let brainCtx = this.brainCanvas.getContext('2d')
        let pitCtx = this.pitCanvas.getContext('2d')
        if(!(brainCtx && pitCtx)){
            throw new Error("ctx wasn't loaded.")
        }
        this.pitCtx = pitCtx;
        this.brainCtx = brainCtx;

        this.brainCanvas.width = 500
        this.brainCanvas.height = 400
        this.pitCanvas.width = 500
        this.pitCanvas.height = 300

        let prevPoints = []
        let prevSegs = []
        let brain = localStorage.getItem('brain')
        if(brain){
            prevPoints = JSON.parse(brain).points
            prevSegs = JSON.parse(brain).segs
        }
        else{
            alert("brain was not found.")
            throw new Error('brain not found')
        }
        this.brainGraph = new Graph(prevPoints, prevSegs)     


        let path = localStorage.getItem('path')
        if(path){
            const {points, segs, borders, endingRect, startingRect} = JSON.parse(path)
            console.log(JSON.parse(path))

            this.pathGraph = new PathGraph(points, segs, borders, startingRect, endingRect)
        }
        else{
            alert('path not found')
            throw new Error('path not found')
        }

        this.car = new Car(JSON.parse(path).startingRect, this.brainGraph, JSON.parse(path).borders)
        this.mind = new Mind(this.car, this.brainGraph)

        document.getElementById("generate-random-threshholds")?.addEventListener('click', () => {
            this.brainGraph.generateRandom()
        })
        document.getElementById("save-the-brain")?.addEventListener('click', () => {
            localStorage.setItem('brain', JSON.stringify({points: this.brainGraph.points, segs: this.brainGraph.segs}))
        })
        document.getElementById("restart-the-car")?.addEventListener('click', () => {
            this.car = new Car(JSON.parse(path).startingRect, this.brainGraph, JSON.parse(path).borders)
            this.mind = new Mind(this.car, this.brainGraph)
        })
        // this.pitCanvas.addEventListener("wheel", (e:WheelEvent) => {
        //     const sign = Math.sign(e.deltaY)
        //     this.zoom += sign*.1
        //     this.zoom = Math.max(1, Math.min(5, this.zoom))
        // })
    }

    update(){
        this.car.update()
        this.mind.update()
    }
    draw(){
        this.brainCtx.clearRect(0,0,this.brainCanvas.width, this.brainCanvas.height)
        this.brainGraph.draw(this.brainCtx)

        this.pitCtx.clearRect(0,0,this.pitCanvas.width, this.pitCanvas.height)
        this.pitCtx.save()
        this.pitCtx.translate(-this.car.x + this.pitCanvas.width/2, -this.car.y + this.pitCanvas.height * .5);

        this.pathGraph.draw(this.pitCtx)
        this.car.draw(this.pitCtx)
        this.pitCtx.restore();
    }

    private loop = () => {
        this.update()
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