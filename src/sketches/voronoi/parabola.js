export default class VParabola {
  constructor(site) {
    this.site = site;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.edge = null;
    this.circleEvent = null;
    this.isLeaf = !!site;
  }

  setLeft(parabola) {
    this.left = parabola;
    parabola.parent = this;
  }

  setRight(parabola) {
    this.right = parabola;
    parabola.parent = this;
  }

  static getY(p /* focus point */, x /* x-coordinate */, ly /* beachline */) {
    let dp = 2 * (p.y - ly);
    let a1 = 1 / dp;
    let b1 = -2 * p.x / dp;
    let c1 = ly + dp / 4 + p.x * p.x / dp;

    return a1 * x * x + b1 * x + c1;
  }

  static getLeft(p) {
    return VParabola.getLeftChild(VParabola.getLeftParent(p));
  }
  static getRight(p) {
    return VParabola.getRightChild(VParabola.getRightParent(p));
  }

  static getLeftParent(p) {
    let par = p.parent;
    let pLast = p;
    while (par.left === pLast) {
      if (par.parent == null) return null;
      pLast = par;
      par = par.parent;
    }
    return par;
  }

  static getRightParent(p) {
    let par = p.parent;
    let pLast = p;
    while (par.right === pLast) {
      if (par.parent == null) return null;
      pLast = par;
      par = par.parent;
    }
    return par;
  }

  static getLeftChild(p) {
    if (p == null) return null;
    let par = p.left;
    while (!par.isLeaf) par = par.right;
    return par;
  }

  static getRightChild(p) {
    if (p == null) return null;
    let par = p.right;
    while (!par.isLeaf) par = par.left;
    return par;
  }
}
