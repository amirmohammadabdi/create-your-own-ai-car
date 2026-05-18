import { BtnState } from "@/app/lib/interface";
import { Graph } from "./graph";
import { Point, Segment } from "./road/point";
import { View } from "./view";
import { getIntersection } from "@/app/lib/lib";

export class GraphEditor{
    private drag: boolean = false
    public btnState: BtnState = BtnState.pen
    private edgeSpace: number = 30
    constructor(
        public view: View,
        public graph: Graph,
        public canvas: HTMLCanvasElement,
    ){
        document.getElementById('startBtn')!.addEventListener("click", () => {
            this.btnState = this.btnState==BtnState.start?BtnState.pen:BtnState.start
            console.log('clicked')
        })
        document.getElementById('stopBtn')!.addEventListener("click", () => {
            this.btnState = this.btnState==BtnState.stop?BtnState.pen:BtnState.stop
        })

        this.canvas.addEventListener("contextmenu", e=>{
            e.preventDefault();
        })

        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            // console.log(this.btnState)
            if(this.btnState == BtnState.pen){
                if(e.button == 0 && !e.altKey){
                    if(this.graph.hover){
                        if(this.graph.selected){
                            this.graph.tryToPushSegment()
                            this.graph.selected = this.graph.hover
                        }
                        else{
                            this.graph.selected = this.graph.hover
                        }
                        this.drag = true
                    }
                    else{
                        let truePoint = this.view.getMouse(e)
                        if(this.graph.selected){
                            const newPoint = new Point(this.graph.endPoint!.x, this.graph.endPoint!.y)
                            this.graph.points.push(newPoint)
                            this.graph.segs.push(new Segment(this.graph.selected, newPoint))
                            this.graph.selected = newPoint
                        }
                        else{
                            const newPoint = new Point(truePoint.x, truePoint.y)
                            this.graph.points.push(newPoint)
                            this.graph.selected = newPoint;
                        }
                    }
                }
                else if(e.button == 2){
                    if(this.graph.hover){
                        this.graph.deletePoint()
                    }
                    else if(this.graph.segmentHover){
                        this.graph.segs = this.graph.segs.filter(s => s!=this.graph.segmentHover);
                        this.graph.segmentHover = null
                    }

                    this.graph.selected = null
                }
            }
            else if(this.btnState == BtnState.start){
                if(this.graph.rectangle.length > 0){
                    if(e.button == 0 && !e.altKey)
                        this.graph.startingRect = [...this.graph.rectangle]
                }
                else if(e.button == 2 && this.graph.startingRectHover){
                    this.graph.startingRect = []
                    this.graph.startingRectHover = false
                }
            }
            else{
                if(this.graph.rectangle.length > 0){
                    if(e.button == 0 && !e.altKey)
                        this.graph.endingRect = [...this.graph.rectangle]
                }
                else if(e.button == 2 && this.graph.endingRectHover){
                    this.graph.endingRect = []
                    this.graph.endingRectHover = false
                }
            }
        })
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            this.graph.rectangle = []
            let truePoint = this.view.getMouse(e)
            if(this.btnState == BtnState.pen){
                if(e.shiftKey && this.graph.selected){
                    let deltaX = Math.abs(truePoint.x - this.graph.selected.x)
                    let deltaY = Math.abs(truePoint.y - this.graph.selected.y)
                    if(deltaX > deltaY){
                        truePoint.y = this.graph.selected.y
                    }
                    else{
                        truePoint.x = this.graph.selected.x
                    }
                }
                this.graph.segmentHover = null
                if(!this.drag){
                    this.graph.hover = null
                    this.graph.points.forEach(p => {
                        let dis = Math.hypot(
                            truePoint.x - p.x,
                            truePoint.y - p.y
                        )
                        if(dis < 15){
                            this.graph.hover = p
                        }
                    })
                    this.graph.endPoint = this.graph.hover?this.graph.hover:truePoint
                    this.graph.segs.forEach(s => {
                        let angel = Math.atan2(s.p2.y-s.p1.y, s.p2.x-s.p1.x)
                        let dis = 10
                        let pts = [
                            new Point(
                                s.p2.x + Math.cos(angel-Math.PI/2)*dis,
                                s.p2.y + Math.sin(angel-Math.PI/2)*dis
                            ),
                            new Point(
                                s.p2.x + Math.cos(angel+Math.PI/2)*dis,
                                s.p2.y + Math.sin(angel+Math.PI/2)*dis
                            ),
                            new Point(
                                s.p1.x + Math.cos(angel+Math.PI/2)*dis,
                                s.p1.y + Math.sin(angel+Math.PI/2)*dis
                            ),
                            new Point(
                                s.p1.x + Math.cos(angel-Math.PI/2)*dis,
                                s.p1.y + Math.sin(angel-Math.PI/2)*dis
                            )
                        ]
                        let counter = 0;
                        let outPt = new Point(100000, 100000)
                        for(let i=0; i<4; i++){
                            if(getIntersection(
                                truePoint,
                                outPt,
                                pts[i],
                                pts[(i+1)%4]
                            )){
                                counter++;
                            }
                        }
                        if(counter%2 == 1){
                            this.graph.segmentHover = s
                        }
                    })
                }
                else{
                    this.graph.endPoint = null
                    this.graph.selected!.x = truePoint.x
                    this.graph.selected!.y = truePoint.y
                }
            }
            else{
                this.graph.segs.forEach(seg => {
                    let angel = Math.atan2(
                        seg.p2.y - seg.p1.y,
                        seg.p2.x - seg.p1.x
                    )
                    let firstPoint = new Point(
                        seg.p1.x + Math.cos(angel)*this.edgeSpace,
                        seg.p1.y + Math.sin(angel)*this.edgeSpace
                    )
                    let secondPoint = new Point(
                        seg.p2.x - Math.cos(angel)*this.edgeSpace,
                        seg.p2.y - Math.sin(angel)*this.edgeSpace
                    )
                    let rect = [
                        firstPoint,
                        new Point(Math.cos(angel+Math.PI/2)*60 + firstPoint.x, Math.sin(angel+Math.PI/2)*60 + firstPoint.y),
                        new Point(Math.cos(angel+Math.PI/2)*60 + secondPoint.x, Math.sin(angel+Math.PI/2)*60 + secondPoint.y),
                        secondPoint
                    ]
                    let rect2 = [
                        firstPoint,
                        new Point(Math.cos(angel-Math.PI/2)*60 + firstPoint.x, Math.sin(angel-Math.PI/2)*60 + firstPoint.y),
                        new Point(Math.cos(angel-Math.PI/2)*60 + secondPoint.x, Math.sin(angel-Math.PI/2)*60 + secondPoint.y),
                        secondPoint
                    ]
                    
                    // this.graph.rectangles.push(rect, rect2)
                    let outerPoint = new Point(100000, 100000)

                    let counter = 0
                    for(let i=0; i<4; i++){
                        if(getIntersection(
                            truePoint, outerPoint, rect[i], rect[(i+1)%4]
                        )){
                            counter +=1
                        }
                    }
                    if(counter%2==1){
                        let outer = new Point(
                            truePoint.x + Math.cos(angel - Math.PI/2) * 200,
                            truePoint.y + Math.sin(angel - Math.PI/2) * 200
                        )
                        let intersection = getIntersection(outer, truePoint, seg.p1, seg.p2)
                        let top = new Point(
                            intersection!.x + Math.cos(angel)*50,
                            intersection!.y + Math.sin(angel)*50,
                        )
                        let bottom = new Point(
                            intersection!.x - Math.cos(angel)*50,
                            intersection!.y - Math.sin(angel)*50,
                        )
                        let inRect = [
                            top,
                            new Point(top.x+Math.cos(angel+Math.PI/2)*60, top.y+Math.sin(angel+Math.PI/2)*60),
                            new Point(bottom.x+Math.cos(angel+Math.PI/2)*60, bottom.y+Math.sin(angel+Math.PI/2)*60),
                            bottom
                        ]
                        this.graph.rectangle = inRect
                    }
                    counter = 0
                    for(let i=0; i<4; i++){
                        if(getIntersection(
                            truePoint, outerPoint, rect2[i], rect2[(i+1)%4]
                        )){
                            counter +=1
                        }
                    }
                    if(counter%2==1){
                        let outer = new Point(
                            Math.cos(angel+Math.PI/2)*200+truePoint.x,
                            Math.sin(angel+Math.PI/2)*200+truePoint.y
                        )
                        let intersection = getIntersection(outer, truePoint, seg.p1, seg.p2)
                        let top = new Point(
                            intersection!.x + Math.cos(angel)*50,
                            intersection!.y + Math.sin(angel)*50,
                        )
                        let bottom = new Point(
                            intersection!.x - Math.cos(angel)*50,
                            intersection!.y - Math.sin(angel)*50,
                        )
                        let inRect = [
                            top,
                            new Point(top.x+Math.cos(angel-Math.PI/2)*60, top.y+Math.sin(angel-Math.PI/2)*60),
                            new Point(bottom.x+Math.cos(angel-Math.PI/2)*60, bottom.y+Math.sin(angel-Math.PI/2)*60),
                            bottom
                        ]
                        this.graph.rectangle = inRect
                    }
                })

                if(this.graph.startingRect.length){
                    let outerPoint = new Point(100000,100000)
                    let counter = 0
                    for(let i=0; i<4; i++){
                        if(getIntersection(truePoint, outerPoint, this.graph.startingRect[i], this.graph.startingRect[(i+1)%4])){
                            counter++
                        }
                    }
                    if(counter%2){
                        this.graph.startingRectHover = true
                        this.graph.rectangle = [];
                    }
                    else{
                        this.graph.startingRectHover = false
                    }
                }
                if(this.graph.endingRect.length){
                    let outerPoint = new Point(100000,100000)
                    let counter = 0
                    for(let i=0; i<4; i++){
                        if(getIntersection(truePoint, outerPoint, this.graph.endingRect[i], this.graph.endingRect[(i+1)%4])){
                            counter++
                        }
                    }
                    if(counter%2){
                        this.graph.endingRectHover = true
                        this.graph.rectangle = [];
                    }
                    else{
                        this.graph.endingRectHover = false
                    }
                }

            }
        })
        this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
            if(this.drag){
                this.drag = false
            }
        })
    }
}