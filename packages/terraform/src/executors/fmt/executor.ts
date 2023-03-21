import { ExecutorContext } from '@nrwl/devkit';
import { runTfCommand } from '../../utils';
import { FmtExecutorSchema } from './schema';

export default async function runExecutor(
  options: FmtExecutorSchema,
  context: ExecutorContext,
) {
  const cmdopt = toCmdOptions(options)
  return runTfCommand(context, "fmt", cmdopt)
}

function toCmdOptions(options: FmtExecutorSchema): string[] {
  return [
    ...(options.list !== undefined ? [`-list=${options.list}`]: []),
    ...(options.write !== undefined ? [`-write=${options.write}`]: []), 
    ...(options.diff ? [`-diff`]: []), 
    ...(options.check ? [`-check`]: []), 
    ...(options.recursive ? [`-recursive`]: []), 
  ]
}
