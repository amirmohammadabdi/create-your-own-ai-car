import { Car } from "./car";
import { Graph } from "../../brain/create/bainLib/brain/graph"
import { ActionPoint, MiddlePoint, Segment, SensorPoint } from "../../brain/create/bainLib/brain/point";
import { NeuronType } from "@/app/lib/interface";

export class Mind{
    public actions: ActionPoint[] = []
    public sensors: Array<SensorPoint> = []
    public middles: MiddlePoint[] = []
    constructor(
        public car: Car,
        public brain: Graph
    ){
        this.brain.points.forEach(p => {
            if(p.type == NeuronType.action){
                this.actions.push(p as ActionPoint)
            }
            else if(p.type == NeuronType.middle){
                this.middles.push(p as MiddlePoint)
            }
            else if(p.type == NeuronType.sensor){
                this.sensors.push(p as SensorPoint)
            }
        })
    }
    update(){
        for(let i=0; i<this.car.radars.rayCount; i++){
            this.sensors[i].offset = 1 - this.car.radars.offset[i]
        }
        this.actions.forEach((a, i) => {
            this.getOffset(a)
            if(a.active){
                this.car.movingBrain[i] = 1
            }
            else{
                this.car.movingBrain[i] = 0
            }
        })
    }
    getOffset(point:ActionPoint|SensorPoint|MiddlePoint, prev:Segment[] = []){
        let offset = 0
        if(point.type !== NeuronType.sensor){
            this.brain.segs.forEach(s => {
                if(!prev.includes(s)){
                    if(s.p1 == point){
                        prev.push(s)
                        offset += s.weight * this.getOffset(s.p2, prev)!
                    }
                    else if(s.p2 == point){
                        prev.push(s)
                        offset += s.weight * this.getOffset(s.p1, prev)!
                    }
                }
            })
            point.offset = offset
            point.update()
            return offset
        }

        this.sensors.forEach(p => {
            if(p == point){
                return p.offset
            }
        })
        return 0
    }
}