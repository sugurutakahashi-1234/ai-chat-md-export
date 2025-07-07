# Redocly Bundle Command Usage

日付: 2024-10-16

---

## 👤 ユーザー
*2024/10/16 18:40:51*

redocly bundle

---

## 🤖 アシスタント
*2024/10/16 18:41:06*

`redocly bundle` is a command-line tool provided by Redocly, primarily used for bundling OpenAPI definitions. It helps combine multiple OpenAPI files into a single bundled file. This is particularly useful when your OpenAPI specification is spread across multiple files or you want to reuse certain components (like schemas, responses, etc.) across different parts of the API.

Here’s how you can use `redocly bundle`:

### Install Redocly CLI
To install Redocly CLI, you can use npm:

```bash
npm install -g @redocly/cli
```

### Bundling OpenAPI Files
Once the CLI is installed, you can bundle your OpenAPI files by running:

```bash
redocly bundle path/to/openapi.yaml
```

This will output a single bundled OpenAPI file that includes all referenced components and definitions.

### Options for `redocly bundle`
Here are some useful options you can use with the `redocly bundle` command:

- **--output**: Specify the output file path.
  ```bash
  redocly bundle path/to/openapi.yaml --output path/to/output.yaml
  ```
  
- **--dereference**: Fully dereferences all `$ref` references in the bundled file.
  ```bash
  redocly bundle path/to/openapi.yaml --dereference
  ```

- **--config**: Use a specific Redocly configuration file.
  ```bash
  redocly bundle path/to/openapi.yaml --config path/to/.redocly.yaml
  ```

The resulting bundled OpenAPI file can be used to generate documentation, share with other teams, or validate the structure of your API in a unified way.

Is there anything specific you're looking to achieve with `redocly bundle`?

---
