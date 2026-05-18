import { getIntersection, getRandomColor } from "@/app/lib/lib";
import { Point, Segment } from "./point";

export class Poly{
    public segs: Segment[] = []
    constructor(
        private points: Point[]
    ){
        let count = this.points.length
        for(let i=0; i<count; i++){
            this.segs.push(new Segment(
                this.points[i],
                this.points[(i+1)%count]
            ))
        }
    }
    static breakPoly(poly1: Poly, poly2: Poly){
        for(let i=0; i<poly1.segs.length; i++){
            for(let j=0; j<poly2.segs.length; j++){
                let intersection = getIntersection(
                    poly1.segs[i].p1,
                    poly1.segs[i].p2,
                    poly2.segs[j].p1,
                    poly2.segs[j].p2
                )
                if(intersection && intersection.offset!=1 && intersection.offset!=0){
                    let newPoint = new Point(
                        intersection.x,
                        intersection.y
                    )

                    let tmpPoint = poly1.segs[i].p2
                    poly1.segs[i].p2 = newPoint
                    poly1.segs.splice(i+1, 0, new Segment(newPoint, tmpPoint))
                    
                    tmpPoint = poly2.segs[j].p2
                    poly2.segs[j].p2 = newPoint
                    poly2.segs.splice(j+1, 0, new Segment(newPoint, tmpPoint))
                }

            }
        }
    }
    drawSegment(ctx: CanvasRenderingContext2D){
        this.segs.forEach(s => {
            s.draw(ctx, getRandomColor())
        })
    }
    draw(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)
        for(let i=1; i<this.points.length; i++){
            ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.fillStyle = "gray"
        ctx.strokeStyle = "gray"
        ctx.lineWidth = 20
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}