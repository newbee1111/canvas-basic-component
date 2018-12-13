import Container from './Container'

function Point(x, y) {
  return { x: x, y: y }
}

function Rect(x, y, w, h) {
  return { x: x, y: y, width: w, height: h }
}

export default class extends Container {
  constructor({
    width,
    height,
    addBGColor,
    backgroundColor,
    radiusSetting,
    boxShadowSetting
  }) {
    super()
    this.addBGColor = addBGColor || false
    this.bgcolor = backgroundColor || '#fff'
    this.width = width
    this.height = height
    this.radiusSetting = radiusSetting || null
    this.boxShadowSetting = boxShadowSetting || null
  }

  drawRoundedRect(rect, r, ctx) {
    var ptA = Point(rect.x + r, rect.y)
    var ptB = Point(rect.x + rect.width, rect.y)
    var ptC = Point(rect.x + rect.width, rect.y + rect.height)
    var ptD = Point(rect.x, rect.y + rect.height)
    var ptE = Point(rect.x, rect.y)
    ctx.beginPath()
    ctx.moveTo(ptA.x, ptA.y)
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
    ctx.fillStyle = this.bgcolor || '#fff'
    ctx.fill()
    // 重置shadow设定
    ctx.shadowBlur = 0
    ctx.shadowColor = 'rgba(0,0,0,0)'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }

  addChildToCenter(child) {
    this.addChild(child)

    child.x = this.width / 2 - child.width / 2
    child.y = this.height / 2 - child.height / 2
  }

  addChildToTopRight(child) {
    this.addChild(child)

    child.x = this.width - child.width
    child.y = this.y
  }

  async render(ctx) {
    this.renderBackground(ctx)
    this.renderRadius(ctx)
    this.childrens.forEach(child => {
      child.x += this.x
      child.y += this.y
    })

    for (let child of this.childrens) {
      await child.render(ctx)
    }
    return Promise.resolve()
  }

  renderBackground(ctx) {
    if (!this.addBGColor || this.radiusSetting) return
    ctx.fillStyle = this.bgcolor
    return ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  renderRadius(ctx) {
    if (!this.radiusSetting) return
    const rect = Rect(this.position.x, this.position.y, this.width, this.height)
    const { radius } = this.radiusSetting
    if (this.boxShadowSetting) {
      const { blur, color, offsetX, offsetY } = this.boxShadowSetting
      ctx.shadowBlur = blur
      ctx.shadowColor = color
      ctx.shadowOffsetX = offsetX
      ctx.shadowOffsetY = offsetY
    }
    this.drawRoundedRect(rect, radius, ctx)
  }
}
