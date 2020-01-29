import VEdge from "./edge";
import VParabola from "./parabola";
import VEvent from "./event";
import VQueue from "./queue";
import Point from "./point";

export default class VBeachline {
  constructor(sites, width, height, p) {
    this.ly = 0;

    this.p = p;

    this.width = width;
    this.height = height;

    this.done = false;
    this.root = null;
    this.sites = sites.map(({ x, y }) => new Point(x, y));

    this.points = [];
    this.deleted = [];
    this.queue = new VQueue();
    this.edges = [];

    for (const site of this.sites) {
      this.queue.enqueue(new VEvent(site, true));
    }
  }

  update() {
    if (!this.done) {
      if (!this.queue.isEmpty()) {
        let event = this.queue.dequeue();
        this.ly = event.point.y;

        let deletedIndex = this.deleted.indexOf(event);
        if (deletedIndex !== -1) {
          this.deleted.splice(deletedIndex, 1);
        } else if (event.siteEvent) {
          this.insert(event.point);
        } else {
          this.remove(event);
        }
        this.finishEdge(this.root);
      } else {
        this.done = true;
        this.finishEdge(this.root);

        for (const edge of this.edges) {
          if (!!edge.neighbor) {
            edge.start = edge.neighbor.end;
            edge.neighbor = null;
          }
          console.log(edge.toString());
        }
      }
    }
  }

  draw() {
    this.p.stroke(200, 100, 50);
    for (const edge of this.edges) {
      let p0 = edge.start;
      let p1 = edge.end;

      if (!!edge.neighbor) {
        p0 = edge.neighbor.end;
      }
      this.p.line(p0.x, p0.y, p1.x, p1.y);
    }

    this.p.stroke(50, 100, 200);
    this.p.line(0, this.ly, this.width, this.ly);
  }

  insert(point) {
    console.log(
      `Inserting point: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
    );
    if (!this.root) {
      console.log("Inserting as root");
      this.root = new VParabola(point);
      return;
    }

    if (this.root.isLeaf && Math.abs(this.root.site.y - point.y) < 1) {
      console.log("Edge case, very close to current root", this.root, point);
      console.log("root y", this.root.site.y);
      console.log("point y", point.y);
      console.log("sub", this.root.site.y - point.y);
      console.log("bool", this.root.site.y - point.y < 1);
      this.root.isLeaf = false;
      this.root.setLeft(new VParabola(this.root.site));
      this.root.setRight(new VParabola(point));
      const s = new Point((this.root.site.x + point.x) / 2, point.y);
      this.points.push(s);
      if (point.x > this.root.site.x) {
        this.root.edge = new VEdge(s, this.root.site, point);
      } else {
        this.root.edge = new VEdge(s, point, this.root.site);
      }
      this.edges.push(this.root.edge);
      return;
    }

    let par = this.lookup(point.x);

    if (par.circleEvent != null) {
      console.log("Circle event");
      if (!this.deleted.includes(par.circleEvent)) {
        this.deleted.push(par.circleEvent);
      }
      par.circleEvent = null;
    }

    let start = new Point(point.x, VParabola.getY(par.site, point.x, this.ly));
    this.points.push(start);

    let edgeLeft = new VEdge(start, par.site, point);
    let edgeRight = new VEdge(start, point, par.site);

    edgeLeft.neighbor = edgeRight;
    this.edges.push(edgeLeft);

    par.edge = edgeRight;
    par.isLeaf = false;

    let p0 = new VParabola(par.site);
    let p1 = new VParabola(point);
    let p2 = new VParabola(par.site);

    par.setRight(p2);
    par.setLeft(new VParabola());
    par.left.edge = edgeLeft;

    par.left.setLeft(p0);
    par.left.setRight(p1);

    this.checkCircle(p0);
    this.checkCircle(p2);
  }

  remove(e) {
    let p1 = e.arc;

    let xl = VParabola.getLeftParent(p1);
    let xr = VParabola.getRightParent(p1);

    let p0 = VParabola.getLeftChild(xl);
    let p2 = VParabola.getRightChild(xr);

    if (p0 === p2) {
      console.error("Parabola left and right have the same focus");
    }

    if (!!p0.circleEvent) {
      if (!this.deleted.includes(p0.circleEvent)) {
        this.deleted.push(p0.circleEvent);
      }
      p0.circleEvent = null;
    }

    if (!!p2.circleEvent) {
      if (!this.deleted.includes(p2.circleEvent)) {
        this.deleted.push(p2.circleEvent);
      }
      p2.circleEvent = null;
    }

    let p = new Point(e.point.x, VParabola.getY(p1.site, e.point.x, this.ly));
    this.points.push(p);

    xl.edge.end = p;
    xr.edge.end = p;

    let higher = new VParabola();
    let par = p1;
    while (par !== this.root) {
      par = par.parent;
      if (par === xl) higher = xl;
      if (par === xr) higher = xr;
    }

    higher.edge = new VEdge(p, p0.site, p2.site);
    this.edges.push(higher.edge);

    let gparent = p1.parent.parent;
    if (p1.parent.left === p1) {
      if (gparent.left === p1.parent) gparent.left = p1.parent.right;
      if (gparent.right === p1.parent) gparent.right = p1.parent.right;
    } else {
      if (gparent.left === p1.parent) gparent.left = p1.parent.left;
      if (gparent.right === p1.parent) gparent.right = p1.parent.left;
    }

    this.checkCircle(p0);
    this.checkCircle(p2);
  }

  lookup(x) {
    let par = this.root;
    let xNew = 0;

    while (!par.isLeaf) {
      xNew = this.getXOfEdge(par, this.ly);
      if (xNew > x) par = par.left;
      else par = par.right;
    }

    return par;
  }

  getXOfEdge(par, y) {
    let left = VParabola.getLeftChild(par);
    let right = VParabola.getRightChild(par);

    let p = left.site;
    let r = right.site;

    let dp = 2 * (y - p.y);
    let a1 = 1 / dp;
    let b1 = -2 * p.x / dp;
    let c1 = y + dp / 4 + p.x * p.x / dp;

    dp = 2 * (y - r.y);
    let a2 = 1 / dp;
    let b2 = -2 * r.x / dp;
    let c2 = -this.ly + dp / 4 + r.x * r.x / dp;

    let a = a1 - a2;
    let b = b1 - b2;
    let c = c1 - c2;

    let disc = b * b - 4 * a * c;
    let x1 = (-b + Math.sqrt(disc)) / (2 * a);
    let x2 = (-b - Math.sqrt(disc)) / (2 * a);

    let ry;
    if (p.y > r.y) ry = Math.max(x1, x2);
    else ry = Math.min(x1, x2);

    return ry;
  }

  checkCircle(par) {
    console.log("checking circle", par);
    let leftParent = VParabola.getLeftParent(par);
    let rightParent = VParabola.getRightParent(par);

    let a = VParabola.getLeftChild(leftParent);
    let c = VParabola.getRightChild(rightParent);

    if (!a || !c || a.site === c.site) return;

    let s = VEdge.intersection(leftParent.edge, rightParent.edge);
    if (!s) return;

    let dx = a.site.x - s.x;
    let dy = a.site.y - s.y;

    let d = Math.sqrt(dx * dx + dy * dy);

    if (s.y - d >= this.ly) {
      return;
    }

    let event = new VEvent(new Point(s.x, d - s.y), false);
    this.points.push(event.point);
    par.circleEvent = event;
    event.arc = par;
    this.queue.enqueue(event, false);
  }

  finishEdge(n /* Parabola */) {
    if (n.isLeaf) return;

    let mx;
    if (n.edge.direction.x > 0) {
      mx = Math.max(this.width, n.edge.start.x + 10);
    } else {
      mx = Math.min(0, n.edge.start.x - 10);
    }

    let end = new Point(mx, mx * n.edge.f + n.edge.g);
    n.edge.end = end;
    this.points.push(end);

    this.finishEdge(n.left);
    this.finishEdge(n.right);
  }

  /*
// Recursively finishes all infinite edges in the tree
  void finishEdge(VParabola n) {
    if (n.isLeaf) {
      return;
    }
    float mx;
    if (n.edge.direction.x > 0.0)	mx = max(width, 	n.edge.start.x + 10);
    else							mx = min(0.0, 		n.edge.start.x - 10);

    PVector end = new PVector(mx, mx * n.edge.f + n.edge.g); 
    n.edge.end = end;
    points.add(end);

    finishEdge(n.left() );
    finishEdge(n.right());
}
  */
}
