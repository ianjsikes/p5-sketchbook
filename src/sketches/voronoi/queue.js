export default class VQueue {
  constructor() {
    this.items = [];
  }

  enqueue(event) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].y > event.y) {
        this.items.splice(i, 0, event);
        return;
      }
    }

    this.items.push(event);
  }

  dequeue() {
    if (this.items.length) {
      return this.items.shift();
    }
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
