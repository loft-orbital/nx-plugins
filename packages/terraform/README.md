# terraform

Nx plugin to use Terraform in a Nx workspace.

## Quickstart

Create your Nx Workspace:

```shell
npx create-nx-workspace@latest my-org --preset=empty --cli=nx
```

Then install terraform plugin:

```shell
npm install --save-dev @loft-orbital/terraform
```

Finally you can generate a new lib or project:

```
# library
nx g @loft-orbital/terraform:lib
# project
nx g @loft-orbital/terraform:project
```

## Executing

### Library

Libraries are terraform modules you don't intend to deploy directly.
As such they do not come with `plan` or `apply` executors.

```shell
# Run terraform fmt -check
npx nx lint lib
# Run terraform validate
npx nx validate lib
```

### Project

Projects are terraform modules you do intend to deploy.
In addition to lint and validate executor, they come with `plan` and `apply`

```shell
# Run terraform fmt -check
npx nx lint project
# Run terraform validate
npx nx validate project
# Run terraform plan
npx nx plan project
# Run terraform apply
npx nx apply project
```
