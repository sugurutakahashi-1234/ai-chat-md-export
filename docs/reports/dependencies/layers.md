# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --abstraction src/domain --abstraction src/application --abstraction src/infrastructure --abstraction src/presentation --md docs/reports/dependencies/layers.md
```

```mermaid
flowchart LR
    classDef dir fill:#0000,stroke:#999
    subgraph src["src"]
        src/domain["/domain"]:::dir
        src/application["/application"]:::dir
        src/infrastructure["/infrastructure"]:::dir
        src/presentation["/presentation"]:::dir
    end
    subgraph node//modules["node_modules"]
        node//modules/zod/index.d.cts["zod"]
        node//modules/ora/index.d.ts["ora"]
        node//modules/picocolors/picocolors.d.ts["picocolors"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/domain-->node//modules/zod/index.d.cts
    src/application-->src/domain
    src/infrastructure-->src/domain
    src/infrastructure-->node//modules/ora/index.d.ts
    src/infrastructure-->node//modules/picocolors/picocolors.d.ts
    src/infrastructure-->node//modules/zod/index.d.cts
    src/presentation-->src/application
    src/presentation-->src/domain
    src/presentation-->src/infrastructure
    src/presentation-->node//modules/commander/typings/index.d.ts
```

