import { Point, Segment } from "./point";
import { Poly } from "./poly";

export class Envelope{
    private points: Point[] = []
    public poly: Poly
    constructor(
        private seg: Segment,
        private roundness: number,
        private width: number = 100
    ){
        let angel = Math.atan2(
            this.seg.p2.y - this.seg.p1.y,
            this.seg.p2.x - this.seg.p1.x
        )
        let step = Math.PI / this.roundness
        for(let i=0; i<=roundness; i++){
            this.points.push(new Point(
                this.seg.p2.x + Math.cos((angel-Math.PI/2) + step*i) * this.width,
                this.seg.p2.y + Math.sin((angel-Math.PI/2) + step*i) * this.width
            ))
        }
        for(let i=0; i<=roundness; i++){
            this.points.push(new Point(
                this.seg.p1.x - Math.cos((angel-Math.PI/2) + step*i) * this.width,
                this.seg.p1.y - Math.sin((angel-Math.PI/2) + step*i) * this.width
            ))
        }
        this.poly = new Poly(this.points)
    }
    draw(ctx: CanvasRenderingContext2D){
        this.poly.draw(ctx)
    }
}