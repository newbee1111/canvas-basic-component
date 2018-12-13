export default class {
  constructor(
    characters,
    { maxWidth, fontSize, lineHeight, fontColor, context }
  ) {
    this.maxWidth = maxWidth
    this.fontSize = fontSize
    this.fontColor = fontColor
    this.lineHeight = lineHeight
    this.context = context

    this.ctx = this.createCanvasContext()

    this.characters = characters.map(character => {
      const { width } = this.ctx.measureText(character)

      return { width, character }
    })

    this.lines = []
  }

  hasNext() {
    return !!this.characters.length
  }

  createCanvasContext() {
    const ctx = this.context

    ctx.font = this.fontSize
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = this.fontColor

    return ctx
  }

  getCurrentLine() {
    let currentLineText = ''
    let currentLineWidth = 0

    let canAppendCharacter = () => {
      if (!this.characters.length) {
        return false
      }

      const { width } = this.characters[0]

      return currentLineWidth + width < this.maxWidth
    }

    while (canAppendCharacter()) {
      const { character, width } = this.characters.shift()
      currentLineWidth += width
      currentLineText += character
      if (character.indexOf('\n') > -1) break;
    }

    return {
      text: currentLineText,
      width: currentLineWidth
    }
  }

  next() {
    if (!this.hasNext()) {
      return { done: true }
    }

    return {
      value: this.getCurrentLine(),
      done: false
    }
  }

  [Symbol.iterator]() {
    let next = this.next.bind(this)

    return { next }
  }
}
