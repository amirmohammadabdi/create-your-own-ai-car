import { getIntersection, lerp } from "@/app/lib/lib";
import { Car } from "../car"
import { Point, Segment } from "@/app/pannel/path/create/roadLib/road/point";

export class Radars{
    public rays: Segment[] = []
    public offset: number[] = []
    public intersectionPoint: Point[] = []
    constructor(
        public car: Car,
        public rayCount: number,
        public spreadAngel:number=Math.PI,
        public length: number=100,
    ){
        for(let i=0; i<this.rayCount; i++){
            this.offset.push(1)
            this.intersectionPoint.push(new Point(0,0))
        }
    }
    update(){
        this.rays = []
        
        for(let i=0; i<this.rayCount; i++){
            const rayAngel = lerp(
                this.spreadAngel/2,
                -this.spreadAngel/2,
                this.rayCount==1?.5:i/(this.rayCount-1)
            )+this.car.angel;
            const newRay = new Segment(
                new Point(this.car.x, this.car.y),
                new Point(
                    this.car.x + this.length*Math.cos(rayAngel),
                    this.car.y + this.length*Math.sin(rayAngel)
            ))

            this.rays.push(newRay)
            
            this.offset[i] = 1
            this.car.borders.forEach(s => {
                let intersection = getIntersection(newRay.p1, newRay.p2, s.p1, s.p2)
                if(intersection){
                    this.offset[i] = Math.min(this.offset[i], intersection.offset)
                    this.intersectionPoint[i] = new Point(intersection.x, intersection.y)
                }
            })
        }
        
    }
    draw(ctx: CanvasRenderingContext2D){
        for(let i=0; i<this.rayCount;i++){
            if(this.offset[i] != 1){
                ctx.beginPath()
                ctx.strokeStyle = 'yellow'
                ctx.moveTo(this.rays[i].p1.x, this.rays[i].p1.y)
                ctx.lineTo(this.intersectionPoint[i].x, this.intersectionPoint[i].y)
                ctx.stroke()
                ctx.beginPath()
                ctx.strokeStyle = 'red'
                ctx.moveTo(this.intersectionPoint[i].x, this.intersectionPoint[i].y)
                ctx.lineTo(this.rays[i].p2.x, this.rays[i].p2.y)
                ctx.stroke()
            }
            else{
                this.rays[i].draw(ctx, "yellow")
            }
        }
    }
}