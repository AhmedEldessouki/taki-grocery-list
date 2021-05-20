function whiteSpaceCleaner(str: string) {
  return str.trim().replaceAll(/\s{2,}/g, ' ')
}

export {whiteSpaceCleaner}
