# Duplicate Enum Key Fix

日付: 2025-03-06

---

## 👤 ユーザー
*2025/3/6 15:20:25*

Launching lib/main.dart on sdk gphone64 arm64 in debug mode...
guild_api/lib/src/model/api_error_response_dto.g.dart:1354:48: Error: Constant evaluation error:
  static const Map&lt;Object, String&gt; _fromWire = const &lt;Object, String&gt;{
                                               ^
guild_api/lib/src/model/api_error_response_dto.g.dart:1474:5: Context: The key '"NFT_ACCESSORY_NOT_EQUIPPED"' conflicts with another existing key in the map.
    'NFT_ACCESSORY_NOT_EQUIPPED': 'NFT_ACCESSORY_NOT_EQUIPPED2',
    ^
guild_api/lib/src/model/api_error_response_dto.g.dart:1354:36: Context: While analyzing:
  static const Map&lt;Object, String&gt; _fromWire = const &lt;Object, String&gt;{
                                   ^
Target kernel_snapshot_program failed: Exception
2

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:compileFlutterBuildDevDebug'.
&gt; Process 'command '/Users/sugurutakahashi/fvm/versions/3.27.4/bin/flutter'' finished with non-zero exit value 1

* Try:
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
            operationId: AdminExplorerController_getAllExplorers
            parameters: [{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all explorers that current user is having [GME0201]'
            tags: ['Admin - Explorers']
        post:
            operationId: AdminExplorerController_createExplorer
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateExplorerRequestAdminDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new explorer [ADMXXXX]'
            tags: ['Admin - Explorers']
    /admin/explorer-attributes:
        get:
            operationId: AdminExplorerAttributeController_getAllAttributes
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerAttributeListResponseAdminDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all NFT explorer attributes by Admin [ADMXXXX]'
            tags: ['Admin - Explorer Attributes']
        post:
            operationId: AdminExplorerAttributeController_createAttribute
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateExplorerAttributeRequestAdminDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new NFT explorer attribute by Admin [ADMXXXX]'
            tags: ['Admin - Explorer Attributes']
    '/admin/explorer-attributes/{attributeId}':
        delete:
            operationId: AdminExplorerAttributeController_deleteAttribute
            parameters: [{name: attributeId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a NFT explorer attribute by Admin [ADMXXXX]'
            tags: ['Admin - Explorer Attributes']
    /v1/auth/email:
        post:
            operationId: AuthController_sendCode
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthEmailRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SendCodeResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Check email and send auth code [LGN0101, LGN0102, ACN0102]'
            tags: [Auth]
    /v1/auth/login:
        post:
            operationId: AuthController_login
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthLoginRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/AuthLoginResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Check auth code and return access token. Create account record if new. [LGN0101, LGN0102, ACN0102]'
            tags: [Auth]
    /v1/auth/logout:
        post:
            operationId: AuthController_logout
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthLogoutRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/AuthLogoutResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'User Logout performed by Admin [ADMXXX]'
            tags: [Auth]
    /v1/decks:
        get:
            operationId: DeckController_getOwnDeck
            parameters: [{name: userId, required: false, in: query, description: 'Get deck information of other user by userId', schema: {example: 123e4567-e89b-12d3-a456-426614174000, type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetDeckResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve deck information. Own deck if no query. [DCK0101]'
            tags: [Decks]
        post:
            operationId: DeckController_createDeck
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateDeckRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new deck [DCK0301]'
            tags: [Decks]
        put:
            operationId: DeckController_upsertDeckCameras
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckCameraRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update deck camera combination or create new deck if not available [DCK0201]'
            tags: [Decks]
    '/v1/decks/{deckId}':
        get:
            operationId: DeckController_getDecksByUserId
            parameters: [{name: deckId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetDeckResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve deck information by deckId [DCK0101]'
            tags: [Decks]
    '/v1/decks/{deckId}/cameras':
        put:
            operationId: DeckController_updateDeckCameras
            parameters: [{name: deckId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckCameraRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update deck camera combination [DCK0201]'
            tags: [Decks]
    '/v1/decks/{deckId}/info':
        put:
            operationId: DeckController_updateDeck
            parameters: [{name: deckId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckInfoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update deck information [DCK0201]'
            tags: [Decks]
    /v1/cameras:
        get:
            operationId: CamerasController_getCameras
            parameters: [{name: userIds, required: false, in: query, description: 'Get cameras information of other user by userId', schema: {example: '123e4567-e89b-12d3-a456-426614174000,123e4567-e89b-12d3-a456-426614174001', type: array, items: {type: string}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/CameraListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get cameras belong to current user [GMEXXXX]'
            tags: [Cameras]
    /admin/flags:
        get:
            operationId: AdminFlagController_getAllFlags
            parameters: [{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/FlagListResponseAdminDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all flags that current user is having [GME0401]'
            tags: ['Admin - Flags']
        post:
            operationId: AdminFlagController_createExplorer
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateFlagRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new flag [ADMXXXX]'
            tags: ['Admin - Flags']
    /admin/flag-attributes:
        get:
            operationId: AdminFlagAttributeController_getAllAttributes
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/FlagAttributeListResponseAdminDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all NFT flag attributes by Admin [ADMXXXX]'
            tags: ['Admin - Flag Attributes']
        post:
            operationId: AdminFlagAttributeController_createAttribute
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateFlagAttributeRequestAdminDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new NFT flag attribute by Admin [ADMXXXX]'
            tags: ['Admin - Flag Attributes']
    '/admin/flag-attributes/{attributeId}':
        delete:
            operationId: AdminFlagAttributeController_deleteAttribute
            parameters: [{name: attributeId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a NFT flag attribute by Admin [ADMXXXX]'
            tags: ['Admin - Flag Attributes']
    /admin/items:
        get:
            operationId: AdminItemController_getItems
            parameters: [{name: itemCategory, required: false, in: query, description: 'Filter items by itemCategory', schema: {type: array, items: {type: string, enum: [DECOY_SPOT, FLAG_REPAIR, HEAL_EXPLORER, SCOUT_SPOT_ENDURANCE]}}}, {name: itemStatus, required: false, in: query, description: 'Filter items by itemStatus', schema: {type: array, items: {type: string, enum: [NEW, ACTIVE, INACTIVE, DELETED]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemsResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all items by Admin [ADMXXXX]'
            tags: ['Admin - Items']
        post:
            operationId: AdminItemController_createItem
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateItemRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create an item by Admin [ADMXXXX]'
            tags: ['Admin - Items']
        put:
            operationId: AdminItemController_updateItem
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateItemRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update an item by Admin [ADMXXXX]'
            tags: ['Admin - Items']
    /admin/items/give:
        post:
            operationId: AdminItemController_giveItems
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/GiveItemRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get item to specific user by Admin [ADMXXXX]'
            tags: ['Admin - Items']
    '/admin/items/del/{itemId}':
        delete:
            operationId: AdminItemController_deleteItem
            parameters: [{name: itemId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete an item by Admin [ADMXXXX]'
            tags: ['Admin - Items']
    /admin/item-boxes:
        get:
            operationId: AdminItemBoxController_getItemBoxes
            parameters: [{name: userLatitude, required: false, in: query, schema: {example: 35.654444, type: number}}, {name: userLongitude, required: false, in: query, schema: {example: 139.8754444, type: number}}, {name: itemCategory, required: false, in: query, description: 'TBD : Filter item boxes by itemCategory', schema: {type: array, items: {type: string, enum: [DECOY_SPOT, FLAG_REPAIR, HEAL_EXPLORER, SCOUT_SPOT_ENDURANCE]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemBoxResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all unopened item boxes [GME0101]'
            tags: ['Admin - Item Boxes']
        post:
            operationId: AdminItemBoxController_createItemBox
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateItemBoxRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create an item box by Admin [ADMXXXX]'
            tags: ['Admin - Item Boxes']
    /admin/spots:
        get:
            operationId: AdminSpotController_getAllSpots
            parameters: [{name: range, required: false, in: query, schema: {example: 100, type: number}}, {name: userLatitude, required: false, in: query, schema: {example: 35.654444, type: number}}, {name: userLongitude, required: false, in: query, schema: {example: 139.8754444, type: number}}, {name: favorite, required: false, in: query, schema: {type: boolean}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all existing spots with its position [ADMXXXX]'
            tags: ['Admin - Spots']
        post:
            operationId: AdminSpotController_createSpot
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateSpotRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new spot by Admin [ADM0101]'
            tags: ['Admin - Spots']
    '/admin/spots/{spotId}':
        get:
            operationId: AdminSpotController_getSpotInfo
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed'}, '500': {description: 'Internal server error'}}
            summary: 'Get a spot information by Admin [ADM0101]'
            tags: ['Admin - Spots']
        put:
            operationId: AdminSpotController_updateSpotInfo
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotInfoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update a spot information by Admin [ADM0101]'
            tags: ['Admin - Spots']
        delete:
            operationId: AdminSpotController_deleteSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a spot by Admin. This will automatically delete the photo in the DB [ADM0102]'
            tags: ['Admin - Spots']
    '/admin/spots/{spotId}/photos':
        put:
            operationId: AdminSpotController_updateSpotPhoto
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotPhotoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update a spot main photo by Admin [ADM0101]'
            tags: ['Admin - Spots']
    /admin/spot-attributes:
        get:
            operationId: AdminSpotAttributeController_getAllAttributes
            parameters: [{name: rarity, required: false, in: query, description: 'Filter spot attributes by rarity', schema: {type: array, items: {type: string, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotAtributeListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all spot attributes by Admin [ADMXXXX]'
            tags: ['Admin - Spot Attributes']
        post:
            operationId: AdminSpotAttributeController_createAttribute
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/CreateSpotAttributeRequestDTO'}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new spot attribute by Admin [ADMXXXX]'
            tags: ['Admin - Spot Attributes']
    '/admin/spot-attributes/{attributeId}':
        delete:
            operationId: AdminSpotAttributeController_deleteAttribute
            parameters: [{name: attributeId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete a spot attribute by Admin [ADMXXXX]'
            tags: ['Admin - Spot Attributes']
    /v1/explorers:
        get:
            operationId: ExplorerController_getAllExplorers
            parameters: [{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all explorers that current user is having [GME0201]'
            tags: [Explorers]
    '/v1/explorers/{explorerId}/search':
        post:
            operationId: ExplorerController_updateExplorer
            parameters: [{name: explorerId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/SearchRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SearchResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Perform search to find the spot [GME0202, GME0203, GME0204, GME0205]'
            tags: [Explorers]
    /v1/flags:
        get:
            operationId: FlagController_getAllFlags
            parameters: [{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/FlagListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all flags that current user is having [GME0401]'
            tags: [Flags]
    '/v1/flags/{flagId}/construct/{spotId}':
        put:
            operationId: FlagController_constructFlag
            parameters: [{name: flagId, required: true, in: path, schema: {type: string}}, {name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Construct NFT flag in the spot [GME0402, GME0403]'
            tags: [Flags]
    '/v1/flags/{flagId}/mint':
        put:
            operationId: FlagController_mintFlag
            parameters: [{name: flagId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Mint NFT flag from 2 existing NFT Flags [GME0405] (TBD: Phase 2)'
            tags: [Flags]
    '/v1/flags/{flagId}/upgrade':
        put:
            operationId: FlagController_upgradeFlag
            parameters: [{name: flagId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Upgrade the flag level [GME0404]'
            tags: [Flags]
    /v1/guilds/self:
        get:
            operationId: GuildController_getGuildInfoOfUser
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get guild information of requested user[GLD0101]'
            tags: [Guilds]
    '/v1/guilds/other/{guildId}':
        get:
            operationId: GuildController_getGuildInfo
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get guild information from guild ID[GLD0103, GLD0201]'
            tags: [Guilds]
    /v1/guilds:
        put:
            operationId: GuildController_updateGuildInfo
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildInfoRequestDto'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Update guild information by guild owner/admin [GLD0301, GLD0302]'
            tags: [Guilds]
        post:
            operationId: GuildController_createGuild
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateGuildRequestDto'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create a new guild [GLD0103, GLD0301, GLD0302]'
            tags: [Guilds]
        delete:
            operationId: GuildController_deleteGuild
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete guild by guild owner[GLDXXXX]'
            tags: [Guilds]
    /v1/guilds/spots:
        get:
            operationId: GuildController_getGuildSpots
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildSpotsResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all guild spots [GLD0401]'
            tags: [Guilds]
    '/v1/guilds/spots/{spotId}':
        get:
            operationId: GuildController_getGuildSpotDetail
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildSpotDetailResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all guild detail spot information including flag [GLDXXXX]'
            tags: [Guilds]
    /v1/guilds/flags:
        get:
            operationId: GuildController_getGuildFlags
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildFlagsResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all guild constructed flags [GLDXXXX]'
            tags: [Guilds]
    '/v1/guilds/flags/{flagId}':
        delete:
            operationId: GuildController_removeFlag
            parameters: [{name: flagId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Remove flag that has been contructed [GLDXXXX]'
            tags: [Guilds]
    /v1/users/self:
        get:
            operationId: UserController_getCurrentUserInfo
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/UserResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve current user information [ACN0201, ACN0202, ACN0203]'
            tags: [Users]
    '/v1/users/other/{userId}':
        get:
            operationId: UserController_getAccountbyId
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/UserResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve other user infromation by userId [ACN0201, ACN0202, ACN0203]'
            tags: [Users]
    /v1/users/nfts:
        get:
            operationId: UserController_getUserNfts
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetUserNftsResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve nfts belong to current user [GMEXXXX]'
            tags: [Users]
    /v1/users:
        post:
            operationId: UserController_createUser
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Create new user user [ACN0101]'
            tags: [Users]
        delete:
            operationId: UserController_deleteAccount
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete user account [ACN0207]'
            tags: [Users]
    '/v1/users/ban/{userId}':
        put:
            operationId: UserController_banAccount
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Ban user account [ADMXXX]'
            tags: [Users]
    '/v1/users/unban/{userId}':
        put:
            operationId: UserController_unbanAccount
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Unban user [ADMXXX]'
            tags: [Users]
    /v1/wallet:
        get:
            operationId: WalletController_getBalance
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/WalletBalanceResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get wallet address and balances [GMEXXXX]'
            tags: [Wallet]
    /v1/spots:
        get:
            operationId: SpotController_getAllSpots
            parameters: [{name: range, required: false, in: query, schema: {example: 100, type: number}}, {name: userLatitude, required: false, in: query, schema: {example: 35.654444, type: number}}, {name: userLongitude, required: false, in: query, schema: {example: 139.8754444, type: number}}, {name: favorite, required: false, in: query, schema: {type: boolean}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all existing spots [GME0101, GME0501]'
            tags: [Spots]
    '/v1/spots/{spotId}':
        get:
            operationId: SpotController_getSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotDetailResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get a spot detail information by spotId [GLD0402, GME0502]'
            tags: [Spots]
    '/v1/spots/{spotId}/favorite':
        post:
            operationId: SpotController_favorite
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}, {name: deactivate, required: false, in: query, schema: {type: boolean}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Favorite the spot [GMEXXXX]'
            tags: [Spots]
    '/v1/spots/{spotId}/waeve':
        put:
            operationId: SpotController_waeveSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/WaeveRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/WaeveResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Waeve the spot after upload the photo [GME0302, GME0303, GME0304, GME0305, GLD0404]'
            tags: [Spots]
    '/v1/guild-members/members/request/{guildId}':
        post:
            operationId: GuildMemberController_requestToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Request to join the quild [GLD0103, GLD0202]'
            tags: [Guild-members]
    '/v1/guild-members/members/invite/{userId}':
        post:
            operationId: GuildMemberController_inviteToJoinGuild
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Invite to join the guild [GLD0202]'
            tags: [Guild-members]
    '/v1/guild-members/members/approve/{userId}/{guildId}':
        put:
            operationId: GuildMemberController_approveToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Approve to join the guild. userId != requested user, means approved "request". userId = requested user, means approved "invite".  [GLD0303]'
            tags: [Guild-members]
    '/v1/guild-members/members/reject/{userId}/{guildId}':
        delete:
            operationId: GuildMemberController_rejectToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Reject to join the guild. userId != requested user, means rejected "request". userId = requested user, means rejected "invite".  [GLDXXXX]'
            tags: [Guild-members]
    /v1/guild-members/members/leave:
        delete:
            operationId: GuildMemberController_leaveFromGuild
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Leave from the guild. [GLD0202, GLD0303]'
            tags: [Guild-members]
    '/v1/guild-members/members/kick/{userId}':
        delete:
            operationId: GuildMemberController_kickFromGuild
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Kicked from guild. [GLD0102]'
            tags: [Guild-members]
    /v1/guild-members/members/role:
        put:
            operationId: GuildMemberController_updateGuildMember
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildMemberRoleRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Change guild member role. [GLDXXXX]'
            tags: [Guild-members]
    /v1/items:
        get:
            operationId: ItemController_getUserItems
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetUserItemsResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Retrieve items belong to current user [GMEXXXX]'
            tags: [Items]
    /v1/items/decoy:
        post:
            operationId: ItemController_useDecoy
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UseDecoyRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'The user use decoy item [GME0602]'
            tags: [Items]
    '/v1/items/repair/{flagId}':
        put:
            operationId: ItemController_useRepair
            parameters: [{name: flagId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'The user use repair item to recover NFT flag endurance[GME0603]'
            tags: [Items]
    '/v1/items/scout/{spotId}':
        get:
            operationId: ItemController_useScout
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetSpotEnduranceResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'The user use scout item to get spot endurance [GME0604]'
            tags: [Items]
    /v1/item-boxes:
        get:
            operationId: ItemBoxController_getItemBoxes
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemBoxResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all item boxes that user has found [GME0101]'
            tags: ['Item Boxes']
    /v1/item-boxes/open:
        post:
            operationId: ItemBoxController_openItemBox
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/OpenBoxRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/OpenBoxResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Open an item box [GME0102]'
            tags: ['Item Boxes']
    '/v1/nft/metadata/{tokenId}.json':
        get:
            operationId: NftController_getMetadata
            parameters: [{name: tokenId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/NftMetadata'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get NFT metadata'
            tags: [NFT]
    /v1/photos:
        get:
            operationId: PhotosController_getAllPhotos
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoListResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Get all photos uploaded by current users [GMEXXX]'
            tags: [Photos]
        post:
            operationId: PhotosController_uploadPhoto
            parameters: []
            requestBody: {required: true, description: 'Binary of photo with metadata', content: {multipart/form-data: {schema: {$ref: '#/components/schemas/UploadPhotoRequestForYaml'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoUploadResponseDTO'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Uploaded a photo, separate Admin and User photo using PhotoType [ADM0101, GME0302]'
            tags: [Photos]
    '/v1/photos/{photoId}':
        delete:
            operationId: PhotosController_deletePhotoByHash
            parameters: [{name: photoId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'Delete photo by photoId, separate Admin and User photo using PhotoType [ADM0102]'
            tags: [Photos]
    /health-check:
        get:
            operationId: HealthCheckController_healthCheck
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {type: string}}}}}
            tags: ['Health Check']
    /v1/maintenance:
        post:
            operationId: MaintenanceController_maintenanceMode
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/MaintenanceDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SwitchModeResponseDto'}}}}, '400': {description: 'Data validation failed', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}, '500': {description: 'Internal server error', content: {application/json: {schema: {$ref: '#/components/schemas/ApiErrorResponseDTO'}}}}}
            summary: 'maintenance mode switched by Admin [ADMXXX]'
            tags: [Maintenance]
tags: []
servers: []
components:
    schemas:
        ApiErrorResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code', example: -1, nullable: false}, statusCode: {type: number, description: 'Http status code', example: '400', nullable: false}, errorType: {type: string, description: 'Enum of the error', nullable: false, enum: [USER_VERIFICATION_CODE_COOLDOWN, USER_VERIFICATION_CODE_UNMATCHED, USER_INVIATION_CODE_INVALID, USER_NOT_FOUND, USER_NOT_ENROLLED_IN_MEMBERSHIP, USER_NOT_ADMIN, USER_UNAUTHORIZED, USER_EXISTS, USER_INCORRECT_UPDATE_FLAG, ITEM_EXISTS, ITEM_NOT_FOUND, ITEM_IN_USE, ITEM_BOX_EXISTS, ITEM_BOX_NOT_FOUND, GUILD_NOT_FOUND, GUILD_EXISTS, GUILD_INCORRECT_MEMBER_STATUS_UDPATE, GUILD_INCORRECT_MEMBER_ROLE_UDPATE, GUILD_INCORRECT_UPDATE_FLAG, GUILD_INCORRECT_PRIVILEGE, GUILD_DUPLICATE_MEMBER, GUILD_INFO_LENGTH_EXCEEDED, GUILD_MEMBER_EXISTS, GUILD_MAX_MEMBERS, GUILD_MAX_ADMINS, GUILD_USER_NOT_MEMBER, GUILD_SPOT_NOT_FOUND, PHOTO_NOT_OWNED_BY_YOU, PHOTO_NO_LONGER_ACCESSIBLE, PHOTO_INVISIBLE, PHOTO_ALBUM_FULL, PHOTO_DUPLICATED_UPLOAD, PHOTO_UNPUBLISHABLE, PHOTO_PENDING_CENSORSHIP, PHOTO_BATTLE_HISTORY_EXISTS, PHOTO_CASUAL_BATTLE_HISTORY_EXISTS, PHOTO_QUALITY_TOO_LOW, PHOTO_PREVIOUS_DEFEAT, PHOTO_NOT_REPORTED, PHOTO_TAG_MISMATCH, PHOTO_TAG_UNSUPPORTED, PHOTO_INVALID_TYPE, PHOTO_NOT_FOUND, PHOTO_APPROVE_FAILED, PHOTO_NOT_ADMIN, PHOTO_DELETE_FAILED, PHOTO_UPLOAD_FAILED, DECK_MAX_LIMIT, DECK_CAMERA_MISMATCH, DECK_CAMERA_INVALID, DECK_CAMERA_EXISTS, DECK_NOT_FOUND, DECK_INCORRECT_UPDATE_FLAG, SPOT_NOT_FOUND, SPOT_IS_EXISTING, SPOT_ATTRIBUTE_EXISTS, SPOT_ATTRIBUTE_NOT_FOUND, SPOT_ATTRIBUTE_IN_USE, SPOT_PHOTO_EXISTS, SPOT_INCORRECT_UPDATE_FLAG, SPOT_PHOTO_ERROR, SPOT_PHOTO_NOT_FOUND, SPOT_LATITUDE_LONGITUDE_REQUIRED, SPOT_WAEVE_OUT_OF_RANGE, SPOT_CANNOT_BE_DELETED, SPOT_ALREADY_CAPTURED, EXPLORER_INSUFFICIENT_ENERGY, FLAG_ALREADY_CONSTRUCTED, FLAG_MAX_LEVEL, FLAG_NOT_FOUND, FLAG_FULL_ENDURANCE, REACHED_MAX_BATTLES, REACHED_MAX_STARS, BATTLE_ALREADY_SETTLED, BATTLE_NO_LONGER_ACCESSIBLE, BATTLE_CANNNOT_BE_CANCELLED_YET, REACHED_MAX_DAILY_ENTRIES, BATTLE_ALREADY_VOTED, REACHED_MAX_BATTLES_PER_PHOTO, BATTLE_ALREADY_KICKED_OFF, BATTLE_ALREADY_JOINED, BATTLE_NOT_YET_JOINED, BATTLE_NOT_JOINABLE_BY_BAN, BATTLE_NOT_READY, BATTLE_NOT_OWNED_BY_YOU, BATTLE_OWNED_BY_YOU, BATTLE_UNFOUND, BATTLE_ALREADY_FULL, BATTLE_PHOTO_UNPICKED, BATTLE_PHOTO_ALREADY_PICKED, NFT_OUT_OF_STOCK, NFT_NOT_OWNED_BY_YOU, NFT_ALREADY_UNBOXED, NFT_NOT_UNBOXED, NFT_NOT_ENOUGH_SKILL_POINTS, NFT_NOT_ENOUGH_BATTERIES, NFT_NOT_ENOUGH_FILMS, NFT_REACHED_MAX_LEVEL, NFT_UPGRADE_COOLDOWN, NFT_TRANSFER_COOLDOWN, NFT_MINT_COOLDOWN, NFT_ZERO_DURABILITY, NFT_CAMERA_IS_NOT_BROKEN, NFT_NOT_UPGRADABLE_WITH_BOOSTER, NFT_BATTERY_FULL, NFT_ACCESSORY_SLOTS_FULL, NFT_ACCESSORY_NOT_EQUIPPED, NFT_ACCESSORY_FUSION_LIMIT, NFT_ACCESSORY_IS_IN_USE, NFT_ACCESSORY_FUSION_NOT_SAME, NFT_ACCESSORY_FUSION_UNEQUAL_STAR, NFT_ACCESSORY_FUSION_STAR_UNFOUND, NFT_ACCESSORY_FUSION_UNEQUAL_GRADE, NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE, NFT_NO_SKILL_POINTS_USED, NFT_MAX_ROULETTE_SPIN, NFT_SKIN_ALREADY_EQUIPPED, NFT_ACCESSORY_NOT_EQUIPPED, NFT_EXTRA_SLOT_IN_USE, NFT_INCOMPATIBLE_TYPE, NFT_NOT_FOUND, EXPLORER_ALREADY_EXISTS, NFT_ATTRIBUTE_EXISTS, NFT_ATTRIBUTE_NOT_FOUND, NFT_ATTRIBUTE_IN_USE, NFT_CREATION_FAILED, MINT_LEVEL_NOT_MAX, MINT_BATTERY_NOT_FULL, MINT_REACHED_MAX_COUNT, MINT_LEFTHAND_NOT_MINTABLE, MINT_RIGHTHAND_NOT_MINTABLE, MINT_LEFTHAND_BROKEN, MINT_RIGHTHAND_BROKEN, MINT_SCROLL_INSUFFICIENT, BADGE_ALREADY_OWNED, BADGE_UNPURCHASABLE, BADGE_RANK_CANNOT_BE_BOOST, BADGE_RANK_REACHED_MAXIMUM_BOOST, BADGE_UNSELLABLE, INVENTORY_ITEM_UNFOUND, INVENTORY_ITEM_OUT_OF_PERIOD, INVENTORY_ITEM_IN_USE, INVENTORY_ITEM_NOT_IN_USE, INVENTORY_ITEM_UNEQUIPABLE, BALANCE_INSUFFICIENT, INSUFFICIENT_SUPPLY_OF_STP, INSUFFICIENT_SUPPLY_OF_SNPT, LIQUIDITIES_CHANGED, EXTERNAL_WALLET_UNFOUND, WITHDRAW_DAILY_LIMIT_REACHED, WITHDRAW_NOT_PERMITTED, REVENUECAT_ERROR, MAIL_TEMPLATE_UNFOUND, MAIL_ATTACHMENT_EXPIRED, LOOTBOX_MYSTERY_SLOTS_FULL, LOOTBOX_MYSTERY_COOLDOWN, GACHA_UNFOUND, GACHA_OUT_OF_PERIOD, SHOP_PRODUCT_UNFOUND, SHOP_PRODUCT_CONTENTS_INVALID, SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED, RENTAL_NOT_QUALIFIED, RENTAL_CONTRACT_NOT_FOUND, RENTAL_CONTRACT_NOT_AVAILABLE, RENTAL_CONTRACT_ONGOING, RENTAL_CONTRACT_TERMINATED, RENTAL_CAMERAS_PACK_IN_USE, RENTAL_CAMERAS_PACK_NOT_FOUND, RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU, RENTAL_CAMERAS_PACK_INVALID_COUNT, RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND, RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL, RENTAL_CONTRACT_LIMIT_REACHED, RENTAL_NFT_NOT_FOUND, RENTAL_NFT_IN_USE, INVALID_PARAMETER, INVALID_MIME_TYPE, UNDER_MAINTENANCE, UNKNOWN, VALIDATION_ERROR, IS_SPAM, RECAPTCHA_REQUEST_ERROR, RECAPTCHA_ACTION_TYPE_UNMATCHED, RECAPTCHA_SCORE_TOO_LOW, AUTH_ERROR, SNPIT_ERROR]}, errorMessage: {type: string, description: 'Detail message of the error', example: 'Invalid parameter', nullable: false}}
            required: [code, statusCode, errorType, errorMessage]
        ExplorerDTO:
            type: object
            properties: {explorerId: {type: string, description: 'NFT explorer ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'NFT explorer name', example: 'Explorer Name', nullable: false, maxLength: 50}, explorerDescription: {type: string, description: 'NFT explorer description', example: 'Explorer Description', nullable: true, maxLength: 200}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: 'https://picsum.photos/300/200', nullable: false}, explorerCategory: {type: string, description: 'Category of NFT explorer', nullable: false, enum: [NORMAL, CLIMBER, HUNTER, DIVER]}, fullEnergy: {type: number, description: 'The full energy of NFT explorer', example: 100, nullable: false}, energy: {type: number, description: 'Current available energy of NFT explorer', example: 100, nullable: false, minimum: 0, maximum: 10000}, rarity: {type: string, description: 'Rarity of NFT explorer', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, energyConsumption: {type: number, description: 'Energy consumption of NFT explorer when used', example: 10, nullable: false, minimum: 0, maximum: 100}, range: {type: number, description: 'Range of NFT explorer', example: 10, nullable: false, minimum: 0, maximum: 1000}, rangeBuff: {type: number, description: 'Additional range buff from Guild deck parameter', example: 10, nullable: false, minimum: 0, maximum: 1000}, decoyFinding: {type: boolean, description: 'Decoy finding ability of NFT explorer. True if the explorer can distinguish decoys from real spots', example: true, nullable: false}, totalSearch: {type: number, description: 'Number of searches the NFT explorer has performed. This is a cumulative count', example: 3, nullable: false}, totalSpotFound: {type: number, description: 'Number of spots the NFT explorer has found. This is a cumulative count', example: 3, nullable: false}}
            required: [explorerId, tokenId, explorerName, explorerImage, explorerCategory, fullEnergy, energy, rarity, energyConsumption, range, rangeBuff, decoyFinding, totalSearch, totalSpotFound]
        ExplorerListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT explorers', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerDTO'}}}
            required: [code, data]
        CreateExplorerRequestAdminDTO:
            type: object
            properties: {tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'Name of NFT explorer', example: 'Explorer Name', nullable: false, maxLength: 50}, explorerDescription: {type: string, description: 'Description of NFT explorer', example: 'Explorer Description', nullable: true, maxLength: 200}, explorerAttributeId: {type: string, description: 'ID of NFT explorer attribute', example: 12345678-1234-1234-1234-123456789012, nullable: false}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: 'https://picsum.photos/300/200', nullable: false}, explorerCategory: {type: string, description: 'Category of NFT explorer', nullable: false, enum: [NORMAL, CLIMBER, HUNTER, DIVER]}}
            required: [tokenId, explorerName, explorerAttributeId, explorerImage, explorerCategory]
        EmptyResponseSchema:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {type: string, description: 'Response message', example: Success, nullable: false}}
            required: [code, data]
        ExplorerAttributeAdminDTO:
            type: object
            properties: {explorerAttributeId: {type: string, description: 'NFT Explorer Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Explorer Attribute Rarity', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false, minimum: 100, maximum: 10000}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false, minimum: 0, maximum: 100}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false, minimum: 0, maximum: 1000}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}, active: {type: boolean, description: 'NFT Explorer Attribute Active Status', example: true, nullable: false}}
            required: [explorerAttributeId, attributeName, rarity, initialEnergy, energyConsumption, range, decoyFinding, active]
        ExplorerAttributeListResponseAdminDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT Explorer Attributes', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerAttributeAdminDTO'}}}
            required: [code, data]
        CreateExplorerAttributeRequestAdminDTO:
            type: object
            properties: {attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Explorer Attribute Rarity', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, rarityCode: {type: string, description: 'Rarity Code of the explorer attribute', example: '1', nullable: false}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false, minimum: 100, maximum: 10000}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false, minimum: 0, maximum: 100}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false, minimum: 0, maximum: 1000}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}}
            required: [attributeName, rarity, rarityCode, initialEnergy, energyConsumption, range, decoyFinding]
        AuthEmailRequestDTO:
            type: object
            properties: {email: {type: string, description: 'email address', example: test@gmail.com, nullable: false}}
            required: [email]
        SendCodeResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {type: string, description: 'success message', example: 'OTA was sent to your in-app inbox.', nullable: false}}
            required: [code, data]
        AuthLoginRequestDTO:
            type: object
            properties: {email: {type: string, description: 'email address', example: test@gmail.com, nullable: false}, code: {type: string, description: 'auth code', example: '1234', nullable: false}}
            required: [email, code]
        AuthLoginDTO:
            type: object
            properties: {accessToken: {type: string, description: SNPIT認証成功後に払い出されるJWTトークン, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3MjU0MDgwMCwiZXhwIjoxNjcyNjI3MjAwfQ, nullable: false}, isExistingUser: {type: boolean, description: 新規ユーザーかどうか, example: false, nullable: false}}
            required: [accessToken, isExistingUser]
        AuthLoginResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'return access token', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/AuthLoginDTO'}]}}
            required: [code, data]
        AuthLogoutRequestDTO:
            type: object
            properties: {uuid: {type: string, description: uuid, nullable: false}, jwt: {type: string, description: jwt, nullable: true}}
            required: [uuid]
        AuthLogoutDTO:
            type: object
            properties: {message: {type: string, example: 'delete session uuid:[uuid]', nullable: false}}
            required: [message]
        AuthLogoutResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'return delete uuid', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/AuthLogoutDTO'}]}}
            required: [code, data]
        CameraDTO:
            type: object
            properties: {cameraId: {type: string, description: 'Token Id of the camera', example: '1234567890', nullable: false}, cameraUrl: {type: string, description: 'Camera Url', example: 'https://picsum.photos/300/200', nullable: false}, rarity: {type: string, description: 'Camera rarity', nullable: false}, displayRarity: {type: string, description: 'Display camera rarity for free camera. Use label is not null, else use rarity', nullable: false}, level: {type: number, description: 'Camera level', example: 1, nullable: false}, searchQ: {type: number, description: 'Search radius of NFT Explorer', example: 1, nullable: false}, attackE: {type: number, description: 'Damage when attacking NFT Flag', example: 1, nullable: false}, luckL: {type: number, description: 'Critical hit chance when attacking NFT Flag', example: 1, nullable: false}, defenseB: {type: number, description: 'Improve the endurance of NFT Flag', example: 1, nullable: false}}
            required: [cameraId, cameraUrl, rarity, displayRarity, level, searchQ, attackE, luckL, defenseB]
        DeckDTO:
            type: object
            properties: {deckId: {type: string, description: 'Deck Id', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, userId: {type: string, description: 'User Id', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, deckName: {type: string, description: 'Deck name', example: 'Deck 1', nullable: false, maxLength: 50}, deckDescription: {type: string, description: 'Deck Description', example: 'New deck', nullable: true, maxLength: 200}, deckImage: {type: string, description: 'Deck Image', example: 'https://picsum.photos/300/200', nullable: true}, deckStatus: {type: string, description: 'Deck Status', nullable: false, enum: [NEW, SELECTED, UNSELECTED]}, searchQ: {type: number, description: 'Search radius of NFT Explorer', example: 1, nullable: false}, attackE: {type: number, description: 'Damage when attacking NFT Flag', example: 1, nullable: false}, luckL: {type: number, description: 'Critical hit chance when attacking NFT Flag', example: 1, nullable: false}, defenseB: {type: number, description: 'Improve the endurance of NFT Flag', example: 1, nullable: false}, deckCameras: {description: 'Cameras on deck', nullable: false, type: array, items: {$ref: '#/components/schemas/CameraDTO'}}, deckNftExplorers: {description: 'NFT Explorer Ids', example: ['1234567890', '1234567891', '1234567892', '1234567893'], nullable: false, type: array, items: {type: string}}}
            required: [deckId, userId]
        GetDeckResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of decks', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: [code, data]
        CreateDeckRequestDTO:
            type: object
            properties: {deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false, maxLength: 50}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true, maxLength: 200}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorers: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
            required: [deckName, deckCameras]
        UpdateDeckCameraRequestDTO:
            type: object
            properties: {deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
        UpdateDeckInfoRequestDTO:
            type: object
            properties: {deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false, maxLength: 50}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true, maxLength: 200}, deckImage: {type: string, description: 'Deck Image', example: 'https://picsum.photos/300/200', nullable: true}}
        CameraListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'The list of cameras', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/CameraDTO'}}}
            required: [code, data]
        FlagDTO:
            type: object
            properties: {flagId: {type: string, description: 'NFT flag ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, spotId: {type: string, description: 'Spot ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT flag', example: '800012345678', nullable: false}, flagName: {type: string, description: 'NFT flag name', example: 'Flag Name', nullable: false, maxLength: 50}, flagDescription: {type: string, description: 'NFT flag description', example: 'Flag Description', nullable: true, maxLength: 200}, flagImage: {type: string, description: 'Image of NFT flag explorer (URL)', example: 'https://picsum.photos/300/200', nullable: false}, flagCategory: {type: string, description: 'Category of NFT flag', nullable: false, enum: [NORMAL, SPECIAL]}, flagStatus: {type: string, description: 'Status of NFT flag', nullable: false, enum: [NEW, CONSTRUCTED, DESTROYED]}, level: {type: number, description: 'Current level of NFT flag', example: 1, nullable: false, minimum: 1, maximum: 99}, fullEndurance: {type: number, description: ' Full endurance of NFT flag', example: 100, nullable: false}, endurance: {type: number, description: 'Current endurance of NFT flag', example: 10, nullable: false, minimum: 0, maximum: 1000}, defended: {type: number, description: 'The number of defenses against attacks from other guilds', example: 1, nullable: false}, rarity: {type: string, description: 'Rarity of NFT flag', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, flagIncome: {type: number, description: 'Income of NFT flag', example: 10, nullable: false}, leftHandId: {type: string, description: 'Token ID of NFT flag on left minted from', example: '80011245678', nullable: true}, rightHand: {type: string, description: 'Token ID of NFT flag on right minted from', example: '800112345678', nullable: true}}
            required: [flagId, spotId, tokenId, flagName, flagImage, flagCategory, flagStatus, level, fullEndurance, endurance, defended, rarity, flagIncome]
        FlagListResponseAdminDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT flags', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: [code, data]
        CreateFlagRequestDTO:
            type: object
            properties: {tokenId: {type: string, description: 'Token ID of NFT flag', example: '800012345678', nullable: false}, flagName: {type: string, description: 'Name of NFT flag', example: 'Flag Name', nullable: false, maxLength: 50}, flagDescription: {type: string, description: 'Description of NFT flag', example: 'Flag Description', nullable: true, maxLength: 200}, flagAttributeId: {type: string, description: 'ID of NFT flag attribute', example: 12345678-1234-1234-1234-123456789012, nullable: false}, flagImage: {type: string, description: 'Image of NFT flag (URL)', example: 'https://picsum.photos/300/200', nullable: false}, flagCategory: {type: string, description: 'Category of NFT flag', nullable: false, enum: [NORMAL, SPECIAL]}}
            required: [tokenId, flagName, flagAttributeId, flagImage, flagCategory]
        FlagAttributeAdminDTO:
            type: object
            properties: {flagAttributeId: {type: string, description: 'NFT Flag Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Flag Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Flag Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Flag Attribute Rarity', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, initialEndurance: {type: number, description: 'NFT Flag Attribute Initial Endurance', example: 10, nullable: false, minimum: 10, maximum: 1000}, enduranceIncrement: {type: number, description: 'NFT Flag Attribute Endurance increased per level', example: 10, nullable: false, minimum: 5, maximum: 100}, flagIncome: {type: number, description: 'NFT Flag Attribute STP Income', example: 10, nullable: false, minimum: 0, maximum: 100}}
            required: [flagAttributeId, attributeName, rarity, initialEndurance, enduranceIncrement, flagIncome]
        FlagAttributeListResponseAdminDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'NFT Flag Attributes', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagAttributeAdminDTO'}}}
            required: [code, data]
        CreateFlagAttributeRequestAdminDTO:
            type: object
            properties: {attributeName: {type: string, description: 'NFT Flag Attribute Name', example: Rare, nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'NFT Flag Attribute Description', example: 'This is a description', nullable: true, maxLength: 200}, rarity: {type: string, description: 'NFT Flag Attribute Rarity', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, rarityCode: {type: string, description: 'Rarity Code of the flag attribute', example: '1', nullable: false}, initialEndurance: {type: number, description: 'NFT Flag Attribute Initial Endurance', example: 10, nullable: false, minimum: 10, maximum: 1000}, enduranceIncrement: {type: number, description: 'NFT Flag Attribute Endurance increased per level', example: 10, nullable: false, minimum: 5, maximum: 100}, flagIncome: {type: number, description: 'NFT Flag Attribute STP Income', example: 10, nullable: false, minimum: 0, maximum: 100}}
            required: [attributeName, rarity, rarityCode, initialEndurance, enduranceIncrement, flagIncome]
        ItemDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemAbility: {type: string, description: 'Item Ability', example: 'The detail of the item ability', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY_SPOT, FLAG_REPAIR, HEAL_EXPLORER, SCOUT_SPOT_ENDURANCE]}}
            required: [itemId, itemName, itemPrice, itemStatus, itemCategory]
        GetItemsResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of items', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ItemDTO'}}}
            required: [code, data]
        CreateItemRequestDTO:
            type: object
            properties: {itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemAbility: {type: string, description: 'Item Ability', example: 'The detail of the item ability', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY_SPOT, FLAG_REPAIR, HEAL_EXPLORER, SCOUT_SPOT_ENDURANCE]}}
            required: [itemName, itemPrice, itemStatus, itemCategory]
        GiveItemRequestDTO:
            type: object
            properties: {userId: {type: string, description: 'User ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, quantity: {type: number, description: 'Quantity of the item', example: 1, nullable: false}}
            required: [userId, itemId]
        UpdateItemRequestDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY_SPOT, FLAG_REPAIR, HEAL_EXPLORER, SCOUT_SPOT_ENDURANCE]}}
            required: [itemId]
        ItemBoxDTO:
            type: object
            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false, maxLength: 50}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true, maxLength: 200}, rarity: {type: string, description: 'Item Box Rarity', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, itemBoxImage: {type: string, description: 'Item Box Image', example: 'https://picsum.photos/300/200', nullable: true}, itemBoxStatus: {type: string, description: 'Status of the item box', nullable: false, enum: [HIDDEN, SHOWN, BOXED]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 35.654444, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: 139.8754444, nullable: false}}
            required: [itemBoxId, itemBoxName, rarity, itemBoxStatus, itemBoxLatitude, itemBoxLongitude]
        GetItemBoxResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of item boxes', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ItemBoxDTO'}}}
            required: [code, data]
        CreateItemBoxRequestDTO:
            type: object
            properties: {itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false, maxLength: 50}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true, maxLength: 200}, itemBoxRarity: {type: string, description: 'Item Box rarity', nullable: true, enum: [COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 35.654444, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: 139.8754444, nullable: false}}
            required: [itemBoxName, itemBoxLatitude, itemBoxLongitude]
        SpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: [NORMAL, DECOY, FLAG]}}
            required: [spotId, spotName, spotStatus, rarity, photoId, photoUrl, spotLatitude, spotLongitude, spotAddress, spotType]
        SpotListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of spots.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/SpotDTO'}}}
            required: [code, data]
        CreateSpotRequestDTO:
            type: object
            properties: {spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true, maxLength: 100}, spotAttributeId: {type: string, description: 'ID of spot attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}}
            required: [spotName, spotLatitude, spotLongitude, spotAttributeId]
        UpdateSpotInfoRequestDTO:
            type: object
            properties: {spotAttributeId: {type: string, description: 'ID of the attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true, maxLength: 100}}
        UpdateSpotPhotoRequestDTO:
            type: object
            properties: {photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}}
            required: [photoId]
        SpotAtributeDTO:
            type: object
            properties: {spotAttributeId: {type: string, description: 'Attribute ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}}
            required: [spotAttributeId, attributeName, rarity, autoIncome, attackIncome]
        SpotAtributeListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of spot attributes.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/SpotAtributeDTO'}}}
            required: [code, data]
        CreateSpotAttributeRequestDTO:
            type: object
            properties: {attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, attributeDescription: {type: string, description: 'Description of the attribute', example: 'A detailed description of the attribute', nullable: true, maxLength: 200}, rarity: {type: string, description: 'Rarity of the attribute', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, rarityCode: {type: string, description: 'Rarity Code of the spot attribute', example: '1', nullable: false}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}}
            required: [attributeName, rarity, rarityCode, autoIncome, attackIncome]
        SearchRequestDTO:
            type: object
            properties: {explorerSearchType: {type: string, description: 'Type of the search', nullable: false, enum: [ITEM_BOX, SPOT, ITEM_BOX_AND_SPOT]}, explorerLongitude: {type: number, description: 'Longitude of the user', example: 40.7128, nullable: false}, explorerLatitude: {type: number, description: 'Latitude of the user', example: -74.006, nullable: false}}
            required: [explorerSearchType, explorerLongitude, explorerLatitude]
        SearchResultDTO:
            type: object
            properties: {spotList: {description: 'List of the Spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotDTO'}}, itemBoxList: {description: 'List of the Item Box', nullable: false, type: array, items: {$ref: '#/components/schemas/ItemBoxDTO'}}}
            required: [spotList, itemBoxList]
        SearchResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'NFT explorer search result', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/SearchResultDTO'}]}}
            required: [code, data]
        FlagListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of NFT flags', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: [code, data]
        GuildMemberDto:
            type: object
            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, username: {type: string, description: Username., example: 'User 1', nullable: false}, role: {type: string, description: 'Role of the guild member.', nullable: false, enum: [OWNER, ADMIN, MEMBER]}, memberStatus: {type: string, description: 'Status of the guild member.', nullable: false, enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED]}, teamId: {type: string, description: 'TBD: Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, avatar: {type: string, description: 'Avatar URL of the user', example: 'https://picsum.photos/300/200', nullable: true}, decks: {description: 'List of guild member deck.', nullable: false, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: [userId, username, role]
        GuildDto:
            type: object
            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildStatus: {type: string, description: 'Status of the guild.', nullable: false, enum: [ACTIVE, INACTIVE, DELETED]}, guildMembersCount: {type: number, description: 'Total number of guild members.', example: 30, nullable: false}, userStatusInGuild: {type: string, description: 'Status of user in guild.', nullable: false, enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED]}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}, gp: {type: number, description: 'Guild point (GPT)', example: 100, nullable: false}, searchQ: {type: number, description: 'Search radius of NFT Explorer', example: 1, nullable: false}, attackE: {type: number, description: 'Damage when attacking NFT Flag', example: 1, nullable: false}, luckL: {type: number, description: 'Critical hit chance when attacking NFT Flag', example: 1, nullable: false}, defenseB: {type: number, description: 'Improve the endurance of NFT Flag', example: 1, nullable: false}, guildMembers: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
            required: [guildId, guildName, guildOwner, guildMembersCount, userStatusInGuild]
        GuildInfoResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Guild information.', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/GuildDto'}]}}
            required: [code, data]
        UpdateGuildInfoRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Guild name', example: 'Guild Name', nullable: true, maxLength: 50}, guildDescription: {type: string, description: 'Guild description', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: 'Avatar of the guild', example: 'https://picsum.photos/300/200', nullable: true}, guildBanner: {type: string, description: 'Banner of the guild', example: 'https://picsum.photos/300/200', nullable: true}}
        CreateGuildRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: 'https://picsum.photos/300/200', nullable: true}}
            required: [guildName]
        GuildSpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: [NORMAL, DECOY, FLAG]}, guildSpotStatus: {type: string, description: 'Guild spot status', nullable: false, enum: [CAPTURED, FOUND, DECOY, REMOVED]}}
            required: [spotId, spotName, spotStatus, rarity, photoId, photoUrl, spotLatitude, spotLongitude, spotAddress, spotType, guildSpotStatus]
        GuildSpotsResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of guild spots.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/GuildSpotDTO'}}}
            required: [code, data]
        SpotPhotoDTO:
            type: object
            properties: {photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'Spot Photo', nullable: false, maxLength: 255}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful spot photo', nullable: true, maxLength: 1024}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}, photoType: {type: string, description: 'Type of the photo', nullable: false, enum: [ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOS]}, photoStatus: {type: string, description: 'Status of the photo', nullable: false, enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED]}, guildId: {type: string, description: 'ID of the guild', example: '1234567890', nullable: true}}
            required: [photoId, photoName, photoUrl, photoType, photoStatus]
        GuildSpotDetailDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: [NORMAL, DECOY, FLAG]}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}, guildSpotStatus: {type: string, description: 'Guild spot status', nullable: false, enum: [CAPTURED, FOUND, DECOY, REMOVED]}, incomeBuff: {type: number, description: 'Additional income buff from Guild deck parameter', example: 100, nullable: false}, flags: {description: 'Flag list of the guild spot.', nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: [spotId, spotName, spotStatus, rarity, spotLatitude, spotLongitude, spotAddress, spotType, autoIncome, attackIncome, spotPhotos, guildSpotStatus, incomeBuff, flags]
        GuildSpotDetailResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Spot information including flags.', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/GuildSpotDetailDTO'}]}}
            required: [code, data]
        GuildFlagsResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of guild flags.', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: [code, data]
        UserDto:
            type: object
            properties: {userId: {type: string, description: 'The id of the user', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the user', example: user1, nullable: false}, email: {type: string, description: 'The email of the user', example: guild@gmail.com, nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, stpAmount: {type: number, description: 'Amount of STP that user has', example: 100, nullable: false}, profilePicture: {type: string, description: 'Profile picture of the user (URL)', example: 'https://picsum.photos/300/200', nullable: true}, guildId: {type: string, description: 'Guild Id of the user', example: '1234567890', nullable: true}, userStatus: {type: string, description: 'Status of the user.', nullable: false, enum: [NEW, INACTIVE, DELETED, BANNED]}, decks: {description: 'Deck of the users', nullable: true, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: [userId, email]
        UserResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'The user details', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/UserDto'}]}}
            required: [code, data]
        UserNftsDTO:
            type: object
            properties: {explorers: {description: 'NftExplorer of the user', nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerDTO'}}, flags: {description: 'NftFlags of the user', nullable: false, type: array, items: {$ref: '#/components/schemas/FlagDTO'}}}
            required: [explorers, flags]
        GetUserNftsResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of items belong to user', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/UserNftsDTO'}]}}
            required: [code, data]
        WalletDTO:
            type: object
            properties: {walletAddress: {type: string, description: 'The wallet address', example: '0x1234567890', nullable: true}, stpAmount: {type: number, description: 'STP (Currency in the game) balance', example: 100, nullable: false}, stpPrecision: {type: number, description: 'STP (Currency in the game) precision', example: 18, nullable: false}, snptAmount: {type: number, description: 'SNTP (Cryptocurrency) balance', example: 100, nullable: false}, snptPrecision: {type: number, description: 'SNTP (Cryptocurrency) precision', example: 18, nullable: false}, fpAmount: {type: number, description: 'FP (Free Point) balance', example: 100, nullable: false}, fpPrecision: {type: number, description: 'FP (Free Point) precision', example: 18, nullable: false}}
            required: [walletAddress, stpAmount, stpPrecision, snptAmount, snptPrecision, fpAmount, fpPrecision]
        WalletBalanceResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'The wallet balance details', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/WalletDTO'}]}}
            required: [code, data]
        SpotDetailDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [CASUAL, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 35.65555, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 139.875555, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false, maxLength: 100}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: [NORMAL, DECOY, FLAG]}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 1000}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 1000}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}}
            required: [spotId, spotName, spotStatus, rarity, spotLatitude, spotLongitude, spotAddress, spotType, autoIncome, attackIncome, spotPhotos]
        SpotDetailResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Detail information of the spot.', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/SpotDetailDTO'}]}}
            required: [code, data]
        WaeveRequestDTO:
            type: object
            properties: {photoId: {type: string, description: 'ID of the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, userLatitude: {type: number, description: 'Latitude of the user', example: 35.65555, nullable: false}, userLongitude: {type: number, description: 'Longitude of the user', example: 139.875555, nullable: false}}
            required: [photoId, userLatitude, userLongitude]
        WaeveDTO:
            type: object
            properties: {isAcquired: {type: boolean, description: 'Result of the waeve if spot could get acquired or not', example: true, nullable: false}, message: {type: string, description: 'Message of the waeve result', example: 'Spot is acquired', nullable: false}}
            required: [isAcquired, message]
        WaeveResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Result of the waeve.', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/WaeveDTO'}]}}
            required: [code, data]
        UpdateGuildMemberRoleRequestDTO:
            type: object
            properties: {role: {type: string, description: 'Role of the guild member.', nullable: false, enum: [OWNER, ADMIN, MEMBER]}}
        UserItemsDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false, maxLength: 50}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true, maxLength: 200}, itemAbility: {type: string, description: 'Item Ability', example: 'The detail of the item ability', nullable: true, maxLength: 200}, itemImage: {type: string, description: 'Item Image', example: 'https://picsum.photos/300/200', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false, minimum: 0, maximum: 10000}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY_SPOT, FLAG_REPAIR, HEAL_EXPLORER, SCOUT_SPOT_ENDURANCE]}, itemQuantity: {type: number, description: 'Quantity of the item', example: 10, nullable: false}}
            required: [itemId, itemName, itemPrice, itemStatus, itemCategory, itemQuantity]
        GetUserItemsResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of items belong to user', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/UserItemsDTO'}}}
            required: [code, data]
        UseDecoyRequestDTO:
            type: object
            properties: {spotId: {type: string, description: 'The id of the item', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, decoyLatitude: {type: number, description: 'Latitude of the decoy', example: 37.123456, nullable: false}, decoyLongitude: {type: number, description: 'Longitude of the decoy', example: -121.123456, nullable: false}}
            required: [spotId, decoyLatitude, decoyLongitude]
        ScoutSpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'The id of the spot', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, spotName: {type: string, description: 'The name of the spot', example: Spot1, nullable: false}, spotEndurance: {type: number, description: 'The endurance of the spot', example: 20, nullable: false}}
            required: [spotId, spotName, spotEndurance]
        GetSpotEnduranceResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Result of scout the spot', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/ScoutSpotDTO'}]}}
            required: [code, data]
        OpenBoxRequestDTO:
            type: object
            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, userLatitute: {type: number, description: 'User latitude', example: 35.654444, nullable: false}, userLongitude: {type: number, description: 'User longitude', example: 139.8754444, nullable: false}}
            required: [itemBoxId, userLatitute, userLongitude]
        OpenBoxResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Opened item box', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/ItemDTO'}}}
            required: [code, data]
        NftAttributes:
            type: object
            properties: {trait_type: {type: string, description: 'The trait type of the NFT', example: Rarity, nullable: false}, value: {type: string, description: 'The value of the NFT', example: COMMON, nullable: false}, trait_display_type: {type: string, description: 'The display type of the NFT', example: number, nullable: true}}
            required: [trait_type, value]
        NftMetadata:
            type: object
            properties: {name: {type: string, description: 'The name of the NFT', example: Explorer, nullable: false}, description: {type: string, description: 'The description of the NFT', example: 'A NFT that explores the world', nullable: true}, image: {type: string, description: 'The image of the NFT', example: 'https://picsum.photos/300/200', nullable: false}, attributes: {description: 'The attributes of the NFT', nullable: false, type: array, items: {$ref: '#/components/schemas/NftAttributes'}}}
            required: [name, image, attributes]
        PhotoDTO:
            type: object
            properties: {photoId: {type: string, description: 'Hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'Picture 1', nullable: false, maxLength: 255}, photoUrl: {type: string, description: 'URL of the photo', example: 'https://picsum.photos/300/200', nullable: false}}
            required: [photoId, photoName, photoUrl]
        PhotoListResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'List of photos data', example: Success, nullable: false, type: array, items: {$ref: '#/components/schemas/PhotoDTO'}}}
            required: [code, data]
        UploadPhotoRequestForYaml:
            type: object
            properties: {file: {type: string, description: 'Binary file data', format: binary}, type: {type: string, description: 'ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOSの三種類のみ。flutterのSDKの関係で、ENUM型ではなく文字列で定義する。'}, latitute: {type: number, description: 'Latitude of the photo location', example: 35.65555}, longitude: {type: number, description: 'Longitude of the photo location', example: 139.875555}}
            required: [file, type, latitute, longitude]
        PhotoUploadDTO:
            type: object
            properties: {photoId: {type: string, description: 'Hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, message: {type: string, description: 'Message associated with the photo', example: 'A beautiful sunset', nullable: true}}
            required: [photoId]
        PhotoUploadResponseDTO:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'Photo data', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/PhotoUploadDTO'}]}}
            required: [code, data]
        MaintenanceDTO:
            type: object
            properties: {isMaintenance: {type: boolean, description: 'maintenance mode flag: true for maintenance mode and false for normal mode', example: true, nullable: false}, minVer: {type: string, description: 'update minimum_app_version', example: 0.0.1, nullable: true}}
            required: [isMaintenance]
        SwitchModeSuccessDTO:
            type: object
            properties: {message: {type: string, example: 'Maintenance mode is off', nullable: false}}
            required: [message]
        SwitchModeResponseDto:
            type: object
            properties: {code: {type: number, description: 'Response code. 0 for success, -1 for failure', nullable: false}, data: {description: 'return response', example: Success, nullable: false, allOf: [{$ref: '#/components/schemas/SwitchModeSuccessDTO'}]}}
            required: [code, data]

// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api_error_response_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_VERIFICATION_CODE_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_VERIFICATION_CODE_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_VERIFICATION_CODE_UNMATCHED =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'USER_VERIFICATION_CODE_UNMATCHED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_INVIATION_CODE_INVALID =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_INVIATION_CODE_INVALID');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_ENROLLED_IN_MEMBERSHIP =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_NOT_ENROLLED_IN_MEMBERSHIP');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_ADMIN =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_NOT_ADMIN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_UNAUTHORIZED =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_UNAUTHORIZED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_USER_INCORRECT_UPDATE_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum._('USER_INCORRECT_UPDATE_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_ITEM_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('ITEM_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_ITEM_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('ITEM_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_ITEM_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('ITEM_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_ITEM_BOX_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('ITEM_BOX_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_ITEM_BOX_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('ITEM_BOX_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_MEMBER_STATUS_UDPATE =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'GUILD_INCORRECT_MEMBER_STATUS_UDPATE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_MEMBER_ROLE_UDPATE =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'GUILD_INCORRECT_MEMBER_ROLE_UDPATE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_UPDATE_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_INCORRECT_UPDATE_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_PRIVILEGE =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_INCORRECT_PRIVILEGE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_DUPLICATE_MEMBER =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_DUPLICATE_MEMBER');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_INFO_LENGTH_EXCEEDED =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_INFO_LENGTH_EXCEEDED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_MEMBER_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_MEMBER_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_MAX_MEMBERS =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_MAX_MEMBERS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_MAX_ADMINS =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_MAX_ADMINS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_USER_NOT_MEMBER =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_USER_NOT_MEMBER');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GUILD_SPOT_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('GUILD_SPOT_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_OWNED_BY_YOU =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_NOT_OWNED_BY_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NO_LONGER_ACCESSIBLE =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_NO_LONGER_ACCESSIBLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_INVISIBLE =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_INVISIBLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_ALBUM_FULL =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_ALBUM_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_DUPLICATED_UPLOAD =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_DUPLICATED_UPLOAD');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_UNPUBLISHABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_UNPUBLISHABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_PENDING_CENSORSHIP =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_PENDING_CENSORSHIP');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_BATTLE_HISTORY_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_BATTLE_HISTORY_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_CASUAL_BATTLE_HISTORY_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'PHOTO_CASUAL_BATTLE_HISTORY_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_QUALITY_TOO_LOW =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_QUALITY_TOO_LOW');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_PREVIOUS_DEFEAT =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_PREVIOUS_DEFEAT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_REPORTED =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_NOT_REPORTED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_TAG_MISMATCH =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_TAG_MISMATCH');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_TAG_UNSUPPORTED =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_TAG_UNSUPPORTED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_INVALID_TYPE =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_INVALID_TYPE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_APPROVE_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_APPROVE_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_ADMIN =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_NOT_ADMIN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_DELETE_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_DELETE_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_PHOTO_UPLOAD_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum._('PHOTO_UPLOAD_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_DECK_MAX_LIMIT =
    const ApiErrorResponseDTOErrorTypeEnum._('DECK_MAX_LIMIT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_MISMATCH =
    const ApiErrorResponseDTOErrorTypeEnum._('DECK_CAMERA_MISMATCH');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_INVALID =
    const ApiErrorResponseDTOErrorTypeEnum._('DECK_CAMERA_INVALID');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('DECK_CAMERA_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_DECK_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('DECK_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_DECK_INCORRECT_UPDATE_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum._('DECK_INCORRECT_UPDATE_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_IS_EXISTING =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_IS_EXISTING');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_ATTRIBUTE_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_ATTRIBUTE_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_ATTRIBUTE_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_PHOTO_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_INCORRECT_UPDATE_FLAG =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_INCORRECT_UPDATE_FLAG');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_PHOTO_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_PHOTO_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_LATITUDE_LONGITUDE_REQUIRED =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'SPOT_LATITUDE_LONGITUDE_REQUIRED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_WAEVE_OUT_OF_RANGE =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_WAEVE_OUT_OF_RANGE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_CANNOT_BE_DELETED =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_CANNOT_BE_DELETED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SPOT_ALREADY_CAPTURED =
    const ApiErrorResponseDTOErrorTypeEnum._('SPOT_ALREADY_CAPTURED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_EXPLORER_INSUFFICIENT_ENERGY =
    const ApiErrorResponseDTOErrorTypeEnum._('EXPLORER_INSUFFICIENT_ENERGY');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_FLAG_ALREADY_CONSTRUCTED =
    const ApiErrorResponseDTOErrorTypeEnum._('FLAG_ALREADY_CONSTRUCTED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_FLAG_MAX_LEVEL =
    const ApiErrorResponseDTOErrorTypeEnum._('FLAG_MAX_LEVEL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_FLAG_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('FLAG_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_FLAG_FULL_ENDURANCE =
    const ApiErrorResponseDTOErrorTypeEnum._('FLAG_FULL_ENDURANCE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_BATTLES =
    const ApiErrorResponseDTOErrorTypeEnum._('REACHED_MAX_BATTLES');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_STARS =
    const ApiErrorResponseDTOErrorTypeEnum._('REACHED_MAX_STARS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_SETTLED =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_ALREADY_SETTLED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NO_LONGER_ACCESSIBLE =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_NO_LONGER_ACCESSIBLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_CANNNOT_BE_CANCELLED_YET =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_CANNNOT_BE_CANCELLED_YET');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_DAILY_ENTRIES =
    const ApiErrorResponseDTOErrorTypeEnum._('REACHED_MAX_DAILY_ENTRIES');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_VOTED =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_ALREADY_VOTED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_BATTLES_PER_PHOTO =
    const ApiErrorResponseDTOErrorTypeEnum._('REACHED_MAX_BATTLES_PER_PHOTO');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_KICKED_OFF =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_ALREADY_KICKED_OFF');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_JOINED =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_ALREADY_JOINED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_YET_JOINED =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_NOT_YET_JOINED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_JOINABLE_BY_BAN =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_NOT_JOINABLE_BY_BAN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_READY =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_NOT_READY');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_OWNED_BY_YOU =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_NOT_OWNED_BY_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_OWNED_BY_YOU =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_OWNED_BY_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_FULL =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_ALREADY_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_PHOTO_UNPICKED =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_PHOTO_UNPICKED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BATTLE_PHOTO_ALREADY_PICKED =
    const ApiErrorResponseDTOErrorTypeEnum._('BATTLE_PHOTO_ALREADY_PICKED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_OUT_OF_STOCK =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_OUT_OF_STOCK');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_OWNED_BY_YOU =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_OWNED_BY_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ALREADY_UNBOXED =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ALREADY_UNBOXED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_UNBOXED =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_UNBOXED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_SKILL_POINTS =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_ENOUGH_SKILL_POINTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_BATTERIES =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_ENOUGH_BATTERIES');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_FILMS =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_ENOUGH_FILMS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_REACHED_MAX_LEVEL =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_REACHED_MAX_LEVEL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_UPGRADE_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_UPGRADE_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_TRANSFER_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_TRANSFER_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_MINT_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_MINT_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ZERO_DURABILITY =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ZERO_DURABILITY');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_CAMERA_IS_NOT_BROKEN =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_CAMERA_IS_NOT_BROKEN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_UPGRADABLE_WITH_BOOSTER =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_UPGRADABLE_WITH_BOOSTER');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_BATTERY_FULL =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_BATTERY_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_SLOTS_FULL =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ACCESSORY_SLOTS_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_NOT_EQUIPPED =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ACCESSORY_NOT_EQUIPPED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_LIMIT =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ACCESSORY_FUSION_LIMIT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_IS_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ACCESSORY_IS_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_NOT_SAME =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ACCESSORY_FUSION_NOT_SAME');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_UNEQUAL_STAR =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'NFT_ACCESSORY_FUSION_UNEQUAL_STAR');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_STAR_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'NFT_ACCESSORY_FUSION_STAR_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_UNEQUAL_GRADE =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'NFT_ACCESSORY_FUSION_UNEQUAL_GRADE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NO_SKILL_POINTS_USED =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NO_SKILL_POINTS_USED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_MAX_ROULETTE_SPIN =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_MAX_ROULETTE_SPIN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_SKIN_ALREADY_EQUIPPED =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_SKIN_ALREADY_EQUIPPED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_NOT_EQUIPPED2 =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ACCESSORY_NOT_EQUIPPED2');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_EXTRA_SLOT_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_EXTRA_SLOT_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_INCOMPATIBLE_TYPE =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_INCOMPATIBLE_TYPE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_EXPLORER_ALREADY_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('EXPLORER_ALREADY_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_EXISTS =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ATTRIBUTE_EXISTS');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ATTRIBUTE_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_ATTRIBUTE_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_NFT_CREATION_FAILED =
    const ApiErrorResponseDTOErrorTypeEnum._('NFT_CREATION_FAILED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_LEVEL_NOT_MAX =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_LEVEL_NOT_MAX');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_BATTERY_NOT_FULL =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_BATTERY_NOT_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_REACHED_MAX_COUNT =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_REACHED_MAX_COUNT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_LEFTHAND_NOT_MINTABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_LEFTHAND_NOT_MINTABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_RIGHTHAND_NOT_MINTABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_RIGHTHAND_NOT_MINTABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_LEFTHAND_BROKEN =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_LEFTHAND_BROKEN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_RIGHTHAND_BROKEN =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_RIGHTHAND_BROKEN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MINT_SCROLL_INSUFFICIENT =
    const ApiErrorResponseDTOErrorTypeEnum._('MINT_SCROLL_INSUFFICIENT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BADGE_ALREADY_OWNED =
    const ApiErrorResponseDTOErrorTypeEnum._('BADGE_ALREADY_OWNED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BADGE_UNPURCHASABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('BADGE_UNPURCHASABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BADGE_RANK_CANNOT_BE_BOOST =
    const ApiErrorResponseDTOErrorTypeEnum._('BADGE_RANK_CANNOT_BE_BOOST');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BADGE_RANK_REACHED_MAXIMUM_BOOST =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'BADGE_RANK_REACHED_MAXIMUM_BOOST');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BADGE_UNSELLABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('BADGE_UNSELLABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('INVENTORY_ITEM_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_OUT_OF_PERIOD =
    const ApiErrorResponseDTOErrorTypeEnum._('INVENTORY_ITEM_OUT_OF_PERIOD');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('INVENTORY_ITEM_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_NOT_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('INVENTORY_ITEM_NOT_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_UNEQUIPABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('INVENTORY_ITEM_UNEQUIPABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_BALANCE_INSUFFICIENT =
    const ApiErrorResponseDTOErrorTypeEnum._('BALANCE_INSUFFICIENT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INSUFFICIENT_SUPPLY_OF_STP =
    const ApiErrorResponseDTOErrorTypeEnum._('INSUFFICIENT_SUPPLY_OF_STP');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INSUFFICIENT_SUPPLY_OF_SNPT =
    const ApiErrorResponseDTOErrorTypeEnum._('INSUFFICIENT_SUPPLY_OF_SNPT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_LIQUIDITIES_CHANGED =
    const ApiErrorResponseDTOErrorTypeEnum._('LIQUIDITIES_CHANGED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_EXTERNAL_WALLET_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('EXTERNAL_WALLET_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_WITHDRAW_DAILY_LIMIT_REACHED =
    const ApiErrorResponseDTOErrorTypeEnum._('WITHDRAW_DAILY_LIMIT_REACHED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_WITHDRAW_NOT_PERMITTED =
    const ApiErrorResponseDTOErrorTypeEnum._('WITHDRAW_NOT_PERMITTED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_REVENUECAT_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum._('REVENUECAT_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MAIL_TEMPLATE_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('MAIL_TEMPLATE_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_MAIL_ATTACHMENT_EXPIRED =
    const ApiErrorResponseDTOErrorTypeEnum._('MAIL_ATTACHMENT_EXPIRED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_LOOTBOX_MYSTERY_SLOTS_FULL =
    const ApiErrorResponseDTOErrorTypeEnum._('LOOTBOX_MYSTERY_SLOTS_FULL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_LOOTBOX_MYSTERY_COOLDOWN =
    const ApiErrorResponseDTOErrorTypeEnum._('LOOTBOX_MYSTERY_COOLDOWN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GACHA_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('GACHA_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_GACHA_OUT_OF_PERIOD =
    const ApiErrorResponseDTOErrorTypeEnum._('GACHA_OUT_OF_PERIOD');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_UNFOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('SHOP_PRODUCT_UNFOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_CONTENTS_INVALID =
    const ApiErrorResponseDTOErrorTypeEnum._('SHOP_PRODUCT_CONTENTS_INVALID');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NOT_QUALIFIED =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_NOT_QUALIFIED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CONTRACT_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_NOT_AVAILABLE =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CONTRACT_NOT_AVAILABLE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_ONGOING =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CONTRACT_ONGOING');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_TERMINATED =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CONTRACT_TERMINATED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CAMERAS_PACK_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CAMERAS_PACK_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_INVALID_COUNT =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'RENTAL_CAMERAS_PACK_INVALID_COUNT');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL =
    const ApiErrorResponseDTOErrorTypeEnum._(
        'RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_LIMIT_REACHED =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_CONTRACT_LIMIT_REACHED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NFT_NOT_FOUND =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_NFT_NOT_FOUND');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NFT_IN_USE =
    const ApiErrorResponseDTOErrorTypeEnum._('RENTAL_NFT_IN_USE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVALID_PARAMETER =
    const ApiErrorResponseDTOErrorTypeEnum._('INVALID_PARAMETER');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_INVALID_MIME_TYPE =
    const ApiErrorResponseDTOErrorTypeEnum._('INVALID_MIME_TYPE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_UNDER_MAINTENANCE =
    const ApiErrorResponseDTOErrorTypeEnum._('UNDER_MAINTENANCE');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_UNKNOWN =
    const ApiErrorResponseDTOErrorTypeEnum._('UNKNOWN');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_VALIDATION_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum._('VALIDATION_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_IS_SPAM =
    const ApiErrorResponseDTOErrorTypeEnum._('IS_SPAM');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_REQUEST_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum._('RECAPTCHA_REQUEST_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_ACTION_TYPE_UNMATCHED =
    const ApiErrorResponseDTOErrorTypeEnum._('RECAPTCHA_ACTION_TYPE_UNMATCHED');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_SCORE_TOO_LOW =
    const ApiErrorResponseDTOErrorTypeEnum._('RECAPTCHA_SCORE_TOO_LOW');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_AUTH_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum._('AUTH_ERROR');
const ApiErrorResponseDTOErrorTypeEnum
    _$apiErrorResponseDTOErrorTypeEnum_SNPIT_ERROR =
    const ApiErrorResponseDTOErrorTypeEnum._('SNPIT_ERROR');

ApiErrorResponseDTOErrorTypeEnum _$apiErrorResponseDTOErrorTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'USER_VERIFICATION_CODE_COOLDOWN':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_VERIFICATION_CODE_COOLDOWN;
    case 'USER_VERIFICATION_CODE_UNMATCHED':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_VERIFICATION_CODE_UNMATCHED;
    case 'USER_INVIATION_CODE_INVALID':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_INVIATION_CODE_INVALID;
    case 'USER_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_FOUND;
    case 'USER_NOT_ENROLLED_IN_MEMBERSHIP':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_ENROLLED_IN_MEMBERSHIP;
    case 'USER_NOT_ADMIN':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_ADMIN;
    case 'USER_UNAUTHORIZED':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_UNAUTHORIZED;
    case 'USER_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_EXISTS;
    case 'USER_INCORRECT_UPDATE_FLAG':
      return _$apiErrorResponseDTOErrorTypeEnum_USER_INCORRECT_UPDATE_FLAG;
    case 'ITEM_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_ITEM_EXISTS;
    case 'ITEM_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_ITEM_NOT_FOUND;
    case 'ITEM_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_ITEM_IN_USE;
    case 'ITEM_BOX_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_ITEM_BOX_EXISTS;
    case 'ITEM_BOX_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_ITEM_BOX_NOT_FOUND;
    case 'GUILD_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_NOT_FOUND;
    case 'GUILD_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_EXISTS;
    case 'GUILD_INCORRECT_MEMBER_STATUS_UDPATE':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_MEMBER_STATUS_UDPATE;
    case 'GUILD_INCORRECT_MEMBER_ROLE_UDPATE':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_MEMBER_ROLE_UDPATE;
    case 'GUILD_INCORRECT_UPDATE_FLAG':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_UPDATE_FLAG;
    case 'GUILD_INCORRECT_PRIVILEGE':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_PRIVILEGE;
    case 'GUILD_DUPLICATE_MEMBER':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_DUPLICATE_MEMBER;
    case 'GUILD_INFO_LENGTH_EXCEEDED':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_INFO_LENGTH_EXCEEDED;
    case 'GUILD_MEMBER_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_MEMBER_EXISTS;
    case 'GUILD_MAX_MEMBERS':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_MAX_MEMBERS;
    case 'GUILD_MAX_ADMINS':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_MAX_ADMINS;
    case 'GUILD_USER_NOT_MEMBER':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_USER_NOT_MEMBER;
    case 'GUILD_SPOT_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_GUILD_SPOT_NOT_FOUND;
    case 'PHOTO_NOT_OWNED_BY_YOU':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_OWNED_BY_YOU;
    case 'PHOTO_NO_LONGER_ACCESSIBLE':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NO_LONGER_ACCESSIBLE;
    case 'PHOTO_INVISIBLE':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_INVISIBLE;
    case 'PHOTO_ALBUM_FULL':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_ALBUM_FULL;
    case 'PHOTO_DUPLICATED_UPLOAD':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_DUPLICATED_UPLOAD;
    case 'PHOTO_UNPUBLISHABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_UNPUBLISHABLE;
    case 'PHOTO_PENDING_CENSORSHIP':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_PENDING_CENSORSHIP;
    case 'PHOTO_BATTLE_HISTORY_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_BATTLE_HISTORY_EXISTS;
    case 'PHOTO_CASUAL_BATTLE_HISTORY_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_CASUAL_BATTLE_HISTORY_EXISTS;
    case 'PHOTO_QUALITY_TOO_LOW':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_QUALITY_TOO_LOW;
    case 'PHOTO_PREVIOUS_DEFEAT':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_PREVIOUS_DEFEAT;
    case 'PHOTO_NOT_REPORTED':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_REPORTED;
    case 'PHOTO_TAG_MISMATCH':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_TAG_MISMATCH;
    case 'PHOTO_TAG_UNSUPPORTED':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_TAG_UNSUPPORTED;
    case 'PHOTO_INVALID_TYPE':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_INVALID_TYPE;
    case 'PHOTO_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_FOUND;
    case 'PHOTO_APPROVE_FAILED':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_APPROVE_FAILED;
    case 'PHOTO_NOT_ADMIN':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_ADMIN;
    case 'PHOTO_DELETE_FAILED':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_DELETE_FAILED;
    case 'PHOTO_UPLOAD_FAILED':
      return _$apiErrorResponseDTOErrorTypeEnum_PHOTO_UPLOAD_FAILED;
    case 'DECK_MAX_LIMIT':
      return _$apiErrorResponseDTOErrorTypeEnum_DECK_MAX_LIMIT;
    case 'DECK_CAMERA_MISMATCH':
      return _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_MISMATCH;
    case 'DECK_CAMERA_INVALID':
      return _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_INVALID;
    case 'DECK_CAMERA_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_EXISTS;
    case 'DECK_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_DECK_NOT_FOUND;
    case 'DECK_INCORRECT_UPDATE_FLAG':
      return _$apiErrorResponseDTOErrorTypeEnum_DECK_INCORRECT_UPDATE_FLAG;
    case 'SPOT_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_NOT_FOUND;
    case 'SPOT_IS_EXISTING':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_IS_EXISTING;
    case 'SPOT_ATTRIBUTE_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_EXISTS;
    case 'SPOT_ATTRIBUTE_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_NOT_FOUND;
    case 'SPOT_ATTRIBUTE_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_IN_USE;
    case 'SPOT_PHOTO_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_EXISTS;
    case 'SPOT_INCORRECT_UPDATE_FLAG':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_INCORRECT_UPDATE_FLAG;
    case 'SPOT_PHOTO_ERROR':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_ERROR;
    case 'SPOT_PHOTO_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_NOT_FOUND;
    case 'SPOT_LATITUDE_LONGITUDE_REQUIRED':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_LATITUDE_LONGITUDE_REQUIRED;
    case 'SPOT_WAEVE_OUT_OF_RANGE':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_WAEVE_OUT_OF_RANGE;
    case 'SPOT_CANNOT_BE_DELETED':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_CANNOT_BE_DELETED;
    case 'SPOT_ALREADY_CAPTURED':
      return _$apiErrorResponseDTOErrorTypeEnum_SPOT_ALREADY_CAPTURED;
    case 'EXPLORER_INSUFFICIENT_ENERGY':
      return _$apiErrorResponseDTOErrorTypeEnum_EXPLORER_INSUFFICIENT_ENERGY;
    case 'FLAG_ALREADY_CONSTRUCTED':
      return _$apiErrorResponseDTOErrorTypeEnum_FLAG_ALREADY_CONSTRUCTED;
    case 'FLAG_MAX_LEVEL':
      return _$apiErrorResponseDTOErrorTypeEnum_FLAG_MAX_LEVEL;
    case 'FLAG_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_FLAG_NOT_FOUND;
    case 'FLAG_FULL_ENDURANCE':
      return _$apiErrorResponseDTOErrorTypeEnum_FLAG_FULL_ENDURANCE;
    case 'REACHED_MAX_BATTLES':
      return _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_BATTLES;
    case 'REACHED_MAX_STARS':
      return _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_STARS;
    case 'BATTLE_ALREADY_SETTLED':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_SETTLED;
    case 'BATTLE_NO_LONGER_ACCESSIBLE':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NO_LONGER_ACCESSIBLE;
    case 'BATTLE_CANNNOT_BE_CANCELLED_YET':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_CANNNOT_BE_CANCELLED_YET;
    case 'REACHED_MAX_DAILY_ENTRIES':
      return _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_DAILY_ENTRIES;
    case 'BATTLE_ALREADY_VOTED':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_VOTED;
    case 'REACHED_MAX_BATTLES_PER_PHOTO':
      return _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_BATTLES_PER_PHOTO;
    case 'BATTLE_ALREADY_KICKED_OFF':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_KICKED_OFF;
    case 'BATTLE_ALREADY_JOINED':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_JOINED;
    case 'BATTLE_NOT_YET_JOINED':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_YET_JOINED;
    case 'BATTLE_NOT_JOINABLE_BY_BAN':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_JOINABLE_BY_BAN;
    case 'BATTLE_NOT_READY':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_READY;
    case 'BATTLE_NOT_OWNED_BY_YOU':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_OWNED_BY_YOU;
    case 'BATTLE_OWNED_BY_YOU':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_OWNED_BY_YOU;
    case 'BATTLE_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_UNFOUND;
    case 'BATTLE_ALREADY_FULL':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_FULL;
    case 'BATTLE_PHOTO_UNPICKED':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_PHOTO_UNPICKED;
    case 'BATTLE_PHOTO_ALREADY_PICKED':
      return _$apiErrorResponseDTOErrorTypeEnum_BATTLE_PHOTO_ALREADY_PICKED;
    case 'NFT_OUT_OF_STOCK':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_OUT_OF_STOCK;
    case 'NFT_NOT_OWNED_BY_YOU':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_OWNED_BY_YOU;
    case 'NFT_ALREADY_UNBOXED':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ALREADY_UNBOXED;
    case 'NFT_NOT_UNBOXED':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_UNBOXED;
    case 'NFT_NOT_ENOUGH_SKILL_POINTS':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_SKILL_POINTS;
    case 'NFT_NOT_ENOUGH_BATTERIES':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_BATTERIES;
    case 'NFT_NOT_ENOUGH_FILMS':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_FILMS;
    case 'NFT_REACHED_MAX_LEVEL':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_REACHED_MAX_LEVEL;
    case 'NFT_UPGRADE_COOLDOWN':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_UPGRADE_COOLDOWN;
    case 'NFT_TRANSFER_COOLDOWN':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_TRANSFER_COOLDOWN;
    case 'NFT_MINT_COOLDOWN':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_MINT_COOLDOWN;
    case 'NFT_ZERO_DURABILITY':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ZERO_DURABILITY;
    case 'NFT_CAMERA_IS_NOT_BROKEN':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_CAMERA_IS_NOT_BROKEN;
    case 'NFT_NOT_UPGRADABLE_WITH_BOOSTER':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_UPGRADABLE_WITH_BOOSTER;
    case 'NFT_BATTERY_FULL':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_BATTERY_FULL;
    case 'NFT_ACCESSORY_SLOTS_FULL':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_SLOTS_FULL;
    case 'NFT_ACCESSORY_NOT_EQUIPPED':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_NOT_EQUIPPED;
    case 'NFT_ACCESSORY_FUSION_LIMIT':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_LIMIT;
    case 'NFT_ACCESSORY_IS_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_IS_IN_USE;
    case 'NFT_ACCESSORY_FUSION_NOT_SAME':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_NOT_SAME;
    case 'NFT_ACCESSORY_FUSION_UNEQUAL_STAR':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_UNEQUAL_STAR;
    case 'NFT_ACCESSORY_FUSION_STAR_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_STAR_UNFOUND;
    case 'NFT_ACCESSORY_FUSION_UNEQUAL_GRADE':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_UNEQUAL_GRADE;
    case 'NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE;
    case 'NFT_NO_SKILL_POINTS_USED':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NO_SKILL_POINTS_USED;
    case 'NFT_MAX_ROULETTE_SPIN':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_MAX_ROULETTE_SPIN;
    case 'NFT_SKIN_ALREADY_EQUIPPED':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_SKIN_ALREADY_EQUIPPED;
    case 'NFT_ACCESSORY_NOT_EQUIPPED2':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_NOT_EQUIPPED2;
    case 'NFT_EXTRA_SLOT_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_EXTRA_SLOT_IN_USE;
    case 'NFT_INCOMPATIBLE_TYPE':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_INCOMPATIBLE_TYPE;
    case 'NFT_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_FOUND;
    case 'EXPLORER_ALREADY_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_EXPLORER_ALREADY_EXISTS;
    case 'NFT_ATTRIBUTE_EXISTS':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_EXISTS;
    case 'NFT_ATTRIBUTE_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_NOT_FOUND;
    case 'NFT_ATTRIBUTE_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_IN_USE;
    case 'NFT_CREATION_FAILED':
      return _$apiErrorResponseDTOErrorTypeEnum_NFT_CREATION_FAILED;
    case 'MINT_LEVEL_NOT_MAX':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_LEVEL_NOT_MAX;
    case 'MINT_BATTERY_NOT_FULL':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_BATTERY_NOT_FULL;
    case 'MINT_REACHED_MAX_COUNT':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_REACHED_MAX_COUNT;
    case 'MINT_LEFTHAND_NOT_MINTABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_LEFTHAND_NOT_MINTABLE;
    case 'MINT_RIGHTHAND_NOT_MINTABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_RIGHTHAND_NOT_MINTABLE;
    case 'MINT_LEFTHAND_BROKEN':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_LEFTHAND_BROKEN;
    case 'MINT_RIGHTHAND_BROKEN':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_RIGHTHAND_BROKEN;
    case 'MINT_SCROLL_INSUFFICIENT':
      return _$apiErrorResponseDTOErrorTypeEnum_MINT_SCROLL_INSUFFICIENT;
    case 'BADGE_ALREADY_OWNED':
      return _$apiErrorResponseDTOErrorTypeEnum_BADGE_ALREADY_OWNED;
    case 'BADGE_UNPURCHASABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_BADGE_UNPURCHASABLE;
    case 'BADGE_RANK_CANNOT_BE_BOOST':
      return _$apiErrorResponseDTOErrorTypeEnum_BADGE_RANK_CANNOT_BE_BOOST;
    case 'BADGE_RANK_REACHED_MAXIMUM_BOOST':
      return _$apiErrorResponseDTOErrorTypeEnum_BADGE_RANK_REACHED_MAXIMUM_BOOST;
    case 'BADGE_UNSELLABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_BADGE_UNSELLABLE;
    case 'INVENTORY_ITEM_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_UNFOUND;
    case 'INVENTORY_ITEM_OUT_OF_PERIOD':
      return _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_OUT_OF_PERIOD;
    case 'INVENTORY_ITEM_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_IN_USE;
    case 'INVENTORY_ITEM_NOT_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_NOT_IN_USE;
    case 'INVENTORY_ITEM_UNEQUIPABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_UNEQUIPABLE;
    case 'BALANCE_INSUFFICIENT':
      return _$apiErrorResponseDTOErrorTypeEnum_BALANCE_INSUFFICIENT;
    case 'INSUFFICIENT_SUPPLY_OF_STP':
      return _$apiErrorResponseDTOErrorTypeEnum_INSUFFICIENT_SUPPLY_OF_STP;
    case 'INSUFFICIENT_SUPPLY_OF_SNPT':
      return _$apiErrorResponseDTOErrorTypeEnum_INSUFFICIENT_SUPPLY_OF_SNPT;
    case 'LIQUIDITIES_CHANGED':
      return _$apiErrorResponseDTOErrorTypeEnum_LIQUIDITIES_CHANGED;
    case 'EXTERNAL_WALLET_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_EXTERNAL_WALLET_UNFOUND;
    case 'WITHDRAW_DAILY_LIMIT_REACHED':
      return _$apiErrorResponseDTOErrorTypeEnum_WITHDRAW_DAILY_LIMIT_REACHED;
    case 'WITHDRAW_NOT_PERMITTED':
      return _$apiErrorResponseDTOErrorTypeEnum_WITHDRAW_NOT_PERMITTED;
    case 'REVENUECAT_ERROR':
      return _$apiErrorResponseDTOErrorTypeEnum_REVENUECAT_ERROR;
    case 'MAIL_TEMPLATE_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_MAIL_TEMPLATE_UNFOUND;
    case 'MAIL_ATTACHMENT_EXPIRED':
      return _$apiErrorResponseDTOErrorTypeEnum_MAIL_ATTACHMENT_EXPIRED;
    case 'LOOTBOX_MYSTERY_SLOTS_FULL':
      return _$apiErrorResponseDTOErrorTypeEnum_LOOTBOX_MYSTERY_SLOTS_FULL;
    case 'LOOTBOX_MYSTERY_COOLDOWN':
      return _$apiErrorResponseDTOErrorTypeEnum_LOOTBOX_MYSTERY_COOLDOWN;
    case 'GACHA_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_GACHA_UNFOUND;
    case 'GACHA_OUT_OF_PERIOD':
      return _$apiErrorResponseDTOErrorTypeEnum_GACHA_OUT_OF_PERIOD;
    case 'SHOP_PRODUCT_UNFOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_UNFOUND;
    case 'SHOP_PRODUCT_CONTENTS_INVALID':
      return _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_CONTENTS_INVALID;
    case 'SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED':
      return _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED;
    case 'RENTAL_NOT_QUALIFIED':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NOT_QUALIFIED;
    case 'RENTAL_CONTRACT_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_NOT_FOUND;
    case 'RENTAL_CONTRACT_NOT_AVAILABLE':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_NOT_AVAILABLE;
    case 'RENTAL_CONTRACT_ONGOING':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_ONGOING;
    case 'RENTAL_CONTRACT_TERMINATED':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_TERMINATED;
    case 'RENTAL_CAMERAS_PACK_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_IN_USE;
    case 'RENTAL_CAMERAS_PACK_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_NOT_FOUND;
    case 'RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU;
    case 'RENTAL_CAMERAS_PACK_INVALID_COUNT':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_INVALID_COUNT;
    case 'RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND;
    case 'RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL;
    case 'RENTAL_CONTRACT_LIMIT_REACHED':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_LIMIT_REACHED;
    case 'RENTAL_NFT_NOT_FOUND':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NFT_NOT_FOUND;
    case 'RENTAL_NFT_IN_USE':
      return _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NFT_IN_USE;
    case 'INVALID_PARAMETER':
      return _$apiErrorResponseDTOErrorTypeEnum_INVALID_PARAMETER;
    case 'INVALID_MIME_TYPE':
      return _$apiErrorResponseDTOErrorTypeEnum_INVALID_MIME_TYPE;
    case 'UNDER_MAINTENANCE':
      return _$apiErrorResponseDTOErrorTypeEnum_UNDER_MAINTENANCE;
    case 'UNKNOWN':
      return _$apiErrorResponseDTOErrorTypeEnum_UNKNOWN;
    case 'VALIDATION_ERROR':
      return _$apiErrorResponseDTOErrorTypeEnum_VALIDATION_ERROR;
    case 'IS_SPAM':
      return _$apiErrorResponseDTOErrorTypeEnum_IS_SPAM;
    case 'RECAPTCHA_REQUEST_ERROR':
      return _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_REQUEST_ERROR;
    case 'RECAPTCHA_ACTION_TYPE_UNMATCHED':
      return _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_ACTION_TYPE_UNMATCHED;
    case 'RECAPTCHA_SCORE_TOO_LOW':
      return _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_SCORE_TOO_LOW;
    case 'AUTH_ERROR':
      return _$apiErrorResponseDTOErrorTypeEnum_AUTH_ERROR;
    case 'SNPIT_ERROR':
      return _$apiErrorResponseDTOErrorTypeEnum_SNPIT_ERROR;
    default:
      throw new ArgumentError(name);
  }
}

final BuiltSet&lt;ApiErrorResponseDTOErrorTypeEnum&gt;
    _$apiErrorResponseDTOErrorTypeEnumValues = new BuiltSet&lt;
        ApiErrorResponseDTOErrorTypeEnum&gt;(const &lt;ApiErrorResponseDTOErrorTypeEnum&gt;[
  _$apiErrorResponseDTOErrorTypeEnum_USER_VERIFICATION_CODE_COOLDOWN,
  _$apiErrorResponseDTOErrorTypeEnum_USER_VERIFICATION_CODE_UNMATCHED,
  _$apiErrorResponseDTOErrorTypeEnum_USER_INVIATION_CODE_INVALID,
  _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_ENROLLED_IN_MEMBERSHIP,
  _$apiErrorResponseDTOErrorTypeEnum_USER_NOT_ADMIN,
  _$apiErrorResponseDTOErrorTypeEnum_USER_UNAUTHORIZED,
  _$apiErrorResponseDTOErrorTypeEnum_USER_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_USER_INCORRECT_UPDATE_FLAG,
  _$apiErrorResponseDTOErrorTypeEnum_ITEM_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_ITEM_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_ITEM_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_ITEM_BOX_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_ITEM_BOX_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_MEMBER_STATUS_UDPATE,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_MEMBER_ROLE_UDPATE,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_UPDATE_FLAG,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_INCORRECT_PRIVILEGE,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_DUPLICATE_MEMBER,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_INFO_LENGTH_EXCEEDED,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_MEMBER_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_MAX_MEMBERS,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_MAX_ADMINS,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_USER_NOT_MEMBER,
  _$apiErrorResponseDTOErrorTypeEnum_GUILD_SPOT_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_OWNED_BY_YOU,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NO_LONGER_ACCESSIBLE,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_INVISIBLE,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_ALBUM_FULL,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_DUPLICATED_UPLOAD,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_UNPUBLISHABLE,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_PENDING_CENSORSHIP,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_BATTLE_HISTORY_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_CASUAL_BATTLE_HISTORY_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_QUALITY_TOO_LOW,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_PREVIOUS_DEFEAT,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_REPORTED,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_TAG_MISMATCH,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_TAG_UNSUPPORTED,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_INVALID_TYPE,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_APPROVE_FAILED,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_NOT_ADMIN,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_DELETE_FAILED,
  _$apiErrorResponseDTOErrorTypeEnum_PHOTO_UPLOAD_FAILED,
  _$apiErrorResponseDTOErrorTypeEnum_DECK_MAX_LIMIT,
  _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_MISMATCH,
  _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_INVALID,
  _$apiErrorResponseDTOErrorTypeEnum_DECK_CAMERA_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_DECK_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_DECK_INCORRECT_UPDATE_FLAG,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_IS_EXISTING,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_ATTRIBUTE_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_INCORRECT_UPDATE_FLAG,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_ERROR,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_PHOTO_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_LATITUDE_LONGITUDE_REQUIRED,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_WAEVE_OUT_OF_RANGE,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_CANNOT_BE_DELETED,
  _$apiErrorResponseDTOErrorTypeEnum_SPOT_ALREADY_CAPTURED,
  _$apiErrorResponseDTOErrorTypeEnum_EXPLORER_INSUFFICIENT_ENERGY,
  _$apiErrorResponseDTOErrorTypeEnum_FLAG_ALREADY_CONSTRUCTED,
  _$apiErrorResponseDTOErrorTypeEnum_FLAG_MAX_LEVEL,
  _$apiErrorResponseDTOErrorTypeEnum_FLAG_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_FLAG_FULL_ENDURANCE,
  _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_BATTLES,
  _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_STARS,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_SETTLED,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NO_LONGER_ACCESSIBLE,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_CANNNOT_BE_CANCELLED_YET,
  _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_DAILY_ENTRIES,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_VOTED,
  _$apiErrorResponseDTOErrorTypeEnum_REACHED_MAX_BATTLES_PER_PHOTO,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_KICKED_OFF,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_JOINED,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_YET_JOINED,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_JOINABLE_BY_BAN,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_READY,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_NOT_OWNED_BY_YOU,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_OWNED_BY_YOU,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_ALREADY_FULL,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_PHOTO_UNPICKED,
  _$apiErrorResponseDTOErrorTypeEnum_BATTLE_PHOTO_ALREADY_PICKED,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_OUT_OF_STOCK,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_OWNED_BY_YOU,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ALREADY_UNBOXED,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_UNBOXED,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_SKILL_POINTS,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_BATTERIES,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_ENOUGH_FILMS,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_REACHED_MAX_LEVEL,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_UPGRADE_COOLDOWN,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_TRANSFER_COOLDOWN,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_MINT_COOLDOWN,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ZERO_DURABILITY,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_CAMERA_IS_NOT_BROKEN,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_UPGRADABLE_WITH_BOOSTER,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_BATTERY_FULL,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_SLOTS_FULL,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_NOT_EQUIPPED,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_LIMIT,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_IS_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_NOT_SAME,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_UNEQUAL_STAR,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_STAR_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_UNEQUAL_GRADE,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NO_SKILL_POINTS_USED,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_MAX_ROULETTE_SPIN,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_SKIN_ALREADY_EQUIPPED,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ACCESSORY_NOT_EQUIPPED2,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_EXTRA_SLOT_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_INCOMPATIBLE_TYPE,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_EXPLORER_ALREADY_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_EXISTS,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_ATTRIBUTE_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_NFT_CREATION_FAILED,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_LEVEL_NOT_MAX,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_BATTERY_NOT_FULL,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_REACHED_MAX_COUNT,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_LEFTHAND_NOT_MINTABLE,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_RIGHTHAND_NOT_MINTABLE,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_LEFTHAND_BROKEN,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_RIGHTHAND_BROKEN,
  _$apiErrorResponseDTOErrorTypeEnum_MINT_SCROLL_INSUFFICIENT,
  _$apiErrorResponseDTOErrorTypeEnum_BADGE_ALREADY_OWNED,
  _$apiErrorResponseDTOErrorTypeEnum_BADGE_UNPURCHASABLE,
  _$apiErrorResponseDTOErrorTypeEnum_BADGE_RANK_CANNOT_BE_BOOST,
  _$apiErrorResponseDTOErrorTypeEnum_BADGE_RANK_REACHED_MAXIMUM_BOOST,
  _$apiErrorResponseDTOErrorTypeEnum_BADGE_UNSELLABLE,
  _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_OUT_OF_PERIOD,
  _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_NOT_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_INVENTORY_ITEM_UNEQUIPABLE,
  _$apiErrorResponseDTOErrorTypeEnum_BALANCE_INSUFFICIENT,
  _$apiErrorResponseDTOErrorTypeEnum_INSUFFICIENT_SUPPLY_OF_STP,
  _$apiErrorResponseDTOErrorTypeEnum_INSUFFICIENT_SUPPLY_OF_SNPT,
  _$apiErrorResponseDTOErrorTypeEnum_LIQUIDITIES_CHANGED,
  _$apiErrorResponseDTOErrorTypeEnum_EXTERNAL_WALLET_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_WITHDRAW_DAILY_LIMIT_REACHED,
  _$apiErrorResponseDTOErrorTypeEnum_WITHDRAW_NOT_PERMITTED,
  _$apiErrorResponseDTOErrorTypeEnum_REVENUECAT_ERROR,
  _$apiErrorResponseDTOErrorTypeEnum_MAIL_TEMPLATE_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_MAIL_ATTACHMENT_EXPIRED,
  _$apiErrorResponseDTOErrorTypeEnum_LOOTBOX_MYSTERY_SLOTS_FULL,
  _$apiErrorResponseDTOErrorTypeEnum_LOOTBOX_MYSTERY_COOLDOWN,
  _$apiErrorResponseDTOErrorTypeEnum_GACHA_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_GACHA_OUT_OF_PERIOD,
  _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_UNFOUND,
  _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_CONTENTS_INVALID,
  _$apiErrorResponseDTOErrorTypeEnum_SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NOT_QUALIFIED,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_NOT_AVAILABLE,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_ONGOING,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_TERMINATED,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_INVALID_COUNT,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_CONTRACT_LIMIT_REACHED,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NFT_NOT_FOUND,
  _$apiErrorResponseDTOErrorTypeEnum_RENTAL_NFT_IN_USE,
  _$apiErrorResponseDTOErrorTypeEnum_INVALID_PARAMETER,
  _$apiErrorResponseDTOErrorTypeEnum_INVALID_MIME_TYPE,
  _$apiErrorResponseDTOErrorTypeEnum_UNDER_MAINTENANCE,
  _$apiErrorResponseDTOErrorTypeEnum_UNKNOWN,
  _$apiErrorResponseDTOErrorTypeEnum_VALIDATION_ERROR,
  _$apiErrorResponseDTOErrorTypeEnum_IS_SPAM,
  _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_REQUEST_ERROR,
  _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_ACTION_TYPE_UNMATCHED,
  _$apiErrorResponseDTOErrorTypeEnum_RECAPTCHA_SCORE_TOO_LOW,
  _$apiErrorResponseDTOErrorTypeEnum_AUTH_ERROR,
  _$apiErrorResponseDTOErrorTypeEnum_SNPIT_ERROR,
]);

Serializer&lt;ApiErrorResponseDTOErrorTypeEnum&gt;
    _$apiErrorResponseDTOErrorTypeEnumSerializer =
    new _$ApiErrorResponseDTOErrorTypeEnumSerializer();

class _$ApiErrorResponseDTOErrorTypeEnumSerializer
    implements PrimitiveSerializer&lt;ApiErrorResponseDTOErrorTypeEnum&gt; {
  static const Map&lt;String, Object&gt; _toWire = const &lt;String, Object&gt;{
    'USER_VERIFICATION_CODE_COOLDOWN': 'USER_VERIFICATION_CODE_COOLDOWN',
    'USER_VERIFICATION_CODE_UNMATCHED': 'USER_VERIFICATION_CODE_UNMATCHED',
    'USER_INVIATION_CODE_INVALID': 'USER_INVIATION_CODE_INVALID',
    'USER_NOT_FOUND': 'USER_NOT_FOUND',
    'USER_NOT_ENROLLED_IN_MEMBERSHIP': 'USER_NOT_ENROLLED_IN_MEMBERSHIP',
    'USER_NOT_ADMIN': 'USER_NOT_ADMIN',
    'USER_UNAUTHORIZED': 'USER_UNAUTHORIZED',
    'USER_EXISTS': 'USER_EXISTS',
    'USER_INCORRECT_UPDATE_FLAG': 'USER_INCORRECT_UPDATE_FLAG',
    'ITEM_EXISTS': 'ITEM_EXISTS',
    'ITEM_NOT_FOUND': 'ITEM_NOT_FOUND',
    'ITEM_IN_USE': 'ITEM_IN_USE',
    'ITEM_BOX_EXISTS': 'ITEM_BOX_EXISTS',
    'ITEM_BOX_NOT_FOUND': 'ITEM_BOX_NOT_FOUND',
    'GUILD_NOT_FOUND': 'GUILD_NOT_FOUND',
    'GUILD_EXISTS': 'GUILD_EXISTS',
    'GUILD_INCORRECT_MEMBER_STATUS_UDPATE':
        'GUILD_INCORRECT_MEMBER_STATUS_UDPATE',
    'GUILD_INCORRECT_MEMBER_ROLE_UDPATE': 'GUILD_INCORRECT_MEMBER_ROLE_UDPATE',
    'GUILD_INCORRECT_UPDATE_FLAG': 'GUILD_INCORRECT_UPDATE_FLAG',
    'GUILD_INCORRECT_PRIVILEGE': 'GUILD_INCORRECT_PRIVILEGE',
    'GUILD_DUPLICATE_MEMBER': 'GUILD_DUPLICATE_MEMBER',
    'GUILD_INFO_LENGTH_EXCEEDED': 'GUILD_INFO_LENGTH_EXCEEDED',
    'GUILD_MEMBER_EXISTS': 'GUILD_MEMBER_EXISTS',
    'GUILD_MAX_MEMBERS': 'GUILD_MAX_MEMBERS',
    'GUILD_MAX_ADMINS': 'GUILD_MAX_ADMINS',
    'GUILD_USER_NOT_MEMBER': 'GUILD_USER_NOT_MEMBER',
    'GUILD_SPOT_NOT_FOUND': 'GUILD_SPOT_NOT_FOUND',
    'PHOTO_NOT_OWNED_BY_YOU': 'PHOTO_NOT_OWNED_BY_YOU',
    'PHOTO_NO_LONGER_ACCESSIBLE': 'PHOTO_NO_LONGER_ACCESSIBLE',
    'PHOTO_INVISIBLE': 'PHOTO_INVISIBLE',
    'PHOTO_ALBUM_FULL': 'PHOTO_ALBUM_FULL',
    'PHOTO_DUPLICATED_UPLOAD': 'PHOTO_DUPLICATED_UPLOAD',
    'PHOTO_UNPUBLISHABLE': 'PHOTO_UNPUBLISHABLE',
    'PHOTO_PENDING_CENSORSHIP': 'PHOTO_PENDING_CENSORSHIP',
    'PHOTO_BATTLE_HISTORY_EXISTS': 'PHOTO_BATTLE_HISTORY_EXISTS',
    'PHOTO_CASUAL_BATTLE_HISTORY_EXISTS': 'PHOTO_CASUAL_BATTLE_HISTORY_EXISTS',
    'PHOTO_QUALITY_TOO_LOW': 'PHOTO_QUALITY_TOO_LOW',
    'PHOTO_PREVIOUS_DEFEAT': 'PHOTO_PREVIOUS_DEFEAT',
    'PHOTO_NOT_REPORTED': 'PHOTO_NOT_REPORTED',
    'PHOTO_TAG_MISMATCH': 'PHOTO_TAG_MISMATCH',
    'PHOTO_TAG_UNSUPPORTED': 'PHOTO_TAG_UNSUPPORTED',
    'PHOTO_INVALID_TYPE': 'PHOTO_INVALID_TYPE',
    'PHOTO_NOT_FOUND': 'PHOTO_NOT_FOUND',
    'PHOTO_APPROVE_FAILED': 'PHOTO_APPROVE_FAILED',
    'PHOTO_NOT_ADMIN': 'PHOTO_NOT_ADMIN',
    'PHOTO_DELETE_FAILED': 'PHOTO_DELETE_FAILED',
    'PHOTO_UPLOAD_FAILED': 'PHOTO_UPLOAD_FAILED',
    'DECK_MAX_LIMIT': 'DECK_MAX_LIMIT',
    'DECK_CAMERA_MISMATCH': 'DECK_CAMERA_MISMATCH',
    'DECK_CAMERA_INVALID': 'DECK_CAMERA_INVALID',
    'DECK_CAMERA_EXISTS': 'DECK_CAMERA_EXISTS',
    'DECK_NOT_FOUND': 'DECK_NOT_FOUND',
    'DECK_INCORRECT_UPDATE_FLAG': 'DECK_INCORRECT_UPDATE_FLAG',
    'SPOT_NOT_FOUND': 'SPOT_NOT_FOUND',
    'SPOT_IS_EXISTING': 'SPOT_IS_EXISTING',
    'SPOT_ATTRIBUTE_EXISTS': 'SPOT_ATTRIBUTE_EXISTS',
    'SPOT_ATTRIBUTE_NOT_FOUND': 'SPOT_ATTRIBUTE_NOT_FOUND',
    'SPOT_ATTRIBUTE_IN_USE': 'SPOT_ATTRIBUTE_IN_USE',
    'SPOT_PHOTO_EXISTS': 'SPOT_PHOTO_EXISTS',
    'SPOT_INCORRECT_UPDATE_FLAG': 'SPOT_INCORRECT_UPDATE_FLAG',
    'SPOT_PHOTO_ERROR': 'SPOT_PHOTO_ERROR',
    'SPOT_PHOTO_NOT_FOUND': 'SPOT_PHOTO_NOT_FOUND',
    'SPOT_LATITUDE_LONGITUDE_REQUIRED': 'SPOT_LATITUDE_LONGITUDE_REQUIRED',
    'SPOT_WAEVE_OUT_OF_RANGE': 'SPOT_WAEVE_OUT_OF_RANGE',
    'SPOT_CANNOT_BE_DELETED': 'SPOT_CANNOT_BE_DELETED',
    'SPOT_ALREADY_CAPTURED': 'SPOT_ALREADY_CAPTURED',
    'EXPLORER_INSUFFICIENT_ENERGY': 'EXPLORER_INSUFFICIENT_ENERGY',
    'FLAG_ALREADY_CONSTRUCTED': 'FLAG_ALREADY_CONSTRUCTED',
    'FLAG_MAX_LEVEL': 'FLAG_MAX_LEVEL',
    'FLAG_NOT_FOUND': 'FLAG_NOT_FOUND',
    'FLAG_FULL_ENDURANCE': 'FLAG_FULL_ENDURANCE',
    'REACHED_MAX_BATTLES': 'REACHED_MAX_BATTLES',
    'REACHED_MAX_STARS': 'REACHED_MAX_STARS',
    'BATTLE_ALREADY_SETTLED': 'BATTLE_ALREADY_SETTLED',
    'BATTLE_NO_LONGER_ACCESSIBLE': 'BATTLE_NO_LONGER_ACCESSIBLE',
    'BATTLE_CANNNOT_BE_CANCELLED_YET': 'BATTLE_CANNNOT_BE_CANCELLED_YET',
    'REACHED_MAX_DAILY_ENTRIES': 'REACHED_MAX_DAILY_ENTRIES',
    'BATTLE_ALREADY_VOTED': 'BATTLE_ALREADY_VOTED',
    'REACHED_MAX_BATTLES_PER_PHOTO': 'REACHED_MAX_BATTLES_PER_PHOTO',
    'BATTLE_ALREADY_KICKED_OFF': 'BATTLE_ALREADY_KICKED_OFF',
    'BATTLE_ALREADY_JOINED': 'BATTLE_ALREADY_JOINED',
    'BATTLE_NOT_YET_JOINED': 'BATTLE_NOT_YET_JOINED',
    'BATTLE_NOT_JOINABLE_BY_BAN': 'BATTLE_NOT_JOINABLE_BY_BAN',
    'BATTLE_NOT_READY': 'BATTLE_NOT_READY',
    'BATTLE_NOT_OWNED_BY_YOU': 'BATTLE_NOT_OWNED_BY_YOU',
    'BATTLE_OWNED_BY_YOU': 'BATTLE_OWNED_BY_YOU',
    'BATTLE_UNFOUND': 'BATTLE_UNFOUND',
    'BATTLE_ALREADY_FULL': 'BATTLE_ALREADY_FULL',
    'BATTLE_PHOTO_UNPICKED': 'BATTLE_PHOTO_UNPICKED',
    'BATTLE_PHOTO_ALREADY_PICKED': 'BATTLE_PHOTO_ALREADY_PICKED',
    'NFT_OUT_OF_STOCK': 'NFT_OUT_OF_STOCK',
    'NFT_NOT_OWNED_BY_YOU': 'NFT_NOT_OWNED_BY_YOU',
    'NFT_ALREADY_UNBOXED': 'NFT_ALREADY_UNBOXED',
    'NFT_NOT_UNBOXED': 'NFT_NOT_UNBOXED',
    'NFT_NOT_ENOUGH_SKILL_POINTS': 'NFT_NOT_ENOUGH_SKILL_POINTS',
    'NFT_NOT_ENOUGH_BATTERIES': 'NFT_NOT_ENOUGH_BATTERIES',
    'NFT_NOT_ENOUGH_FILMS': 'NFT_NOT_ENOUGH_FILMS',
    'NFT_REACHED_MAX_LEVEL': 'NFT_REACHED_MAX_LEVEL',
    'NFT_UPGRADE_COOLDOWN': 'NFT_UPGRADE_COOLDOWN',
    'NFT_TRANSFER_COOLDOWN': 'NFT_TRANSFER_COOLDOWN',
    'NFT_MINT_COOLDOWN': 'NFT_MINT_COOLDOWN',
    'NFT_ZERO_DURABILITY': 'NFT_ZERO_DURABILITY',
    'NFT_CAMERA_IS_NOT_BROKEN': 'NFT_CAMERA_IS_NOT_BROKEN',
    'NFT_NOT_UPGRADABLE_WITH_BOOSTER': 'NFT_NOT_UPGRADABLE_WITH_BOOSTER',
    'NFT_BATTERY_FULL': 'NFT_BATTERY_FULL',
    'NFT_ACCESSORY_SLOTS_FULL': 'NFT_ACCESSORY_SLOTS_FULL',
    'NFT_ACCESSORY_NOT_EQUIPPED': 'NFT_ACCESSORY_NOT_EQUIPPED',
    'NFT_ACCESSORY_FUSION_LIMIT': 'NFT_ACCESSORY_FUSION_LIMIT',
    'NFT_ACCESSORY_IS_IN_USE': 'NFT_ACCESSORY_IS_IN_USE',
    'NFT_ACCESSORY_FUSION_NOT_SAME': 'NFT_ACCESSORY_FUSION_NOT_SAME',
    'NFT_ACCESSORY_FUSION_UNEQUAL_STAR': 'NFT_ACCESSORY_FUSION_UNEQUAL_STAR',
    'NFT_ACCESSORY_FUSION_STAR_UNFOUND': 'NFT_ACCESSORY_FUSION_STAR_UNFOUND',
    'NFT_ACCESSORY_FUSION_UNEQUAL_GRADE': 'NFT_ACCESSORY_FUSION_UNEQUAL_GRADE',
    'NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE':
        'NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE',
    'NFT_NO_SKILL_POINTS_USED': 'NFT_NO_SKILL_POINTS_USED',
    'NFT_MAX_ROULETTE_SPIN': 'NFT_MAX_ROULETTE_SPIN',
    'NFT_SKIN_ALREADY_EQUIPPED': 'NFT_SKIN_ALREADY_EQUIPPED',
    'NFT_ACCESSORY_NOT_EQUIPPED2': 'NFT_ACCESSORY_NOT_EQUIPPED',
    'NFT_EXTRA_SLOT_IN_USE': 'NFT_EXTRA_SLOT_IN_USE',
    'NFT_INCOMPATIBLE_TYPE': 'NFT_INCOMPATIBLE_TYPE',
    'NFT_NOT_FOUND': 'NFT_NOT_FOUND',
    'EXPLORER_ALREADY_EXISTS': 'EXPLORER_ALREADY_EXISTS',
    'NFT_ATTRIBUTE_EXISTS': 'NFT_ATTRIBUTE_EXISTS',
    'NFT_ATTRIBUTE_NOT_FOUND': 'NFT_ATTRIBUTE_NOT_FOUND',
    'NFT_ATTRIBUTE_IN_USE': 'NFT_ATTRIBUTE_IN_USE',
    'NFT_CREATION_FAILED': 'NFT_CREATION_FAILED',
    'MINT_LEVEL_NOT_MAX': 'MINT_LEVEL_NOT_MAX',
    'MINT_BATTERY_NOT_FULL': 'MINT_BATTERY_NOT_FULL',
    'MINT_REACHED_MAX_COUNT': 'MINT_REACHED_MAX_COUNT',
    'MINT_LEFTHAND_NOT_MINTABLE': 'MINT_LEFTHAND_NOT_MINTABLE',
    'MINT_RIGHTHAND_NOT_MINTABLE': 'MINT_RIGHTHAND_NOT_MINTABLE',
    'MINT_LEFTHAND_BROKEN': 'MINT_LEFTHAND_BROKEN',
    'MINT_RIGHTHAND_BROKEN': 'MINT_RIGHTHAND_BROKEN',
    'MINT_SCROLL_INSUFFICIENT': 'MINT_SCROLL_INSUFFICIENT',
    'BADGE_ALREADY_OWNED': 'BADGE_ALREADY_OWNED',
    'BADGE_UNPURCHASABLE': 'BADGE_UNPURCHASABLE',
    'BADGE_RANK_CANNOT_BE_BOOST': 'BADGE_RANK_CANNOT_BE_BOOST',
    'BADGE_RANK_REACHED_MAXIMUM_BOOST': 'BADGE_RANK_REACHED_MAXIMUM_BOOST',
    'BADGE_UNSELLABLE': 'BADGE_UNSELLABLE',
    'INVENTORY_ITEM_UNFOUND': 'INVENTORY_ITEM_UNFOUND',
    'INVENTORY_ITEM_OUT_OF_PERIOD': 'INVENTORY_ITEM_OUT_OF_PERIOD',
    'INVENTORY_ITEM_IN_USE': 'INVENTORY_ITEM_IN_USE',
    'INVENTORY_ITEM_NOT_IN_USE': 'INVENTORY_ITEM_NOT_IN_USE',
    'INVENTORY_ITEM_UNEQUIPABLE': 'INVENTORY_ITEM_UNEQUIPABLE',
    'BALANCE_INSUFFICIENT': 'BALANCE_INSUFFICIENT',
    'INSUFFICIENT_SUPPLY_OF_STP': 'INSUFFICIENT_SUPPLY_OF_STP',
    'INSUFFICIENT_SUPPLY_OF_SNPT': 'INSUFFICIENT_SUPPLY_OF_SNPT',
    'LIQUIDITIES_CHANGED': 'LIQUIDITIES_CHANGED',
    'EXTERNAL_WALLET_UNFOUND': 'EXTERNAL_WALLET_UNFOUND',
    'WITHDRAW_DAILY_LIMIT_REACHED': 'WITHDRAW_DAILY_LIMIT_REACHED',
    'WITHDRAW_NOT_PERMITTED': 'WITHDRAW_NOT_PERMITTED',
    'REVENUECAT_ERROR': 'REVENUECAT_ERROR',
    'MAIL_TEMPLATE_UNFOUND': 'MAIL_TEMPLATE_UNFOUND',
    'MAIL_ATTACHMENT_EXPIRED': 'MAIL_ATTACHMENT_EXPIRED',
    'LOOTBOX_MYSTERY_SLOTS_FULL': 'LOOTBOX_MYSTERY_SLOTS_FULL',
    'LOOTBOX_MYSTERY_COOLDOWN': 'LOOTBOX_MYSTERY_COOLDOWN',
    'GACHA_UNFOUND': 'GACHA_UNFOUND',
    'GACHA_OUT_OF_PERIOD': 'GACHA_OUT_OF_PERIOD',
    'SHOP_PRODUCT_UNFOUND': 'SHOP_PRODUCT_UNFOUND',
    'SHOP_PRODUCT_CONTENTS_INVALID': 'SHOP_PRODUCT_CONTENTS_INVALID',
    'SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED':
        'SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED',
    'RENTAL_NOT_QUALIFIED': 'RENTAL_NOT_QUALIFIED',
    'RENTAL_CONTRACT_NOT_FOUND': 'RENTAL_CONTRACT_NOT_FOUND',
    'RENTAL_CONTRACT_NOT_AVAILABLE': 'RENTAL_CONTRACT_NOT_AVAILABLE',
    'RENTAL_CONTRACT_ONGOING': 'RENTAL_CONTRACT_ONGOING',
    'RENTAL_CONTRACT_TERMINATED': 'RENTAL_CONTRACT_TERMINATED',
    'RENTAL_CAMERAS_PACK_IN_USE': 'RENTAL_CAMERAS_PACK_IN_USE',
    'RENTAL_CAMERAS_PACK_NOT_FOUND': 'RENTAL_CAMERAS_PACK_NOT_FOUND',
    'RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU':
        'RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU',
    'RENTAL_CAMERAS_PACK_INVALID_COUNT': 'RENTAL_CAMERAS_PACK_INVALID_COUNT',
    'RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND':
        'RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND',
    'RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL':
        'RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL',
    'RENTAL_CONTRACT_LIMIT_REACHED': 'RENTAL_CONTRACT_LIMIT_REACHED',
    'RENTAL_NFT_NOT_FOUND': 'RENTAL_NFT_NOT_FOUND',
    'RENTAL_NFT_IN_USE': 'RENTAL_NFT_IN_USE',
    'INVALID_PARAMETER': 'INVALID_PARAMETER',
    'INVALID_MIME_TYPE': 'INVALID_MIME_TYPE',
    'UNDER_MAINTENANCE': 'UNDER_MAINTENANCE',
    'UNKNOWN': 'UNKNOWN',
    'VALIDATION_ERROR': 'VALIDATION_ERROR',
    'IS_SPAM': 'IS_SPAM',
    'RECAPTCHA_REQUEST_ERROR': 'RECAPTCHA_REQUEST_ERROR',
    'RECAPTCHA_ACTION_TYPE_UNMATCHED': 'RECAPTCHA_ACTION_TYPE_UNMATCHED',
    'RECAPTCHA_SCORE_TOO_LOW': 'RECAPTCHA_SCORE_TOO_LOW',
    'AUTH_ERROR': 'AUTH_ERROR',
    'SNPIT_ERROR': 'SNPIT_ERROR',
  };
  static const Map&lt;Object, String&gt; _fromWire = const &lt;Object, String&gt;{
    'USER_VERIFICATION_CODE_COOLDOWN': 'USER_VERIFICATION_CODE_COOLDOWN',
    'USER_VERIFICATION_CODE_UNMATCHED': 'USER_VERIFICATION_CODE_UNMATCHED',
    'USER_INVIATION_CODE_INVALID': 'USER_INVIATION_CODE_INVALID',
    'USER_NOT_FOUND': 'USER_NOT_FOUND',
    'USER_NOT_ENROLLED_IN_MEMBERSHIP': 'USER_NOT_ENROLLED_IN_MEMBERSHIP',
    'USER_NOT_ADMIN': 'USER_NOT_ADMIN',
    'USER_UNAUTHORIZED': 'USER_UNAUTHORIZED',
    'USER_EXISTS': 'USER_EXISTS',
    'USER_INCORRECT_UPDATE_FLAG': 'USER_INCORRECT_UPDATE_FLAG',
    'ITEM_EXISTS': 'ITEM_EXISTS',
    'ITEM_NOT_FOUND': 'ITEM_NOT_FOUND',
    'ITEM_IN_USE': 'ITEM_IN_USE',
    'ITEM_BOX_EXISTS': 'ITEM_BOX_EXISTS',
    'ITEM_BOX_NOT_FOUND': 'ITEM_BOX_NOT_FOUND',
    'GUILD_NOT_FOUND': 'GUILD_NOT_FOUND',
    'GUILD_EXISTS': 'GUILD_EXISTS',
    'GUILD_INCORRECT_MEMBER_STATUS_UDPATE':
        'GUILD_INCORRECT_MEMBER_STATUS_UDPATE',
    'GUILD_INCORRECT_MEMBER_ROLE_UDPATE': 'GUILD_INCORRECT_MEMBER_ROLE_UDPATE',
    'GUILD_INCORRECT_UPDATE_FLAG': 'GUILD_INCORRECT_UPDATE_FLAG',
    'GUILD_INCORRECT_PRIVILEGE': 'GUILD_INCORRECT_PRIVILEGE',
    'GUILD_DUPLICATE_MEMBER': 'GUILD_DUPLICATE_MEMBER',
    'GUILD_INFO_LENGTH_EXCEEDED': 'GUILD_INFO_LENGTH_EXCEEDED',
    'GUILD_MEMBER_EXISTS': 'GUILD_MEMBER_EXISTS',
    'GUILD_MAX_MEMBERS': 'GUILD_MAX_MEMBERS',
    'GUILD_MAX_ADMINS': 'GUILD_MAX_ADMINS',
    'GUILD_USER_NOT_MEMBER': 'GUILD_USER_NOT_MEMBER',
    'GUILD_SPOT_NOT_FOUND': 'GUILD_SPOT_NOT_FOUND',
    'PHOTO_NOT_OWNED_BY_YOU': 'PHOTO_NOT_OWNED_BY_YOU',
    'PHOTO_NO_LONGER_ACCESSIBLE': 'PHOTO_NO_LONGER_ACCESSIBLE',
    'PHOTO_INVISIBLE': 'PHOTO_INVISIBLE',
    'PHOTO_ALBUM_FULL': 'PHOTO_ALBUM_FULL',
    'PHOTO_DUPLICATED_UPLOAD': 'PHOTO_DUPLICATED_UPLOAD',
    'PHOTO_UNPUBLISHABLE': 'PHOTO_UNPUBLISHABLE',
    'PHOTO_PENDING_CENSORSHIP': 'PHOTO_PENDING_CENSORSHIP',
    'PHOTO_BATTLE_HISTORY_EXISTS': 'PHOTO_BATTLE_HISTORY_EXISTS',
    'PHOTO_CASUAL_BATTLE_HISTORY_EXISTS': 'PHOTO_CASUAL_BATTLE_HISTORY_EXISTS',
    'PHOTO_QUALITY_TOO_LOW': 'PHOTO_QUALITY_TOO_LOW',
    'PHOTO_PREVIOUS_DEFEAT': 'PHOTO_PREVIOUS_DEFEAT',
    'PHOTO_NOT_REPORTED': 'PHOTO_NOT_REPORTED',
    'PHOTO_TAG_MISMATCH': 'PHOTO_TAG_MISMATCH',
    'PHOTO_TAG_UNSUPPORTED': 'PHOTO_TAG_UNSUPPORTED',
    'PHOTO_INVALID_TYPE': 'PHOTO_INVALID_TYPE',
    'PHOTO_NOT_FOUND': 'PHOTO_NOT_FOUND',
    'PHOTO_APPROVE_FAILED': 'PHOTO_APPROVE_FAILED',
    'PHOTO_NOT_ADMIN': 'PHOTO_NOT_ADMIN',
    'PHOTO_DELETE_FAILED': 'PHOTO_DELETE_FAILED',
    'PHOTO_UPLOAD_FAILED': 'PHOTO_UPLOAD_FAILED',
    'DECK_MAX_LIMIT': 'DECK_MAX_LIMIT',
    'DECK_CAMERA_MISMATCH': 'DECK_CAMERA_MISMATCH',
    'DECK_CAMERA_INVALID': 'DECK_CAMERA_INVALID',
    'DECK_CAMERA_EXISTS': 'DECK_CAMERA_EXISTS',
    'DECK_NOT_FOUND': 'DECK_NOT_FOUND',
    'DECK_INCORRECT_UPDATE_FLAG': 'DECK_INCORRECT_UPDATE_FLAG',
    'SPOT_NOT_FOUND': 'SPOT_NOT_FOUND',
    'SPOT_IS_EXISTING': 'SPOT_IS_EXISTING',
    'SPOT_ATTRIBUTE_EXISTS': 'SPOT_ATTRIBUTE_EXISTS',
    'SPOT_ATTRIBUTE_NOT_FOUND': 'SPOT_ATTRIBUTE_NOT_FOUND',
    'SPOT_ATTRIBUTE_IN_USE': 'SPOT_ATTRIBUTE_IN_USE',
    'SPOT_PHOTO_EXISTS': 'SPOT_PHOTO_EXISTS',
    'SPOT_INCORRECT_UPDATE_FLAG': 'SPOT_INCORRECT_UPDATE_FLAG',
    'SPOT_PHOTO_ERROR': 'SPOT_PHOTO_ERROR',
    'SPOT_PHOTO_NOT_FOUND': 'SPOT_PHOTO_NOT_FOUND',
    'SPOT_LATITUDE_LONGITUDE_REQUIRED': 'SPOT_LATITUDE_LONGITUDE_REQUIRED',
    'SPOT_WAEVE_OUT_OF_RANGE': 'SPOT_WAEVE_OUT_OF_RANGE',
    'SPOT_CANNOT_BE_DELETED': 'SPOT_CANNOT_BE_DELETED',
    'SPOT_ALREADY_CAPTURED': 'SPOT_ALREADY_CAPTURED',
    'EXPLORER_INSUFFICIENT_ENERGY': 'EXPLORER_INSUFFICIENT_ENERGY',
    'FLAG_ALREADY_CONSTRUCTED': 'FLAG_ALREADY_CONSTRUCTED',
    'FLAG_MAX_LEVEL': 'FLAG_MAX_LEVEL',
    'FLAG_NOT_FOUND': 'FLAG_NOT_FOUND',
    'FLAG_FULL_ENDURANCE': 'FLAG_FULL_ENDURANCE',
    'REACHED_MAX_BATTLES': 'REACHED_MAX_BATTLES',
    'REACHED_MAX_STARS': 'REACHED_MAX_STARS',
    'BATTLE_ALREADY_SETTLED': 'BATTLE_ALREADY_SETTLED',
    'BATTLE_NO_LONGER_ACCESSIBLE': 'BATTLE_NO_LONGER_ACCESSIBLE',
    'BATTLE_CANNNOT_BE_CANCELLED_YET': 'BATTLE_CANNNOT_BE_CANCELLED_YET',
    'REACHED_MAX_DAILY_ENTRIES': 'REACHED_MAX_DAILY_ENTRIES',
    'BATTLE_ALREADY_VOTED': 'BATTLE_ALREADY_VOTED',
    'REACHED_MAX_BATTLES_PER_PHOTO': 'REACHED_MAX_BATTLES_PER_PHOTO',
    'BATTLE_ALREADY_KICKED_OFF': 'BATTLE_ALREADY_KICKED_OFF',
    'BATTLE_ALREADY_JOINED': 'BATTLE_ALREADY_JOINED',
    'BATTLE_NOT_YET_JOINED': 'BATTLE_NOT_YET_JOINED',
    'BATTLE_NOT_JOINABLE_BY_BAN': 'BATTLE_NOT_JOINABLE_BY_BAN',
    'BATTLE_NOT_READY': 'BATTLE_NOT_READY',
    'BATTLE_NOT_OWNED_BY_YOU': 'BATTLE_NOT_OWNED_BY_YOU',
    'BATTLE_OWNED_BY_YOU': 'BATTLE_OWNED_BY_YOU',
    'BATTLE_UNFOUND': 'BATTLE_UNFOUND',
    'BATTLE_ALREADY_FULL': 'BATTLE_ALREADY_FULL',
    'BATTLE_PHOTO_UNPICKED': 'BATTLE_PHOTO_UNPICKED',
    'BATTLE_PHOTO_ALREADY_PICKED': 'BATTLE_PHOTO_ALREADY_PICKED',
    'NFT_OUT_OF_STOCK': 'NFT_OUT_OF_STOCK',
    'NFT_NOT_OWNED_BY_YOU': 'NFT_NOT_OWNED_BY_YOU',
    'NFT_ALREADY_UNBOXED': 'NFT_ALREADY_UNBOXED',
    'NFT_NOT_UNBOXED': 'NFT_NOT_UNBOXED',
    'NFT_NOT_ENOUGH_SKILL_POINTS': 'NFT_NOT_ENOUGH_SKILL_POINTS',
    'NFT_NOT_ENOUGH_BATTERIES': 'NFT_NOT_ENOUGH_BATTERIES',
    'NFT_NOT_ENOUGH_FILMS': 'NFT_NOT_ENOUGH_FILMS',
    'NFT_REACHED_MAX_LEVEL': 'NFT_REACHED_MAX_LEVEL',
    'NFT_UPGRADE_COOLDOWN': 'NFT_UPGRADE_COOLDOWN',
    'NFT_TRANSFER_COOLDOWN': 'NFT_TRANSFER_COOLDOWN',
    'NFT_MINT_COOLDOWN': 'NFT_MINT_COOLDOWN',
    'NFT_ZERO_DURABILITY': 'NFT_ZERO_DURABILITY',
    'NFT_CAMERA_IS_NOT_BROKEN': 'NFT_CAMERA_IS_NOT_BROKEN',
    'NFT_NOT_UPGRADABLE_WITH_BOOSTER': 'NFT_NOT_UPGRADABLE_WITH_BOOSTER',
    'NFT_BATTERY_FULL': 'NFT_BATTERY_FULL',
    'NFT_ACCESSORY_SLOTS_FULL': 'NFT_ACCESSORY_SLOTS_FULL',
    'NFT_ACCESSORY_NOT_EQUIPPED': 'NFT_ACCESSORY_NOT_EQUIPPED',
    'NFT_ACCESSORY_FUSION_LIMIT': 'NFT_ACCESSORY_FUSION_LIMIT',
    'NFT_ACCESSORY_IS_IN_USE': 'NFT_ACCESSORY_IS_IN_USE',
    'NFT_ACCESSORY_FUSION_NOT_SAME': 'NFT_ACCESSORY_FUSION_NOT_SAME',
    'NFT_ACCESSORY_FUSION_UNEQUAL_STAR': 'NFT_ACCESSORY_FUSION_UNEQUAL_STAR',
    'NFT_ACCESSORY_FUSION_STAR_UNFOUND': 'NFT_ACCESSORY_FUSION_STAR_UNFOUND',
    'NFT_ACCESSORY_FUSION_UNEQUAL_GRADE': 'NFT_ACCESSORY_FUSION_UNEQUAL_GRADE',
    'NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE':
        'NFT_ACCESSORY_FUSION_REACHED_MAX_GRADE',
    'NFT_NO_SKILL_POINTS_USED': 'NFT_NO_SKILL_POINTS_USED',
    'NFT_MAX_ROULETTE_SPIN': 'NFT_MAX_ROULETTE_SPIN',
    'NFT_SKIN_ALREADY_EQUIPPED': 'NFT_SKIN_ALREADY_EQUIPPED',
    'NFT_ACCESSORY_NOT_EQUIPPED': 'NFT_ACCESSORY_NOT_EQUIPPED2',
    'NFT_EXTRA_SLOT_IN_USE': 'NFT_EXTRA_SLOT_IN_USE',
    'NFT_INCOMPATIBLE_TYPE': 'NFT_INCOMPATIBLE_TYPE',
    'NFT_NOT_FOUND': 'NFT_NOT_FOUND',
    'EXPLORER_ALREADY_EXISTS': 'EXPLORER_ALREADY_EXISTS',
    'NFT_ATTRIBUTE_EXISTS': 'NFT_ATTRIBUTE_EXISTS',
    'NFT_ATTRIBUTE_NOT_FOUND': 'NFT_ATTRIBUTE_NOT_FOUND',
    'NFT_ATTRIBUTE_IN_USE': 'NFT_ATTRIBUTE_IN_USE',
    'NFT_CREATION_FAILED': 'NFT_CREATION_FAILED',
    'MINT_LEVEL_NOT_MAX': 'MINT_LEVEL_NOT_MAX',
    'MINT_BATTERY_NOT_FULL': 'MINT_BATTERY_NOT_FULL',
    'MINT_REACHED_MAX_COUNT': 'MINT_REACHED_MAX_COUNT',
    'MINT_LEFTHAND_NOT_MINTABLE': 'MINT_LEFTHAND_NOT_MINTABLE',
    'MINT_RIGHTHAND_NOT_MINTABLE': 'MINT_RIGHTHAND_NOT_MINTABLE',
    'MINT_LEFTHAND_BROKEN': 'MINT_LEFTHAND_BROKEN',
    'MINT_RIGHTHAND_BROKEN': 'MINT_RIGHTHAND_BROKEN',
    'MINT_SCROLL_INSUFFICIENT': 'MINT_SCROLL_INSUFFICIENT',
    'BADGE_ALREADY_OWNED': 'BADGE_ALREADY_OWNED',
    'BADGE_UNPURCHASABLE': 'BADGE_UNPURCHASABLE',
    'BADGE_RANK_CANNOT_BE_BOOST': 'BADGE_RANK_CANNOT_BE_BOOST',
    'BADGE_RANK_REACHED_MAXIMUM_BOOST': 'BADGE_RANK_REACHED_MAXIMUM_BOOST',
    'BADGE_UNSELLABLE': 'BADGE_UNSELLABLE',
    'INVENTORY_ITEM_UNFOUND': 'INVENTORY_ITEM_UNFOUND',
    'INVENTORY_ITEM_OUT_OF_PERIOD': 'INVENTORY_ITEM_OUT_OF_PERIOD',
    'INVENTORY_ITEM_IN_USE': 'INVENTORY_ITEM_IN_USE',
    'INVENTORY_ITEM_NOT_IN_USE': 'INVENTORY_ITEM_NOT_IN_USE',
    'INVENTORY_ITEM_UNEQUIPABLE': 'INVENTORY_ITEM_UNEQUIPABLE',
    'BALANCE_INSUFFICIENT': 'BALANCE_INSUFFICIENT',
    'INSUFFICIENT_SUPPLY_OF_STP': 'INSUFFICIENT_SUPPLY_OF_STP',
    'INSUFFICIENT_SUPPLY_OF_SNPT': 'INSUFFICIENT_SUPPLY_OF_SNPT',
    'LIQUIDITIES_CHANGED': 'LIQUIDITIES_CHANGED',
    'EXTERNAL_WALLET_UNFOUND': 'EXTERNAL_WALLET_UNFOUND',
    'WITHDRAW_DAILY_LIMIT_REACHED': 'WITHDRAW_DAILY_LIMIT_REACHED',
    'WITHDRAW_NOT_PERMITTED': 'WITHDRAW_NOT_PERMITTED',
    'REVENUECAT_ERROR': 'REVENUECAT_ERROR',
    'MAIL_TEMPLATE_UNFOUND': 'MAIL_TEMPLATE_UNFOUND',
    'MAIL_ATTACHMENT_EXPIRED': 'MAIL_ATTACHMENT_EXPIRED',
    'LOOTBOX_MYSTERY_SLOTS_FULL': 'LOOTBOX_MYSTERY_SLOTS_FULL',
    'LOOTBOX_MYSTERY_COOLDOWN': 'LOOTBOX_MYSTERY_COOLDOWN',
    'GACHA_UNFOUND': 'GACHA_UNFOUND',
    'GACHA_OUT_OF_PERIOD': 'GACHA_OUT_OF_PERIOD',
    'SHOP_PRODUCT_UNFOUND': 'SHOP_PRODUCT_UNFOUND',
    'SHOP_PRODUCT_CONTENTS_INVALID': 'SHOP_PRODUCT_CONTENTS_INVALID',
    'SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED':
        'SHOP_PRODUCT_PURCHASE_LIMIT_EXCEEDED',
    'RENTAL_NOT_QUALIFIED': 'RENTAL_NOT_QUALIFIED',
    'RENTAL_CONTRACT_NOT_FOUND': 'RENTAL_CONTRACT_NOT_FOUND',
    'RENTAL_CONTRACT_NOT_AVAILABLE': 'RENTAL_CONTRACT_NOT_AVAILABLE',
    'RENTAL_CONTRACT_ONGOING': 'RENTAL_CONTRACT_ONGOING',
    'RENTAL_CONTRACT_TERMINATED': 'RENTAL_CONTRACT_TERMINATED',
    'RENTAL_CAMERAS_PACK_IN_USE': 'RENTAL_CAMERAS_PACK_IN_USE',
    'RENTAL_CAMERAS_PACK_NOT_FOUND': 'RENTAL_CAMERAS_PACK_NOT_FOUND',
    'RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU':
        'RENTAL_CAMERAS_PACK_NOT_OWNED_BY_YOU',
    'RENTAL_CAMERAS_PACK_INVALID_COUNT': 'RENTAL_CAMERAS_PACK_INVALID_COUNT',
    'RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND':
        'RENTAL_CAMERAS_PACK_MAIN_CAMERA_NOT_FOUND',
    'RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL':
        'RENTAL_CAMERAS_PACK_SUB_CAMERAS_INSUFFICIENT_LEVEL',
    'RENTAL_CONTRACT_LIMIT_REACHED': 'RENTAL_CONTRACT_LIMIT_REACHED',
    'RENTAL_NFT_NOT_FOUND': 'RENTAL_NFT_NOT_FOUND',
    'RENTAL_NFT_IN_USE': 'RENTAL_NFT_IN_USE',
    'INVALID_PARAMETER': 'INVALID_PARAMETER',
    'INVALID_MIME_TYPE': 'INVALID_MIME_TYPE',
    'UNDER_MAINTENANCE': 'UNDER_MAINTENANCE',
    'UNKNOWN': 'UNKNOWN',
    'VALIDATION_ERROR': 'VALIDATION_ERROR',
    'IS_SPAM': 'IS_SPAM',
    'RECAPTCHA_REQUEST_ERROR': 'RECAPTCHA_REQUEST_ERROR',
    'RECAPTCHA_ACTION_TYPE_UNMATCHED': 'RECAPTCHA_ACTION_TYPE_UNMATCHED',
    'RECAPTCHA_SCORE_TOO_LOW': 'RECAPTCHA_SCORE_TOO_LOW',
    'AUTH_ERROR': 'AUTH_ERROR',
    'SNPIT_ERROR': 'SNPIT_ERROR',
  };

  @override
  final Iterable&lt;Type&gt; types = const &lt;Type&gt;[ApiErrorResponseDTOErrorTypeEnum];
  @override
  final String wireName = 'ApiErrorResponseDTOErrorTypeEnum';

  @override
  Object serialize(
          Serializers serializers, ApiErrorResponseDTOErrorTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =&gt;
      _toWire[object.name] ?? object.name;

  @override
  ApiErrorResponseDTOErrorTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =&gt;
      ApiErrorResponseDTOErrorTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$ApiErrorResponseDTO extends ApiErrorResponseDTO {
  @override
  final num code;
  @override
  final num statusCode;
  @override
  final ApiErrorResponseDTOErrorTypeEnum errorType;
  @override
  final String errorMessage;

  factory _$ApiErrorResponseDTO(
          [void Function(ApiErrorResponseDTOBuilder)? updates]) =&gt;
      (new ApiErrorResponseDTOBuilder()..update(updates))._build();

  _$ApiErrorResponseDTO._(
      {required this.code,
      required this.statusCode,
      required this.errorType,
      required this.errorMessage})
      : super._() {
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
    var _$hash = 0;
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, statusCode.hashCode);
    _$hash = $jc(_$hash, errorType.hashCode);
    _$hash = $jc(_$hash, errorMessage.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
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
  _$ApiErrorResponseDTO? _$v;

  num? _code;
  num? get code =&gt; _$this._code;
  set code(num? code) =&gt; _$this._code = code;

  num? _statusCode;
  num? get statusCode =&gt; _$this._statusCode;
  set statusCode(num? statusCode) =&gt; _$this._statusCode = statusCode;

  ApiErrorResponseDTOErrorTypeEnum? _errorType;
  ApiErrorResponseDTOErrorTypeEnum? get errorType =&gt; _$this._errorType;
  set errorType(ApiErrorResponseDTOErrorTypeEnum? errorType) =&gt;
      _$this._errorType = errorType;

  String? _errorMessage;
  String? get errorMessage =&gt; _$this._errorMessage;
  set errorMessage(String? errorMessage) =&gt; _$this._errorMessage = errorMessage;

  ApiErrorResponseDTOBuilder() {
    ApiErrorResponseDTO._defaults(this);
  }

  ApiErrorResponseDTOBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _code = $v.code;
      _statusCode = $v.statusCode;
      _errorType = $v.errorType;
      _errorMessage = $v.errorMessage;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ApiErrorResponseDTO other) {
    ArgumentError.checkNotNull(other, 'other');
    _$v = other as _$ApiErrorResponseDTO;
  }

  @override
  void update(void Function(ApiErrorResponseDTOBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ApiErrorResponseDTO build() =&gt; _build();

  _$ApiErrorResponseDTO _build() {
    final _$result = _$v ??
        new _$ApiErrorResponseDTO._(
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'ApiErrorResponseDTO', 'code'),
          statusCode: BuiltValueNullFieldError.checkNotNull(
              statusCode, r'ApiErrorResponseDTO', 'statusCode'),
          errorType: BuiltValueNullFieldError.checkNotNull(
              errorType, r'ApiErrorResponseDTO', 'errorType'),
          errorMessage: BuiltValueNullFieldError.checkNotNull(
              errorMessage, r'ApiErrorResponseDTO', 'errorMessage'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

---

## 🔧 ツール
*2025/3/6 15:20:29*

**エラーの発見と原因明確化**

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
