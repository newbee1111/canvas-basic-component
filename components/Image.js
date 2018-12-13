import Container from './Container'

function Point(x, y) {
  return { x: x, y: y }
}

function Rect(x, y, w, h) {
  return { x: x, y: y, width: w, height: h }
}

export default class extends Container {
  constructor({ image, width, height, roundSetting, radiusSetting, clipMode }) {
    super()

    this.width = width
    this.height = height
    this.image = image
    this.roundSetting = roundSetting || null
    this.radiusSetting = radiusSetting || null
    this.clipMode = clipMode || null
  }

  drawRoundedRect(rect, r, radiusMode, ctx) {
    const ptA = Point(rect.x + r, rect.y)
    const ptB = Point(rect.x + rect.width, rect.y)
    const ptC = Point(rect.x + rect.width, rect.y + rect.height)
    const ptD = Point(rect.x, rect.y + rect.height)
    const ptE = Point(rect.x, rect.y)
    ctx.beginPath()
    ctx.moveTo(ptA.x, ptA.y)
    if (!radiusMode) {
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
    } else if (radiusMode === 'top') {
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
      ctx.lineTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
      ctx.lineTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
    } else if (radiusMode === 'bottom') {
      ctx.lineTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
      ctx.lineTo(ptE.x, ptE.y, ptA.x, ptA.y, r)
    }
    ctx.strokeStyle = '#fff'
    ctx.stroke()
  }

  normalDraw(ctx, img) {
    return ctx.drawImage(img, this.x, this.y, this.width, this.height)
  }

  clipDraw(ctx, img) {
    const { sx, sy, sWidth, sHeight } = this.clipMode
    return ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  onLoadSuccess(ctx, img) {
    if (!this.roundSetting && !this.radiusSetting) {
      this.clipMode ? this.clipDraw(ctx, img) : this.normalDraw(ctx, img)
    } else if (this.roundSetting) {
      const { lineWidth, sideWidth } = this.roundSetting
      ctx.save()
      ctx.beginPath()
      ctx.arc(
        this.x + sideWidth / 2,
        this.y + sideWidth / 2,
        sideWidth / 2,
        0,
        2 * Math.PI
      )

      ctx.strokeStyle = '#fff'
      ctx.lineWidth = lineWidth
      ctx.stroke()
      ctx.clip()
      this.clipMode ? this.clipDraw(ctx, img) : this.normalDraw(ctx, img)
      ctx.restore()
    } else {
      ctx.save()
      const rect = Rect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      )
      const { radius, radiusMode } = this.radiusSetting
      this.drawRoundedRect(rect, radius, radiusMode, ctx)
      ctx.clip()
      this.clipMode ? this.clipDraw(ctx, img) : this.normalDraw(ctx, img)
      ctx.restore()
    }
  }

  render(ctx) {
    let { url } = this.image
    const img = new Image()

    url += `&_time=${+new Date()}`

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('get', url)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          const source = URL.createObjectURL(xhr.response)
          img.src = source
          img.onload = () => {
            this.onLoadSuccess(ctx, img)
            return resolve()
          }
          img.onerror = () => {
            return reject()
          }
        }
      }
      xhr.send()
    })
  }
}
