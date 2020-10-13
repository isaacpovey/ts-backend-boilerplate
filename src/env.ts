import * as _ from 'lodash'

require('dotenv').config()

declare const process: any

export interface Config {
  PORT: number
  PUBLIC_DOMAIN: string
  NODE_ENV: string
}

const referenceConfig: Config = {
  PORT: 9000,
  PUBLIC_DOMAIN: 'http://localhost',
  NODE_ENV: 'development'
}

const mandatoryKeys: (keyof Config)[] = ['PORT', 'PUBLIC_DOMAIN']

const prodMandatoryKeys: (keyof Config)[] = []

const jsonKeys: (keyof Config)[] = []

const tempEnv: Config = { ...referenceConfig, ..._.pick(process.env, Object.keys(referenceConfig)) }

// Prefix PUBLIC_DOMAIN with https:// if no protocol defined.
if (!RegExp('^https?://').test(tempEnv.PUBLIC_DOMAIN)) {
  tempEnv.PUBLIC_DOMAIN = 'https://' + tempEnv.PUBLIC_DOMAIN
}

Object.keys(tempEnv).forEach(k => {
  const key = k as keyof Config
  if (typeof tempEnv[key] === 'string') {
    ;(tempEnv[key] as string) = (tempEnv[key] as string).trim()
  }
})

jsonKeys.forEach(k => {
  if (typeof tempEnv[k] === 'string') {
    try {
      ;((tempEnv[k] as any) as object) = JSON.parse(tempEnv[k] as string)
    } catch (error) {
      throw new Error(`Environment variable - ${k} is not valid json`)
    }
  }
})

function throwUnsetError(key: string) {
  throw new Error(`Environment variable - ${key} is mandatory`)
}

// If mandatory keys are unset, just blow up
mandatoryKeys.forEach(key => (!tempEnv[key] ? throwUnsetError(key) : null))

if ('production' === tempEnv.NODE_ENV) {
  prodMandatoryKeys.forEach(key => (!tempEnv[key] ? throwUnsetError(key) : null))
}

export const env = tempEnv
