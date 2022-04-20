import i18next from "i18next";
import { initReactI18next } from 'react-i18next'
import zh from "./lang/zh.json"
import en from "./lang/en.json"
import jp from './lang/jp.json'

const i18n = i18next.use(initReactI18next).init({
  resources: {
    zh: {
      translation: zh
    },
    en: {
      translation: en
    },
    jp: {
      translation: jp
    }
  },
  lng: "zh",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n