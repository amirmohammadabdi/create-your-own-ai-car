export class Point{
    private radius: number = 10
    private color: string = 'black'
    constructor(
        public x: number,
        public y: number
    ){}

    draw(ctx: CanvasRenderingContext2D, color:string='black'){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = color;
        ctx.fill()
    }
    drawSelected(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius/5, 0, Math.PI*2)
        ctx.lineWidth= 2
        ctx.strokeStyle = 'yellow'
        ctx.stroke()
    }
    drawHover(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius/2, 0, Math.PI*2)
        ctx.fillStyle = 'yellow';
        ctx.fill()
    }

    static isEqual(p1: Point, p2: Point){
        if(p1.x == p2.x && p1.y == p2.y){
            return true
        }
    }
}

export class Segment{
    constructor(
        public p1: Point,
        public p2: Point
    ){}

    draw(ctx: CanvasRenderingContext2D, color:string = "black", lineWidth:number = 2, dash:number[] = []){
        ctx.beginPath()
        ctx.moveTo(this.p1.x, this.p1.y)
        ctx.lineTo(this.p2.x, this.p2.y)
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.setLineDash(dash)
        ctx.stroke()
        ctx.setLineDash([])
    }
}