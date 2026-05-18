import { getIntersection, getMiddle, getRandomColor } from "@/app/lib/lib";
import { Envelope } from "./road/envelope";
import { Point, Segment } from "./road/point";
import { Poly } from "./road/poly";

export class Graph{
    public points: Point[] = []
    public segs: Segment[] = []
    public selected: Point|null = null
    public hover: Point|null = null
    public endPoint: Point|null = null
    public envelopes: Envelope[] = []
    private outerBorder: Segment[] = []
    public rectangle: Point[] = []
    public startingRect: Point[] = []
    public startingRectHover: boolean = false
    public endingRect: Point[] = []
    public endingRectHover: boolean = false
    public segmentHover: Segment|null = null
    constructor(points?:Point[], segs?: Segment[]){
        if(points && segs){
            console.log(points, segs)
            points.forEach(p => {
                this.points.push(new Point(p.x, p.y))
            })
            segs.forEach(s => {
                let p1
                let p2
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
        }
        document.getElementById('done-btn')!.addEventListener('click', () => {
            if(this.startingRect.length==0 || this.endingRect.length == 0){
                return alert('please select an starting and ending point.')
            }
            localStorage.setItem(
                'path',
                JSON.stringify({
                    points: this.points,
                    segs: this.segs,
                    borders: this.outerBorder,
                    startingRect: this.startingRect,
                    endingRect: this.endingRect,
                })
            )
            alert('save the path. go and check it!')
        })
        document.getElementById('clear-btn')!.addEventListener('click', () => {
            this.points = []
            this.segs = []
            this.outerBorder = []
        })
    }

    public draw(ctx: CanvasRenderingContext2D){
        let border = []
        this.envelopes = []
        this.segs.forEach(s => {
            this.envelopes.push(new Envelope(s, 11))
        })
        let count = this.envelopes.length
        for(let i=0; i<count; i++){
            for(let j=0; j<count; j++){
                if(i != j){
                    Poly.breakPoly(this.envelopes[i].poly, this.envelopes[j].poly)
                }
            }
        }
        this.envelopes.forEach(s=>{
            s.poly.draw(ctx)
        })

        let outerPoint = new Point(100000, 100000)
        for(let i=0; i<count; i++){
            let poly1 = this.envelopes[i].poly
            for(let j=0; j<poly1.segs.length; j++){
                let isOut = true
                let middlePoint = getMiddle(poly1.segs[j].p1, poly1.segs[j].p2)
                for(let c=0; c<count; c++){
                    if(c != i){
                        let poly2 = this.envelopes[c].poly
                        let counter = 0;
                        for(let d=0; d<poly2.segs.length; d++){
                            let intersection = getIntersection(
                                outerPoint, middlePoint,
                                poly2.segs[d].p1, poly2.segs[d].p2
                            )
                            if(intersection){
                                counter ++;
                            }
                        }
                        if(counter%2 == 1){
                            isOut = false
                            break
                        }
                    }
                }
                if(isOut){
                    border.push(poly1.segs[j])
                }
            }
        }
        
        this.outerBorder = border
        this.outerBorder.forEach(s=>{
            s.draw(ctx, "white", 5, [])
        })

        ctx.globalAlpha = .6
        if(this.segmentHover){
            ctx.beginPath()
            ctx.moveTo(this.segmentHover.p1.x, this.segmentHover.p1.y)
            ctx.lineTo(this.segmentHover.p2.x, this.segmentHover.p2.y)
            ctx.strokeStyle = "red"
            ctx.lineWidth = 4
            ctx.stroke()
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
        }
        this.segs.forEach(s => {
            s.draw(ctx)
        })
        this.points.forEach(p => {
            p.draw(ctx)
        })

        if(this.rectangle.length){
            ctx.beginPath()
            ctx.moveTo(this.rectangle[0].x, this.rectangle[0].y)
            for(let i=1; i<4; i++){
                ctx.lineTo(this.rectangle[i].x, this.rectangle[i].y)
            }
            ctx.closePath()
            ctx.fillStyle = "blue"
            ctx.fill()
        }
        if(this.startingRect.length){
            ctx.beginPath()
            ctx.moveTo(this.startingRect[0].x, this.startingRect[0].y)
            for(let i=1; i<4; i++){
                ctx.lineTo(this.startingRect[i].x, this.startingRect[i].y)
            }
            ctx.closePath()
            ctx.fillStyle = "green"
            if(this.startingRectHover)
                ctx.fillStyle = "yellow"
            ctx.fill()
        }
        if(this.endingRect.length){
            ctx.beginPath()
            ctx.moveTo(this.endingRect[0].x, this.endingRect[0].y)
            for(let i=1; i<4; i++){
                ctx.lineTo(this.endingRect[i].x, this.endingRect[i].y)
            }
            ctx.closePath()
            ctx.fillStyle = "red"
            if(this.endingRectHover)
                ctx.fillStyle = "orange"
            ctx.fill()
        }

        ctx.globalAlpha = 1
        if(this.selected){
            this.selected.drawSelected(ctx)
            if(this.endPoint){
                ctx.beginPath()
                ctx.setLineDash([2,2])
                ctx.lineWidth = 2
                ctx.moveTo(this.selected.x, this.selected.y)
                ctx.lineTo(this.endPoint.x, this.endPoint.y)
                ctx.stroke()
                ctx.setLineDash([])
            }
        }
        if(this.hover){
            this.hover.drawHover(ctx)
        }
    }

    public deletePoint(){
        this.selected = null
        for(let i=0; i<this.segs.length; i++){
            if(this.segs[i].p1 == this.hover || this.segs[i].p2 == this.hover){
                this.segs.splice(i, 1)
                i--
            }
        }

        this.points = this.points.filter(p => p!=this.hover)
        this.hover = null
    }
    public tryToPushSegment(){
        let isthere = false
        this.segs.forEach(s => {
            if(
                (s.p1 == this.selected && s.p2 == this.hover) ||
                (s.p1 == this.hover && s.p2 == this.selected)
            )
            {
                isthere = true
            }
        })
        if(!isthere && this.hover != this.selected){
            this.segs.push(new Segment(this.selected!, this.hover!))
        }
        else{
            console.log('already added or trying to create a segment with the same point.')
        }
    }
}