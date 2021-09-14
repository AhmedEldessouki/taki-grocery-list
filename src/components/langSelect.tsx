import React from 'react'
import {useLang} from '../context/lang'

function LangSelect() {
  const {locale, selectLang} = useLang()

  return (
    <select name="lang" value={locale} onChange={selectLang}>
      <option value="en">En</option>
      <option value="tr">Tr</option>
    </select>
  )
}

export default LangSelect
