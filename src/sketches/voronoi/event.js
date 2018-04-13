export default class VEvent {
  constructor(point, siteEvent) {
    this.point = point;
    this.siteEvent = siteEvent;
    this.x = point.x;
    this.y = point.y;
    this.arc = null;
  }

  compareTo(other) {
    return this.y > other.y ? -1 : 1;
  }
}
