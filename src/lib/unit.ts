function unit(color: string): string {
  switch (color) {
    case 'mattBlue':
      return 'OZ'
    case 'mattRed':
      return 'PCK'
    case 'mattGray':
      return 'BTL'
    default:
      return ''
  }
}

export default unit
