import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('terraform e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@loft-orbital/terraform', 'dist/packages/terraform');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create lib', async () => {
    const project = uniq('terraform');
    await runNxCommandAsync(
      `generate @loft-orbital/terraform:lib ${project}`
    );
    const result = await runNxCommandAsync(`initialize ${project}`);
    expect(result.stdout).toContain('Terraform has been successfully initialized!');
  }, 120000);
  
  it('should create project', async () => {
    const project = uniq('terraform');
    await runNxCommandAsync(
      `generate @loft-orbital/terraform:project ${project}`
    );
    const result = await runNxCommandAsync(`initialize ${project}`);
    expect(result.stdout).toContain('Terraform has been successfully initialized!');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('terraform');
      await runNxCommandAsync(
        `generate @loft-orbital/terraform:project ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${project}/src/main.tf`, `libs/subdir/${project}/README.md`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('terraform');
      ensureNxProject('@loft-orbital/terraform', 'dist/packages/terraform');
      await runNxCommandAsync(
        `generate @loft-orbital/terraform:project ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${projectName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
