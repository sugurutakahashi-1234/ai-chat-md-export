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
        subgraph src/converters["/converters"]
            src/converters/json.ts["json.ts"]
            src/converters/markdown.ts["markdown.ts"]
        end
        subgraph src/schemas["/schemas"]
            src/schemas/chatgpt.ts["chatgpt.ts"]
            src/schemas/claude.ts["claude.ts"]
        end
        subgraph src/utils["/utils"]
            src/utils/logger.ts["logger.ts"]
            src/utils/loader//helpers.ts["loader-helpers.ts"]
            src/utils/schema//validator.ts["schema-validator.ts"]
            src/utils/error//formatter.ts["error-formatter.ts"]
            src/utils/filename.ts["filename.ts"]
            src/utils/format//detector.ts["format-detector.ts"]
            src/utils/options.ts["options.ts"]
        end
        subgraph src/loaders["/loaders"]
            src/loaders/chatgpt.ts["chatgpt.ts"]
            src/loaders/claude.ts["claude.ts"]
        end
        subgraph src/core["/core"]
            src/core/filter.ts["filter.ts"]
            src/core/processor.ts["processor.ts"]
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/zod/index.d.cts["zod"]
        node//modules/picocolors/picocolors.d.ts["picocolors"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/converters/json.ts-->src/types.ts
    src/converters/markdown.ts-->src/types.ts
    src/schemas/chatgpt.ts-->node//modules/zod/index.d.cts
    src/utils/logger.ts-->node//modules/picocolors/picocolors.d.ts
    src/utils/loader//helpers.ts-->src/utils/logger.ts
    src/utils/schema//validator.ts-->node//modules/zod/index.d.cts
    src/loaders/chatgpt.ts-->src/schemas/chatgpt.ts
    src/loaders/chatgpt.ts-->src/types.ts
    src/loaders/chatgpt.ts-->src/utils/loader//helpers.ts
    src/loaders/chatgpt.ts-->src/utils/schema//validator.ts
    src/schemas/claude.ts-->node//modules/zod/index.d.cts
    src/loaders/claude.ts-->src/schemas/claude.ts
    src/loaders/claude.ts-->src/types.ts
    src/loaders/claude.ts-->src/utils/loader//helpers.ts
    src/loaders/claude.ts-->src/utils/schema//validator.ts
    src/utils/options.ts-->node//modules/zod/index.d.cts
    src/core/filter.ts-->src/types.ts
    src/core/filter.ts-->src/utils/options.ts
    src/core/processor.ts-->src/converters/json.ts
    src/core/processor.ts-->src/converters/markdown.ts
    src/core/processor.ts-->src/loaders/chatgpt.ts
    src/core/processor.ts-->src/loaders/claude.ts
    src/core/processor.ts-->src/types.ts
    src/core/processor.ts-->src/utils/error//formatter.ts
    src/core/processor.ts-->src/utils/filename.ts
    src/core/processor.ts-->src/utils/format//detector.ts
    src/core/processor.ts-->src/utils/logger.ts
    src/core/processor.ts-->src/utils/options.ts
    src/core/processor.ts-->src/core/filter.ts
    src/cli.ts-->node//modules/commander/typings/index.d.ts
    src/cli.ts-->src/core/processor.ts
    src/cli.ts-->src/utils/logger.ts
    src/cli.ts-->src/utils/options.ts
    src/cli.ts-->src/version.ts
    src/index.ts-->src/cli.ts
    src/index.ts-->src/converters/json.ts
    src/index.ts-->src/converters/markdown.ts
    src/index.ts-->src/core/processor.ts
    src/index.ts-->src/loaders/chatgpt.ts
    src/index.ts-->src/loaders/claude.ts
    src/index.ts-->src/types.ts
    src/index.ts-->src/utils/filename.ts
    src/index.ts-->src/utils/format//detector.ts
    src/index.ts-->src/utils/options.ts
```

