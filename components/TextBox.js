import TextWrap from './TextWrap/index'
import Container from './Container'

export default class extends Container {
  constructor({
    text,
    maxWidth = 400,
    fontSize = 20,
    lineHeight = 1.5,
    fontColor = '#333',
    fontWeight = 'normal',
    textAlign = 'left',
    context
  }) {
    super()
    this.text = text
    this.maxWidth = maxWidth

    const wrapper = new TextWrap(this.text, context)

    // TODO(v150)：
    const { lines, height } = wrapper.wrap({
      maxWidth,
      lineHeight,
      fontSize
    })

    this.width = maxWidth
    this.height = height
    this.lines = lines
    this.fontSize = fontSize
    this.fontColor = fontColor
    this.fontWeight = fontWeight
    this.lineHeight = lineHeight
    this.textAlign = textAlign
    this.context = context
  }

  render(ctx) {
    // TODO(v150)：
    const { x, y } = this.position

    const fontSize = this.fontSize
    const lineHeight = this.lineHeight
    const startX = x || 0
    const endY = y || 0

    this.lines.reduce((endY, line) => {
      const { text, width } = line
      endY += parseInt(fontSize) * lineHeight
      let x = startX

      if (this.textAlign === 'center') {
        x = x + (this.maxWidth - width) / 2
      }

      ctx.save()
      // See more: https://bit.ly/2J9THnY
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = this.fontColor
      ctx.font = `${this.fontWeight} ${fontSize}`

      ctx.fillText(text, x, endY, this.maxWidth)
      ctx.restore()

      return endY
    }, endY)

    return Promise.resolve()
  }
}
