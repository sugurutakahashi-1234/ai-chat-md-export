# TypeScript Graph

```bash
tsg --tsconfig ./tsconfig.dependency-graph.json --exclude tests --LR --md docs/dependency-graphs/typescript-graph.md
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
        subgraph src/core["/core"]
            src/core/format//handler.ts["format-handler.ts"]
            src/core/handler//registry.ts["handler-registry.ts"]
            src/core/filter.ts["filter.ts"]
            src/core/processor.ts["processor.ts"]
        end
        subgraph src/schemas["/schemas"]
            src/schemas/chatgpt.ts["chatgpt.ts"]
            src/schemas/claude.ts["claude.ts"]
        end
        subgraph src/utils["/utils"]
            src/utils/logger.ts["logger.ts"]
            src/utils/loader//logger.ts["loader-logger.ts"]
            src/utils/schema//validator.ts["schema-validator.ts"]
            src/utils/error//formatter.ts["error-formatter.ts"]
            src/utils/filename.ts["filename.ts"]
            src/utils/options.ts["options.ts"]
            src/utils/format//detector.ts["format-detector.ts"]
        end
        subgraph src/handlers["/handlers"]
            src/handlers/chatgpt//handler.ts["chatgpt-handler.ts"]
            src/handlers/claude//handler.ts["claude-handler.ts"]
            src/handlers/index.ts["index.ts"]
        end
        subgraph src/loaders["/loaders"]
            src/loaders/chatgpt.ts["chatgpt.ts"]
            src/loaders/claude.ts["claude.ts"]
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/zod/index.d.cts["zod"]
        node//modules/picocolors/picocolors.d.ts["picocolors"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/converters/json.ts-->src/types.ts
    src/converters/markdown.ts-->src/types.ts
    src/core/format//handler.ts-->node//modules/zod/index.d.cts
    src/core/format//handler.ts-->src/types.ts
    src/core/handler//registry.ts-->src/core/format//handler.ts
    src/schemas/chatgpt.ts-->node//modules/zod/index.d.cts
    src/utils/logger.ts-->node//modules/picocolors/picocolors.d.ts
    src/utils/loader//logger.ts-->src/utils/logger.ts
    src/utils/schema//validator.ts-->node//modules/zod/index.d.cts
    src/handlers/chatgpt//handler.ts-->src/core/format//handler.ts
    src/handlers/chatgpt//handler.ts-->src/schemas/chatgpt.ts
    src/handlers/chatgpt//handler.ts-->src/types.ts
    src/handlers/chatgpt//handler.ts-->src/utils/loader//logger.ts
    src/handlers/chatgpt//handler.ts-->src/utils/schema//validator.ts
    src/schemas/claude.ts-->node//modules/zod/index.d.cts
    src/handlers/claude//handler.ts-->src/core/format//handler.ts
    src/handlers/claude//handler.ts-->src/schemas/claude.ts
    src/handlers/claude//handler.ts-->src/types.ts
    src/handlers/claude//handler.ts-->src/utils/loader//logger.ts
    src/handlers/claude//handler.ts-->src/utils/schema//validator.ts
    src/handlers/index.ts-->src/core/handler//registry.ts
    src/handlers/index.ts-->src/handlers/chatgpt//handler.ts
    src/handlers/index.ts-->src/handlers/claude//handler.ts
    src/utils/options.ts-->node//modules/zod/index.d.cts
    src/core/filter.ts-->src/types.ts
    src/core/filter.ts-->src/utils/options.ts
    src/core/processor.ts-->src/converters/json.ts
    src/core/processor.ts-->src/converters/markdown.ts
    src/core/processor.ts-->src/handlers/index.ts
    src/core/processor.ts-->src/types.ts
    src/core/processor.ts-->src/utils/error//formatter.ts
    src/core/processor.ts-->src/utils/filename.ts
    src/core/processor.ts-->src/utils/logger.ts
    src/core/processor.ts-->src/utils/options.ts
    src/core/processor.ts-->src/core/filter.ts
    src/core/processor.ts-->src/core/format//handler.ts
    src/core/processor.ts-->src/core/handler//registry.ts
    src/cli.ts-->node//modules/commander/typings/index.d.ts
    src/cli.ts-->src/core/processor.ts
    src/cli.ts-->src/utils/logger.ts
    src/cli.ts-->src/utils/options.ts
    src/cli.ts-->src/version.ts
    src/loaders/chatgpt.ts-->src/core/handler//registry.ts
    src/loaders/chatgpt.ts-->src/handlers/chatgpt//handler.ts
    src/loaders/chatgpt.ts-->src/types.ts
    src/loaders/claude.ts-->src/core/handler//registry.ts
    src/loaders/claude.ts-->src/handlers/claude//handler.ts
    src/loaders/claude.ts-->src/types.ts
    src/utils/format//detector.ts-->src/core/handler//registry.ts
    src/utils/format//detector.ts-->src/handlers/index.ts
    src/index.ts-->src/cli.ts
    src/index.ts-->src/converters/json.ts
    src/index.ts-->src/converters/markdown.ts
    src/index.ts-->src/core/processor.ts
    src/index.ts-->src/core/format//handler.ts
    src/index.ts-->src/core/handler//registry.ts
    src/index.ts-->src/loaders/chatgpt.ts
    src/index.ts-->src/loaders/claude.ts
    src/index.ts-->src/handlers/index.ts
    src/index.ts-->src/types.ts
    src/index.ts-->src/utils/filename.ts
    src/index.ts-->src/utils/format//detector.ts
    src/index.ts-->src/utils/options.ts
```

