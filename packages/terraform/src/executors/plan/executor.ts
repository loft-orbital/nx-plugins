import { ExecutorContext } from '@nrwl/devkit';
import { runTfCommand } from '../../utils';
import { PlanExecutorSchema } from './schema';

export default async function runExecutor(
  options: PlanExecutorSchema,
 context: ExecutorContext,
) {
  const cmdopt = ["-input=false", ...toCmdOptions(options)]
  return runTfCommand(context, "plan", cmdopt)
}

function toCmdOptions(options: PlanExecutorSchema ): string[] {
  return [
    ...(options.refresh !== undefined ? [`-refresh=${options.refresh}`]: []),
    ...(options.replace !== undefined ? [`-replace=${options.replace}`]: []),
    ...(options.target !== undefined ? [`-target=${options.target}`]: []),
    ...Object.entries(options.var).map(([k,v]) => `-var='${k}=${v}'`),
    ...(options.varFile !== undefined ? [`-var-file=${options.varFile}`]: []),
    ...(options.compactWarnings !== undefined ? ['-compact-warnings}']: []),
    ...(options.detailedExitCode !== undefined ? ['-detailde-exitcode']: []),
    ...(options.json!== undefined ? ['-json']: []),
    ...(options.lock !== undefined ? [`-lock=${options.lock}`]: []),
    ...(options.lockTimeout !== undefined ? [`-lock-timeout=${options.lockTimeout}`]: []), 
    ...(options.noColor !== undefined ? ['-no-color']: []),
    ...(options.out !== undefined ? [`-out=${options.out}`]: []),
    ...(options.parallelism !== undefined ? [`-parallelism=${options.parallelism}`]: []),
  ]
}

