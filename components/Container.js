export default class {
  constructor() {
    this.childrens = []
    this.position = { x: 0, y: 0 }
    this.parent = null
    this.width = 0
    this.height = 0
  }

  get x() {
    return this.position.x
  }

  set x(value) {
    this.position.x = value
  }

  get y() {
    return this.position.y
  }

  set y(value) {
    this.position.y = value
  }

  addChild(child) {
    if (!child) {
      return
    }

    child.parent = this
    this.childrens.push(child)
  }

  render(ctx) {
    return this.renderChildrens(ctx)
  }

  async renderChildrens(ctx) {
    for (let child of this.childrens) {
      await child.render(ctx)
    }

    return Promise.resolve()
  }
}
