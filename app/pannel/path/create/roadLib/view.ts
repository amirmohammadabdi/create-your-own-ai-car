import { add, scale, subtract } from "@/app/lib/lib"
import { Point } from "./road/point"
import { DragInterface } from "@/app/lib/interface"

export class View{
    private zoom: number = 1
    private center: Point
    private offset: Point
    private drag: DragInterface = {
        start: new Point(0,0),
        end: new Point(0,0),
        offest: new Point(0,0),
        active: false
    }
    constructor(
        public canvas: HTMLCanvasElement
    ){
        this.center = new Point(this.canvas.width/2, this.canvas.height/2)
        this.offset = scale(this.center, -1)

        this.canvas.addEventListener("wheel", (e: WheelEvent) => {
            const sign = Math.sign(e.deltaY)
            const step = 0.1
            this.zoom += step*sign
            this.zoom = Math.max(1, Math.min(5, this.zoom))
        })
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            if(e.button == 0 && e.altKey){
                this.drag.active = true
                this.drag.start = new Point(e.offsetX, e.offsetY)
            }
        })
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            if(this.drag.active){
                this.drag.end = new Point(e.offsetX, e.offsetY)
                this.drag.offest = subtract(this.drag.start, this.drag.end)
            }
        })
        this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
            if(this.drag.active){
                this.offset = add(this.offset, this.drag.offest)
                this.drag = {
                    start: new Point(0,0),
                    end: new Point(0,0),
                    offest: new Point(0,0),
                    active: false
                }
            }
        })
    }

    public getMouse(e: MouseEvent){
        return(
            new Point((e.offsetX - this.center.x)*this.zoom - this.offset.x, (e.offsetY - this.center.y)*this.zoom - this.offset.y)
        )
    }

    public restore(ctx: CanvasRenderingContext2D){
        ctx.restore()
        ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
        ctx.save()
        ctx.translate(this.center.x, this.center.y)
        ctx.scale(1/this.zoom, 1/this.zoom)
        ctx.translate(this.offset.x, this.offset.y)
    }
}