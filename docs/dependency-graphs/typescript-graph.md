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
        subgraph src/schemas["/schemas"]
            src/schemas/chatgpt.ts["chatgpt.ts"]
            src/schemas/claude.ts["claude.ts"]
        end
        subgraph src/utils["/utils"]
            src/utils/type//guards.ts["type-guards.ts"]
            src/utils/logger.ts["logger.ts"]
            src/utils/schema//validator.ts["schema-validator.ts"]
            src/utils/error//formatter.ts["error-formatter.ts"]
            src/utils/options.ts["options.ts"]
            src/utils/filename.ts["filename.ts"]
        end
        subgraph src/core["/core"]
            src/core/file//loader.ts["file-loader.ts"]
            src/core/output//manager.ts["output-manager.ts"]
            src/core/file//writer.ts["file-writer.ts"]
            src/core/filter.ts["filter.ts"]
            src/core/platform//detector.ts["platform-detector.ts"]
            src/core/processor.ts["processor.ts"]
            subgraph src/core/interfaces["/interfaces"]
                src/core/interfaces/platform//parser.ts["platform-parser.ts"]
                src/core/interfaces/output//formatter.ts["output-formatter.ts"]
            end
        end
        subgraph src/errors["/errors"]
            src/errors/custom//errors.ts["custom-errors.ts"]
        end
        subgraph src/handlers["/handlers"]
            src/handlers/base//handler.ts["base-handler.ts"]
            src/handlers/chatgpt//handler.ts["chatgpt-handler.ts"]
            src/handlers/claude//handler.ts["claude-handler.ts"]
        end
        subgraph src/converters["/converters"]
            src/converters/json.ts["json.ts"]
            src/converters/markdown.ts["markdown.ts"]
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/zod/index.d.cts["zod"]
        node//modules/picocolors/picocolors.d.ts["picocolors"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/schemas/chatgpt.ts-->node//modules/zod/index.d.cts
    src/utils/type//guards.ts-->node//modules/zod/index.d.cts
    src/core/interfaces/platform//parser.ts-->node//modules/zod/index.d.cts
    src/core/interfaces/platform//parser.ts-->src/types.ts
    src/utils/logger.ts-->node//modules/picocolors/picocolors.d.ts
    src/utils/schema//validator.ts-->node//modules/zod/index.d.cts
    src/handlers/base//handler.ts-->node//modules/zod/index.d.cts
    src/handlers/base//handler.ts-->src/core/interfaces/platform//parser.ts
    src/handlers/base//handler.ts-->src/errors/custom//errors.ts
    src/handlers/base//handler.ts-->src/types.ts
    src/handlers/base//handler.ts-->src/utils/logger.ts
    src/handlers/base//handler.ts-->src/utils/schema//validator.ts
    src/handlers/chatgpt//handler.ts-->src/schemas/chatgpt.ts
    src/handlers/chatgpt//handler.ts-->src/types.ts
    src/handlers/chatgpt//handler.ts-->src/utils/type//guards.ts
    src/handlers/chatgpt//handler.ts-->src/handlers/base//handler.ts
    src/schemas/claude.ts-->node//modules/zod/index.d.cts
    src/handlers/claude//handler.ts-->src/schemas/claude.ts
    src/handlers/claude//handler.ts-->src/types.ts
    src/handlers/claude//handler.ts-->src/utils/type//guards.ts
    src/handlers/claude//handler.ts-->src/handlers/base//handler.ts
    src/utils/error//formatter.ts-->src/errors/custom//errors.ts
    src/utils/options.ts-->node//modules/zod/index.d.cts
    src/core/file//loader.ts-->src/errors/custom//errors.ts
    src/core/file//loader.ts-->src/utils/error//formatter.ts
    src/core/interfaces/output//formatter.ts-->src/types.ts
    src/converters/json.ts-->src/core/interfaces/output//formatter.ts
    src/converters/json.ts-->src/types.ts
    src/converters/markdown.ts-->src/core/interfaces/output//formatter.ts
    src/converters/markdown.ts-->src/types.ts
    src/core/output//manager.ts-->src/converters/json.ts
    src/core/output//manager.ts-->src/converters/markdown.ts
    src/core/output//manager.ts-->src/types.ts
    src/core/output//manager.ts-->src/utils/error//formatter.ts
    src/core/output//manager.ts-->src/utils/options.ts
    src/core/output//manager.ts-->src/core/interfaces/output//formatter.ts
    src/core/file//writer.ts-->src/types.ts
    src/core/file//writer.ts-->src/utils/error//formatter.ts
    src/core/file//writer.ts-->src/utils/filename.ts
    src/core/file//writer.ts-->src/utils/logger.ts
    src/core/file//writer.ts-->src/utils/options.ts
    src/core/file//writer.ts-->src/core/output//manager.ts
    src/core/filter.ts-->src/types.ts
    src/core/filter.ts-->src/utils/options.ts
    src/core/platform//detector.ts-->src/errors/custom//errors.ts
    src/core/platform//detector.ts-->src/utils/options.ts
    src/core/platform//detector.ts-->src/core/interfaces/platform//parser.ts
    src/core/processor.ts-->src/handlers/chatgpt//handler.ts
    src/core/processor.ts-->src/handlers/claude//handler.ts
    src/core/processor.ts-->src/types.ts
    src/core/processor.ts-->src/utils/error//formatter.ts
    src/core/processor.ts-->src/utils/logger.ts
    src/core/processor.ts-->src/utils/options.ts
    src/core/processor.ts-->src/core/file//loader.ts
    src/core/processor.ts-->src/core/file//writer.ts
    src/core/processor.ts-->src/core/filter.ts
    src/core/processor.ts-->src/core/interfaces/platform//parser.ts
    src/core/processor.ts-->src/core/output//manager.ts
    src/core/processor.ts-->src/core/platform//detector.ts
    src/cli.ts-->node//modules/commander/typings/index.d.ts
    src/cli.ts-->src/core/processor.ts
    src/cli.ts-->src/utils/error//formatter.ts
    src/cli.ts-->src/utils/logger.ts
    src/cli.ts-->src/utils/options.ts
    src/cli.ts-->src/version.ts
    src/index.ts-->src/cli.ts
```

