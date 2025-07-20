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
            src/utils/validator.ts["validator.ts"]
            subgraph src/utils/errors["/errors"]
                src/utils/errors/errors.ts["errors.ts"]
                src/utils/errors/formatter.ts["formatter.ts"]
            end
        end
        subgraph src/parsers["/parsers"]
            src/parsers/platform//parser//interface.ts["platform-parser-interface.ts"]
            src/parsers/base//parser.ts["base-parser.ts"]
            src/parsers/chatgpt//parser.ts["chatgpt-parser.ts"]
            src/parsers/claude//parser.ts["claude-parser.ts"]
            src/parsers/parser//factory.ts["parser-factory.ts"]
            subgraph src/parsers/schemas["/schemas"]
                src/parsers/schemas/chatgpt.ts["chatgpt.ts"]
                src/parsers/schemas/claude.ts["claude.ts"]
            end
        end
        subgraph src/core["/core"]
            src/core/processor//depend_encies.ts["processor-dependencies.ts"]
            src/core/processor//factories.ts["processor-factories.ts"]
            subgraph src/core/io["/io"]
                src/core/io/file//loader.ts["file-loader.ts"]
                src/core/io/file//writer.ts["file-writer.ts"]
                subgraph src/core/io/formatters["/formatters"]
                    src/core/io/formatters/base.ts["base.ts"]
                    src/core/io/formatters/json.ts["json.ts"]
                    src/core/io/formatters/markdown.ts["markdown.ts"]
                end
            end
            subgraph src/core/processing["/processing"]
                src/core/processing/filter.ts["filter.ts"]
                src/core/processing/processor.ts["processor.ts"]
            end
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/picocolors/picocolors.d.ts["picocolors"]
        node//modules/zod/index.d.cts["zod"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/utils/errors/formatter.ts-->src/utils/errors/errors.ts
    src/utils/logger.ts-->node//modules/picocolors/picocolors.d.ts
    src/utils/options.ts-->node//modules/zod/index.d.cts
    src/parsers/platform//parser//interface.ts-->node//modules/zod/index.d.cts
    src/parsers/platform//parser//interface.ts-->src/types.ts
    src/core/io/file//loader.ts-->src/utils/errors/errors.ts
    src/core/io/file//loader.ts-->src/utils/errors/formatter.ts
    src/core/io/formatters/base.ts-->src/types.ts
    src/core/io/formatters/json.ts-->src/types.ts
    src/core/io/formatters/json.ts-->src/core/io/formatters/base.ts
    src/core/io/formatters/markdown.ts-->src/types.ts
    src/core/io/formatters/markdown.ts-->src/core/io/formatters/base.ts
    src/core/io/file//writer.ts-->src/types.ts
    src/core/io/file//writer.ts-->src/utils/errors/errors.ts
    src/core/io/file//writer.ts-->src/utils/errors/formatter.ts
    src/core/io/file//writer.ts-->src/utils/filename.ts
    src/core/io/file//writer.ts-->src/utils/logger.ts
    src/core/io/file//writer.ts-->src/utils/options.ts
    src/core/io/file//writer.ts-->src/core/io/formatters/base.ts
    src/core/io/file//writer.ts-->src/core/io/formatters/json.ts
    src/core/io/file//writer.ts-->src/core/io/formatters/markdown.ts
    src/core/processor//depend_encies.ts-->src/parsers/platform//parser//interface.ts
    src/core/processor//depend_encies.ts-->src/utils/logger.ts
    src/core/processor//depend_encies.ts-->src/core/io/file//loader.ts
    src/core/processor//depend_encies.ts-->src/core/io/file//writer.ts
    src/core/processing/filter.ts-->src/types.ts
    src/core/processing/filter.ts-->src/utils/options.ts
    src/core/processing/processor.ts-->src/types.ts
    src/core/processing/processor.ts-->src/utils/errors/errors.ts
    src/core/processing/processor.ts-->src/utils/errors/formatter.ts
    src/core/processing/processor.ts-->src/utils/logger.ts
    src/core/processing/processor.ts-->src/utils/options.ts
    src/core/processing/processor.ts-->src/core/processor//depend_encies.ts
    src/core/processing/processor.ts-->src/core/processing/filter.ts
    src/utils/validator.ts-->node//modules/zod/index.d.cts
    src/utils/validator.ts-->src/utils/errors/errors.ts
    src/parsers/base//parser.ts-->node//modules/zod/index.d.cts
    src/parsers/base//parser.ts-->src/types.ts
    src/parsers/base//parser.ts-->src/utils/errors/errors.ts
    src/parsers/base//parser.ts-->src/utils/logger.ts
    src/parsers/base//parser.ts-->src/utils/validator.ts
    src/parsers/base//parser.ts-->src/parsers/platform//parser//interface.ts
    src/parsers/schemas/chatgpt.ts-->node//modules/zod/index.d.cts
    src/parsers/chatgpt//parser.ts-->src/types.ts
    src/parsers/chatgpt//parser.ts-->src/utils/validator.ts
    src/parsers/chatgpt//parser.ts-->src/parsers/base//parser.ts
    src/parsers/chatgpt//parser.ts-->src/parsers/schemas/chatgpt.ts
    src/parsers/schemas/claude.ts-->node//modules/zod/index.d.cts
    src/parsers/claude//parser.ts-->src/types.ts
    src/parsers/claude//parser.ts-->src/utils/validator.ts
    src/parsers/claude//parser.ts-->src/parsers/base//parser.ts
    src/parsers/claude//parser.ts-->src/parsers/schemas/claude.ts
    src/parsers/parser//factory.ts-->src/utils/options.ts
    src/parsers/parser//factory.ts-->src/parsers/chatgpt//parser.ts
    src/parsers/parser//factory.ts-->src/parsers/claude//parser.ts
    src/parsers/parser//factory.ts-->src/parsers/platform//parser//interface.ts
    src/core/processor//factories.ts-->src/parsers/parser//factory.ts
    src/core/processor//factories.ts-->src/parsers/platform//parser//interface.ts
    src/core/processor//factories.ts-->src/utils/logger.ts
    src/core/processor//factories.ts-->src/core/io/file//loader.ts
    src/core/processor//factories.ts-->src/core/io/file//writer.ts
    src/core/processor//factories.ts-->src/core/processor//depend_encies.ts
    src/cli.ts-->node//modules/commander/typings/index.d.ts
    src/cli.ts-->src/core/processing/processor.ts
    src/cli.ts-->src/core/processor//factories.ts
    src/cli.ts-->src/utils/errors/formatter.ts
    src/cli.ts-->src/utils/logger.ts
    src/cli.ts-->src/utils/options.ts
    src/cli.ts-->src/version.ts
    src/index.ts-->src/cli.ts
```

