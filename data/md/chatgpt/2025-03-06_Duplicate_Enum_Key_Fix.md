# Duplicate Enum Key Fix

日付: 2025-03-06

---

## 👤 ユーザー
*2025/3/6 15:20:25*

Launching lib/main.dart on sdk gphone64 arm64 in debug mode...
guild\_api/lib/src/model/api\_error\_response\_dto.g.dart:1354:48: Error: Constant evaluation error:
  static const Map&lt;Object, String&gt; \_fromWire = const &lt;Object, String&gt;{
                                               ^
guild\_api/lib/src/model/api\_error\_response\_dto.g.dart:1474:5: Context: The key '"NFT\_ACCESSORY\_NOT\_EQUIPPED"' conflicts with another existing key in the map.
    'NFT\_ACCESSORY\_NOT\_EQUIPPED': 'NFT\_ACCESSORY\_NOT\_EQUIPPED2',
    ^
guild\_api/lib/src/model/api\_error\_response\_dto.g.dart:1354:36: Context: While analyzing:
  static const Map&lt;Object, String&gt; \_fromWire = const &lt;Object, String&gt;{
                                   ^
Target kernel\_snapshot\_program failed: Exception
2

FAILURE: Build failed with an exception.

\* What went wrong:
Execution failed for task ':app:compileFlutterBuildDevDebug'.
&gt; Process 'command '/Users/sugurutakahashi/fvm/versions/3.27.4/bin/flutter'' finished with non-zero exit value 1

\* Try:
&gt; Run with --stacktrace option to get the stack trace.
&gt; Run with --info or --debug option to get more log output.
&gt; Run with --scan to get full insights.
&gt; Get more help at https://help.gradle.org.

BUILD FAILED in 7s
Error: Gradle task assembleDevDebug failed with exit code 1

Exited (1).

info:
    title: 'SNPIT Guild APIs'
    description: '作成日時: 2025年03月05日 14時05分56秒'
    version: 0.0.1
    contact: {}
openapi: 3.0.0
paths:
    /admin/explorers:
        get:
            operationId: AdminExplorerController\_getAllExplorers
            parameters: \[{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all explorers that current user is having \[GME0201\]'
            tags: \['Admin - Explorers'\]
        post:
            operationId: AdminExplorerController\_createExplorer
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateExplorerRequestAdminDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new explorer \[ADMXXXX\]'
            tags: \['Admin - Explorers'\]
    /admin/explorer-attributes:
        get:
            operationId: AdminExplorerAttributeController\_getAllAttributes
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerAttributeListResponseAdminDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all NFT explorer attributes by Admin \[ADMXXXX\]'
            tags: \['Admin - Explorer Attributes'\]
        post:
            operationId: AdminExplorerAttributeController\_createAttribute
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateExplorerAttributeRequestAdminDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new NFT explorer attribute by Admin \[ADMXXXX\]'
            tags: \['Admin - Explorer Attributes'\]
    '/admin/explorer-attributes/{attributeId}':
        delete:
            operationId: AdminExplorerAttributeController\_deleteAttribute
            parameters: \[{name: attributeId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a NFT explorer attribute by Admin \[ADMXXXX\]'
            tags: \['Admin - Explorer Attributes'\]
    /v1/auth/email:
        post:
            operationId: AuthController\_sendCode
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthEmailRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SendCodeResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Check email and send auth code \[LGN0101, LGN0102, ACN0102\]'
            tags: \[Auth\]
    /v1/auth/login:
        post:
            operationId: AuthController\_login
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthLoginRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/AuthLoginResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Check auth code and return access token. Create account record if new. \[LGN0101, LGN0102, ACN0102\]'
            tags: \[Auth\]
    /v1/auth/logout:
        post:
            operationId: AuthController\_logout
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthLogoutRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/AuthLogoutResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'User Logout performed by Admin \[ADMXXX\]'
            tags: \[Auth\]
    /v1/decks:
        get:
            operationId: DeckController\_getOwnDeck
            parameters: \[{name: userId, required: false, in: query, description: 'Get deck information of other user by userId', schema: {example: 123e4567-e89b-12d3-a456-426614174000, type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetDeckResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve deck information. Own deck if no query. \[DCK0101\]'
            tags: \[Decks\]
        post:
            operationId: DeckController\_createDeck
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateDeckRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new deck \[DCK0301\]'
            tags: \[Decks\]
        put:
            operationId: DeckController\_upsertDeckCameras
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckCameraRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update deck camera combination or create new deck if not available \[DCK0201\]'
            tags: \[Decks\]
    '/v1/decks/{deckId}':
        get:
            operationId: DeckController\_getDecksByUserId
            parameters: \[{name: deckId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetDeckResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve deck information by deckId \[DCK0101\]'
            tags: \[Decks\]
    '/v1/decks/{deckId}/cameras':
        put:
            operationId: DeckController\_updateDeckCameras
            parameters: \[{name: deckId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckCameraRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update deck camera combination \[DCK0201\]'
            tags: \[Decks\]
    '/v1/decks/{deckId}/info':
        put:
            operationId: DeckController\_updateDeck
            parameters: \[{name: deckId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckInfoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update deck information \[DCK0201\]'
            tags: \[Decks\]
    /v1/cameras:
        get:
            operationId: CamerasController\_getCameras
            parameters: \[{name: userIds, required: false, in: query, description: 'Get cameras information of other user by userId', schema: {example: '123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001', type: array, items: {type: string}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/CameraListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get cameras belong to current user \[GMEXXXX\]'
            tags: \[Cameras\]
    /admin/flags:
        get:
            operationId: AdminFlagController\_getAllFlags
            parameters: \[{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/FlagListResponseAdminDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all flags that current user is having \[GME0401\]'
            tags: \['Admin - Flags'\]
        post:
            operationId: AdminFlagController\_createExplorer
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateFlagRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new flag \[ADMXXXX\]'
            tags: \['Admin - Flags'\]
    /admin/flag-attributes:
        get:
            operationId: AdminFlagAttributeController\_getAllAttributes
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/FlagAttributeListResponseAdminDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all NFT flag attributes by Admin \[ADMXXXX\]'
            tags: \['Admin - Flag Attributes'\]
        post:
            operationId: AdminFlagAttributeController\_createAttribute
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateFlagAttributeRequestAdminDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new NFT flag attribute by Admin \[ADMXXXX\]'
            tags: \['Admin - Flag Attributes'\]
    '/admin/flag-attributes/{attributeId}':
        delete:
            operationId: AdminFlagAttributeController\_deleteAttribute
            parameters: \[{name: attributeId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a NFT flag attribute by Admin \[ADMXXXX\]'
            tags: \['Admin - Flag Attributes'\]
    /admin/items:
        get:
            operationId: AdminItemController\_getItems
            parameters: \[{name: itemCategory, required: false, in: query, description: 'Filter items by itemCategory', schema: {type: array, items: {type: string, enum: \[DECOY\_SPOT, FLAG\_REPAIR, HEAL\_EXPLORER, SCOUT\_SPOT\_ENDURANCE\]}}}, {name: itemStatus, required: false, in: query, description: 'Filter items by itemStatus', schema: {type: array, items: {type: string, enum: \[NEW, ACTIVE, INACTIVE, DELETED\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemsResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all items by Admin \[ADMXXXX\]'
            tags: \['Admin - Items'\]
        post:
            operationId: AdminItemController\_createItem
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateItemRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create an item by Admin \[ADMXXXX\]'
            tags: \['Admin - Items'\]
        put:
            operationId: AdminItemController\_updateItem
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateItemRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update an item by Admin \[ADMXXXX\]'
            tags: \['Admin - Items'\]
    /admin/items/give:
        post:
            operationId: AdminItemController\_giveItems
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/GiveItemRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get item to specific user by Admin \[ADMXXXX\]'
            tags: \['Admin - Items'\]
    '/admin/items/del/{itemId}':
        delete:
            operationId: AdminItemController\_deleteItem
            parameters: \[{name: itemId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete an item by Admin \[ADMXXXX\]'
            tags: \['Admin - Items'\]
    /admin/item-boxes:
        get:
            operationId: AdminItemBoxController\_getItemBoxes
            parameters: \[{name: userLatitude, required: false, in: query, schema: {example: 35.654444, type: number}}, {name: userLongitude, required: false, in: query, schema: {example: 139.8754444, type: number}}, {name: itemCategory, required: false, in: query, description: 'TBD : Filter item boxes by itemCategory', schema: {type: array, items: {type: string, enum: \[DECOY\_SPOT, FLAG\_REPAIR, HEAL\_EXPLORER, SCOUT\_SPOT\_ENDURANCE\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemBoxResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all unopened item boxes \[GME0101\]'
            tags: \['Admin - Item Boxes'\]
        post:
            operationId: AdminItemBoxController\_createItemBox
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateItemBoxRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create an item box by Admin \[ADMXXXX\]'
            tags: \['Admin - Item Boxes'\]
    /admin/spots:
        get:
            operationId: AdminSpotController\_getAllSpots
            parameters: \[{name: range, required: false, in: query, schema: {example: 100, type: number}}, {name: userLatitude, required: false, in: query, schema: {example: 35.654444, type: number}}, {name: userLongitude, required: false, in: query, schema: {example: 139.8754444, type: number}}, {name: favorite, required: false, in: query, schema: {type: boolean}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all existing spots with its position \[ADMXXXX\]'
            tags: \['Admin - Spots'\]
        post:
            operationId: AdminSpotController\_createSpot
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateSpotRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new spot by Admin \[ADM0101\]'
            tags: \['Admin - Spots'\]
    '/admin/spots/{spotId}':
        get:
            operationId: AdminSpotController\_getSpotInfo
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed'}, '500': {description: 'Internal server error'}}
            summary: 'Get a spot information by Admin \[ADM0101\]'
            tags: \['Admin - Spots'\]
        put:
            operationId: AdminSpotController\_updateSpotInfo
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotInfoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update a spot information by Admin \[ADM0101\]'
            tags: \['Admin - Spots'\]
        delete:
            operationId: AdminSpotController\_deleteSpot
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a spot by Admin. This will automatically delete the photo in the DB \[ADM0102\]'
            tags: \['Admin - Spots'\]
    '/admin/spots/{spotId}/photos':
        put:
            operationId: AdminSpotController\_updateSpotPhoto
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotPhotoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update a spot main photo by Admin \[ADM0101\]'
            tags: \['Admin - Spots'\]
    /admin/spot-attributes:
        get:
            operationId: AdminSpotAttributeController\_getAllAttributes
            parameters: \[{name: rarity, required: false, in: query, description: 'Filter spot attributes by rarity', schema: {type: array, items: {type: string, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotAtributeListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all spot attributes by Admin \[ADMXXXX\]'
            tags: \['Admin - Spot Attributes'\]
        post:
            operationId: AdminSpotAttributeController\_createAttribute
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateSpotAttributeRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new spot attribute by Admin \[ADMXXXX\]'
            tags: \['Admin - Spot Attributes'\]
    '/admin/spot-attributes/{attributeId}':
        delete:
            operationId: AdminSpotAttributeController\_deleteAttribute
            parameters: \[{name: attributeId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a spot attribute by Admin \[ADMXXXX\]'
            tags: \['Admin - Spot Attributes'\]
    /v1/explorers:
        get:
            operationId: ExplorerController\_getAllExplorers
            parameters: \[{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all explorers that current user is having \[GME0201\]'
            tags: \[Explorers\]
    '/v1/explorers/{explorerId}/search':
        post:
            operationId: ExplorerController\_updateExplorer
            parameters: \[{name: explorerId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/SearchRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SearchResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Perform search to find the spot \[GME0202, GME0203, GME0204, GME0205\]'
            tags: \[Explorers\]
    /v1/flags:
        get:
            operationId: FlagController\_getAllFlags
            parameters: \[{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/FlagListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all flags that current user is having \[GME0401\]'
            tags: \[Flags\]
    '/v1/flags/{flagId}/construct/{spotId}':
        put:
            operationId: FlagController\_constructFlag
            parameters: \[{name: flagId, required: true, in: path, schema: {type: string}}, {name: spotId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Construct NFT flag in the spot \[GME0402, GME0403\]'
            tags: \[Flags\]
    '/v1/flags/{flagId}/mint':
        put:
            operationId: FlagController\_mintFlag
            parameters: \[{name: flagId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Mint NFT flag from 2 existing NFT Flags \[GME0405\] (TBD: Phase 2)'
            tags: \[Flags\]
    '/v1/flags/{flagId}/upgrade':
        put:
            operationId: FlagController\_upgradeFlag
            parameters: \[{name: flagId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Upgrade the flag level \[GME0404\]'
            tags: \[Flags\]
    /v1/guilds/self:
        get:
            operationId: GuildController\_getGuildInfoOfUser
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get guild information of requested user\[GLD0101\]'
            tags: \[Guilds\]
    '/v1/guilds/other/{guildId}':
        get:
            operationId: GuildController\_getGuildInfo
            parameters: \[{name: guildId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get guild information from guild ID\[GLD0103, GLD0201\]'
            tags: \[Guilds\]
    /v1/guilds:
        put:
            operationId: GuildController\_updateGuildInfo
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildInfoRequestDto'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update guild information by guild owner/admin \[GLD0301, GLD0302\]'
            tags: \[Guilds\]
        post:
            operationId: GuildController\_createGuild
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateGuildRequestDto'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new guild \[GLD0103, GLD0301, GLD0302\]'
            tags: \[Guilds\]
        delete:
            operationId: GuildController\_deleteGuild
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete guild by guild owner\[GLDXXXX\]'
            tags: \[Guilds\]
    /v1/guilds/spots:
        get:
            operationId: GuildController\_getGuildSpots
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildSpotsResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all guild spots \[GLD0401\]'
            tags: \[Guilds\]
    '/v1/guilds/spots/{spotId}':
        get:
            operationId: GuildController\_getGuildSpotDetail
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildSpotDetailResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all guild detail spot information including flag \[GLDXXXX\]'
            tags: \[Guilds\]
    /v1/guilds/flags:
        get:
            operationId: GuildController\_getGuildFlags
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildFlagsResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all guild constructed flags \[GLDXXXX\]'
            tags: \[Guilds\]
    '/v1/guilds/flags/{flagId}':
        delete:
            operationId: GuildController\_removeFlag
            parameters: \[{name: flagId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Remove flag that has been contructed \[GLDXXXX\]'
            tags: \[Guilds\]
    /v1/users/self:
        get:
            operationId: UserController\_getCurrentUserInfo
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/UserResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve current user information \[ACN0201, ACN0202, ACN0203\]'
            tags: \[Users\]
    '/v1/users/other/{userId}':
        get:
            operationId: UserController\_getAccountbyId
            parameters: \[{name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/UserResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve other user infromation by userId \[ACN0201, ACN0202, ACN0203\]'
            tags: \[Users\]
    /v1/users/nfts:
        get:
            operationId: UserController\_getUserNfts
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetUserNftsResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve nfts belong to current user \[GMEXXXX\]'
            tags: \[Users\]
    /v1/users:
        post:
            operationId: UserController\_createUser
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create new user user \[ACN0101\]'
            tags: \[Users\]
        delete:
            operationId: UserController\_deleteAccount
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete user account \[ACN0207\]'
            tags: \[Users\]
    '/v1/users/ban/{userId}':
        put:
            operationId: UserController\_banAccount
            parameters: \[{name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Ban user account \[ADMXXX\]'
            tags: \[Users\]
    '/v1/users/unban/{userId}':
        put:
            operationId: UserController\_unbanAccount
            parameters: \[{name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Unban user \[ADMXXX\]'
            tags: \[Users\]
    /v1/wallet:
        get:
            operationId: WalletController\_getBalance
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/WalletBalanceResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get wallet address and balances \[GMEXXXX\]'
            tags: \[Wallet\]
    /v1/spots:
        get:
            operationId: SpotController\_getAllSpots
            parameters: \[{name: range, required: false, in: query, schema: {example: 100, type: number}}, {name: userLatitude, required: false, in: query, schema: {example: 35.654444, type: number}}, {name: userLongitude, required: false, in: query, schema: {example: 139.8754444, type: number}}, {name: favorite, required: false, in: query, schema: {type: boolean}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all existing spots \[GME0101, GME0501\]'
            tags: \[Spots\]
    '/v1/spots/{spotId}':
        get:
            operationId: SpotController\_getSpot
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotDetailResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get a spot detail information by spotId \[GLD0402, GME0502\]'
            tags: \[Spots\]
    '/v1/spots/{spotId}/favorite':
        post:
            operationId: SpotController\_favorite
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}, {name: deactivate, required: false, in: query, schema: {type: boolean}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Favorite the spot \[GMEXXXX\]'
            tags: \[Spots\]
    '/v1/spots/{spotId}/waeve':
        put:
            operationId: SpotController\_waeveSpot
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/WaeveRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/WaeveResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Waeve the spot after upload the photo \[GME0302, GME0303, GME0304, GME0305, GLD0404\]'
            tags: \[Spots\]
    '/v1/guild-members/members/request/{guildId}':
        post:
            operationId: GuildMemberController\_requestToJoinGuild
            parameters: \[{name: guildId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Request to join the quild \[GLD0103, GLD0202\]'
            tags: \[Guild-members\]
    '/v1/guild-members/members/invite/{userId}':
        post:
            operationId: GuildMemberController\_inviteToJoinGuild
            parameters: \[{name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Invite to join the guild \[GLD0202\]'
            tags: \[Guild-members\]
    '/v1/guild-members/members/approve/{userId}/{guildId}':
        put:
            operationId: GuildMemberController\_approveToJoinGuild
            parameters: \[{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Approve to join the guild. userId != requested user, means approved "request". userId = requested user, means approved "invite".  \[GLD0303\]'
            tags: \[Guild-members\]
    '/v1/guild-members/members/reject/{userId}/{guildId}':
        delete:
            operationId: GuildMemberController\_rejectToJoinGuild
            parameters: \[{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Reject to join the guild. userId != requested user, means rejected "request". userId = requested user, means rejected "invite".  \[GLDXXXX\]'
            tags: \[Guild-members\]
    /v1/guild-members/members/leave:
        delete:
            operationId: GuildMemberController\_leaveFromGuild
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Leave from the guild. \[GLD0202, GLD0303\]'
            tags: \[Guild-members\]
    '/v1/guild-members/members/kick/{userId}':
        delete:
            operationId: GuildMemberController\_kickFromGuild
            parameters: \[{name: userId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Kicked from guild. \[GLD0102\]'
            tags: \[Guild-members\]
    /v1/guild-members/members/role:
        put:
            operationId: GuildMemberController\_updateGuildMember
            parameters: \[{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildMemberRoleRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Change guild member role. \[GLDXXXX\]'
            tags: \[Guild-members\]
    /v1/items:
        get:
            operationId: ItemController\_getUserItems
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetUserItemsResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve items belong to current user \[GMEXXXX\]'
            tags: \[Items\]
    /v1/items/decoy:
        post:
            operationId: ItemController\_useDecoy
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UseDecoyRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'The user use decoy item \[GME0602\]'
            tags: \[Items\]
    '/v1/items/repair/{flagId}':
        put:
            operationId: ItemController\_useRepair
            parameters: \[{name: flagId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'The user use repair item to recover NFT flag endurance\[GME0603\]'
            tags: \[Items\]
    '/v1/items/scout/{spotId}':
        get:
            operationId: ItemController\_useScout
            parameters: \[{name: spotId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetSpotEnduranceResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'The user use scout item to get spot endurance \[GME0604\]'
            tags: \[Items\]
    /v1/item-boxes:
        get:
            operationId: ItemBoxController\_getItemBoxes
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemBoxResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all item boxes that user has found \[GME0101\]'
            tags: \['Item Boxes'\]
    /v1/item-boxes/open:
        post:
            operationId: ItemBoxController\_openItemBox
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/OpenBoxRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/OpenBoxResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Open an item box \[GME0102\]'
            tags: \['Item Boxes'\]
    '/v1/nft/metadata/{tokenId}.json':
        get:
            operationId: NftController\_getMetadata
            parameters: \[{name: tokenId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/NftMetadata'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get NFT metadata'
            tags: \[NFT\]
    /v1/photos:
        get:
            operationId: PhotosController\_getAllPhotos
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all photos uploaded by current users \[GMEXXX\]'
            tags: \[Photos\]
        post:
            operationId: PhotosController\_uploadPhoto
            parameters: \[\]
            requestBody: {required: true, description: 'Binary of photo with metadata', content: {multipart/form-data: {schema: {$ref: '#/components/schemas/UploadPhotoRequestForYaml'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoUploadResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Uploaded a photo, separate Admin and User photo using PhotoType \[ADM0101, GME0302\]'
            tags: \[Photos\]
    '/v1/photos/{photoId}':
        delete:
            operationId: PhotosController\_deletePhotoByHash
            parameters: \[{name: photoId, required: true, in: path, schema: {type: string}}\]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete photo by photoId, separate Admin and User photo using PhotoType \[ADM0102\]'
            tags: \[Photos\]
    /health-check:
        get:
            operationId: HealthCheckController\_healthCheck
            parameters: \[\]
            responses: {'200': {description: "", content: {application/json: {schema: {type: string}}}}}
            tags: \['Health Check'\]
    /v1/maintenance:
        post:
            operationId: MaintenanceController\_maintenanceMode
            parameters: \[\]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/MaintenanceDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SwitchModeResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'maintenance mode switched by Admin \[ADMXXX\]'
            tags: \[Maintenance\]
tags: \[\]
servers: \[\]
components:
    schemas:
        ApiErrorResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code', example: -1, nullable: false}, statusCode: {type: number, description: 'Http status code', example: '400', nullable: false}, errorType: {type: string, description: 'Enum of the error', nullable: false, enum: \[USER\_VERIFICATION\_CODE\_COOLDOWN, USER\_VERIFICATION\_CODE\_UNMATCHED, USER\_INVIATION\_CODE\_INVALID, USER\_NOT\_FOUND, USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP, USER\_NOT\_ADMIN, USER\_UNAUTHORIZED, USER\_EXISTS, USER\_INCORRECT\_UPDATE\_FLAG, ITEM\_EXISTS, ITEM\_NOT\_FOUND, ITEM\_IN\_USE, ITEM\_BOX\_EXISTS, ITEM\_BOX\_NOT\_FOUND, GUILD\_NOT\_FOUND, GUILD\_EXISTS, GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE, GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE, GUILD\_INCORRECT\_UPDATE\_FLAG, GUILD\_INCORRECT\_PRIVILEGE, GUILD\_DUPLICATE\_MEMBER, GUILD\_INFO\_LENGTH\_EXCEEDED, GUILD\_MEMBER\_EXISTS, GUILD\_MAX\_MEMBERS, GUILD\_MAX\_ADMINS, GUILD\_USER\_NOT\_MEMBER, GUILD\_SPOT\_NOT\_FOUND, PHOTO\_NOT\_OWNED\_BY\_YOU, PHOTO\_NO\_LONGER\_ACCESSIBLE, PHOTO\_INVISIBLE, PHOTO\_ALBUM\_FULL, PHOTO\_DUPLICATED\_UPLOAD, PHOTO\_UNPUBLISHABLE, PHOTO\_PENDING\_CENSORSHIP, PHOTO\_BATTLE\_HISTORY\_EXISTS, PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS, PHOTO\_QUALITY\_TOO\_LOW, PHOTO\_PREVIOUS\_DEFEAT, PHOTO\_NOT\_REPORTED, PHOTO\_TAG\_MISMATCH, PHOTO\_TAG\_UNSUPPORTED, PHOTO\_INVALID\_TYPE, PHOTO\_NOT\_FOUND, PHOTO\_APPROVE\_FAILED, PHOTO\_NOT\_ADMIN, PHOTO\_DELETE\_FAILED, PHOTO\_UPLOAD\_FAILED, DECK\_MAX\_LIMIT, DECK\_CAMERA\_MISMATCH, DECK\_CAMERA\_INVALID, DECK\_CAMERA\_EXISTS, DECK\_NOT\_FOUND, DECK\_INCORRECT\_UPDATE\_FLAG, SPOT\_NOT\_FOUND, SPOT\_IS\_EXISTING, SPOT\_ATTRIBUTE\_EXISTS, SPOT\_ATTRIBUTE\_NOT\_FOUND, SPOT\_ATTRIBUTE\_IN\_USE, SPOT\_PHOTO\_EXISTS, SPOT\_INCORRECT\_UPDATE\_FLAG, SPOT\_PHOTO\_ERROR, SPOT\_PHOTO\_NOT\_FOUND, SPOT\_LATITUDE\_LONGITUDE\_REQUIRED, SPOT\_WAEVE\_OUT\_OF\_RANGE, SPOT\_CANNOT\_BE\_DELETED, SPOT\_ALREADY\_CAPTURED, EXPLORER\_INSUFFICIENT\_ENERGY, FLAG\_ALREADY\_CONSTRUCTED, FLAG\_MAX\_LEVEL, FLAG\_NOT\_FOUND, FLAG\_FULL\_ENDURANCE, REACHED\_MAX\_BATTLES, REACHED\_MAX\_STARS, BATTLE\_ALREADY\_SETTLED, BATTLE\_NO\_LONGER\_ACCESSIBLE, BATTLE\_CANNNOT\_BE\_CANCELLED\_YET, REACHED\_MAX\_DAILY\_ENTRIES, BATTLE\_ALREADY\_VOTED, REACHED\_MAX\_BATTLES\_PER\_PHOTO, BATTLE\_ALREADY\_KICKED\_OFF, BATTLE\_ALREADY\_JOINED, BATTLE\_NOT\_YET\_JOINED, BATTLE\_NOT\_JOINABLE\_BY\_BAN, BATTLE\_NOT\_READY, BATTLE\_NOT\_OWNED\_BY\_YOU, BATTLE\_OWNED\_BY\_YOU, BATTLE\_UNFOUND, BATTLE\_ALREADY\_FULL, BATTLE\_PHOTO\_UNPICKED, BATTLE\_PHOTO\_ALREADY\_PICKED, NFT\_OUT\_OF\_STOCK, NFT\_NOT\_OWNED\_BY\_YOU, NFT\_ALREADY\_UNBOXED, NFT\_NOT\_UNBOXED, NFT\_NOT\_ENOUGH\_SKILL\_POINTS, NFT\_NOT\_ENOUGH\_BATTERIES, NFT\_NOT\_ENOUGH\_FILMS, NFT\_REACHED\_MAX\_LEVEL, NFT\_UPGRADE\_COOLDOWN, NFT\_TRANSFER\_COOLDOWN, NFT\_MINT\_COOLDOWN, NFT\_ZERO\_DURABILITY, NFT\_CAMERA\_IS\_NOT\_BROKEN, NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER, NFT\_BATTERY\_FULL, NFT\_ACCESSORY\_SLOTS\_FULL, NFT\_ACCESSORY\_NOT\_EQUIPPED, NFT\_ACCESSORY\_FUSION\_LIMIT, NFT\_ACCESSORY\_IS\_IN\_USE, NFT\_ACCESSORY\_FUSION\_NOT\_SAME, NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR, NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND, NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE, NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE, NFT\_NO\_SKILL\_POINTS\_USED, NFT\_MAX\_ROULETTE\_SPIN, NFT\_SKIN\_ALREADY\_EQUIPPED, NFT\_ACCESSORY\_NOT\_EQUIPPED, NFT\_EXTRA\_SLOT\_IN\_USE, NFT\_INCOMPATIBLE\_TYPE, NFT\_NOT\_FOUND, EXPLORER\_ALREADY\_EXISTS, NFT\_ATTRIBUTE\_EXISTS, NFT\_ATTRIBUTE\_NOT\_FOUND, NFT\_ATTRIBUTE\_IN\_USE, NFT\_CREATION\_FAILED, MINT\_LEVEL\_NOT\_MAX, MINT\_BATTERY\_NOT\_FULL, MINT\_REACHED\_MAX\_COUNT, MINT\_LEFTHAND\_NOT\_MINTABLE, MINT\_RIGHTHAND\_NOT\_MINTABLE, MINT\_LEFTHAND\_BROKEN, MINT\_RIGHTHAND\_BROKEN, MINT\_SCROLL\_INSUFFICIENT, BADGE\_ALREADY\_OWNED, BADGE\_UNPURCHASABLE, BADGE\_RANK\_CANNOT\_BE\_BOOST, BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST, BADGE\_UNSELLABLE, INVENTORY\_ITEM\_UNFOUND, INVENTORY\_ITEM\_OUT\_OF\_PERIOD, INVENTORY\_ITEM\_IN\_USE, INVENTORY\_ITEM\_NOT\_IN\_USE, INVENTORY\_ITEM\_UNEQUIPABLE, BALANCE\_INSUFFICIENT, INSUFFICIENT\_SUPPLY\_OF\_STP, INSUFFICIENT\_SUPPLY\_OF\_SNPT, LIQUIDITIES\_CHANGED, EXTERNAL\_WALLET\_UNFOUND, WITHDRAW\_DAILY\_LIMIT\_REACHED, WITHDRAW\_NOT\_PERMITTED, REVENUECAT\_ERROR, MAIL\_TEMPLATE\_UNFOUND, MAIL\_ATTACHMENT\_EXPIRED, LOOTBOX\_MYSTERY\_SLOTS\_FULL, LOOTBOX\_MYSTERY\_COOLDOWN, GACHA\_UNFOUND, GACHA\_OUT\_OF\_PERIOD, SHOP\_PRODUCT\_UNFOUND, SHOP\_PRODUCT\_CONTENTS\_INVALID, SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED, RENTAL\_NOT\_QUALIFIED, RENTAL\_CONTRACT\_NOT\_FOUND, RENTAL\_CONTRACT\_NOT\_AVAILABLE, RENTAL\_CONTRACT\_ONGOING, RENTAL\_CONTRACT\_TERMINATED, RENTAL\_CAMERAS\_PACK\_IN\_USE, RENTAL\_CAMERAS\_PACK\_NOT\_FOUND, RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU, RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT, RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND, RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL, RENTAL\_CONTRACT\_LIMIT\_REACHED, RENTAL\_NFT\_NOT\_FOUND, RENTAL\_NFT\_IN\_USE, INVALID\_PARAMETER, INVALID\_MIME\_TYPE, UNDER\_MAINTENANCE, UNKNOWN, VALIDATION\_ERROR, IS\_SPAM, RECAPTCHA\_REQUEST\_ERROR, RECAPTCHA\_ACTION\_TYPE\_UNMATCHED, RECAPTCHA\_SCORE\_TOO\_LOW, AUTH\_ERROR, SNPIT\_ERROR\]}, errorMessage: {type: string, description: 'Detail message of the error', example: 'Invalid parameter', nullable: false}}
            required: \[code, statusCode, errorType, errorMessage\]
        ExplorerDTO:
            type: object
            properties: {explorerId: {type: string, description: 'NFT explorer ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'NFT explorer name', example: 'Explorer Name', nullable: false, maxLength: 50}, explorerDescription: {type: string, description: 'NFT explorer description', example: 'Explorer Description', nullable: true, maxLength: 200}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: 'https://picsum.photos/300/200', nullable: false}, explorerCategory: {type: string, description: 'Category of NFT explorer', nullable: false, enum: \[NORMAL, CLIMBER, HUNTER, DIVER\]}, fullEnergy: {type: number, description: 'The full energy of NFT explorer', example: 100, nullable: false}, energy: {type: number, description: 'Current available energy of NFT explorer', example: 100, nullable: false, minimum: 0, maximum: 10000}, rarity: {type: string, description: 'Rarity of NFT explorer', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, energyConsumption: {type: number, description: 'Energy consumption of NFT explorer when used', example: 10, nullable: false, minimum: 0, maximum: 100}, range: {type: number, description: 'Range of NFT explorer', example: 10, nullable: false, minimum: 0, maximum: 1000}, rangeBuff: {type: number, description: 'Additional range buff from Guild deck parameter', example: 10, nullable: false, minimum: 0, maximum: 1000}, decoyFinding: {type: boolean, description: 'Decoy finding ability of NFT explorer. True if the explorer can distinguish decoys from real spots', example: true, nullable: false}, totalSearch: {type: number, description: 'Number of searches the NFT explorer has performed. This is a cumulative count', example: 3, nullable: false}, totalSpotFound: {type: number, description: 'Number of spots the NFT explorer has found. This is a cumulative count', example: 3, nullable: false}}
            required: \[explorerId, tokenId, explorerName, explorerImage, explorerCategory, fullEnergy, energy, rarity, energyConsumption, range, rangeBuff, decoyFinding, totalSearch, totalSpotFound\]
        ExplorerListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT explorers', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerDTO'}}}
            required: \[code, data\]
        CreateExplorerRequestAdminDTO:
            type: object
            properties: {tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'Name of NFT explorer', example: 'Explorer Name', nullable: false, maxLength: 50}, explorerDescription: {type: string, description: 'Description of NFT explorer', example: 'Explorer Description', nullable: true, maxLength: 200}, explorerAttributeId: {type: string, description: 'ID of NFT explorer attribute', example: 12345678-1234-1234-1234-123456789012, nullable: false}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: 'https://picsum.photos/300/200', nullable: false}, explorerCategory: {type: string, description: 'Category of NFT explorer', nullable: false, enum: \[NORMAL, CLIMBER, HUNTER, DIVER\]}}
            required: \[tokenId, explorerName, explorerAttributeId, explorerImage, explorerCategory\]
        EmptyResponseSchema:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {type: string, description: 'Response message', example: Success, nullable: false}}
            required: \[code, data\]
        ExplorerAttributeAdminDTO:
            type: object
            properties: {explorerAttributeId: {type: string, description: 'NFT Explorer Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Explorer Attribute Rarity', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false, minimum: 100, maximum: 10000}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false, minimum: 0, maximum: 100}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false, minimum: 0, maximum: 1000}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}, active: {type: boolean, description: 'NFT Explorer Attribute Active Status', example: true, nullable: false}}
            required: \[explorerAttributeId, attributeName, rarity, initialEnergy, energyConsumption, range, decoyFinding, active\]
        ExplorerAttributeListResponseAdminDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT Explorer Attributes', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerAttributeAdminDTO'}}}
            required: \[code, data\]
        CreateExplorerAttributeRequestAdminDTO:
            type: object
            properties: {attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Explorer Attribute Rarity', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, rarityCode: {type: string, description: 'Rarity Code of the explorer attribute', example: '1', nullable: false}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false, minimum: 100, maximum: 10000}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false, minimum: 0, maximum: 100}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false, minimum: 0, maximum: 1000}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}}
            required: \[attributeName, rarity, rarityCode, initialEnergy, energyConsumption, range, decoyFinding\]
        AuthEmailRequestDTO:
            type: object
            properties: {email: {type: string, description: 'email address', example: test@gmail.com, nullable: false}}
            required: \[email\]
        SendCodeResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {type: string, description: 'success message', example: 'OTA was sent to your in-app inbox.', nullable: false}}
            required: \[code, data\]
        AuthLoginRequestDTO:
            type: object
            properties: {email: {type: string, description: 'email address', example: test@gmail.com, nullable: false}, code: {type: string, description: 'auth code', example: '1234', nullable: false}}
            required: \[email, code\]
        AuthLoginDTO:
            type: object
            properties: {accessToken: {type: string, description: SNPIT認証成功後に払い出されるJWTトークン, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3MjU0MDgwMCwiZXhwIjoxNjcyNjI3MjAwfQ, nullable: false}, isExistingUser: {type: boolean, description: 新規ユーザーかどうか, example: false, nullable: false}}
            required: \[accessToken, isExistingUser\]
        AuthLoginResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'return access token', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/AuthLoginDTO'}\]}}
            required: \[code, data\]
        AuthLogoutRequestDTO:
            type: object
            properties: {uuid: {type: string, description: uuid, nullable: false}, jwt: {type: string, description: jwt, nullable: true}}
            required: \[uuid\]
        AuthLogoutDTO:
            type: object
            properties: {message: {type: string, example: 'delete session uuid:\[uuid\]', nullable: false}}
            required: \[message\]
        AuthLogoutResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'return delete uuid', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/AuthLogoutDTO'}\]}}
            required: \[code, data\]
        CameraDTO:
            type: object
            properties: {cameraId: {type: string, description: 'Token Id of the camera', example: '1234567890', nullable: false}, cameraUrl: {type: string, description: 'Camera Url', example: 'https://picsum.photos/300/200', nullable: false}, rarity: {type: string, description: 'Camera rarity', nullable: false}, displayRarity: {type: string, description: 'Display camera rarity for free camera. Use label is not null, else use rarity', nullable: false}, level: {type: number, description: 'Camera level', example: 1, nullable: false}, searchQ: {type: number, description: 'Search radius of NFT Explorer', example: 1, nullable: false}, attackE: {type: number, description: 'Damage when attacking NFT Flag', example: 1, nullable: false}, luckL: {type: number, description: 'Critical hit chance when attacking NFT Flag', example: 1, nullable: false}, defenseB: {type: number, description: 'Improve the endurance of NFT Flag', example: 1, nullable: false}}
            required: \[cameraId, cameraUrl, rarity, displayRarity, level, searchQ, attackE, luckL, defenseB\]
        DeckDTO:
            type: object
            properties: {deckId: {type: string, description: 'Deck Id', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, userId: {type: string, description: 'User Id', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, deckName: {type: string, description: 'Deck name', example: 'Deck 1', nullable: false, maxLength: 50}, deckDescription: {type: string, description: 'Deck Description', example: 'New deck', nullable: true, maxLength: 200}, deckImage: {type: string, description: 'Deck Image', example: 'https://picsum.photos/300/200', nullable: true}, deckStatus: {type: string, description: 'Deck Status', nullable: false, enum: \[NEW, SELECTED, UNSELECTED\]}, searchQ: {type: number, description: 'Search radius of NFT Explorer', example: 1, nullable: false}, attackE: {type: number, description: 'Damage when attacking NFT Flag', example: 1, nullable: false}, luckL: {type: number, description: 'Critical hit chance when attacking NFT Flag', example: 1, nullable: false}, defenseB: {type: number, description: 'Improve the endurance of NFT Flag', example: 1, nullable: false}, deckCameras: {description: 'Cameras on deck', nullable: false, type: array, items: {$ref: '#/components/schemas/CameraDTO'}}, deckNftExplorers: {description: 'NFT Explorer Ids', example: \['1234567890', '1234567891', '1234567892', '1234567893'\], nullable: false, type: array, items: {type: string}}}
            required: \[deckId, userId\]
        GetDeckResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of decks', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: \[code, data\]
        CreateDeckRequestDTO:
            type: object
            properties: {deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false, maxLength: 50}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true, maxLength: 200}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorers: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
            required: \[deckName, deckCameras\]
        UpdateDeckCameraRequestDTO:
            type: object
            properties: {deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
        UpdateDeckInfoRequestDTO:
            type: object
            properties: {deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false, maxLength: 50}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true, maxLength: 200}, deckImage: {type: string, description: 'Deck Image', example: 'https://picsum.photos/300/200', nullable: true}}
        CameraListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'The list of cameras', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/CameraDTO'}}}
            required: \[code, data\]
        FlagDTO:
            type: object
            properties: {flagId: {type: string, description: 'NFT flag ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, spotId: {type: string, description: 'Spot ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT flag', example: '800012345678', nullable: false}, flagName: {type: string, description: 'NFT flag name', example: 'Flag Name', nullable: false, maxLength: 50}, flagDescription: {type: string, description: 'NFT flag description', example: 'Flag Description', nullable: true, maxLength: 200}, flagImage: {type: string, description: 'Image of NFT flag explorer (URL)', example: 'https://picsum.photos/300/200', nullable: false}, flagCategory: {type: string, description: 'Category of NFT flag', nullable: false, enum: \[NORMAL, SPECIAL\]}, flagStatus: {type: string, description: 'Status of NFT flag', nullable: false, enum: \[NEW, CONSTRUCTED, DESTROYED\]}, level: {type: number, description: 'Current level of NFT flag', example: 1, nullable: false, minimum: 1, maximum: 99}, fullEndurance: {type: number, description: ' Full endurance of NFT flag', example: 100, nullable: false}, endurance: {type: number, description: 'Current endurance of NFT flag', example: 10, nullable: false, minimum: 0, maximum: 1000}, defended: {type: number, description: 'The number of defenses against attacks from other guilds', example: 1, nullable: false}, rarity: {type: string, description: 'Rarity of NFT flag', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, flagIncome: {type: number, description: 'Income of NFT flag', example: 10, nullable: false}, leftHandId: {type: string, description: 'Token ID of NFT flag on left minted from', example: '80011245678', nullable: true}, rightHand: {type: string, description: 'Token ID of NFT flag on right minted from', example: '800112345678', nullable: true}}
            required: \[flagId, spotId, tokenId, flagName, flagImage, flagCategory, flagStatus, level, fullEndurance, endurance, defended, rarity, flagIncome\]
        FlagListResponseAdminDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT flags', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: \[code, data\]
        CreateFlagRequestDTO:
            type: object
            properties: {tokenId: {type: string, description: 'Token ID of NFT flag', example: '800012345678', nullable: false}, flagName: {type: string, description: 'Name of NFT flag', example: 'Flag Name', nullable: false, maxLength: 50}, flagDescription: {type: string, description: 'Description of NFT flag', example: 'Flag Description', nullable: true, maxLength: 200}, flagAttributeId: {type: string, description: 'ID of NFT flag attribute', example: 12345678-1234-1234-1234-123456789012, nullable: false}, flagImage: {type: string, description: 'Image of NFT flag (URL)', example: 'https://picsum.photos/300/200', nullable: false}, flagCategory: {type: string, description: 'Category of NFT flag', nullable: false, enum: \[NORMAL, SPECIAL\]}}
            required: \[tokenId, flagName, flagAttributeId, flagImage, flagCategory\]
        FlagAttributeAdminDTO:
            type: object
            properties: {flagAttributeId: {type: string, description: 'NFT Flag Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Flag Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Flag Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Flag Attribute Rarity', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, initialEndurance: {type: number, description: 'NFT Flag Attribute Initial Endurance', example: 10, nullable: false, minimum: 10, maximum: 1000}, enduranceIncrement: {type: number, description: 'NFT Flag Attribute Endurance increased per level', example: 10, nullable: false, minimum: 5, maximum: 100}, flagIncome: {type: number, description: 'NFT Flag Attribute STP Income', example: 10, nullable: false, minimum: 0, maximum: 100}}
            required: \[flagAttributeId, attributeName, rarity, initialEndurance, enduranceIncrement, flagIncome\]
        FlagAttributeListResponseAdminDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'NFT Flag Attributes', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagAttributeAdminDTO'}}}
            required: \[code, data\]
        CreateFlagAttributeRequestAdminDTO:
            type: object
            properties: {attributeName: {type: string, description: 'NFT Flag Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Flag Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Flag Attribute Rarity', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, rarityCode: {type: string, description: 'Rarity Code of the flag attribute', example: '1', nullable: false}, initialEndurance: {type: number, description: 'NFT Flag Attribute Initial Endurance', example: 10, nullable: false, minimum: 10, maximum: 1000}, enduranceIncrement: {type: number, description: 'NFT Flag Attribute Endurance increased per level', example: 10, nullable: false, minimum: 5, maximum: 100}, flagIncome: {type: number, description: 'NFT Flag Attribute STP Income', example: 10, nullable: false, minimum: 0, maximum: 100}}
            required: \[attributeName, rarity, rarityCode, initialEndurance, enduranceIncrement, flagIncome\]
        ItemDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemAbility: {type: string, description: 'Item Ability', example: 'The detail of the item ability', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: \[NEW, ACTIVE, INACTIVE, DELETED\]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: \[DECOY\_SPOT, FLAG\_REPAIR, HEAL\_EXPLORER, SCOUT\_SPOT\_ENDURANCE\]}}
            required: \[itemId, itemName, itemPrice, itemStatus, itemCategory\]
        GetItemsResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of items', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ItemDTO'}}}
            required: \[code, data\]
        CreateItemRequestDTO:
            type: object
            properties: {itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemAbility: {type: string, description: 'Item Ability', example: 'The detail of the item ability', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: \[NEW, ACTIVE, INACTIVE, DELETED\]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: \[DECOY\_SPOT, FLAG\_REPAIR, HEAL\_EXPLORER, SCOUT\_SPOT\_ENDURANCE\]}}
            required: \[itemName, itemPrice, itemStatus, itemCategory\]
        GiveItemRequestDTO:
            type: object
            properties: {userId: {type: string, description: 'User ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, quantity: {type: number, description: 'Quantity of the item', example: 1, nullable: false}}
            required: \[userId, itemId\]
        UpdateItemRequestDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: \[NEW, ACTIVE, INACTIVE, DELETED\]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: \[DECOY\_SPOT, FLAG\_REPAIR, HEAL\_EXPLORER, SCOUT\_SPOT\_ENDURANCE\]}}
            required: \[itemId\]
        ItemBoxDTO:
            type: object
            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false, maxLength: 50}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true, maxLength: 200}, rarity: {type: string, description: 'Item Box Rarity', nullable: false, enum: \[COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, itemBoxImage: {type: string, description: 'Item Box Image', example: 'https://picsum.photos/300/200', nullable: true}, itemBoxStatus: {type: string, description: 'Status of the item box', nullable: false, enum: \[HIDDEN, SHOWN, BOXED\]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 35.654444, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: 139.8754444, nullable: false}}
            required: \[itemBoxId, itemBoxName, rarity, itemBoxStatus, itemBoxLatitude, itemBoxLongitude\]
        GetItemBoxResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of item boxes', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ItemBoxDTO'}}}
            required: \[code, data\]
        CreateItemBoxRequestDTO:
            type: object
            properties: {itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false, maxLength: 50}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true, maxLength: 200}, itemBoxRarity: {type: string, description: 'Item Box rarity', nullable: true, enum: \[COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 35.654444, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: 139.8754444, nullable: false}}
            required: \[itemBoxName, itemBoxLatitude, itemBoxLongitude\]
        SpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: \[NEW, PENDING, CAPTURED, FREE, DELETED\]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: \[NORMAL, DECOY, FLAG\]}}
            required: \[spotId, spotName, spotStatus, rarity, photoId, photoUrl, spotLatitude, spotLongitude, spotAddress, spotType\]
        SpotListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of spots.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/SpotDTO'}}}
            required: \[code, data\]
        CreateSpotRequestDTO:
            type: object
            properties: {spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true, maxLength: 100}, spotAttributeId: {type: string, description: 'ID of spot attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}}
            required: \[spotName, spotLatitude, spotLongitude, spotAttributeId\]
        UpdateSpotInfoRequestDTO:
            type: object
            properties: {spotAttributeId: {type: string, description: 'ID of the attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true, maxLength: 100}}
        UpdateSpotPhotoRequestDTO:
            type: object
            properties: {photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}}
            required: \[photoId\]
        SpotAtributeDTO:
            type: object
            properties: {spotAttributeId: {type: string, description: 'Attribute ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}}
            required: \[spotAttributeId, attributeName, rarity, autoIncome, attackIncome\]
        SpotAtributeListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of spot attributes.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/SpotAtributeDTO'}}}
            required: \[code, data\]
        CreateSpotAttributeRequestDTO:
            type: object
            properties: {attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'Description of the attribute', example: 'A detailed description of the attribute', nullable: true, maxLength: 200}, rarity: {type: string, description: 'Rarity of the attribute', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, rarityCode: {type: string, description: 'Rarity Code of the spot attribute', example: '1', nullable: false}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}}
            required: \[attributeName, rarity, rarityCode, autoIncome, attackIncome\]
        SearchRequestDTO:
            type: object
            properties: {explorerSearchType: {type: string, description: 'Type of the search', nullable: false, enum: \[ITEM\_BOX, SPOT, ITEM\_BOX\_AND\_SPOT\]}, explorerLongitude: {type: number, description: 'Longitude of the user', example: 40.7128, nullable: false}, explorerLatitude: {type: number, description: 'Latitude of the user', example: -74.006, nullable: false}}
            required: \[explorerSearchType, explorerLongitude, explorerLatitude\]
        SearchResultDTO:
            type: object
            properties: {spotList: {description: 'List of the Spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotDTO'}}, itemBoxList: {description: 'List of the Item Box', nullable: false, type: array, items: {$ref: '#/components/schemas/ItemBoxDTO'}}}
            required: \[spotList, itemBoxList\]
        SearchResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'NFT explorer search result', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/SearchResultDTO'}\]}}
            required: \[code, data\]
        FlagListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT flags', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: \[code, data\]
        GuildMemberDto:
            type: object
            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, username: {type: string, description: Username., example: 'User 1', nullable: false}, role: {type: string, description: 'Role of the guild member.', nullable: false, enum: \[OWNER, ADMIN, MEMBER\]}, memberStatus: {type: string, description: 'Status of the guild member.', nullable: false, enum: \[INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED\]}, teamId: {type: string, description: 'TBD: Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, avatar: {type: string, description: 'Avatar URL of the user', example: 'https://picsum.photos/300/200', nullable: true}, decks: {description: 'List of guild member deck.', nullable: false, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: \[userId, username, role\]
        GuildDto:
            type: object
            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildStatus: {type: string, description: 'Status of the guild.', nullable: false, enum: \[ACTIVE, INACTIVE, DELETED\]}, guildMembersCount: {type: number, description: 'Total number of guild members.', example: 30, nullable: false}, userStatusInGuild: {type: string, description: 'Status of user in guild.', nullable: false, enum: \[INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED\]}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}, gp: {type: number, description: 'Guild point (GPT)', example: 100, nullable: false}, searchQ: {type: number, description: 'Search radius of NFT Explorer', example: 1, nullable: false}, attackE: {type: number, description: 'Damage when attacking NFT Flag', example: 1, nullable: false}, luckL: {type: number, description: 'Critical hit chance when attacking NFT Flag', example: 1, nullable: false}, defenseB: {type: number, description: 'Improve the endurance of NFT Flag', example: 1, nullable: false}, guildMembers: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
            required: \[guildId, guildName, guildOwner, guildMembersCount, userStatusInGuild\]
        GuildInfoResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Guild information.', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/GuildDto'}\]}}
            required: \[code, data\]
        UpdateGuildInfoRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Guild name', example: 'Guild Name', nullable: true, maxLength: 50}, guildDescription: {type: string, description: 'Guild description', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: 'Avatar of the guild', example: 'https://picsum.photos/300/200', nullable: true}, guildBanner: {type: string, description: 'Banner of the guild', example: 'https://picsum.photos/300/200', nullable: true}}
        CreateGuildRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}}
            required: \[guildName\]
        GuildSpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: \[NEW, PENDING, CAPTURED, FREE, DELETED\]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: \[NORMAL, DECOY, FLAG\]}, guildSpotStatus: {type: string, description: 'Guild spot status', nullable: false, enum: \[CAPTURED, FOUND, DECOY, REMOVED\]}}
            required: \[spotId, spotName, spotStatus, rarity, photoId, photoUrl, spotLatitude, spotLongitude, spotAddress, spotType, guildSpotStatus\]
        GuildSpotsResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of guild spots.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/GuildSpotDTO'}}}
            required: \[code, data\]
        SpotPhotoDTO:
            type: object
            properties: {photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'Spot Photo', nullable: false, maxLength: 255}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful spot photo', nullable: true, maxLength: 1024}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}, photoType: {type: string, description: 'Type of the photo', nullable: false, enum: \[ADMIN\_PHOTOS, USER\_PHOTOS, DECOY\_PHOTOS\]}, photoStatus: {type: string, description: 'Status of the photo', nullable: false, enum: \[NEW, APPROVED, VALIDATED, BANNED, DELETED\]}, guildId: {type: string, description: 'ID of the guild', example: '1234567890', nullable: true}}
            required: \[photoId, photoName, photoUrl, photoType, photoStatus\]
        GuildSpotDetailDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: \[NEW, PENDING, CAPTURED, FREE, DELETED\]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: \[NORMAL, DECOY, FLAG\]}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}, guildSpotStatus: {type: string, description: 'Guild spot status', nullable: false, enum: \[CAPTURED, FOUND, DECOY, REMOVED\]}, incomeBuff: {type: number, description: 'Additional income buff from Guild deck parameter', example: 100, nullable: false}, flags: {description: 'Flag list of the guild spot.', nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: \[spotId, spotName, spotStatus, rarity, spotLatitude, spotLongitude, spotAddress, spotType, autoIncome, attackIncome, spotPhotos, guildSpotStatus, incomeBuff, flags\]
        GuildSpotDetailResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Spot information including flags.', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/GuildSpotDetailDTO'}\]}}
            required: \[code, data\]
        GuildFlagsResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of guild flags.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: \[code, data\]
        UserDto:
            type: object
            properties: {userId: {type: string, description: 'The id of the user', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the user', example: user1, nullable: false}, email: {type: string, description: 'The email of the user', example: guild@gmail.com, nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, stpAmount: {type: number, description: 'Amount of STP that user has', example: 100, nullable: false}, profilePicture: {type: string, description: 'Profile picture of the user (URL)', example: 'https://picsum.photos/300/200', nullable: true}, guildId: {type: string, description: 'Guild Id of the user', example: '1234567890', nullable: true}, userStatus: {type: string, description: 'Status of the user.', nullable: false, enum: \[NEW, INACTIVE, DELETED, BANNED\]}, decks: {description: 'Deck of the users', nullable: true, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: \[userId, email\]
        UserResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'The user details', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/UserDto'}\]}}
            required: \[code, data\]
        UserNftsDTO:
            type: object
            properties: {explorers: {description: 'NftExplorer of the user', nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerDTO'}}, flags: {description: 'NftFlags of the user', nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: \[explorers, flags\]
        GetUserNftsResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of items belong to user', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/UserNftsDTO'}\]}}
            required: \[code, data\]
        WalletDTO:
            type: object
            properties: {walletAddress: {type: string, description: 'The wallet address', example: '0x1234567890', nullable: true}, stpAmount: {type: number, description: 'STP (Currency in the game) balance', example: 100, nullable: false}, stpPrecision: {type: number, description: 'STP (Currency in the game) precision', example: 18, nullable: false}, snptAmount: {type: number, description: 'SNTP (Cryptocurrency) balance', example: 100, nullable: false}, snptPrecision: {type: number, description: 'SNTP (Cryptocurrency) precision', example: 18, nullable: false}, fpAmount: {type: number, description: 'FP (Free Point) balance', example: 100, nullable: false}, fpPrecision: {type: number, description: 'FP (Free Point) precision', example: 18, nullable: false}}
            required: \[walletAddress, stpAmount, stpPrecision, snptAmount, snptPrecision, fpAmount, fpPrecision\]
        WalletBalanceResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'The wallet balance details', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/WalletDTO'}\]}}
            required: \[code, data\]
        SpotDetailDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: \[NEW, PENDING, CAPTURED, FREE, DELETED\]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: \[CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY\]}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: \[NORMAL, DECOY, FLAG\]}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}}
            required: \[spotId, spotName, spotStatus, rarity, spotLatitude, spotLongitude, spotAddress, spotType, autoIncome, attackIncome, spotPhotos\]
        SpotDetailResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Detail information of the spot.', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/SpotDetailDTO'}\]}}
            required: \[code, data\]
        WaeveRequestDTO:
            type: object
            properties: {photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, userLatitude: {type: number, description: 'Latitude of the user', example: 35.65555, nullable: false}, userLongitude: {type: number, description: 'Longitude of the user', example: 139.875555, nullable: false}}
            required: \[photoId, userLatitude, userLongitude\]
        WaeveDTO:
            type: object
            properties: {isAcquired: {type: boolean, description: 'Result of the waeve if spot could get acquired or not', example: true, nullable: false}, message: {type: string, description: 'Message of the waeve result', example: 'Spot is acquired', nullable: false}}
            required: \[isAcquired, message\]
        WaeveResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Result of the waeve.', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/WaeveDTO'}\]}}
            required: \[code, data\]
        UpdateGuildMemberRoleRequestDTO:
            type: object
            properties: {role: {type: string, description: 'Role of the guild member.', nullable: false, enum: \[OWNER, ADMIN, MEMBER\]}}
        UserItemsDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemAbility: {type: string, description: 'Item Ability', example: 'The detail of the item ability', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: \[NEW, ACTIVE, INACTIVE, DELETED\]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: \[DECOY\_SPOT, FLAG\_REPAIR, HEAL\_EXPLORER, SCOUT\_SPOT\_ENDURANCE\]}, itemQuantity: {type: number, description: 'Quantity of the item', example: 10, nullable: false}}
            required: \[itemId, itemName, itemPrice, itemStatus, itemCategory, itemQuantity\]
        GetUserItemsResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of items belong to user', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/UserItemsDTO'}}}
            required: \[code, data\]
        UseDecoyRequestDTO:
            type: object
            properties: {spotId: {type: string, description: 'The id of the item', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, decoyLatitude: {type: number, description: 'Latitude of the decoy', example: 37.123456, nullable: false}, decoyLongitude: {type: number, description: 'Longitude of the decoy', example: -121.123456, nullable: false}}
            required: \[spotId, decoyLatitude, decoyLongitude\]
        ScoutSpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'The id of the spot', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, spotName: {type: string, description: 'The name of the spot', example: Spot1, nullable: false}, spotEndurance: {type: number, description: 'The endurance of the spot', example: 20, nullable: false}}
            required: \[spotId, spotName, spotEndurance\]
        GetSpotEnduranceResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Result of scout the spot', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/ScoutSpotDTO'}\]}}
            required: \[code, data\]
        OpenBoxRequestDTO:
            type: object
            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, userLatitute: {type: number, description: 'User latitude', example: 35.654444, nullable: false}, userLongitude: {type: number, description: 'User longitude', example: 139.8754444, nullable: false}}
            required: \[itemBoxId, userLatitute, userLongitude\]
        OpenBoxResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Opened item box', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ItemDTO'}}}
            required: \[code, data\]
        NftAttributes:
            type: object
            properties: {trait\_type: {type: string, description: 'The trait type of the NFT', example: Rarity, nullable: false}, value: {type: string, description: 'The value of the NFT', example: COMMON, nullable: false}, trait\_display\_type: {type: string, description: 'The display type of the NFT', example: number, nullable: true}}
            required: \[trait\_type, value\]
        NftMetadata:
            type: object
            properties: {name: {type: string, description: 'The name of the NFT', example: Explorer, nullable: false}, description: {type: string, description: 'The description of the NFT', example: 'A NFT that explores the world', nullable: true}, image: {type: string, description: 'The image of the NFT', example: 'https://picsum.photos/300/200', nullable: false}, attributes: {description: 'The attributes of the NFT', nullable: false, type: array, items: {$ref: '#/components/schemas/NftAttributes'}}}
            required: \[name, image, attributes\]
        PhotoDTO:
            type: object
            properties: {photoId: {type: string, description: 'Hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'Picture 1', nullable: false, maxLength: 255}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}}
            required: \[photoId, photoName, photoUrl\]
        PhotoListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of photos data', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/PhotoDTO'}}}
            required: \[code, data\]
        UploadPhotoRequestForYaml:
            type: object
            properties: {file: {type: string, description: 'Binary file data', format: binary}, type: {type: string, description: 'ADMIN\_PHOTOS, USER\_PHOTOS, DECOY\_PHOTOSの三種類のみ。flutterのSDKの関係で、ENUM型ではなく文字列で定義する。'}, latitute: {type: number, description: 'Latitude of the photo location', example: 35.65555}, longitude: {type: number, description: 'Longitude of the photo location', example: 139.875555}}
            required: \[file, type, latitute, longitude\]
        PhotoUploadDTO:
            type: object
            properties: {photoId: {type: string, description: 'Hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, message: {type: string, description: 'Message associated with the photo', example: 'A beautiful sunset', nullable: true}}
            required: \[photoId\]
        PhotoUploadResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Photo data', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/PhotoUploadDTO'}\]}}
            required: \[code, data\]
        MaintenanceDTO:
            type: object
            properties: {isMaintenance: {type: boolean, description: 'maintenance mode flag: true for maintenance mode and false for normal mode', example: true, nullable: false}, minVer: {type: string, description: 'update minimum\_app\_version', example: 0.0.1, nullable: true}}
            required: \[isMaintenance\]
        SwitchModeSuccessDTO:
            type: object
            properties: {message: {type: string, example: 'Maintenance mode is off', nullable: false}}
            required: \[message\]
        SwitchModeResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'return response', example: Success, nullable: false, allOf: \[{$ref: '#/components/schemas/SwitchModeSuccessDTO'}\]}}
            required: \[code, data\]

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api\_error\_response\_dto.dart';

// \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
// BuiltValueGenerator
// \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_VERIFICATION\_CODE\_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_VERIFICATION\_CODE\_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_VERIFICATION\_CODE\_UNMATCHED =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'USER\_VERIFICATION\_CODE\_UNMATCHED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_INVIATION\_CODE\_INVALID =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_INVIATION\_CODE\_INVALID');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_ADMIN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_NOT\_ADMIN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_UNAUTHORIZED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_UNAUTHORIZED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_USER\_INCORRECT\_UPDATE\_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum.\_('USER\_INCORRECT\_UPDATE\_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('ITEM\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('ITEM\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('ITEM\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_BOX\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('ITEM\_BOX\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_BOX\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('ITEM\_BOX\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_UPDATE\_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_INCORRECT\_UPDATE\_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_PRIVILEGE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_INCORRECT\_PRIVILEGE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_DUPLICATE\_MEMBER =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_DUPLICATE\_MEMBER');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INFO\_LENGTH\_EXCEEDED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_INFO\_LENGTH\_EXCEEDED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MEMBER\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_MEMBER\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MAX\_MEMBERS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_MAX\_MEMBERS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MAX\_ADMINS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_MAX\_ADMINS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_USER\_NOT\_MEMBER =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_USER\_NOT\_MEMBER');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_SPOT\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GUILD\_SPOT\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_OWNED\_BY\_YOU =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_NOT\_OWNED\_BY\_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NO\_LONGER\_ACCESSIBLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_NO\_LONGER\_ACCESSIBLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_INVISIBLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_INVISIBLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_ALBUM\_FULL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_ALBUM\_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_DUPLICATED\_UPLOAD =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_DUPLICATED\_UPLOAD');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_UNPUBLISHABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_UNPUBLISHABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_PENDING\_CENSORSHIP =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_PENDING\_CENSORSHIP');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_BATTLE\_HISTORY\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_BATTLE\_HISTORY\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_QUALITY\_TOO\_LOW =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_QUALITY\_TOO\_LOW');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_PREVIOUS\_DEFEAT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_PREVIOUS\_DEFEAT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_REPORTED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_NOT\_REPORTED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_TAG\_MISMATCH =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_TAG\_MISMATCH');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_TAG\_UNSUPPORTED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_TAG\_UNSUPPORTED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_INVALID\_TYPE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_INVALID\_TYPE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_APPROVE\_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_APPROVE\_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_ADMIN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_NOT\_ADMIN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_DELETE\_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_DELETE\_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_UPLOAD\_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('PHOTO\_UPLOAD\_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_MAX\_LIMIT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('DECK\_MAX\_LIMIT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_MISMATCH =
    const ApiErrorResponseDTOErrorTypeEnum.\_('DECK\_CAMERA\_MISMATCH');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_INVALID =
    const ApiErrorResponseDTOErrorTypeEnum.\_('DECK\_CAMERA\_INVALID');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('DECK\_CAMERA\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('DECK\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_INCORRECT\_UPDATE\_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum.\_('DECK\_INCORRECT\_UPDATE\_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_IS\_EXISTING =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_IS\_EXISTING');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_ATTRIBUTE\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_ATTRIBUTE\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_ATTRIBUTE\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_PHOTO\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_INCORRECT\_UPDATE\_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_INCORRECT\_UPDATE\_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_PHOTO\_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_PHOTO\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_LATITUDE\_LONGITUDE\_REQUIRED =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'SPOT\_LATITUDE\_LONGITUDE\_REQUIRED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_WAEVE\_OUT\_OF\_RANGE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_WAEVE\_OUT\_OF\_RANGE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_CANNOT\_BE\_DELETED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_CANNOT\_BE\_DELETED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ALREADY\_CAPTURED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SPOT\_ALREADY\_CAPTURED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_EXPLORER\_INSUFFICIENT\_ENERGY =
    const ApiErrorResponseDTOErrorTypeEnum.\_('EXPLORER\_INSUFFICIENT\_ENERGY');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_ALREADY\_CONSTRUCTED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('FLAG\_ALREADY\_CONSTRUCTED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_MAX\_LEVEL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('FLAG\_MAX\_LEVEL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('FLAG\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_FULL\_ENDURANCE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('FLAG\_FULL\_ENDURANCE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_BATTLES =
    const ApiErrorResponseDTOErrorTypeEnum.\_('REACHED\_MAX\_BATTLES');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_STARS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('REACHED\_MAX\_STARS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_SETTLED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_ALREADY\_SETTLED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NO\_LONGER\_ACCESSIBLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_NO\_LONGER\_ACCESSIBLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_CANNNOT\_BE\_CANCELLED\_YET =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_CANNNOT\_BE\_CANCELLED\_YET');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_DAILY\_ENTRIES =
    const ApiErrorResponseDTOErrorTypeEnum.\_('REACHED\_MAX\_DAILY\_ENTRIES');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_VOTED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_ALREADY\_VOTED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_BATTLES\_PER\_PHOTO =
    const ApiErrorResponseDTOErrorTypeEnum.\_('REACHED\_MAX\_BATTLES\_PER\_PHOTO');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_KICKED\_OFF =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_ALREADY\_KICKED\_OFF');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_JOINED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_ALREADY\_JOINED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_YET\_JOINED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_NOT\_YET\_JOINED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_JOINABLE\_BY\_BAN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_NOT\_JOINABLE\_BY\_BAN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_READY =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_NOT\_READY');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_OWNED\_BY\_YOU =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_NOT\_OWNED\_BY\_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_OWNED\_BY\_YOU =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_OWNED\_BY\_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_FULL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_ALREADY\_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_PHOTO\_UNPICKED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_PHOTO\_UNPICKED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_PHOTO\_ALREADY\_PICKED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BATTLE\_PHOTO\_ALREADY\_PICKED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_OUT\_OF\_STOCK =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_OUT\_OF\_STOCK');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_OWNED\_BY\_YOU =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_OWNED\_BY\_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ALREADY\_UNBOXED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ALREADY\_UNBOXED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_UNBOXED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_UNBOXED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_SKILL\_POINTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_ENOUGH\_SKILL\_POINTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_BATTERIES =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_ENOUGH\_BATTERIES');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_FILMS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_ENOUGH\_FILMS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_REACHED\_MAX\_LEVEL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_REACHED\_MAX\_LEVEL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_UPGRADE\_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_UPGRADE\_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_TRANSFER\_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_TRANSFER\_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_MINT\_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_MINT\_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ZERO\_DURABILITY =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ZERO\_DURABILITY');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_CAMERA\_IS\_NOT\_BROKEN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_CAMERA\_IS\_NOT\_BROKEN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_BATTERY\_FULL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_BATTERY\_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_SLOTS\_FULL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ACCESSORY\_SLOTS\_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_NOT\_EQUIPPED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ACCESSORY\_NOT\_EQUIPPED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_LIMIT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ACCESSORY\_FUSION\_LIMIT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_IS\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ACCESSORY\_IS\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_NOT\_SAME =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ACCESSORY\_FUSION\_NOT\_SAME');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NO\_SKILL\_POINTS\_USED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NO\_SKILL\_POINTS\_USED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_MAX\_ROULETTE\_SPIN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_MAX\_ROULETTE\_SPIN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_SKIN\_ALREADY\_EQUIPPED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_SKIN\_ALREADY\_EQUIPPED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_NOT\_EQUIPPED2 =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ACCESSORY\_NOT\_EQUIPPED2');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_EXTRA\_SLOT\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_EXTRA\_SLOT\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_INCOMPATIBLE\_TYPE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_INCOMPATIBLE\_TYPE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_EXPLORER\_ALREADY\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('EXPLORER\_ALREADY\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ATTRIBUTE\_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ATTRIBUTE\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_ATTRIBUTE\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_CREATION\_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('NFT\_CREATION\_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEVEL\_NOT\_MAX =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_LEVEL\_NOT\_MAX');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_BATTERY\_NOT\_FULL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_BATTERY\_NOT\_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_REACHED\_MAX\_COUNT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_REACHED\_MAX\_COUNT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEFTHAND\_NOT\_MINTABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_LEFTHAND\_NOT\_MINTABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_RIGHTHAND\_NOT\_MINTABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_RIGHTHAND\_NOT\_MINTABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEFTHAND\_BROKEN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_LEFTHAND\_BROKEN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_RIGHTHAND\_BROKEN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_RIGHTHAND\_BROKEN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_SCROLL\_INSUFFICIENT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MINT\_SCROLL\_INSUFFICIENT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_ALREADY\_OWNED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BADGE\_ALREADY\_OWNED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_UNPURCHASABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BADGE\_UNPURCHASABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_RANK\_CANNOT\_BE\_BOOST =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BADGE\_RANK\_CANNOT\_BE\_BOOST');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_UNSELLABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BADGE\_UNSELLABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVENTORY\_ITEM\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_OUT\_OF\_PERIOD =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVENTORY\_ITEM\_OUT\_OF\_PERIOD');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVENTORY\_ITEM\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_NOT\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVENTORY\_ITEM\_NOT\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_UNEQUIPABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVENTORY\_ITEM\_UNEQUIPABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_BALANCE\_INSUFFICIENT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('BALANCE\_INSUFFICIENT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INSUFFICIENT\_SUPPLY\_OF\_STP =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INSUFFICIENT\_SUPPLY\_OF\_STP');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INSUFFICIENT\_SUPPLY\_OF\_SNPT =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INSUFFICIENT\_SUPPLY\_OF\_SNPT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_LIQUIDITIES\_CHANGED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('LIQUIDITIES\_CHANGED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_EXTERNAL\_WALLET\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('EXTERNAL\_WALLET\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_WITHDRAW\_DAILY\_LIMIT\_REACHED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('WITHDRAW\_DAILY\_LIMIT\_REACHED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_WITHDRAW\_NOT\_PERMITTED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('WITHDRAW\_NOT\_PERMITTED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_REVENUECAT\_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum.\_('REVENUECAT\_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MAIL\_TEMPLATE\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MAIL\_TEMPLATE\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_MAIL\_ATTACHMENT\_EXPIRED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('MAIL\_ATTACHMENT\_EXPIRED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_LOOTBOX\_MYSTERY\_SLOTS\_FULL =
    const ApiErrorResponseDTOErrorTypeEnum.\_('LOOTBOX\_MYSTERY\_SLOTS\_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_LOOTBOX\_MYSTERY\_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('LOOTBOX\_MYSTERY\_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GACHA\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GACHA\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_GACHA\_OUT\_OF\_PERIOD =
    const ApiErrorResponseDTOErrorTypeEnum.\_('GACHA\_OUT\_OF\_PERIOD');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SHOP\_PRODUCT\_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_CONTENTS\_INVALID =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SHOP\_PRODUCT\_CONTENTS\_INVALID');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NOT\_QUALIFIED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_NOT\_QUALIFIED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CONTRACT\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_NOT\_AVAILABLE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CONTRACT\_NOT\_AVAILABLE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_ONGOING =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CONTRACT\_ONGOING');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_TERMINATED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CONTRACT\_TERMINATED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CAMERAS\_PACK\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CAMERAS\_PACK\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL =
    const ApiErrorResponseDTOErrorTypeEnum.\_(
        'RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_LIMIT\_REACHED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_CONTRACT\_LIMIT\_REACHED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NFT\_NOT\_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_NFT\_NOT\_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NFT\_IN\_USE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RENTAL\_NFT\_IN\_USE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVALID\_PARAMETER =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVALID\_PARAMETER');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_INVALID\_MIME\_TYPE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('INVALID\_MIME\_TYPE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_UNDER\_MAINTENANCE =
    const ApiErrorResponseDTOErrorTypeEnum.\_('UNDER\_MAINTENANCE');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_UNKNOWN =
    const ApiErrorResponseDTOErrorTypeEnum.\_('UNKNOWN');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_VALIDATION\_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum.\_('VALIDATION\_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_IS\_SPAM =
    const ApiErrorResponseDTOErrorTypeEnum.\_('IS\_SPAM');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_REQUEST\_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RECAPTCHA\_REQUEST\_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_ACTION\_TYPE\_UNMATCHED =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RECAPTCHA\_ACTION\_TYPE\_UNMATCHED');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_SCORE\_TOO\_LOW =
    const ApiErrorResponseDTOErrorTypeEnum.\_('RECAPTCHA\_SCORE\_TOO\_LOW');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_AUTH\_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum.\_('AUTH\_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    \_$apiErrorResponseDTOErrorTypeEnum\_SNPIT\_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum.\_('SNPIT\_ERROR');

ApiErrorResponseDTOErrorTypeEnum \_$apiErrorResponseDTOErrorTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'USER\_VERIFICATION\_CODE\_COOLDOWN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_VERIFICATION\_CODE\_COOLDOWN;
    case 'USER\_VERIFICATION\_CODE\_UNMATCHED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_VERIFICATION\_CODE\_UNMATCHED;
    case 'USER\_INVIATION\_CODE\_INVALID':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_INVIATION\_CODE\_INVALID;
    case 'USER\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_FOUND;
    case 'USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP;
    case 'USER\_NOT\_ADMIN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_ADMIN;
    case 'USER\_UNAUTHORIZED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_UNAUTHORIZED;
    case 'USER\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_EXISTS;
    case 'USER\_INCORRECT\_UPDATE\_FLAG':
      return \_$apiErrorResponseDTOErrorTypeEnum\_USER\_INCORRECT\_UPDATE\_FLAG;
    case 'ITEM\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_EXISTS;
    case 'ITEM\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_NOT\_FOUND;
    case 'ITEM\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_IN\_USE;
    case 'ITEM\_BOX\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_BOX\_EXISTS;
    case 'ITEM\_BOX\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_BOX\_NOT\_FOUND;
    case 'GUILD\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_NOT\_FOUND;
    case 'GUILD\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_EXISTS;
    case 'GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE;
    case 'GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE;
    case 'GUILD\_INCORRECT\_UPDATE\_FLAG':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_UPDATE\_FLAG;
    case 'GUILD\_INCORRECT\_PRIVILEGE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_PRIVILEGE;
    case 'GUILD\_DUPLICATE\_MEMBER':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_DUPLICATE\_MEMBER;
    case 'GUILD\_INFO\_LENGTH\_EXCEEDED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INFO\_LENGTH\_EXCEEDED;
    case 'GUILD\_MEMBER\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MEMBER\_EXISTS;
    case 'GUILD\_MAX\_MEMBERS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MAX\_MEMBERS;
    case 'GUILD\_MAX\_ADMINS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MAX\_ADMINS;
    case 'GUILD\_USER\_NOT\_MEMBER':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_USER\_NOT\_MEMBER;
    case 'GUILD\_SPOT\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_SPOT\_NOT\_FOUND;
    case 'PHOTO\_NOT\_OWNED\_BY\_YOU':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_OWNED\_BY\_YOU;
    case 'PHOTO\_NO\_LONGER\_ACCESSIBLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NO\_LONGER\_ACCESSIBLE;
    case 'PHOTO\_INVISIBLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_INVISIBLE;
    case 'PHOTO\_ALBUM\_FULL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_ALBUM\_FULL;
    case 'PHOTO\_DUPLICATED\_UPLOAD':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_DUPLICATED\_UPLOAD;
    case 'PHOTO\_UNPUBLISHABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_UNPUBLISHABLE;
    case 'PHOTO\_PENDING\_CENSORSHIP':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_PENDING\_CENSORSHIP;
    case 'PHOTO\_BATTLE\_HISTORY\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_BATTLE\_HISTORY\_EXISTS;
    case 'PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS;
    case 'PHOTO\_QUALITY\_TOO\_LOW':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_QUALITY\_TOO\_LOW;
    case 'PHOTO\_PREVIOUS\_DEFEAT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_PREVIOUS\_DEFEAT;
    case 'PHOTO\_NOT\_REPORTED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_REPORTED;
    case 'PHOTO\_TAG\_MISMATCH':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_TAG\_MISMATCH;
    case 'PHOTO\_TAG\_UNSUPPORTED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_TAG\_UNSUPPORTED;
    case 'PHOTO\_INVALID\_TYPE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_INVALID\_TYPE;
    case 'PHOTO\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_FOUND;
    case 'PHOTO\_APPROVE\_FAILED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_APPROVE\_FAILED;
    case 'PHOTO\_NOT\_ADMIN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_ADMIN;
    case 'PHOTO\_DELETE\_FAILED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_DELETE\_FAILED;
    case 'PHOTO\_UPLOAD\_FAILED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_UPLOAD\_FAILED;
    case 'DECK\_MAX\_LIMIT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_MAX\_LIMIT;
    case 'DECK\_CAMERA\_MISMATCH':
      return \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_MISMATCH;
    case 'DECK\_CAMERA\_INVALID':
      return \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_INVALID;
    case 'DECK\_CAMERA\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_EXISTS;
    case 'DECK\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_NOT\_FOUND;
    case 'DECK\_INCORRECT\_UPDATE\_FLAG':
      return \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_INCORRECT\_UPDATE\_FLAG;
    case 'SPOT\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_NOT\_FOUND;
    case 'SPOT\_IS\_EXISTING':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_IS\_EXISTING;
    case 'SPOT\_ATTRIBUTE\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_EXISTS;
    case 'SPOT\_ATTRIBUTE\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_NOT\_FOUND;
    case 'SPOT\_ATTRIBUTE\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_IN\_USE;
    case 'SPOT\_PHOTO\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_EXISTS;
    case 'SPOT\_INCORRECT\_UPDATE\_FLAG':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_INCORRECT\_UPDATE\_FLAG;
    case 'SPOT\_PHOTO\_ERROR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_ERROR;
    case 'SPOT\_PHOTO\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_NOT\_FOUND;
    case 'SPOT\_LATITUDE\_LONGITUDE\_REQUIRED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_LATITUDE\_LONGITUDE\_REQUIRED;
    case 'SPOT\_WAEVE\_OUT\_OF\_RANGE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_WAEVE\_OUT\_OF\_RANGE;
    case 'SPOT\_CANNOT\_BE\_DELETED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_CANNOT\_BE\_DELETED;
    case 'SPOT\_ALREADY\_CAPTURED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ALREADY\_CAPTURED;
    case 'EXPLORER\_INSUFFICIENT\_ENERGY':
      return \_$apiErrorResponseDTOErrorTypeEnum\_EXPLORER\_INSUFFICIENT\_ENERGY;
    case 'FLAG\_ALREADY\_CONSTRUCTED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_ALREADY\_CONSTRUCTED;
    case 'FLAG\_MAX\_LEVEL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_MAX\_LEVEL;
    case 'FLAG\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_NOT\_FOUND;
    case 'FLAG\_FULL\_ENDURANCE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_FULL\_ENDURANCE;
    case 'REACHED\_MAX\_BATTLES':
      return \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_BATTLES;
    case 'REACHED\_MAX\_STARS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_STARS;
    case 'BATTLE\_ALREADY\_SETTLED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_SETTLED;
    case 'BATTLE\_NO\_LONGER\_ACCESSIBLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NO\_LONGER\_ACCESSIBLE;
    case 'BATTLE\_CANNNOT\_BE\_CANCELLED\_YET':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_CANNNOT\_BE\_CANCELLED\_YET;
    case 'REACHED\_MAX\_DAILY\_ENTRIES':
      return \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_DAILY\_ENTRIES;
    case 'BATTLE\_ALREADY\_VOTED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_VOTED;
    case 'REACHED\_MAX\_BATTLES\_PER\_PHOTO':
      return \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_BATTLES\_PER\_PHOTO;
    case 'BATTLE\_ALREADY\_KICKED\_OFF':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_KICKED\_OFF;
    case 'BATTLE\_ALREADY\_JOINED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_JOINED;
    case 'BATTLE\_NOT\_YET\_JOINED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_YET\_JOINED;
    case 'BATTLE\_NOT\_JOINABLE\_BY\_BAN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_JOINABLE\_BY\_BAN;
    case 'BATTLE\_NOT\_READY':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_READY;
    case 'BATTLE\_NOT\_OWNED\_BY\_YOU':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_OWNED\_BY\_YOU;
    case 'BATTLE\_OWNED\_BY\_YOU':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_OWNED\_BY\_YOU;
    case 'BATTLE\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_UNFOUND;
    case 'BATTLE\_ALREADY\_FULL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_FULL;
    case 'BATTLE\_PHOTO\_UNPICKED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_PHOTO\_UNPICKED;
    case 'BATTLE\_PHOTO\_ALREADY\_PICKED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_PHOTO\_ALREADY\_PICKED;
    case 'NFT\_OUT\_OF\_STOCK':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_OUT\_OF\_STOCK;
    case 'NFT\_NOT\_OWNED\_BY\_YOU':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_OWNED\_BY\_YOU;
    case 'NFT\_ALREADY\_UNBOXED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ALREADY\_UNBOXED;
    case 'NFT\_NOT\_UNBOXED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_UNBOXED;
    case 'NFT\_NOT\_ENOUGH\_SKILL\_POINTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_SKILL\_POINTS;
    case 'NFT\_NOT\_ENOUGH\_BATTERIES':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_BATTERIES;
    case 'NFT\_NOT\_ENOUGH\_FILMS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_FILMS;
    case 'NFT\_REACHED\_MAX\_LEVEL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_REACHED\_MAX\_LEVEL;
    case 'NFT\_UPGRADE\_COOLDOWN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_UPGRADE\_COOLDOWN;
    case 'NFT\_TRANSFER\_COOLDOWN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_TRANSFER\_COOLDOWN;
    case 'NFT\_MINT\_COOLDOWN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_MINT\_COOLDOWN;
    case 'NFT\_ZERO\_DURABILITY':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ZERO\_DURABILITY;
    case 'NFT\_CAMERA\_IS\_NOT\_BROKEN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_CAMERA\_IS\_NOT\_BROKEN;
    case 'NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER;
    case 'NFT\_BATTERY\_FULL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_BATTERY\_FULL;
    case 'NFT\_ACCESSORY\_SLOTS\_FULL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_SLOTS\_FULL;
    case 'NFT\_ACCESSORY\_NOT\_EQUIPPED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_NOT\_EQUIPPED;
    case 'NFT\_ACCESSORY\_FUSION\_LIMIT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_LIMIT;
    case 'NFT\_ACCESSORY\_IS\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_IS\_IN\_USE;
    case 'NFT\_ACCESSORY\_FUSION\_NOT\_SAME':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_NOT\_SAME;
    case 'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR;
    case 'NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND;
    case 'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE;
    case 'NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE;
    case 'NFT\_NO\_SKILL\_POINTS\_USED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NO\_SKILL\_POINTS\_USED;
    case 'NFT\_MAX\_ROULETTE\_SPIN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_MAX\_ROULETTE\_SPIN;
    case 'NFT\_SKIN\_ALREADY\_EQUIPPED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_SKIN\_ALREADY\_EQUIPPED;
    case 'NFT\_ACCESSORY\_NOT\_EQUIPPED2':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_NOT\_EQUIPPED2;
    case 'NFT\_EXTRA\_SLOT\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_EXTRA\_SLOT\_IN\_USE;
    case 'NFT\_INCOMPATIBLE\_TYPE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_INCOMPATIBLE\_TYPE;
    case 'NFT\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_FOUND;
    case 'EXPLORER\_ALREADY\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_EXPLORER\_ALREADY\_EXISTS;
    case 'NFT\_ATTRIBUTE\_EXISTS':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_EXISTS;
    case 'NFT\_ATTRIBUTE\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_NOT\_FOUND;
    case 'NFT\_ATTRIBUTE\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_IN\_USE;
    case 'NFT\_CREATION\_FAILED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_CREATION\_FAILED;
    case 'MINT\_LEVEL\_NOT\_MAX':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEVEL\_NOT\_MAX;
    case 'MINT\_BATTERY\_NOT\_FULL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_BATTERY\_NOT\_FULL;
    case 'MINT\_REACHED\_MAX\_COUNT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_REACHED\_MAX\_COUNT;
    case 'MINT\_LEFTHAND\_NOT\_MINTABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEFTHAND\_NOT\_MINTABLE;
    case 'MINT\_RIGHTHAND\_NOT\_MINTABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_RIGHTHAND\_NOT\_MINTABLE;
    case 'MINT\_LEFTHAND\_BROKEN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEFTHAND\_BROKEN;
    case 'MINT\_RIGHTHAND\_BROKEN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_RIGHTHAND\_BROKEN;
    case 'MINT\_SCROLL\_INSUFFICIENT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_SCROLL\_INSUFFICIENT;
    case 'BADGE\_ALREADY\_OWNED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_ALREADY\_OWNED;
    case 'BADGE\_UNPURCHASABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_UNPURCHASABLE;
    case 'BADGE\_RANK\_CANNOT\_BE\_BOOST':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_RANK\_CANNOT\_BE\_BOOST;
    case 'BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST;
    case 'BADGE\_UNSELLABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_UNSELLABLE;
    case 'INVENTORY\_ITEM\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_UNFOUND;
    case 'INVENTORY\_ITEM\_OUT\_OF\_PERIOD':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_OUT\_OF\_PERIOD;
    case 'INVENTORY\_ITEM\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_IN\_USE;
    case 'INVENTORY\_ITEM\_NOT\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_NOT\_IN\_USE;
    case 'INVENTORY\_ITEM\_UNEQUIPABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_UNEQUIPABLE;
    case 'BALANCE\_INSUFFICIENT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_BALANCE\_INSUFFICIENT;
    case 'INSUFFICIENT\_SUPPLY\_OF\_STP':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INSUFFICIENT\_SUPPLY\_OF\_STP;
    case 'INSUFFICIENT\_SUPPLY\_OF\_SNPT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INSUFFICIENT\_SUPPLY\_OF\_SNPT;
    case 'LIQUIDITIES\_CHANGED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_LIQUIDITIES\_CHANGED;
    case 'EXTERNAL\_WALLET\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_EXTERNAL\_WALLET\_UNFOUND;
    case 'WITHDRAW\_DAILY\_LIMIT\_REACHED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_WITHDRAW\_DAILY\_LIMIT\_REACHED;
    case 'WITHDRAW\_NOT\_PERMITTED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_WITHDRAW\_NOT\_PERMITTED;
    case 'REVENUECAT\_ERROR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_REVENUECAT\_ERROR;
    case 'MAIL\_TEMPLATE\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MAIL\_TEMPLATE\_UNFOUND;
    case 'MAIL\_ATTACHMENT\_EXPIRED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_MAIL\_ATTACHMENT\_EXPIRED;
    case 'LOOTBOX\_MYSTERY\_SLOTS\_FULL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_LOOTBOX\_MYSTERY\_SLOTS\_FULL;
    case 'LOOTBOX\_MYSTERY\_COOLDOWN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_LOOTBOX\_MYSTERY\_COOLDOWN;
    case 'GACHA\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GACHA\_UNFOUND;
    case 'GACHA\_OUT\_OF\_PERIOD':
      return \_$apiErrorResponseDTOErrorTypeEnum\_GACHA\_OUT\_OF\_PERIOD;
    case 'SHOP\_PRODUCT\_UNFOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_UNFOUND;
    case 'SHOP\_PRODUCT\_CONTENTS\_INVALID':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_CONTENTS\_INVALID;
    case 'SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED;
    case 'RENTAL\_NOT\_QUALIFIED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NOT\_QUALIFIED;
    case 'RENTAL\_CONTRACT\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_NOT\_FOUND;
    case 'RENTAL\_CONTRACT\_NOT\_AVAILABLE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_NOT\_AVAILABLE;
    case 'RENTAL\_CONTRACT\_ONGOING':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_ONGOING;
    case 'RENTAL\_CONTRACT\_TERMINATED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_TERMINATED;
    case 'RENTAL\_CAMERAS\_PACK\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_IN\_USE;
    case 'RENTAL\_CAMERAS\_PACK\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_NOT\_FOUND;
    case 'RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU;
    case 'RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT;
    case 'RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND;
    case 'RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL;
    case 'RENTAL\_CONTRACT\_LIMIT\_REACHED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_LIMIT\_REACHED;
    case 'RENTAL\_NFT\_NOT\_FOUND':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NFT\_NOT\_FOUND;
    case 'RENTAL\_NFT\_IN\_USE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NFT\_IN\_USE;
    case 'INVALID\_PARAMETER':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVALID\_PARAMETER;
    case 'INVALID\_MIME\_TYPE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_INVALID\_MIME\_TYPE;
    case 'UNDER\_MAINTENANCE':
      return \_$apiErrorResponseDTOErrorTypeEnum\_UNDER\_MAINTENANCE;
    case 'UNKNOWN':
      return \_$apiErrorResponseDTOErrorTypeEnum\_UNKNOWN;
    case 'VALIDATION\_ERROR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_VALIDATION\_ERROR;
    case 'IS\_SPAM':
      return \_$apiErrorResponseDTOErrorTypeEnum\_IS\_SPAM;
    case 'RECAPTCHA\_REQUEST\_ERROR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_REQUEST\_ERROR;
    case 'RECAPTCHA\_ACTION\_TYPE\_UNMATCHED':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_ACTION\_TYPE\_UNMATCHED;
    case 'RECAPTCHA\_SCORE\_TOO\_LOW':
      return \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_SCORE\_TOO\_LOW;
    case 'AUTH\_ERROR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_AUTH\_ERROR;
    case 'SNPIT\_ERROR':
      return \_$apiErrorResponseDTOErrorTypeEnum\_SNPIT\_ERROR;
    default:
      throw new ArgumentError(name);
  }
}

final BuiltSet&lt;ApiErrorResponseDTOErrorTypeEnum&gt;
    \_$apiErrorResponseDTOErrorTypeEnumValues = new BuiltSet&lt;
        ApiErrorResponseDTOErrorTypeEnum&gt;(const &lt;ApiErrorResponseDTOErrorTypeEnum&gt;\[
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_VERIFICATION\_CODE\_COOLDOWN,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_VERIFICATION\_CODE\_UNMATCHED,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_INVIATION\_CODE\_INVALID,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_NOT\_ADMIN,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_UNAUTHORIZED,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_USER\_INCORRECT\_UPDATE\_FLAG,
  \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_BOX\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_ITEM\_BOX\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_UPDATE\_FLAG,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INCORRECT\_PRIVILEGE,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_DUPLICATE\_MEMBER,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_INFO\_LENGTH\_EXCEEDED,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MEMBER\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MAX\_MEMBERS,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_MAX\_ADMINS,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_USER\_NOT\_MEMBER,
  \_$apiErrorResponseDTOErrorTypeEnum\_GUILD\_SPOT\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_OWNED\_BY\_YOU,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NO\_LONGER\_ACCESSIBLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_INVISIBLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_ALBUM\_FULL,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_DUPLICATED\_UPLOAD,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_UNPUBLISHABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_PENDING\_CENSORSHIP,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_BATTLE\_HISTORY\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_QUALITY\_TOO\_LOW,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_PREVIOUS\_DEFEAT,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_REPORTED,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_TAG\_MISMATCH,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_TAG\_UNSUPPORTED,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_INVALID\_TYPE,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_APPROVE\_FAILED,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_NOT\_ADMIN,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_DELETE\_FAILED,
  \_$apiErrorResponseDTOErrorTypeEnum\_PHOTO\_UPLOAD\_FAILED,
  \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_MAX\_LIMIT,
  \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_MISMATCH,
  \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_INVALID,
  \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_CAMERA\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_DECK\_INCORRECT\_UPDATE\_FLAG,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_IS\_EXISTING,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ATTRIBUTE\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_INCORRECT\_UPDATE\_FLAG,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_ERROR,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_PHOTO\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_LATITUDE\_LONGITUDE\_REQUIRED,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_WAEVE\_OUT\_OF\_RANGE,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_CANNOT\_BE\_DELETED,
  \_$apiErrorResponseDTOErrorTypeEnum\_SPOT\_ALREADY\_CAPTURED,
  \_$apiErrorResponseDTOErrorTypeEnum\_EXPLORER\_INSUFFICIENT\_ENERGY,
  \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_ALREADY\_CONSTRUCTED,
  \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_MAX\_LEVEL,
  \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_FLAG\_FULL\_ENDURANCE,
  \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_BATTLES,
  \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_STARS,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_SETTLED,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NO\_LONGER\_ACCESSIBLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_CANNNOT\_BE\_CANCELLED\_YET,
  \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_DAILY\_ENTRIES,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_VOTED,
  \_$apiErrorResponseDTOErrorTypeEnum\_REACHED\_MAX\_BATTLES\_PER\_PHOTO,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_KICKED\_OFF,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_JOINED,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_YET\_JOINED,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_JOINABLE\_BY\_BAN,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_READY,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_NOT\_OWNED\_BY\_YOU,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_OWNED\_BY\_YOU,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_ALREADY\_FULL,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_PHOTO\_UNPICKED,
  \_$apiErrorResponseDTOErrorTypeEnum\_BATTLE\_PHOTO\_ALREADY\_PICKED,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_OUT\_OF\_STOCK,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_OWNED\_BY\_YOU,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ALREADY\_UNBOXED,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_UNBOXED,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_SKILL\_POINTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_BATTERIES,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_ENOUGH\_FILMS,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_REACHED\_MAX\_LEVEL,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_UPGRADE\_COOLDOWN,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_TRANSFER\_COOLDOWN,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_MINT\_COOLDOWN,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ZERO\_DURABILITY,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_CAMERA\_IS\_NOT\_BROKEN,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_BATTERY\_FULL,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_SLOTS\_FULL,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_NOT\_EQUIPPED,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_LIMIT,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_IS\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_NOT\_SAME,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NO\_SKILL\_POINTS\_USED,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_MAX\_ROULETTE\_SPIN,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_SKIN\_ALREADY\_EQUIPPED,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ACCESSORY\_NOT\_EQUIPPED2,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_EXTRA\_SLOT\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_INCOMPATIBLE\_TYPE,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_EXPLORER\_ALREADY\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_EXISTS,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_ATTRIBUTE\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_NFT\_CREATION\_FAILED,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEVEL\_NOT\_MAX,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_BATTERY\_NOT\_FULL,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_REACHED\_MAX\_COUNT,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEFTHAND\_NOT\_MINTABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_RIGHTHAND\_NOT\_MINTABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_LEFTHAND\_BROKEN,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_RIGHTHAND\_BROKEN,
  \_$apiErrorResponseDTOErrorTypeEnum\_MINT\_SCROLL\_INSUFFICIENT,
  \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_ALREADY\_OWNED,
  \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_UNPURCHASABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_RANK\_CANNOT\_BE\_BOOST,
  \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST,
  \_$apiErrorResponseDTOErrorTypeEnum\_BADGE\_UNSELLABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_OUT\_OF\_PERIOD,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_NOT\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVENTORY\_ITEM\_UNEQUIPABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_BALANCE\_INSUFFICIENT,
  \_$apiErrorResponseDTOErrorTypeEnum\_INSUFFICIENT\_SUPPLY\_OF\_STP,
  \_$apiErrorResponseDTOErrorTypeEnum\_INSUFFICIENT\_SUPPLY\_OF\_SNPT,
  \_$apiErrorResponseDTOErrorTypeEnum\_LIQUIDITIES\_CHANGED,
  \_$apiErrorResponseDTOErrorTypeEnum\_EXTERNAL\_WALLET\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_WITHDRAW\_DAILY\_LIMIT\_REACHED,
  \_$apiErrorResponseDTOErrorTypeEnum\_WITHDRAW\_NOT\_PERMITTED,
  \_$apiErrorResponseDTOErrorTypeEnum\_REVENUECAT\_ERROR,
  \_$apiErrorResponseDTOErrorTypeEnum\_MAIL\_TEMPLATE\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_MAIL\_ATTACHMENT\_EXPIRED,
  \_$apiErrorResponseDTOErrorTypeEnum\_LOOTBOX\_MYSTERY\_SLOTS\_FULL,
  \_$apiErrorResponseDTOErrorTypeEnum\_LOOTBOX\_MYSTERY\_COOLDOWN,
  \_$apiErrorResponseDTOErrorTypeEnum\_GACHA\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_GACHA\_OUT\_OF\_PERIOD,
  \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_UNFOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_CONTENTS\_INVALID,
  \_$apiErrorResponseDTOErrorTypeEnum\_SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NOT\_QUALIFIED,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_NOT\_AVAILABLE,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_ONGOING,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_TERMINATED,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_CONTRACT\_LIMIT\_REACHED,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NFT\_NOT\_FOUND,
  \_$apiErrorResponseDTOErrorTypeEnum\_RENTAL\_NFT\_IN\_USE,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVALID\_PARAMETER,
  \_$apiErrorResponseDTOErrorTypeEnum\_INVALID\_MIME\_TYPE,
  \_$apiErrorResponseDTOErrorTypeEnum\_UNDER\_MAINTENANCE,
  \_$apiErrorResponseDTOErrorTypeEnum\_UNKNOWN,
  \_$apiErrorResponseDTOErrorTypeEnum\_VALIDATION\_ERROR,
  \_$apiErrorResponseDTOErrorTypeEnum\_IS\_SPAM,
  \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_REQUEST\_ERROR,
  \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_ACTION\_TYPE\_UNMATCHED,
  \_$apiErrorResponseDTOErrorTypeEnum\_RECAPTCHA\_SCORE\_TOO\_LOW,
  \_$apiErrorResponseDTOErrorTypeEnum\_AUTH\_ERROR,
  \_$apiErrorResponseDTOErrorTypeEnum\_SNPIT\_ERROR,
\]);

Serializer&lt;ApiErrorResponseDTOErrorTypeEnum&gt;
    \_$apiErrorResponseDTOErrorTypeEnumSerializer =
    new \_$ApiErrorResponseDTOErrorTypeEnumSerializer();

class \_$ApiErrorResponseDTOErrorTypeEnumSerializer
    implements PrimitiveSerializer&lt;ApiErrorResponseDTOErrorTypeEnum&gt; {
  static const Map&lt;String, Object&gt; \_toWire = const &lt;String, Object&gt;{
    'USER\_VERIFICATION\_CODE\_COOLDOWN': 'USER\_VERIFICATION\_CODE\_COOLDOWN',
    'USER\_VERIFICATION\_CODE\_UNMATCHED': 'USER\_VERIFICATION\_CODE\_UNMATCHED',
    'USER\_INVIATION\_CODE\_INVALID': 'USER\_INVIATION\_CODE\_INVALID',
    'USER\_NOT\_FOUND': 'USER\_NOT\_FOUND',
    'USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP': 'USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP',
    'USER\_NOT\_ADMIN': 'USER\_NOT\_ADMIN',
    'USER\_UNAUTHORIZED': 'USER\_UNAUTHORIZED',
    'USER\_EXISTS': 'USER\_EXISTS',
    'USER\_INCORRECT\_UPDATE\_FLAG': 'USER\_INCORRECT\_UPDATE\_FLAG',
    'ITEM\_EXISTS': 'ITEM\_EXISTS',
    'ITEM\_NOT\_FOUND': 'ITEM\_NOT\_FOUND',
    'ITEM\_IN\_USE': 'ITEM\_IN\_USE',
    'ITEM\_BOX\_EXISTS': 'ITEM\_BOX\_EXISTS',
    'ITEM\_BOX\_NOT\_FOUND': 'ITEM\_BOX\_NOT\_FOUND',
    'GUILD\_NOT\_FOUND': 'GUILD\_NOT\_FOUND',
    'GUILD\_EXISTS': 'GUILD\_EXISTS',
    'GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE':
        'GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE',
    'GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE': 'GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE',
    'GUILD\_INCORRECT\_UPDATE\_FLAG': 'GUILD\_INCORRECT\_UPDATE\_FLAG',
    'GUILD\_INCORRECT\_PRIVILEGE': 'GUILD\_INCORRECT\_PRIVILEGE',
    'GUILD\_DUPLICATE\_MEMBER': 'GUILD\_DUPLICATE\_MEMBER',
    'GUILD\_INFO\_LENGTH\_EXCEEDED': 'GUILD\_INFO\_LENGTH\_EXCEEDED',
    'GUILD\_MEMBER\_EXISTS': 'GUILD\_MEMBER\_EXISTS',
    'GUILD\_MAX\_MEMBERS': 'GUILD\_MAX\_MEMBERS',
    'GUILD\_MAX\_ADMINS': 'GUILD\_MAX\_ADMINS',
    'GUILD\_USER\_NOT\_MEMBER': 'GUILD\_USER\_NOT\_MEMBER',
    'GUILD\_SPOT\_NOT\_FOUND': 'GUILD\_SPOT\_NOT\_FOUND',
    'PHOTO\_NOT\_OWNED\_BY\_YOU': 'PHOTO\_NOT\_OWNED\_BY\_YOU',
    'PHOTO\_NO\_LONGER\_ACCESSIBLE': 'PHOTO\_NO\_LONGER\_ACCESSIBLE',
    'PHOTO\_INVISIBLE': 'PHOTO\_INVISIBLE',
    'PHOTO\_ALBUM\_FULL': 'PHOTO\_ALBUM\_FULL',
    'PHOTO\_DUPLICATED\_UPLOAD': 'PHOTO\_DUPLICATED\_UPLOAD',
    'PHOTO\_UNPUBLISHABLE': 'PHOTO\_UNPUBLISHABLE',
    'PHOTO\_PENDING\_CENSORSHIP': 'PHOTO\_PENDING\_CENSORSHIP',
    'PHOTO\_BATTLE\_HISTORY\_EXISTS': 'PHOTO\_BATTLE\_HISTORY\_EXISTS',
    'PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS': 'PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS',
    'PHOTO\_QUALITY\_TOO\_LOW': 'PHOTO\_QUALITY\_TOO\_LOW',
    'PHOTO\_PREVIOUS\_DEFEAT': 'PHOTO\_PREVIOUS\_DEFEAT',
    'PHOTO\_NOT\_REPORTED': 'PHOTO\_NOT\_REPORTED',
    'PHOTO\_TAG\_MISMATCH': 'PHOTO\_TAG\_MISMATCH',
    'PHOTO\_TAG\_UNSUPPORTED': 'PHOTO\_TAG\_UNSUPPORTED',
    'PHOTO\_INVALID\_TYPE': 'PHOTO\_INVALID\_TYPE',
    'PHOTO\_NOT\_FOUND': 'PHOTO\_NOT\_FOUND',
    'PHOTO\_APPROVE\_FAILED': 'PHOTO\_APPROVE\_FAILED',
    'PHOTO\_NOT\_ADMIN': 'PHOTO\_NOT\_ADMIN',
    'PHOTO\_DELETE\_FAILED': 'PHOTO\_DELETE\_FAILED',
    'PHOTO\_UPLOAD\_FAILED': 'PHOTO\_UPLOAD\_FAILED',
    'DECK\_MAX\_LIMIT': 'DECK\_MAX\_LIMIT',
    'DECK\_CAMERA\_MISMATCH': 'DECK\_CAMERA\_MISMATCH',
    'DECK\_CAMERA\_INVALID': 'DECK\_CAMERA\_INVALID',
    'DECK\_CAMERA\_EXISTS': 'DECK\_CAMERA\_EXISTS',
    'DECK\_NOT\_FOUND': 'DECK\_NOT\_FOUND',
    'DECK\_INCORRECT\_UPDATE\_FLAG': 'DECK\_INCORRECT\_UPDATE\_FLAG',
    'SPOT\_NOT\_FOUND': 'SPOT\_NOT\_FOUND',
    'SPOT\_IS\_EXISTING': 'SPOT\_IS\_EXISTING',
    'SPOT\_ATTRIBUTE\_EXISTS': 'SPOT\_ATTRIBUTE\_EXISTS',
    'SPOT\_ATTRIBUTE\_NOT\_FOUND': 'SPOT\_ATTRIBUTE\_NOT\_FOUND',
    'SPOT\_ATTRIBUTE\_IN\_USE': 'SPOT\_ATTRIBUTE\_IN\_USE',
    'SPOT\_PHOTO\_EXISTS': 'SPOT\_PHOTO\_EXISTS',
    'SPOT\_INCORRECT\_UPDATE\_FLAG': 'SPOT\_INCORRECT\_UPDATE\_FLAG',
    'SPOT\_PHOTO\_ERROR': 'SPOT\_PHOTO\_ERROR',
    'SPOT\_PHOTO\_NOT\_FOUND': 'SPOT\_PHOTO\_NOT\_FOUND',
    'SPOT\_LATITUDE\_LONGITUDE\_REQUIRED': 'SPOT\_LATITUDE\_LONGITUDE\_REQUIRED',
    'SPOT\_WAEVE\_OUT\_OF\_RANGE': 'SPOT\_WAEVE\_OUT\_OF\_RANGE',
    'SPOT\_CANNOT\_BE\_DELETED': 'SPOT\_CANNOT\_BE\_DELETED',
    'SPOT\_ALREADY\_CAPTURED': 'SPOT\_ALREADY\_CAPTURED',
    'EXPLORER\_INSUFFICIENT\_ENERGY': 'EXPLORER\_INSUFFICIENT\_ENERGY',
    'FLAG\_ALREADY\_CONSTRUCTED': 'FLAG\_ALREADY\_CONSTRUCTED',
    'FLAG\_MAX\_LEVEL': 'FLAG\_MAX\_LEVEL',
    'FLAG\_NOT\_FOUND': 'FLAG\_NOT\_FOUND',
    'FLAG\_FULL\_ENDURANCE': 'FLAG\_FULL\_ENDURANCE',
    'REACHED\_MAX\_BATTLES': 'REACHED\_MAX\_BATTLES',
    'REACHED\_MAX\_STARS': 'REACHED\_MAX\_STARS',
    'BATTLE\_ALREADY\_SETTLED': 'BATTLE\_ALREADY\_SETTLED',
    'BATTLE\_NO\_LONGER\_ACCESSIBLE': 'BATTLE\_NO\_LONGER\_ACCESSIBLE',
    'BATTLE\_CANNNOT\_BE\_CANCELLED\_YET': 'BATTLE\_CANNNOT\_BE\_CANCELLED\_YET',
    'REACHED\_MAX\_DAILY\_ENTRIES': 'REACHED\_MAX\_DAILY\_ENTRIES',
    'BATTLE\_ALREADY\_VOTED': 'BATTLE\_ALREADY\_VOTED',
    'REACHED\_MAX\_BATTLES\_PER\_PHOTO': 'REACHED\_MAX\_BATTLES\_PER\_PHOTO',
    'BATTLE\_ALREADY\_KICKED\_OFF': 'BATTLE\_ALREADY\_KICKED\_OFF',
    'BATTLE\_ALREADY\_JOINED': 'BATTLE\_ALREADY\_JOINED',
    'BATTLE\_NOT\_YET\_JOINED': 'BATTLE\_NOT\_YET\_JOINED',
    'BATTLE\_NOT\_JOINABLE\_BY\_BAN': 'BATTLE\_NOT\_JOINABLE\_BY\_BAN',
    'BATTLE\_NOT\_READY': 'BATTLE\_NOT\_READY',
    'BATTLE\_NOT\_OWNED\_BY\_YOU': 'BATTLE\_NOT\_OWNED\_BY\_YOU',
    'BATTLE\_OWNED\_BY\_YOU': 'BATTLE\_OWNED\_BY\_YOU',
    'BATTLE\_UNFOUND': 'BATTLE\_UNFOUND',
    'BATTLE\_ALREADY\_FULL': 'BATTLE\_ALREADY\_FULL',
    'BATTLE\_PHOTO\_UNPICKED': 'BATTLE\_PHOTO\_UNPICKED',
    'BATTLE\_PHOTO\_ALREADY\_PICKED': 'BATTLE\_PHOTO\_ALREADY\_PICKED',
    'NFT\_OUT\_OF\_STOCK': 'NFT\_OUT\_OF\_STOCK',
    'NFT\_NOT\_OWNED\_BY\_YOU': 'NFT\_NOT\_OWNED\_BY\_YOU',
    'NFT\_ALREADY\_UNBOXED': 'NFT\_ALREADY\_UNBOXED',
    'NFT\_NOT\_UNBOXED': 'NFT\_NOT\_UNBOXED',
    'NFT\_NOT\_ENOUGH\_SKILL\_POINTS': 'NFT\_NOT\_ENOUGH\_SKILL\_POINTS',
    'NFT\_NOT\_ENOUGH\_BATTERIES': 'NFT\_NOT\_ENOUGH\_BATTERIES',
    'NFT\_NOT\_ENOUGH\_FILMS': 'NFT\_NOT\_ENOUGH\_FILMS',
    'NFT\_REACHED\_MAX\_LEVEL': 'NFT\_REACHED\_MAX\_LEVEL',
    'NFT\_UPGRADE\_COOLDOWN': 'NFT\_UPGRADE\_COOLDOWN',
    'NFT\_TRANSFER\_COOLDOWN': 'NFT\_TRANSFER\_COOLDOWN',
    'NFT\_MINT\_COOLDOWN': 'NFT\_MINT\_COOLDOWN',
    'NFT\_ZERO\_DURABILITY': 'NFT\_ZERO\_DURABILITY',
    'NFT\_CAMERA\_IS\_NOT\_BROKEN': 'NFT\_CAMERA\_IS\_NOT\_BROKEN',
    'NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER': 'NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER',
    'NFT\_BATTERY\_FULL': 'NFT\_BATTERY\_FULL',
    'NFT\_ACCESSORY\_SLOTS\_FULL': 'NFT\_ACCESSORY\_SLOTS\_FULL',
    'NFT\_ACCESSORY\_NOT\_EQUIPPED': 'NFT\_ACCESSORY\_NOT\_EQUIPPED',
    'NFT\_ACCESSORY\_FUSION\_LIMIT': 'NFT\_ACCESSORY\_FUSION\_LIMIT',
    'NFT\_ACCESSORY\_IS\_IN\_USE': 'NFT\_ACCESSORY\_IS\_IN\_USE',
    'NFT\_ACCESSORY\_FUSION\_NOT\_SAME': 'NFT\_ACCESSORY\_FUSION\_NOT\_SAME',
    'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR': 'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR',
    'NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND': 'NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND',
    'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE': 'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE',
    'NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE':
        'NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE',
    'NFT\_NO\_SKILL\_POINTS\_USED': 'NFT\_NO\_SKILL\_POINTS\_USED',
    'NFT\_MAX\_ROULETTE\_SPIN': 'NFT\_MAX\_ROULETTE\_SPIN',
    'NFT\_SKIN\_ALREADY\_EQUIPPED': 'NFT\_SKIN\_ALREADY\_EQUIPPED',
    'NFT\_ACCESSORY\_NOT\_EQUIPPED2': 'NFT\_ACCESSORY\_NOT\_EQUIPPED',
    'NFT\_EXTRA\_SLOT\_IN\_USE': 'NFT\_EXTRA\_SLOT\_IN\_USE',
    'NFT\_INCOMPATIBLE\_TYPE': 'NFT\_INCOMPATIBLE\_TYPE',
    'NFT\_NOT\_FOUND': 'NFT\_NOT\_FOUND',
    'EXPLORER\_ALREADY\_EXISTS': 'EXPLORER\_ALREADY\_EXISTS',
    'NFT\_ATTRIBUTE\_EXISTS': 'NFT\_ATTRIBUTE\_EXISTS',
    'NFT\_ATTRIBUTE\_NOT\_FOUND': 'NFT\_ATTRIBUTE\_NOT\_FOUND',
    'NFT\_ATTRIBUTE\_IN\_USE': 'NFT\_ATTRIBUTE\_IN\_USE',
    'NFT\_CREATION\_FAILED': 'NFT\_CREATION\_FAILED',
    'MINT\_LEVEL\_NOT\_MAX': 'MINT\_LEVEL\_NOT\_MAX',
    'MINT\_BATTERY\_NOT\_FULL': 'MINT\_BATTERY\_NOT\_FULL',
    'MINT\_REACHED\_MAX\_COUNT': 'MINT\_REACHED\_MAX\_COUNT',
    'MINT\_LEFTHAND\_NOT\_MINTABLE': 'MINT\_LEFTHAND\_NOT\_MINTABLE',
    'MINT\_RIGHTHAND\_NOT\_MINTABLE': 'MINT\_RIGHTHAND\_NOT\_MINTABLE',
    'MINT\_LEFTHAND\_BROKEN': 'MINT\_LEFTHAND\_BROKEN',
    'MINT\_RIGHTHAND\_BROKEN': 'MINT\_RIGHTHAND\_BROKEN',
    'MINT\_SCROLL\_INSUFFICIENT': 'MINT\_SCROLL\_INSUFFICIENT',
    'BADGE\_ALREADY\_OWNED': 'BADGE\_ALREADY\_OWNED',
    'BADGE\_UNPURCHASABLE': 'BADGE\_UNPURCHASABLE',
    'BADGE\_RANK\_CANNOT\_BE\_BOOST': 'BADGE\_RANK\_CANNOT\_BE\_BOOST',
    'BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST': 'BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST',
    'BADGE\_UNSELLABLE': 'BADGE\_UNSELLABLE',
    'INVENTORY\_ITEM\_UNFOUND': 'INVENTORY\_ITEM\_UNFOUND',
    'INVENTORY\_ITEM\_OUT\_OF\_PERIOD': 'INVENTORY\_ITEM\_OUT\_OF\_PERIOD',
    'INVENTORY\_ITEM\_IN\_USE': 'INVENTORY\_ITEM\_IN\_USE',
    'INVENTORY\_ITEM\_NOT\_IN\_USE': 'INVENTORY\_ITEM\_NOT\_IN\_USE',
    'INVENTORY\_ITEM\_UNEQUIPABLE': 'INVENTORY\_ITEM\_UNEQUIPABLE',
    'BALANCE\_INSUFFICIENT': 'BALANCE\_INSUFFICIENT',
    'INSUFFICIENT\_SUPPLY\_OF\_STP': 'INSUFFICIENT\_SUPPLY\_OF\_STP',
    'INSUFFICIENT\_SUPPLY\_OF\_SNPT': 'INSUFFICIENT\_SUPPLY\_OF\_SNPT',
    'LIQUIDITIES\_CHANGED': 'LIQUIDITIES\_CHANGED',
    'EXTERNAL\_WALLET\_UNFOUND': 'EXTERNAL\_WALLET\_UNFOUND',
    'WITHDRAW\_DAILY\_LIMIT\_REACHED': 'WITHDRAW\_DAILY\_LIMIT\_REACHED',
    'WITHDRAW\_NOT\_PERMITTED': 'WITHDRAW\_NOT\_PERMITTED',
    'REVENUECAT\_ERROR': 'REVENUECAT\_ERROR',
    'MAIL\_TEMPLATE\_UNFOUND': 'MAIL\_TEMPLATE\_UNFOUND',
    'MAIL\_ATTACHMENT\_EXPIRED': 'MAIL\_ATTACHMENT\_EXPIRED',
    'LOOTBOX\_MYSTERY\_SLOTS\_FULL': 'LOOTBOX\_MYSTERY\_SLOTS\_FULL',
    'LOOTBOX\_MYSTERY\_COOLDOWN': 'LOOTBOX\_MYSTERY\_COOLDOWN',
    'GACHA\_UNFOUND': 'GACHA\_UNFOUND',
    'GACHA\_OUT\_OF\_PERIOD': 'GACHA\_OUT\_OF\_PERIOD',
    'SHOP\_PRODUCT\_UNFOUND': 'SHOP\_PRODUCT\_UNFOUND',
    'SHOP\_PRODUCT\_CONTENTS\_INVALID': 'SHOP\_PRODUCT\_CONTENTS\_INVALID',
    'SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED':
        'SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED',
    'RENTAL\_NOT\_QUALIFIED': 'RENTAL\_NOT\_QUALIFIED',
    'RENTAL\_CONTRACT\_NOT\_FOUND': 'RENTAL\_CONTRACT\_NOT\_FOUND',
    'RENTAL\_CONTRACT\_NOT\_AVAILABLE': 'RENTAL\_CONTRACT\_NOT\_AVAILABLE',
    'RENTAL\_CONTRACT\_ONGOING': 'RENTAL\_CONTRACT\_ONGOING',
    'RENTAL\_CONTRACT\_TERMINATED': 'RENTAL\_CONTRACT\_TERMINATED',
    'RENTAL\_CAMERAS\_PACK\_IN\_USE': 'RENTAL\_CAMERAS\_PACK\_IN\_USE',
    'RENTAL\_CAMERAS\_PACK\_NOT\_FOUND': 'RENTAL\_CAMERAS\_PACK\_NOT\_FOUND',
    'RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU':
        'RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU',
    'RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT': 'RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT',
    'RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND':
        'RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND',
    'RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL':
        'RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL',
    'RENTAL\_CONTRACT\_LIMIT\_REACHED': 'RENTAL\_CONTRACT\_LIMIT\_REACHED',
    'RENTAL\_NFT\_NOT\_FOUND': 'RENTAL\_NFT\_NOT\_FOUND',
    'RENTAL\_NFT\_IN\_USE': 'RENTAL\_NFT\_IN\_USE',
    'INVALID\_PARAMETER': 'INVALID\_PARAMETER',
    'INVALID\_MIME\_TYPE': 'INVALID\_MIME\_TYPE',
    'UNDER\_MAINTENANCE': 'UNDER\_MAINTENANCE',
    'UNKNOWN': 'UNKNOWN',
    'VALIDATION\_ERROR': 'VALIDATION\_ERROR',
    'IS\_SPAM': 'IS\_SPAM',
    'RECAPTCHA\_REQUEST\_ERROR': 'RECAPTCHA\_REQUEST\_ERROR',
    'RECAPTCHA\_ACTION\_TYPE\_UNMATCHED': 'RECAPTCHA\_ACTION\_TYPE\_UNMATCHED',
    'RECAPTCHA\_SCORE\_TOO\_LOW': 'RECAPTCHA\_SCORE\_TOO\_LOW',
    'AUTH\_ERROR': 'AUTH\_ERROR',
    'SNPIT\_ERROR': 'SNPIT\_ERROR',
  };
  static const Map&lt;Object, String&gt; \_fromWire = const &lt;Object, String&gt;{
    'USER\_VERIFICATION\_CODE\_COOLDOWN': 'USER\_VERIFICATION\_CODE\_COOLDOWN',
    'USER\_VERIFICATION\_CODE\_UNMATCHED': 'USER\_VERIFICATION\_CODE\_UNMATCHED',
    'USER\_INVIATION\_CODE\_INVALID': 'USER\_INVIATION\_CODE\_INVALID',
    'USER\_NOT\_FOUND': 'USER\_NOT\_FOUND',
    'USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP': 'USER\_NOT\_ENROLLED\_IN\_MEMBERSHIP',
    'USER\_NOT\_ADMIN': 'USER\_NOT\_ADMIN',
    'USER\_UNAUTHORIZED': 'USER\_UNAUTHORIZED',
    'USER\_EXISTS': 'USER\_EXISTS',
    'USER\_INCORRECT\_UPDATE\_FLAG': 'USER\_INCORRECT\_UPDATE\_FLAG',
    'ITEM\_EXISTS': 'ITEM\_EXISTS',
    'ITEM\_NOT\_FOUND': 'ITEM\_NOT\_FOUND',
    'ITEM\_IN\_USE': 'ITEM\_IN\_USE',
    'ITEM\_BOX\_EXISTS': 'ITEM\_BOX\_EXISTS',
    'ITEM\_BOX\_NOT\_FOUND': 'ITEM\_BOX\_NOT\_FOUND',
    'GUILD\_NOT\_FOUND': 'GUILD\_NOT\_FOUND',
    'GUILD\_EXISTS': 'GUILD\_EXISTS',
    'GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE':
        'GUILD\_INCORRECT\_MEMBER\_STATUS\_UDPATE',
    'GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE': 'GUILD\_INCORRECT\_MEMBER\_ROLE\_UDPATE',
    'GUILD\_INCORRECT\_UPDATE\_FLAG': 'GUILD\_INCORRECT\_UPDATE\_FLAG',
    'GUILD\_INCORRECT\_PRIVILEGE': 'GUILD\_INCORRECT\_PRIVILEGE',
    'GUILD\_DUPLICATE\_MEMBER': 'GUILD\_DUPLICATE\_MEMBER',
    'GUILD\_INFO\_LENGTH\_EXCEEDED': 'GUILD\_INFO\_LENGTH\_EXCEEDED',
    'GUILD\_MEMBER\_EXISTS': 'GUILD\_MEMBER\_EXISTS',
    'GUILD\_MAX\_MEMBERS': 'GUILD\_MAX\_MEMBERS',
    'GUILD\_MAX\_ADMINS': 'GUILD\_MAX\_ADMINS',
    'GUILD\_USER\_NOT\_MEMBER': 'GUILD\_USER\_NOT\_MEMBER',
    'GUILD\_SPOT\_NOT\_FOUND': 'GUILD\_SPOT\_NOT\_FOUND',
    'PHOTO\_NOT\_OWNED\_BY\_YOU': 'PHOTO\_NOT\_OWNED\_BY\_YOU',
    'PHOTO\_NO\_LONGER\_ACCESSIBLE': 'PHOTO\_NO\_LONGER\_ACCESSIBLE',
    'PHOTO\_INVISIBLE': 'PHOTO\_INVISIBLE',
    'PHOTO\_ALBUM\_FULL': 'PHOTO\_ALBUM\_FULL',
    'PHOTO\_DUPLICATED\_UPLOAD': 'PHOTO\_DUPLICATED\_UPLOAD',
    'PHOTO\_UNPUBLISHABLE': 'PHOTO\_UNPUBLISHABLE',
    'PHOTO\_PENDING\_CENSORSHIP': 'PHOTO\_PENDING\_CENSORSHIP',
    'PHOTO\_BATTLE\_HISTORY\_EXISTS': 'PHOTO\_BATTLE\_HISTORY\_EXISTS',
    'PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS': 'PHOTO\_CASUAL\_BATTLE\_HISTORY\_EXISTS',
    'PHOTO\_QUALITY\_TOO\_LOW': 'PHOTO\_QUALITY\_TOO\_LOW',
    'PHOTO\_PREVIOUS\_DEFEAT': 'PHOTO\_PREVIOUS\_DEFEAT',
    'PHOTO\_NOT\_REPORTED': 'PHOTO\_NOT\_REPORTED',
    'PHOTO\_TAG\_MISMATCH': 'PHOTO\_TAG\_MISMATCH',
    'PHOTO\_TAG\_UNSUPPORTED': 'PHOTO\_TAG\_UNSUPPORTED',
    'PHOTO\_INVALID\_TYPE': 'PHOTO\_INVALID\_TYPE',
    'PHOTO\_NOT\_FOUND': 'PHOTO\_NOT\_FOUND',
    'PHOTO\_APPROVE\_FAILED': 'PHOTO\_APPROVE\_FAILED',
    'PHOTO\_NOT\_ADMIN': 'PHOTO\_NOT\_ADMIN',
    'PHOTO\_DELETE\_FAILED': 'PHOTO\_DELETE\_FAILED',
    'PHOTO\_UPLOAD\_FAILED': 'PHOTO\_UPLOAD\_FAILED',
    'DECK\_MAX\_LIMIT': 'DECK\_MAX\_LIMIT',
    'DECK\_CAMERA\_MISMATCH': 'DECK\_CAMERA\_MISMATCH',
    'DECK\_CAMERA\_INVALID': 'DECK\_CAMERA\_INVALID',
    'DECK\_CAMERA\_EXISTS': 'DECK\_CAMERA\_EXISTS',
    'DECK\_NOT\_FOUND': 'DECK\_NOT\_FOUND',
    'DECK\_INCORRECT\_UPDATE\_FLAG': 'DECK\_INCORRECT\_UPDATE\_FLAG',
    'SPOT\_NOT\_FOUND': 'SPOT\_NOT\_FOUND',
    'SPOT\_IS\_EXISTING': 'SPOT\_IS\_EXISTING',
    'SPOT\_ATTRIBUTE\_EXISTS': 'SPOT\_ATTRIBUTE\_EXISTS',
    'SPOT\_ATTRIBUTE\_NOT\_FOUND': 'SPOT\_ATTRIBUTE\_NOT\_FOUND',
    'SPOT\_ATTRIBUTE\_IN\_USE': 'SPOT\_ATTRIBUTE\_IN\_USE',
    'SPOT\_PHOTO\_EXISTS': 'SPOT\_PHOTO\_EXISTS',
    'SPOT\_INCORRECT\_UPDATE\_FLAG': 'SPOT\_INCORRECT\_UPDATE\_FLAG',
    'SPOT\_PHOTO\_ERROR': 'SPOT\_PHOTO\_ERROR',
    'SPOT\_PHOTO\_NOT\_FOUND': 'SPOT\_PHOTO\_NOT\_FOUND',
    'SPOT\_LATITUDE\_LONGITUDE\_REQUIRED': 'SPOT\_LATITUDE\_LONGITUDE\_REQUIRED',
    'SPOT\_WAEVE\_OUT\_OF\_RANGE': 'SPOT\_WAEVE\_OUT\_OF\_RANGE',
    'SPOT\_CANNOT\_BE\_DELETED': 'SPOT\_CANNOT\_BE\_DELETED',
    'SPOT\_ALREADY\_CAPTURED': 'SPOT\_ALREADY\_CAPTURED',
    'EXPLORER\_INSUFFICIENT\_ENERGY': 'EXPLORER\_INSUFFICIENT\_ENERGY',
    'FLAG\_ALREADY\_CONSTRUCTED': 'FLAG\_ALREADY\_CONSTRUCTED',
    'FLAG\_MAX\_LEVEL': 'FLAG\_MAX\_LEVEL',
    'FLAG\_NOT\_FOUND': 'FLAG\_NOT\_FOUND',
    'FLAG\_FULL\_ENDURANCE': 'FLAG\_FULL\_ENDURANCE',
    'REACHED\_MAX\_BATTLES': 'REACHED\_MAX\_BATTLES',
    'REACHED\_MAX\_STARS': 'REACHED\_MAX\_STARS',
    'BATTLE\_ALREADY\_SETTLED': 'BATTLE\_ALREADY\_SETTLED',
    'BATTLE\_NO\_LONGER\_ACCESSIBLE': 'BATTLE\_NO\_LONGER\_ACCESSIBLE',
    'BATTLE\_CANNNOT\_BE\_CANCELLED\_YET': 'BATTLE\_CANNNOT\_BE\_CANCELLED\_YET',
    'REACHED\_MAX\_DAILY\_ENTRIES': 'REACHED\_MAX\_DAILY\_ENTRIES',
    'BATTLE\_ALREADY\_VOTED': 'BATTLE\_ALREADY\_VOTED',
    'REACHED\_MAX\_BATTLES\_PER\_PHOTO': 'REACHED\_MAX\_BATTLES\_PER\_PHOTO',
    'BATTLE\_ALREADY\_KICKED\_OFF': 'BATTLE\_ALREADY\_KICKED\_OFF',
    'BATTLE\_ALREADY\_JOINED': 'BATTLE\_ALREADY\_JOINED',
    'BATTLE\_NOT\_YET\_JOINED': 'BATTLE\_NOT\_YET\_JOINED',
    'BATTLE\_NOT\_JOINABLE\_BY\_BAN': 'BATTLE\_NOT\_JOINABLE\_BY\_BAN',
    'BATTLE\_NOT\_READY': 'BATTLE\_NOT\_READY',
    'BATTLE\_NOT\_OWNED\_BY\_YOU': 'BATTLE\_NOT\_OWNED\_BY\_YOU',
    'BATTLE\_OWNED\_BY\_YOU': 'BATTLE\_OWNED\_BY\_YOU',
    'BATTLE\_UNFOUND': 'BATTLE\_UNFOUND',
    'BATTLE\_ALREADY\_FULL': 'BATTLE\_ALREADY\_FULL',
    'BATTLE\_PHOTO\_UNPICKED': 'BATTLE\_PHOTO\_UNPICKED',
    'BATTLE\_PHOTO\_ALREADY\_PICKED': 'BATTLE\_PHOTO\_ALREADY\_PICKED',
    'NFT\_OUT\_OF\_STOCK': 'NFT\_OUT\_OF\_STOCK',
    'NFT\_NOT\_OWNED\_BY\_YOU': 'NFT\_NOT\_OWNED\_BY\_YOU',
    'NFT\_ALREADY\_UNBOXED': 'NFT\_ALREADY\_UNBOXED',
    'NFT\_NOT\_UNBOXED': 'NFT\_NOT\_UNBOXED',
    'NFT\_NOT\_ENOUGH\_SKILL\_POINTS': 'NFT\_NOT\_ENOUGH\_SKILL\_POINTS',
    'NFT\_NOT\_ENOUGH\_BATTERIES': 'NFT\_NOT\_ENOUGH\_BATTERIES',
    'NFT\_NOT\_ENOUGH\_FILMS': 'NFT\_NOT\_ENOUGH\_FILMS',
    'NFT\_REACHED\_MAX\_LEVEL': 'NFT\_REACHED\_MAX\_LEVEL',
    'NFT\_UPGRADE\_COOLDOWN': 'NFT\_UPGRADE\_COOLDOWN',
    'NFT\_TRANSFER\_COOLDOWN': 'NFT\_TRANSFER\_COOLDOWN',
    'NFT\_MINT\_COOLDOWN': 'NFT\_MINT\_COOLDOWN',
    'NFT\_ZERO\_DURABILITY': 'NFT\_ZERO\_DURABILITY',
    'NFT\_CAMERA\_IS\_NOT\_BROKEN': 'NFT\_CAMERA\_IS\_NOT\_BROKEN',
    'NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER': 'NFT\_NOT\_UPGRADABLE\_WITH\_BOOSTER',
    'NFT\_BATTERY\_FULL': 'NFT\_BATTERY\_FULL',
    'NFT\_ACCESSORY\_SLOTS\_FULL': 'NFT\_ACCESSORY\_SLOTS\_FULL',
    'NFT\_ACCESSORY\_NOT\_EQUIPPED': 'NFT\_ACCESSORY\_NOT\_EQUIPPED',
    'NFT\_ACCESSORY\_FUSION\_LIMIT': 'NFT\_ACCESSORY\_FUSION\_LIMIT',
    'NFT\_ACCESSORY\_IS\_IN\_USE': 'NFT\_ACCESSORY\_IS\_IN\_USE',
    'NFT\_ACCESSORY\_FUSION\_NOT\_SAME': 'NFT\_ACCESSORY\_FUSION\_NOT\_SAME',
    'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR': 'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_STAR',
    'NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND': 'NFT\_ACCESSORY\_FUSION\_STAR\_UNFOUND',
    'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE': 'NFT\_ACCESSORY\_FUSION\_UNEQUAL\_GRADE',
    'NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE':
        'NFT\_ACCESSORY\_FUSION\_REACHED\_MAX\_GRADE',
    'NFT\_NO\_SKILL\_POINTS\_USED': 'NFT\_NO\_SKILL\_POINTS\_USED',
    'NFT\_MAX\_ROULETTE\_SPIN': 'NFT\_MAX\_ROULETTE\_SPIN',
    'NFT\_SKIN\_ALREADY\_EQUIPPED': 'NFT\_SKIN\_ALREADY\_EQUIPPED',
    'NFT\_ACCESSORY\_NOT\_EQUIPPED': 'NFT\_ACCESSORY\_NOT\_EQUIPPED2',
    'NFT\_EXTRA\_SLOT\_IN\_USE': 'NFT\_EXTRA\_SLOT\_IN\_USE',
    'NFT\_INCOMPATIBLE\_TYPE': 'NFT\_INCOMPATIBLE\_TYPE',
    'NFT\_NOT\_FOUND': 'NFT\_NOT\_FOUND',
    'EXPLORER\_ALREADY\_EXISTS': 'EXPLORER\_ALREADY\_EXISTS',
    'NFT\_ATTRIBUTE\_EXISTS': 'NFT\_ATTRIBUTE\_EXISTS',
    'NFT\_ATTRIBUTE\_NOT\_FOUND': 'NFT\_ATTRIBUTE\_NOT\_FOUND',
    'NFT\_ATTRIBUTE\_IN\_USE': 'NFT\_ATTRIBUTE\_IN\_USE',
    'NFT\_CREATION\_FAILED': 'NFT\_CREATION\_FAILED',
    'MINT\_LEVEL\_NOT\_MAX': 'MINT\_LEVEL\_NOT\_MAX',
    'MINT\_BATTERY\_NOT\_FULL': 'MINT\_BATTERY\_NOT\_FULL',
    'MINT\_REACHED\_MAX\_COUNT': 'MINT\_REACHED\_MAX\_COUNT',
    'MINT\_LEFTHAND\_NOT\_MINTABLE': 'MINT\_LEFTHAND\_NOT\_MINTABLE',
    'MINT\_RIGHTHAND\_NOT\_MINTABLE': 'MINT\_RIGHTHAND\_NOT\_MINTABLE',
    'MINT\_LEFTHAND\_BROKEN': 'MINT\_LEFTHAND\_BROKEN',
    'MINT\_RIGHTHAND\_BROKEN': 'MINT\_RIGHTHAND\_BROKEN',
    'MINT\_SCROLL\_INSUFFICIENT': 'MINT\_SCROLL\_INSUFFICIENT',
    'BADGE\_ALREADY\_OWNED': 'BADGE\_ALREADY\_OWNED',
    'BADGE\_UNPURCHASABLE': 'BADGE\_UNPURCHASABLE',
    'BADGE\_RANK\_CANNOT\_BE\_BOOST': 'BADGE\_RANK\_CANNOT\_BE\_BOOST',
    'BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST': 'BADGE\_RANK\_REACHED\_MAXIMUM\_BOOST',
    'BADGE\_UNSELLABLE': 'BADGE\_UNSELLABLE',
    'INVENTORY\_ITEM\_UNFOUND': 'INVENTORY\_ITEM\_UNFOUND',
    'INVENTORY\_ITEM\_OUT\_OF\_PERIOD': 'INVENTORY\_ITEM\_OUT\_OF\_PERIOD',
    'INVENTORY\_ITEM\_IN\_USE': 'INVENTORY\_ITEM\_IN\_USE',
    'INVENTORY\_ITEM\_NOT\_IN\_USE': 'INVENTORY\_ITEM\_NOT\_IN\_USE',
    'INVENTORY\_ITEM\_UNEQUIPABLE': 'INVENTORY\_ITEM\_UNEQUIPABLE',
    'BALANCE\_INSUFFICIENT': 'BALANCE\_INSUFFICIENT',
    'INSUFFICIENT\_SUPPLY\_OF\_STP': 'INSUFFICIENT\_SUPPLY\_OF\_STP',
    'INSUFFICIENT\_SUPPLY\_OF\_SNPT': 'INSUFFICIENT\_SUPPLY\_OF\_SNPT',
    'LIQUIDITIES\_CHANGED': 'LIQUIDITIES\_CHANGED',
    'EXTERNAL\_WALLET\_UNFOUND': 'EXTERNAL\_WALLET\_UNFOUND',
    'WITHDRAW\_DAILY\_LIMIT\_REACHED': 'WITHDRAW\_DAILY\_LIMIT\_REACHED',
    'WITHDRAW\_NOT\_PERMITTED': 'WITHDRAW\_NOT\_PERMITTED',
    'REVENUECAT\_ERROR': 'REVENUECAT\_ERROR',
    'MAIL\_TEMPLATE\_UNFOUND': 'MAIL\_TEMPLATE\_UNFOUND',
    'MAIL\_ATTACHMENT\_EXPIRED': 'MAIL\_ATTACHMENT\_EXPIRED',
    'LOOTBOX\_MYSTERY\_SLOTS\_FULL': 'LOOTBOX\_MYSTERY\_SLOTS\_FULL',
    'LOOTBOX\_MYSTERY\_COOLDOWN': 'LOOTBOX\_MYSTERY\_COOLDOWN',
    'GACHA\_UNFOUND': 'GACHA\_UNFOUND',
    'GACHA\_OUT\_OF\_PERIOD': 'GACHA\_OUT\_OF\_PERIOD',
    'SHOP\_PRODUCT\_UNFOUND': 'SHOP\_PRODUCT\_UNFOUND',
    'SHOP\_PRODUCT\_CONTENTS\_INVALID': 'SHOP\_PRODUCT\_CONTENTS\_INVALID',
    'SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED':
        'SHOP\_PRODUCT\_PURCHASE\_LIMIT\_EXCEEDED',
    'RENTAL\_NOT\_QUALIFIED': 'RENTAL\_NOT\_QUALIFIED',
    'RENTAL\_CONTRACT\_NOT\_FOUND': 'RENTAL\_CONTRACT\_NOT\_FOUND',
    'RENTAL\_CONTRACT\_NOT\_AVAILABLE': 'RENTAL\_CONTRACT\_NOT\_AVAILABLE',
    'RENTAL\_CONTRACT\_ONGOING': 'RENTAL\_CONTRACT\_ONGOING',
    'RENTAL\_CONTRACT\_TERMINATED': 'RENTAL\_CONTRACT\_TERMINATED',
    'RENTAL\_CAMERAS\_PACK\_IN\_USE': 'RENTAL\_CAMERAS\_PACK\_IN\_USE',
    'RENTAL\_CAMERAS\_PACK\_NOT\_FOUND': 'RENTAL\_CAMERAS\_PACK\_NOT\_FOUND',
    'RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU':
        'RENTAL\_CAMERAS\_PACK\_NOT\_OWNED\_BY\_YOU',
    'RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT': 'RENTAL\_CAMERAS\_PACK\_INVALID\_COUNT',
    'RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND':
        'RENTAL\_CAMERAS\_PACK\_MAIN\_CAMERA\_NOT\_FOUND',
    'RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL':
        'RENTAL\_CAMERAS\_PACK\_SUB\_CAMERAS\_INSUFFICIENT\_LEVEL',
    'RENTAL\_CONTRACT\_LIMIT\_REACHED': 'RENTAL\_CONTRACT\_LIMIT\_REACHED',
    'RENTAL\_NFT\_NOT\_FOUND': 'RENTAL\_NFT\_NOT\_FOUND',
    'RENTAL\_NFT\_IN\_USE': 'RENTAL\_NFT\_IN\_USE',
    'INVALID\_PARAMETER': 'INVALID\_PARAMETER',
    'INVALID\_MIME\_TYPE': 'INVALID\_MIME\_TYPE',
    'UNDER\_MAINTENANCE': 'UNDER\_MAINTENANCE',
    'UNKNOWN': 'UNKNOWN',
    'VALIDATION\_ERROR': 'VALIDATION\_ERROR',
    'IS\_SPAM': 'IS\_SPAM',
    'RECAPTCHA\_REQUEST\_ERROR': 'RECAPTCHA\_REQUEST\_ERROR',
    'RECAPTCHA\_ACTION\_TYPE\_UNMATCHED': 'RECAPTCHA\_ACTION\_TYPE\_UNMATCHED',
    'RECAPTCHA\_SCORE\_TOO\_LOW': 'RECAPTCHA\_SCORE\_TOO\_LOW',
    'AUTH\_ERROR': 'AUTH\_ERROR',
    'SNPIT\_ERROR': 'SNPIT\_ERROR',
  };

  @override
  final Iterable&lt;Type&gt; types = const &lt;Type&gt;\[ApiErrorResponseDTOErrorTypeEnum\];
  @override
  final String wireName = 'ApiErrorResponseDTOErrorTypeEnum';

  @override
  Object serialize(
          Serializers serializers, ApiErrorResponseDTOErrorTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =&gt;
      \_toWire\[object.name\] ?? object.name;

  @override
  ApiErrorResponseDTOErrorTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =&gt;
      ApiErrorResponseDTOErrorTypeEnum.valueOf(
          \_fromWire\[serialized\] ?? (serialized is String ? serialized : ''));
}

class \_$ApiErrorResponseDTO extends ApiErrorResponseDTO {
  @override
  final num code;
  @override
  final num statusCode;
  @override
  final ApiErrorResponseDTOErrorTypeEnum errorType;
  @override
  final String errorMessage;

  factory \_$ApiErrorResponseDTO(
          \[void Function(ApiErrorResponseDTOBuilder)? updates\]) =&gt;
      (new ApiErrorResponseDTOBuilder()..update(updates)).\_build();

  \_$ApiErrorResponseDTO.\_(
      {required this.code,
      required this.statusCode,
      required this.errorType,
      required this.errorMessage})
      : super.\_() {
    BuiltValueNullFieldError.checkNotNull(code, r'ApiErrorResponseDTO', 'code');
    BuiltValueNullFieldError.checkNotNull(
        statusCode, r'ApiErrorResponseDTO', 'statusCode');
    BuiltValueNullFieldError.checkNotNull(
        errorType, r'ApiErrorResponseDTO', 'errorType');
    BuiltValueNullFieldError.checkNotNull(
        errorMessage, r'ApiErrorResponseDTO', 'errorMessage');
  }

  @override
  ApiErrorResponseDTO rebuild(
          void Function(ApiErrorResponseDTOBuilder) updates) =&gt;
      (toBuilder()..update(updates)).build();

  @override
  ApiErrorResponseDTOBuilder toBuilder() =&gt;
      new ApiErrorResponseDTOBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ApiErrorResponseDTO &&
        code == other.code &&
        statusCode == other.statusCode &&
        errorType == other.errorType &&
        errorMessage == other.errorMessage;
  }

  @override
  int get hashCode {
    var \_$hash = 0;
    \_$hash = $jc(\_$hash, code.hashCode);
    \_$hash = $jc(\_$hash, statusCode.hashCode);
    \_$hash = $jc(\_$hash, errorType.hashCode);
    \_$hash = $jc(\_$hash, errorMessage.hashCode);
    \_$hash = $jf(\_$hash);
    return \_$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ApiErrorResponseDTO')
          ..add('code', code)
          ..add('statusCode', statusCode)
          ..add('errorType', errorType)
          ..add('errorMessage', errorMessage))
        .toString();
  }
}

class ApiErrorResponseDTOBuilder
    implements Builder&lt;ApiErrorResponseDTO, ApiErrorResponseDTOBuilder&gt; {
  \_$ApiErrorResponseDTO? \_$v;

  num? \_code;
  num? get code =&gt; \_$this.\_code;
  set code(num? code) =&gt; \_$this.\_code = code;

  num? \_statusCode;
  num? get statusCode =&gt; \_$this.\_statusCode;
  set statusCode(num? statusCode) =&gt; \_$this.\_statusCode = statusCode;

  ApiErrorResponseDTOErrorTypeEnum? \_errorType;
  ApiErrorResponseDTOErrorTypeEnum? get errorType =&gt; \_$this.\_errorType;
  set errorType(ApiErrorResponseDTOErrorTypeEnum? errorType) =&gt;
      \_$this.\_errorType = errorType;

  String? \_errorMessage;
  String? get errorMessage =&gt; \_$this.\_errorMessage;
  set errorMessage(String? errorMessage) =&gt; \_$this.\_errorMessage = errorMessage;

  ApiErrorResponseDTOBuilder() {
    ApiErrorResponseDTO.\_defaults(this);
  }

  ApiErrorResponseDTOBuilder get \_$this {
    final $v = \_$v;
    if ($v != null) {
      \_code = $v.code;
      \_statusCode = $v.statusCode;
      \_errorType = $v.errorType;
      \_errorMessage = $v.errorMessage;
      \_$v = null;
    }
    return this;
  }

  @override
  void replace(ApiErrorResponseDTO other) {
    ArgumentError.checkNotNull(other, 'other');
    \_$v = other as \_$ApiErrorResponseDTO;
  }

  @override
  void update(void Function(ApiErrorResponseDTOBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ApiErrorResponseDTO build() =&gt; \_build();

  \_$ApiErrorResponseDTO \_build() {
    final \_$result = \_$v ??
        new \_$ApiErrorResponseDTO.\_(
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'ApiErrorResponseDTO', 'code'),
          statusCode: BuiltValueNullFieldError.checkNotNull(
              statusCode, r'ApiErrorResponseDTO', 'statusCode'),
          errorType: BuiltValueNullFieldError.checkNotNull(
              errorType, r'ApiErrorResponseDTO', 'errorType'),
          errorMessage: BuiltValueNullFieldError.checkNotNull(
              errorMessage, r'ApiErrorResponseDTO', 'errorMessage'),
        );
    replace(\_$result);
    return \_$result;
  }
}

// ignore\_for\_file: deprecated\_member\_use\_from\_same\_package,type=lint

---

## 🔧 ツール
*2025/3/6 15:20:29*

\*\*エラーの発見と原因明確化\*\*

エラーは、マップのキーの重複から生じている。需要時と再試行時に異なるキーを使用しない限り、解決は難しい。

---

## 🤖 アシスタント
*2025/3/6 15:20:26*

This error typically happens because in your OpenAPI spec, you have the exact same error code appearing twice in the **enum** list. When the Dart code generator (via `built_value` or a similar tool) sees duplicate enum entries, it can’t create a valid `Map< Object, String >`, so you end up with a collision in `_fromWire`.

---

### Where the Collision Is

In your `api_error_response_dto.g.dart`, you can see something like this:

```dart
static const Map<Object, String> _fromWire = const <Object, String>{
  ...
  'NFT_ACCESSORY_NOT_EQUIPPED': 'NFT_ACCESSORY_NOT_EQUIPPED2',
  ...
};
```

This happens because the OpenAPI generator found **two** entries in your schema's `enum` for `NFT_ACCESSORY_NOT_EQUIPPED`, or it tried to rename a second one to `_NOT_EQUIPPED2`. As soon as it sees the same string repeated, it tries to rename one of them, which leads to a conflict or “key duplication” in the Dart code.

---

### How To Fix

1. **Open the relevant place in your schema**: Specifically, look at the list of enums under `ApiErrorResponseDTO.properties.errorType.enum` in your OpenAPI file. You’ll see `NFT_ACCESSORY_NOT_EQUIPPED` listed twice—once near the top, and once near the bottom, or you may see both spelled out as `NFT_ACCESSORY_NOT_EQUIPPED` in the same array.

2. **Remove or rename the duplicate**: Make sure `NFT_ACCESSORY_NOT_EQUIPPED` appears only once. For example, if you truly need two distinct codes, rename them properly in your OpenAPI spec, e.g.:
   ```yaml
   enum:
     - NFT_ACCESSORY_NOT_EQUIPPED
     - NFT_ACCESSORY_NOT_EQUIPPED_XYZ
   ```
   so that they are actually different strings.  

3. **Re-generate the Dart code**: Once the duplicate is gone (or distinctly renamed), you should be able to run your OpenAPI generator without the “constant evaluation error” or “duplicate key” error.

---

### Example Before and After

**Before** (problematic):
```yaml
errorType:
  type: string
  enum:
    - NFT_ACCESSORY_NOT_EQUIPPED
    ...
    - NFT_ACCESSORY_NOT_EQUIPPED   # repeats here
```

**After** (fixed):
```yaml
errorType:
  type: string
  enum:
    - NFT_ACCESSORY_NOT_EQUIPPED
    ...
    - NFT_ACCESSORY_NOT_EQUIPPED_V2  # or rename to something else unique
```

or simply remove the second entry if it’s not needed.

That’s all! Once you eliminate the duplicate enum entry, the generated code will compile successfully.

---
