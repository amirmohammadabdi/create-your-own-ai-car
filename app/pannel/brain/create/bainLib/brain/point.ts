import { NeuronType } from "@/app/lib/interface"

export class Point{
    public radius:number = 10
    public type:NeuronType|null = null
    public threshHold:number = 0
    constructor(
        public x:number,
        public y:number,
    ){}
    update(){}
    drawSelected(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius/2, 0, Math.PI*2)
        ctx.strokeStyle = "red"
        ctx.stroke()
    }
    drawHover(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius-5, 0, Math.PI*2)
        ctx.fillStyle = "red"
        ctx.fill()
    }
    static Isequeal(p1: Point, p2: Point){
        if(p1.x == p2.x && p1.y == p2.y){
            return true
        }
    }
}

export class SensorPoint extends Point{
    public offset:number = 0
    public id:number = Date.now()
    constructor(x:number, y: number){
        super(x, y)
        this.type = NeuronType.sensor
    }
    update(){}
    draw(ctx: CanvasRenderingContext2D, color:string='black'){
        ctx.beginPath()
        ctx.fillStyle = color
        if(this.offset > 0){
            ctx.fillStyle = "yellow"
            ctx.globalAlpha = this.offset/1
        }
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fill()
        ctx.globalAlpha = 1
    }
}

export class MiddlePoint extends Point{
    public offset:number = 0;
    public active:boolean = false
    constructor(x:number, y: number, threshHold:number = 0){
        super(x, y)
        this.type = NeuronType.middle
        this.threshHold = threshHold
    }
    update(){
        if(this.offset > this.threshHold){
            this.active = true
        }
        else{
            this.active = false
        }
    }
    draw(ctx: CanvasRenderingContext2D, color:string='black'){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius+2, 0, Math.PI*2)
        ctx.lineWidth = 5
        ctx.strokeStyle = 'black'
        if(this.threshHold < 0){
            ctx.strokeStyle = 'blue'
            ctx.globalAlpha = Math.abs(this.threshHold)/1
        }
        else if(this.threshHold > 0){
            ctx.strokeStyle = 'yellow'
            ctx.globalAlpha = Math.abs(this.threshHold)/1
        }
        ctx.setLineDash([2,2])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = 'black'
        if(this.active){
            ctx.fillStyle = 'yellow'
        }
        ctx.fill()
    }
}

export class ActionPoint extends Point{
    public offset:number = 0;
    public active:boolean = false
    constructor(x:number, y: number,  threshHold:number = 0){
        super(x, y)
        this.type = NeuronType.action
        this.threshHold = threshHold
    }
    update(){
        if(this.offset > this.threshHold){
            this.active = true
        }
        else{
            this.active = false
        }
    }
    draw(ctx: CanvasRenderingContext2D, color:string='yellow'){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius+2, 0, Math.PI*2)
        ctx.lineWidth = 5
        ctx.strokeStyle = 'black'
        if(this.threshHold < 0){
            ctx.strokeStyle = 'blue'
            ctx.globalAlpha = Math.abs(this.threshHold)/1
        }
        else if(this.threshHold > 0){
            ctx.strokeStyle = 'red'
            ctx.globalAlpha = Math.abs(this.threshHold)/1
        }
        ctx.setLineDash([2,2])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = 'black'
        if(this.active){
            ctx.fillStyle = 'yellow'
        }
        ctx.fill()
    }
}

export class Segment{
    constructor(
        public p1: SensorPoint|MiddlePoint|ActionPoint,
        public p2: SensorPoint|MiddlePoint|ActionPoint,
        public weight:number = 0
    ){}
    draw(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.moveTo(this.p1.x, this.p1.y)
        ctx.lineTo(this.p2.x, this.p2.y)
        ctx.strokeStyle = "black"
        if(this.weight > 0){
            ctx.strokeStyle = "yellow"
            ctx.globalAlpha = Math.abs(this.weight)/1
        }
        else if(this.weight < 0){
            ctx.strokeStyle = "blue"
            ctx.globalAlpha = Math.abs(this.weight)/1
        }
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.globalAlpha = 1
    }
    drawHover(ctx:CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.moveTo(this.p1.x, this.p1.y)
        ctx.lineTo(this.p2.x, this.p2.y)
        ctx.strokeStyle = "red"
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.lineWidth = 2
    }
}