import { ExecutorContext } from '@nrwl/devkit'
import { execSync } from 'child_process'

export function runTfCommand(
  context: ExecutorContext,
  command: 'init' | 'plan' | 'fmt' | 'validate' | 'apply',
  params: string[],
): { success: boolean } {
  const cwd = context?.projectsConfigurations?.projects[context.projectName]?.sourceRoot || process.cwd()

  // Create the command to execute
  const execute = ['terraform', command, ...params].join(' ')

  try {
    console.log(`Executing command: ${execute}`)
    execSync(execute, { cwd, stdio: [0, 1, 2] })
    return { success: true }
  } catch (e) {
    console.error(`Failed to execute command: ${execute}`, e)
    return { success: false }
  }
}
