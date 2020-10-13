import * as util from 'util'

export const errorLogger = (logFunction: (message?: any) => void) => (content: any) => {
  const time = new Date().toISOString()
  logFunction(util.inspect({ time, error: content }, { depth: 8 }))
}
