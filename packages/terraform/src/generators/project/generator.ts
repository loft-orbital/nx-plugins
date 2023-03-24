import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  updateNxJson,
} from '@nrwl/devkit';
import * as path from 'path';
import { ProjectGeneratorSchema } from './schema';

interface NormalizedSchema extends ProjectGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: ProjectGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: ProjectGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  updateNxJson(
    tree,
    {
      namedInputs: {
        tfSource: ["{projectRoot}/src/*.tf"],
        tfWD: ["{projectRoot}/src/.terraform"],
        tfPlan: ["{projectRoot}/src/tfplan"] 
      },
      targetDefaults: {
        initialize: {
          inputs: ["tfSource"]
        },
        lint: {
          inputs: ["tfSource"]
        },
        validate: {
          inputs: ["tfSource", "tfWD"]
        },
        plan: {
          inputs: ["tfSource", "tfWD"]
        },
        apply: {
          inputs: ["tfSource", "tfWD", "tfPlan"]
        },
      },
      tasksRunnerOptions: {
        default: {
          runner: "nx/tasks-runners/default",
          options: {
            cacheableOperations: ["initialize", "plan", "apply"]
          }
        }
      }    
    }
  )
  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    {
      root: normalizedOptions.projectRoot,
      projectType: 'application',
      sourceRoot: `${normalizedOptions.projectRoot}/src`,
      targets: {
        initialize: {
          executor: "@loft-orbital/terraform:init",
          outputs: [
            "{projectRoot}/src/.terraform",
            "{projectRoot}/src/.terraform.lock.hcl"
          ]
        },
        plan: {
          executor: "@loft-orbital/terraform:plan",
          options: {
            out: "tfplan"
          },
          outputs: [
            "{projectRoot}/src/tfplan",
          ],
          dependsOn: ["initialize"]
        },
        lint: {
          executor: "@loft-orbital/terraform:fmt",
          options: {
            check: true
          }
        },
        validate: {
          executor: "@loft-orbital/terraform:validate",
          dependsOn: ["initialize"]
        },
        apply: {
          executor: "@loft-orbital/terraform:apply",
          options: {
            planFile: "tfplan"
          },
          dependsOn: ["plan"]
        }     
      },
      tags: normalizedOptions.parsedTags,
    }
  );
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
