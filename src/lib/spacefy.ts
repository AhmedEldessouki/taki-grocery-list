function spacefy(str: string, {reverse}: {reverse?: boolean} = {}): string {
  if (reverse) {
    const camelCase = str
      .split(' ')
      .map((item, i) => {
        if (i > 0) {
          return item.replace(/^\w/, c => c.toUpperCase())
        }
        return item
      })
      .join('')
    console.log(camelCase)
    return camelCase
  }
  return str.replaceAll(/[A-Z]/g, _ => ' ' + _.toLowerCase())
}

export {spacefy}
