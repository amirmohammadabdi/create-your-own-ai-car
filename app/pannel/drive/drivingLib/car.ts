import { getIntersection } from "@/app/lib/lib"
import { Point, Segment } from "../../path/create/roadLib/road/point"
import { Radars } from "./carLib/radars"
import { Graph } from "../../brain/create/bainLib/brain/graph"
import { NeuronType } from "@/app/lib/interface"


export class Car{
    public x:number=0
    public y:number=0
    public angel:number=0
    public img:HTMLImageElement = new Image
    public readyImg: boolean = false
    public width:number = 50
    public height:number = 100
    public radars:Radars
    public speed = 0
    public a = .5
    public friction = .1
    public maxSpeed = 3
    public movingBrain:number[] = [0,0,0,0]
    public move = {
        fwd: false,
        bwd: false,
        right: false,
        left: false
    }
    public alive: boolean = true
    constructor(
        public startingRect: Point[],
        public brainGraph: Graph,
        public borders: Segment[]
    ){
        let intersction = getIntersection(startingRect[0], startingRect[2], startingRect[1], startingRect[3])
        if(intersction){
            this.x = intersction.x
            this.y = intersction.y
        }
        this.angel = Math.atan2(
            startingRect[0].y - startingRect[3].y,
            startingRect[0].x - startingRect[3].x
        )
        this.img.src = '/car.png'
        this.img.onload = () => {
            this.readyImg = true
        }

        let counter = 0
        this.brainGraph.points.forEach(p => {
            if(p.type == NeuronType.sensor) counter++
        })

        this.radars = new Radars(this, counter, Math.PI*2/3)

        // document.addEventListener("keydown", (e) => {
        //     if(e.key=='a'){
        //         this.move.left = true
        //     }
        //     if(e.key=='w'){
        //         this.move.fwd = true
        //     }
        //     if(e.key=='d'){
        //         this.move.right = true
        //     }
        //     if(e.key=='s'){
        //         this.move.bwd = true
        //     }
        // })
        // document.addEventListener("keyup", (e) => {
        //     if(e.key=='a'){
        //         this.move.left = false
        //     }
        //     if(e.key=='w'){
        //         this.move.fwd = false
        //     }
        //     if(e.key=='d'){
        //         this.move.right = false
        //     }
        //     if(e.key=='s'){
        //         this.move.bwd = false
        //     }
        // })
    }
    

    update(){
        if(!this.alive) return

        this.radars.update()
        
        this.speed -= Math.sign(this.speed)*this.friction

        if(Math.abs(this.speed)<.15){
            this.speed = 0
        }

        if(this.movingBrain[0]){
            this.speed += this.a
        }
        if(this.movingBrain[1]){
            this.speed -= this.a
        }
        this.speed = Math.max(-2, Math.min(this.maxSpeed, this.speed))

        if(this.movingBrain[2]){
            this.angel += .02
        }
        if(this.movingBrain[3]){
            this.angel -= .02
        }
        // console.log(this.movingBrain)

        this.x += this.speed*Math.cos(this.angel)
        this.y += this.speed*Math.sin(this.angel)
    }


    draw(ctx: CanvasRenderingContext2D){
        if(!this.alive){
            ctx.globalAlpha = .5
        }
        if (!this.readyImg) {
            return;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angel+Math.PI/2);
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.restore();

        this.radars.draw(ctx);
    
        ctx.globalAlpha = .5
        this.#checkCrash()
    }
    
    #getPolygan(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2-5;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x-Math.cos(this.angel - alpha)*rad,
            y: this.y-Math.sin(this.angel - alpha)*rad
        });
        points.push({
            x: this.x-Math.cos(this.angel + alpha)*rad,
            y: this.y-Math.sin(this.angel + alpha)*rad
        });
        points.push({
            x: this.x-Math.cos(Math.PI + this.angel - alpha)*rad,
            y: this.y-Math.sin(Math.PI + this.angel - alpha)*rad
        });
        points.push({
            x: this.x-Math.cos(Math.PI + this.angel + alpha)*rad,
            y: this.y-Math.sin(Math.PI + this.angel + alpha)*rad
        });

        return points;
    }
    #checkCrash(){
        let poly = this.#getPolygan()
        this.borders.forEach(s => {
            for(let i=0; i<4; i++){
                if(getIntersection(
                    poly[i],
                    poly[(i+1)%4],
                    s.p1,
                    s.p2
                )){
                    this.alive = false
                }
            }
        })
    }
}