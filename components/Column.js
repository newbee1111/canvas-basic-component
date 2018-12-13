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

    this.height = this.elements.reduce((height, { child, marginTop }) => {
      if (!child) {
        return height
      }
      height += child.height + marginTop
      return height
    }, 0)

    const widths = this.elements.map(({ child, marginLeft }) => {
      if (!child) {
        return 0
      }
      return child.width
    })

    this.width = Math.max(...widths)
  }

  async render(ctx) {
    this.elements.reduce((height, { child, marginTop }) => {
      if (!child) {
        return height
      }
      child.x = this.x
      height += marginTop
      child.y = height
      height += child.height
      return height
    }, this.y)

    return this.renderChildrens(ctx)
  }
}
