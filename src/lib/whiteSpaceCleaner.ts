function whiteSpaceCleaner(str: string) {
  return str.trim().replace(/\s{2,}/g, ' ')
}

export default whiteSpaceCleaner
