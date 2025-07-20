# TypeScript Graph

```bash
tsg --tsconfig ./tsconfig.json --LR --md docs/dependency-graphs/typescript-graph.md
```

```mermaid
flowchart LR
    subgraph src["src"]
        src/types.ts["types.ts"]
        src/version.ts["version.ts"]
        src/cli.ts["cli.ts"]
        src/index.ts["index.ts"]
        subgraph src/utils["/utils"]
            src/utils/logger.ts["logger.ts"]
            src/utils/options.ts["options.ts"]
            src/utils/filename.ts["filename.ts"]
            subgraph src/utils/errors["/errors"]
                src/utils/errors/errors.ts["errors.ts"]
                src/utils/errors/formatter.ts["formatter.ts"]
            end
            subgraph src/utils/validation["/validation"]
                src/utils/validation/type//guards.ts["type-guards.ts"]
                src/utils/validation/schema//validator.ts["schema-validator.ts"]
            end
        end
        subgraph src/core["/core"]
            subgraph src/core/interfaces["/interfaces"]
                src/core/interfaces/platform//parser.ts["platform-parser.ts"]
                src/core/interfaces/output//formatter.ts["output-formatter.ts"]
            end
            subgraph src/core/io["/io"]
                src/core/io/file//loader.ts["file-loader.ts"]
                src/core/io/file//writer.ts["file-writer.ts"]
            end
            subgraph src/core/processing["/processing"]
                src/core/processing/filter.ts["filter.ts"]
                src/core/processing/processor.ts["processor.ts"]
                subgraph src/core/processing/converters["/converters"]
                    src/core/processing/converters/json.ts["json.ts"]
                    src/core/processing/converters/markdown.ts["markdown.ts"]
                end
            end
        end
        subgraph src/handlers["/handlers"]
            src/handlers/base//handler.ts["base-handler.ts"]
            src/handlers/chatgpt//handler.ts["chatgpt-handler.ts"]
            src/handlers/claude//handler.ts["claude-handler.ts"]
            subgraph src/handlers/schemas["/schemas"]
                src/handlers/schemas/chatgpt.ts["chatgpt.ts"]
                src/handlers/schemas/claude.ts["claude.ts"]
            end
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/zod/index.d.cts["zod"]
        node//modules/picocolors/picocolors.d.ts["picocolors"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/utils/validation/type//guards.ts-->node//modules/zod/index.d.cts
    src/utils/validation/type//guards.ts-->src/utils/errors/errors.ts
    src/core/interfaces/platform//parser.ts-->node//modules/zod/index.d.cts
    src/core/interfaces/platform//parser.ts-->src/types.ts
    src/utils/logger.ts-->node//modules/picocolors/picocolors.d.ts
    src/utils/validation/schema//validator.ts-->node//modules/zod/index.d.cts
    src/handlers/base//handler.ts-->node//modules/zod/index.d.cts
    src/handlers/base//handler.ts-->src/core/interfaces/platform//parser.ts
    src/handlers/base//handler.ts-->src/types.ts
    src/handlers/base//handler.ts-->src/utils/errors/errors.ts
    src/handlers/base//handler.ts-->src/utils/logger.ts
    src/handlers/base//handler.ts-->src/utils/validation/schema//validator.ts
    src/handlers/schemas/chatgpt.ts-->node//modules/zod/index.d.cts
    src/handlers/chatgpt//handler.ts-->src/types.ts
    src/handlers/chatgpt//handler.ts-->src/utils/validation/type//guards.ts
    src/handlers/chatgpt//handler.ts-->src/handlers/base//handler.ts
    src/handlers/chatgpt//handler.ts-->src/handlers/schemas/chatgpt.ts
    src/handlers/schemas/claude.ts-->node//modules/zod/index.d.cts
    src/handlers/claude//handler.ts-->src/types.ts
    src/handlers/claude//handler.ts-->src/utils/validation/type//guards.ts
    src/handlers/claude//handler.ts-->src/handlers/base//handler.ts
    src/handlers/claude//handler.ts-->src/handlers/schemas/claude.ts
    src/utils/errors/formatter.ts-->src/utils/errors/errors.ts
    src/utils/options.ts-->node//modules/zod/index.d.cts
    src/core/io/file//loader.ts-->src/utils/errors/errors.ts
    src/core/io/file//loader.ts-->src/utils/errors/formatter.ts
    src/core/interfaces/output//formatter.ts-->src/types.ts
    src/core/processing/converters/json.ts-->src/types.ts
    src/core/processing/converters/json.ts-->src/core/interfaces/output//formatter.ts
    src/core/processing/converters/markdown.ts-->src/types.ts
    src/core/processing/converters/markdown.ts-->src/core/interfaces/output//formatter.ts
    src/core/io/file//writer.ts-->src/types.ts
    src/core/io/file//writer.ts-->src/utils/errors/errors.ts
    src/core/io/file//writer.ts-->src/utils/errors/formatter.ts
    src/core/io/file//writer.ts-->src/utils/filename.ts
    src/core/io/file//writer.ts-->src/utils/logger.ts
    src/core/io/file//writer.ts-->src/utils/options.ts
    src/core/io/file//writer.ts-->src/core/interfaces/output//formatter.ts
    src/core/io/file//writer.ts-->src/core/processing/converters/json.ts
    src/core/io/file//writer.ts-->src/core/processing/converters/markdown.ts
    src/core/processing/filter.ts-->src/types.ts
    src/core/processing/filter.ts-->src/utils/options.ts
    src/core/processing/processor.ts-->src/handlers/chatgpt//handler.ts
    src/core/processing/processor.ts-->src/handlers/claude//handler.ts
    src/core/processing/processor.ts-->src/types.ts
    src/core/processing/processor.ts-->src/utils/errors/errors.ts
    src/core/processing/processor.ts-->src/utils/errors/formatter.ts
    src/core/processing/processor.ts-->src/utils/logger.ts
    src/core/processing/processor.ts-->src/utils/options.ts
    src/core/processing/processor.ts-->src/core/interfaces/platform//parser.ts
    src/core/processing/processor.ts-->src/core/io/file//loader.ts
    src/core/processing/processor.ts-->src/core/io/file//writer.ts
    src/core/processing/processor.ts-->src/core/processing/filter.ts
    src/cli.ts-->node//modules/commander/typings/index.d.ts
    src/cli.ts-->src/core/processing/processor.ts
    src/cli.ts-->src/utils/errors/formatter.ts
    src/cli.ts-->src/utils/logger.ts
    src/cli.ts-->src/utils/options.ts
    src/cli.ts-->src/version.ts
    src/index.ts-->src/cli.ts
```

