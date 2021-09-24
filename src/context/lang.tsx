import React, {useState} from 'react'
import {IntlProvider} from 'react-intl'
import type {MessageFormatElement} from 'react-intl'
import tr from '../lang/tr.json'
import en from '../lang/en.json'
import useLocalStorageState from '../lib/useLocalStorage'

const LangContext = React.createContext<{
  locale: string
  selectLang: (e: React.SyntheticEvent<HTMLSelectElement>) => void
}>({locale: 'en', selectLang: e => {}})
LangContext.displayName = 'LangContext'

const local = navigator.language

const LangProvider = ({children}: {children: React.ReactChild}) => {
  const {state: locale, setState: setLocale} = useLocalStorageState(
    `Taki_grocery_list_lang`,
    local,
  )

  const [messages, setMessages] = useState<
    Record<string, string> | Record<string, MessageFormatElement[]>
  >(() => {
    if (locale === 'tr') {
      return tr
    }
    return en
  })

  function selectLang(e: React.SyntheticEvent<HTMLSelectElement>) {
    const lang = e.currentTarget.value

    if (locale === lang) return
    setLocale(lang)
    if (lang === 'tr') {
      setMessages(tr)
      return
    }
    setMessages(en)
  }

  return (
    <LangContext.Provider value={{locale, selectLang}}>
      <IntlProvider messages={messages} locale={locale}>
        {children}
      </IntlProvider>
    </LangContext.Provider>
  )
}

function useLang() {
  const {locale, selectLang} = React.useContext(LangContext)
  // ? No Needs for Checking Because IntlProvider Does the Job

  return {locale, selectLang}
}

export default LangProvider
export {useLang}
