export default class {
  constructor(text) {
    this.text = text
    this.current = null
    this.length = text.length
    this.index = 0
  }

  hasNext() {
    return this.index < this.length
  }

  getWord() {
    const text = this.text
    const index = this.index
    const code = text.charCodeAt(index)

    // XXX: 以下算法来自 http://mzl.la/11dmcFz, 用来获取 trans-BMP 的字符
    //   比如  𝕊 𝔹 μ

    if (Number.isNaN(code)) {
      return '' // Position not found
    }

    if (code < 0xd800 || code > 0xdfff) {
      return text.charAt(index)
    }

    // High surrogate (could change last hex to 0xDB7F to treat high private
    // surrogates as single characters)
    if (code >= 0xd800 && code <= 0xdbff) {
      if (text.length <= index + 1) {
        throw new Error('High surrogate without following low surrogate')
      }
      var next = text.charCodeAt(index + 1)
      if (next < 0xdc00 || next > 0xdfff) {
        throw new Error('High surrogate without following low surrogate')
      }
      return text.charAt(index) + text.charAt(index + 1)
    }
    // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
    if (index === 0) {
      throw new Error('Low surrogate without preceding high surrogate')
    }

    var prev = text.charCodeAt(index - 1)

    // (could change last hex to 0xDB7F to treat high private
    // surrogates as single characters)
    if (prev < 0xd800 || prev > 0xdbff) {
      throw new Error('Low surrogate without preceding high surrogate')
    }

    // We can pass over low surrogates now as the second component
    // in a pair which we have already processed
    return ''
  }

  next() {
    if (!this.hasNext()) {
      return { done: true }
    }

    let word = this.getWord()
    this.index += word.length

    return {
      value: word,
      done: false
    }
  }

  [Symbol.iterator]() {
    let next = this.next.bind(this)

    return { next }
  }
}
