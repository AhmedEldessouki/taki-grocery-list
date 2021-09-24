import styled from '@emotion/styled'
import React from 'react'
import {useLang} from '../context/lang'

const $Select = styled.select`
  background: transparent;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: var(--roundness);
  color: var(--mattGray);
  font-weight: 500;
  padding: 5px 7px;
`
function LangSelect() {
  const {locale, selectLang} = useLang()

  return (
    <$Select name="lang" value={locale} onChange={selectLang}>
      <option value="en">En</option>
      <option value="tr">Tr</option>
    </$Select>
  )
}

export default LangSelect
