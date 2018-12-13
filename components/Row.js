import Container from './Container'

export default class extends Container {
  constructor(elements = []) {
    super()

    this.elements = elements

    elements.forEach(({ child }) => {
      if (!child) {
        return
      }
      this.addChild(child)
    })

    this.width = this.elements.reduce((width, { child, marginLeft }) => {
      if (!child) {
        return width
      }
      width += child.width + marginLeft
      return width
    }, 0)

    const heights = this.elements.map(({ child, marginLeft }) => {
      if (!child) {
        return 0
      }
      return child.height
    })

    this.height = Math.max(...heights)
  }

  async render(ctx) {
    this.elements.reduce((width, { child, marginLeft }) => {
      if (!child) {
        return width
      }
      child.y = this.y

      width += marginLeft
      child.x = width
      width += child.width

      return width
    }, this.x)

    return this.renderChildrens(ctx)
  }
}
