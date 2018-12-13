import LineIterator from './LineIterator'
import { LineBreaker } from 'css-line-break'

export default class {
  constructor(text, context) {
    this.text = text
    this.context = context
  }

  wordIterator() {
    const breaker = LineBreaker(this.text)
    const characters = []
    let bk
    while(!(bk = breaker.next()).done) {
      characters.push(bk.value.slice())
    }

    return characters
  }

  wrap({ maxWidth, fontSize, lineHeight, fontColor }) {
    const characters = this.wordIterator()
    const lines = Array.from(
      new LineIterator(characters, {
        maxWidth,
        fontSize,
        lineHeight,
        fontColor,
        context: this.context
      })
    )

    return {
      lines,
      height: lines.length * lineHeight * parseInt(fontSize)
    }
  }
}
