import { FmtExecutorSchema } from './schema';
import executor from './executor';

const options: FmtExecutorSchema = {};

describe('Fmt Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});