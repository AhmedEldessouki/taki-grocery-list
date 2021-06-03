function spacefy(str: string, {reverse}: {reverse?: boolean} = {}): string {
  if (reverse) {
    return str
      .split(' ')
      .map((item, i) => {
        if (i > 0) {
          return item.replace(/^\w/, c => c.toUpperCase())
        }
        return item
      })
      .join('')
  }
  return str.replace(/[A-Z]/g, _ => ` ${_.toLowerCase()}`)
}

export default spacefy
