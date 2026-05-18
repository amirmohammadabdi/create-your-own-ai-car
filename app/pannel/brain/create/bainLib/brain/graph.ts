import { NeuronState, NeuronType } from "@/app/lib/interface";
import { ActionPoint, MiddlePoint, Point, Segment, SensorPoint } from "./point";

export class Graph{
    public points: Array<MiddlePoint|ActionPoint|SensorPoint> = []
    public segs: Segment[] = []
    public selected: SensorPoint|MiddlePoint|ActionPoint|null = null
    public hover: SensorPoint|MiddlePoint|ActionPoint|null = null
    public endPoint: SensorPoint|MiddlePoint|ActionPoint|null = null
    public segHover: Segment|null = null
    public sensorCount:number = 0
    constructor(prevPoints: Array<MiddlePoint|ActionPoint|SensorPoint>, prevSegs: Segment[]){
        if(prevPoints.length){
            prevPoints.forEach(p => {
                if(p.type == NeuronType.action){
                    this.points.push(new ActionPoint(p.x, p.y, p.threshHold))
                }
                else if(p.type == NeuronType.sensor){
                    this.points.push(new SensorPoint(p.x, p.y))
                }
                else if(p.type == NeuronType.middle){
                    this.points.push(new MiddlePoint(p.x, p.y, p.threshHold))
                }
            })
        }
        else{
            for(let i=0; i<4; i++){
                this.points.push(new ActionPoint(100*(i+1), 50, .5))
            }
        }
        prevSegs.forEach(s => {
            let p1;
            let p2;
            this.points.forEach(p => {
                if(Point.Isequeal(s.p1, p)){
                    p1 = p
                }
                else if(Point.Isequeal(s.p2, p)){
                    p2 = p
                }
            })
            if(p1 && p2)
                this.segs.push(new Segment(p1, p2, s.weight))
        })
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";

        // draw text at x=50, y=50
        ctx.fillText("fwd", 100-18, 30);
        ctx.fillText("bwd", 200-18, 30);
        ctx.fillText("right", 300-18, 30);
        ctx.fillText("left", 400-18, 30);
        if(this.segHover){
            this.segHover.drawHover(ctx)
        }
        this.segs.forEach(s => {
            s.draw(ctx)
        })
        this.points.forEach(p => {
            p.draw(ctx)
        })

        if(this.hover){
            this.hover.drawHover(ctx)
        }
        if(this.selected){
            this.selected.drawSelected(ctx)
            if(this.endPoint){
                ctx.beginPath()
                ctx.moveTo(this.selected.x, this.selected.y)
                ctx.lineTo(this.endPoint.x, this.endPoint.y)
                ctx.setLineDash([3,3])
                ctx.stroke()
                ctx.setLineDash([])
            }
        }
    }
    tryToPushSegment(){
        let canDo = true
        if(
            this.selected != this.hover &&
            (
                this.selected?.type != this.hover?.type || 
                (this.selected?.type==NeuronType.middle && this.hover?.type == NeuronType.middle)
            )
        ){
            for(let i=0; i<this.segs.length; i++){
                if(
                    (this.segs[i].p1 == this.selected && this.segs[i].p2 == this.hover)||
                    (this.segs[i].p2 == this.selected && this.segs[i].p1 == this.hover)
                ){
                    canDo = false
                    break
                }
            }
            if(canDo){
                this.segs.push(new Segment(
                    this.selected!, this.hover!
                ))
            }
        }
    }
    createPoint(type: NeuronState, e:MouseEvent){
        if(type == NeuronState.sensor){
            this.sensorCount++
            return new SensorPoint(e.offsetX, e.offsetY)
        }
        if(type == NeuronState.middle){
            return new MiddlePoint(e.offsetX, e.offsetY, 0)
        }
    }
    deletePoint(){
        if(this.hover?.type == NeuronType.action) return
        for(let i=0; i<this.segs.length; i++){
            if(this.segs[i].p1 == this.hover || this.segs[i].p2 == this.hover){
                this.segs.splice(i, 1)
                i--
            }
        }
        this.points = this.points.filter(p => p!=this.hover)
        if(this.hover?.type == NeuronType.sensor){
            this.sensorCount--
            console.log(this.sensorCount)
        }
        this.hover = null
    }
    generateRandom(){
        this.segs.forEach(s => {
            s.weight = Math.random() * 2 - 1
        })
        this.points.forEach(p => {
            if(p.type != NeuronType.sensor){
                p.threshHold = Math.random() * 2 - 1
            }
        })
    }
}