import { Point } from "../pannel/path/create/roadLib/road/point";

export function subtract(p1: Point, p2: Point): Point{
    return new Point(p2.x - p1.x, p2.y - p1.y);
}
export function add(p1: Point, p2: Point): Point{
    return new Point(p2.x + p1.x, p2.y + p1.y);
}
export function scale(p: Point, scale: number): Point{
    return new Point(p.x*scale, p.y*scale);
}

export function lerp(a: number, b:number, t: number): number{
    return a+(b-a)*t;
}
interface IntersectionInterface{
    x: number,
    y: number,
    offset: number
}
export function getIntersection(a: any, b: any, c: any, d: any): IntersectionInterface | null{
    const tTop = (d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
    const uTop = (c.y-a.y)*(a.x-b.x)-(c.x-a.x)*(a.y-b.y);
    const bottom = (d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);

    if(bottom != 0){
        const t = tTop/bottom;
        const u = uTop/bottom;

        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t
            }
        }
    }

    return null;
}

export function getRGBA(value: number): string{
    const alpha = Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

export function getRandomColor(): string{
    const hue = 290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}

export function getMiddle(p1: Point, p2: Point): Point{
    return new Point((p1.x+p2.x)/2, (p1.y+p2.y)/2)
}