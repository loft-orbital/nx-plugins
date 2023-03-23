import { PlanExecutorSchema } from './schema';
import executor from './executor';
import { execSync, ExecSyncOptionsWithBufferEncoding } from 'child_process'

const options: PlanExecutorSchema = {};

jest.mock('child_process', () => {
  const originalModule = jest.requireActual('child_process')
  return {
    __esModule: true,
    ...originalModule,
    execSync: jest.fn((command: string, options: ExecSyncOptionsWithBufferEncoding): Buffer => {
                expect(command).toMatch(/^terraform plan/)
                expect(options.cwd).toBe(process.cwd())
                return null
              }),
  }
})

describe('Plan Executor', () => {
  it('can run', async () => {
    const output = await executor(options, null);
    expect(output.success).toBe(true);
    expect(execSync).toBeCalledTimes(1);
  });
});