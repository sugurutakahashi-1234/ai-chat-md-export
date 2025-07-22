# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --include src/presentation/cli.ts --include src/presentation/processor-factory.ts --include src/application/processor.ts --exclude src/domain --exclude node_modules --md docs/reports/dependencies/flow.md
```

```mermaid
flowchart LR
    subgraph src["src"]
        subgraph src/application["/application"]
            src/application/processor.ts["processor.ts"]
            src/application/depend_encies.ts["dependencies.ts"]
        end
        subgraph src/presentation["/presentation"]
            src/presentation/processor//factory.ts["processor-factory.ts"]
            src/presentation/cli.ts["cli.ts"]
            src/presentation/index.ts["index.ts"]
        end
        subgraph src/infrastructure["/infrastructure"]
            subgraph src/infrastructure/filters["/filters"]
                src/infrastructure/filters/conversation//filter.ts["conversation-filter.ts"]
            end
            subgraph src/infrastructure/formatters["/formatters"]
                src/infrastructure/formatters/json//formatter.ts["json-formatter.ts"]
                src/infrastructure/formatters/markdown//formatter.ts["markdown-formatter.ts"]
            end
            subgraph src/infrastructure/io["/io"]
                src/infrastructure/io/file//loader.ts["file-loader.ts"]
                src/infrastructure/io/file//writer.ts["file-writer.ts"]
            end
            subgraph src/infrastructure/logging["/logging"]
                src/infrastructure/logging/logger.ts["logger.ts"]
            end
            subgraph src/infrastructure/parsers["/parsers"]
                subgraph src/infrastructure/parsers/chatgpt["/chatgpt"]
                    src/infrastructure/parsers/chatgpt/parser.ts["parser.ts"]
                end
                subgraph src/infrastructure/parsers/claude["/claude"]
                    src/infrastructure/parsers/claude/parser.ts["parser.ts"]
                end
            end
            subgraph src/infrastructure/validation["/validation"]
                src/infrastructure/validation/schema//validator.ts["schema-validator.ts"]
            end
        end
    end
    src/application/processor.ts-->src/application/depend_encies.ts
    src/presentation/processor//factory.ts-->src/application/depend_encies.ts
    src/presentation/processor//factory.ts-->src/infrastructure/filters/conversation//filter.ts
    src/presentation/processor//factory.ts-->src/infrastructure/formatters/json//formatter.ts
    src/presentation/processor//factory.ts-->src/infrastructure/formatters/markdown//formatter.ts
    src/presentation/processor//factory.ts-->src/infrastructure/io/file//loader.ts
    src/presentation/processor//factory.ts-->src/infrastructure/io/file//writer.ts
    src/presentation/processor//factory.ts-->src/infrastructure/logging/logger.ts
    src/presentation/processor//factory.ts-->src/infrastructure/parsers/chatgpt/parser.ts
    src/presentation/processor//factory.ts-->src/infrastructure/parsers/claude/parser.ts
    src/presentation/processor//factory.ts-->src/infrastructure/validation/schema//validator.ts
    src/presentation/cli.ts-->src/application/processor.ts
    src/presentation/cli.ts-->src/presentation/processor//factory.ts
    src/presentation/index.ts-->src/presentation/cli.ts
```

