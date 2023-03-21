import { ExecutorContext } from '@nrwl/devkit'
import { runTfCommand } from '../../utils';
import { InitExecutorSchema } from './schema';

export default async function runExecutor(
  options: InitExecutorSchema,
  context: ExecutorContext,
) {
  const cmdopt = ["-input=false", ...toCmdOptions(options)]
  return runTfCommand(context, "init", cmdopt)
}

function toCmdOptions(options: InitExecutorSchema ): string[] {
  return [
    ...(options.lock !== undefined ? [`-lock=${options.lock}`]: []),
    ...(options.lockTimeout !== undefined ? [`-lock-timeout=${options.lockTimeout}`]: []), 
    ...(options.upgrade !== undefined ? [`-upgrade=${options.upgrade}`]: []), 
  ]
}

