function dashify(string: string) {
  return string.toLowerCase().trim().replaceAll(' ', '-')
}

export {dashify}
