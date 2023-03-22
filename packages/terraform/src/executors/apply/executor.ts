import { ExecutorContext } from '@nrwl/devkit';
import { runTfCommand } from '../../utils';
import { ApplyExecutorSchema } from './schema';

export default async function runExecutor(
  options: ApplyExecutorSchema,
  context: ExecutorContext,
) {
  const cmdopt = ["-input=false", "-auto-approve", ...toCmdOptions(options)]
  return runTfCommand(context, "apply", cmdopt)
}

function toCmdOptions(options: ApplyExecutorSchema): string[] {
  return [
    ...(options.compactWarnings !== undefined ? ['-compact-warnings}'] : []),
    ...(options.json!== undefined ? ['-json'] : []),
    ...(options.lock !== undefined ? [`-lock=${options.lock}`]: []),
    ...(options.lockTimeout !== undefined ? [`-lock-timeout=${options.lockTimeout}`] : []), 
    ...(options.noColor !== undefined ? ['-no-color'] : []),
    ...(options.parallelism !== undefined ? [`-parallelism=${options.parallelism}`] : []),
    ...(options.planFile !== undefined ? [`${options.planFile}`] : []),
  ]
}

