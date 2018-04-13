export default class VEdge {
  constructor(s /* startPoint */, a /* leftPoint */, b /* rightPoint */) {
    this.start = s;
    this.left = a;
    this.right = b;
    this.neighbor = null;
    this.end = null;

    this.f = (b.x - a.x) / (a.y - b.y);
    this.g = s.y - this.f * s.x;
    this.direction = {
      x: b.y - a.y,
      y: -(b.x - a.x)
    };

    this.intersected = false;
    this.counted = false;
  }

  static intersection(a, b) {
    let x = (b.g - a.g) / (a.f - b.f);
    let y = a.f * x + a.g;

    if ((x - a.start.x) / a.direction.x < 0) return null;
    if ((y - a.start.y) / a.direction.y < 0) return null;

    if ((x - b.start.x) / b.direction.x < 0) return null;
    if ((y - b.start.y) / b.direction.y < 0) return null;

    return { x, y };
  }

  toString() {
    return `VEdge : (${this.start.x.toFixed(2)}, ${this.start.y.toFixed(
      2
    )}), (${this.end.x.toFixed(2)}, ${this.end.y.toFixed(
      2
    )}), intersected : ${this.intersected}, counted : ${this
      .counted}, f : ${this.f.toFixed(2)}, g : ${this.g.toFixed(
      2
    )}, neighbor : ${!!this.neighbor}`;
  }
}
/*
String toString(){
    return "VEdge : " + start + ", " + end 
         + ", intersected : " + intersected 
         + ", iCounted : " + iCounted 
         + ", f : " + f + ", g : " + g
         + ", neighbour : " + (neighbour != null);
}

PVector getEdgeIntersection(VEdge a, VEdge b) {
    float x = (b.g - a.g) / (a.f - b.f);
    float y = a.f * x + a.g;

    if ((x - a.start.x)/a.direction.x < 0) return null;
    if ((y - a.start.y)/a.direction.y < 0) return null;

    if ((x - b.start.x)/b.direction.x < 0) return null;
    if ((y - b.start.y)/b.direction.y < 0) return null;	

    PVector p = new PVector(x, y);		
    points.add(p);
    return p;
}
*/
