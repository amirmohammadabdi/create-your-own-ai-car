import { Point, Segment } from "../../path/create/roadLib/road/point";

export class PathGraph{
    public points: Point[]=[]
    public segs: Segment[]=[]
    public roadBorders:Segment[] = []
    public startingRect:Point[] = []
    public endingRect:Point[] = []
    constructor(
        points: Point[],
        segs: Segment[],
        roadBorders: Segment[],
        startingRect: Point[],
        endingRect: Point[]
    ){
        points.forEach(p => {
            this.points.push(new Point(p.x, p.y))
        })
        segs.forEach(s => {
            let p1;
            let p2;
            this.points.forEach(p => {
                if(Point.isEqual(s.p1, p)){
                    p1 = p
                }
                else if(Point.isEqual(s.p2, p)){
                    p2 = p
                }
            })

            if(p1 && p2){
                this.segs.push(new Segment(p1, p2))
            }
        })
        roadBorders.forEach(s => {
            let p1 = new Point(s.p1.x, s.p1.y)
            let p2 = new Point(s.p2.x, s.p2.y)
            this.roadBorders.push(new Segment(p1, p2))
        })
        startingRect.forEach(p => {
            this.startingRect.push(new Point(p.x, p.y))
        })
        endingRect.forEach(p => {
            this.endingRect.push(new Point(p.x, p.y))
        })
    }
    draw(ctx: CanvasRenderingContext2D){
        this.roadBorders.forEach(s => {
            s.draw(ctx, 'white', 5, [])
        })
        this.segs.forEach(s => {
            s.draw(ctx, "white", 3, [50, 100])
        })
        ctx.beginPath()
        ctx.moveTo(this.startingRect[0].x, this.startingRect[0].y)
        for(let i=1; i<4; i++){
            ctx.lineTo(this.startingRect[i].x, this.startingRect[i].y)
        }
        ctx.closePath()
        ctx.globalAlpha = .6
        ctx.fillStyle = "green"
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(this.endingRect[0].x, this.endingRect[0].y)
        for(let i=1; i<4; i++){
            ctx.lineTo(this.endingRect[i].x, this.endingRect[i].y)
        }
        ctx.closePath()
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.globalAlpha = 1

    }
}