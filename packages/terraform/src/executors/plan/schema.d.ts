export interface PlanExecutorSchema {
  refresh?: boolean
  replace?: string
  target?: string
  var?: {[key: string]:string}
  varFile?: string
  compactWarnings?: boolean
  detailedExitCode?: boolean
  json?: boolean
  lock?: boolean
  lockTimeout?: string
  noColor?: boolean
  out?: string
  parallelism?: number
}