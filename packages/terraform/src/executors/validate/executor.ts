import { ExecutorContext } from '@nrwl/devkit';
import { runTfCommand } from '../../utils';
import { ValidateExecutorSchema } from './schema';

export default async function runExecutor(
  options: ValidateExecutorSchema,
  context: ExecutorContext,
) {
  const cmdopt = toCmdOptions(options)
  return runTfCommand(context, "validate", cmdopt)
}

function toCmdOptions(options: ValidateExecutorSchema): string[] {
  return [
    ...(options.json !== undefined ? [`-json`]: []),
    ...(options.noColor !== undefined ? [`-noColor`]: []),
  ]
}
