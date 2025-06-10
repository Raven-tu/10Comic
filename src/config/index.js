const { VITE_TAMPERMONKEY_APP_ENVIRONMENT, VITE_APPVERSION: AppVersion } = import.meta.env

const AppEnv = VITE_TAMPERMONKEY_APP_ENVIRONMENT
const isDev = AppEnv === 'development'

export {
  AppEnv,
  AppVersion,
  isDev,
}
