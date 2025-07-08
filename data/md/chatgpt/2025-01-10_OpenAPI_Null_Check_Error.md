# OpenAPI Null Check Error

日付: 2025-01-10

---

## 👤 ユーザー
*2025/01/10 18:53:49*

Null check operator used on a null value
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 552:33  OpenApiLibraryGenerator._createSchemaClass
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 525:17  OpenApiLibraryGenerator._schemaReference.&lt;fn&gt;
dart:_compact_hash                                                        _LinkedHashMapMixin.putIfAbsent
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 519:37  OpenApiLibraryGenerator._schemaReference
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 743:16  OpenApiLibraryGenerator._toDartType
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 564:29  OpenApiLibraryGenerator._createSchemaClass.&lt;fn&gt;.&lt;fn&gt;
package:code_builder/src/specs/field.g.dart 244:33                        _$FieldBuilder.update
package:code_builder/src/specs/field.g.dart 30:28                         new _$Field
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 563:61  OpenApiLibraryGenerator._createSchemaClass.&lt;fn&gt;
dart:collection                                                           MapBase.map
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 563:31  OpenApiLibraryGenerator._createSchemaClass
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 525:17  OpenApiLibraryGenerator._schemaReference.&lt;fn&gt;
dart:_compact_hash                                                        _LinkedHashMapMixin.putIfAbsent
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 519:37  OpenApiLibraryGenerator._schemaReference
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 75:7    OpenApiLibraryGenerator.generate
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 854:7   OpenApiCodeBuilder.build

エラーになった理由を検討して欲しい

openapi: 3.0.0
paths:
    /:
        get:
            operationId: AppController_getHello
            parameters: []
            responses: {'200': {description: ""}}
            tags: [App]
    /v1/accounts:
        get:
            operationId: AccountController_getCurrentUserAccounts
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/AccountResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Retrieve current user information [ACN0201, ACN0202, ACN0203]'
            tags: [Accounts]
        post:
            operationId: AccountController_createAccount
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateAccountRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create new user account [ACN0101]'
            tags: [Accounts]
        put:
            operationId: AccountController_updateAccount
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateAccountRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update user information or ban/unban user [ACN0204, ACN0205]'
            tags: [Accounts]
        delete:
            operationId: AccountController_deleteAccount
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete user account [ACN0207]'
            tags: [Accounts]
    '/v1/accounts/users/{userId}':
        get:
            operationId: AccountController_getAccountbyId
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/AccountResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Retrieve other user infromation by userId [ACN0201, ACN0202, ACN0203]'
            tags: [Accounts]
    /v1/accounts/items:
        get:
            operationId: AccountController_getUserItems
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetUserItemsResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Retrieve items belong to current user [GMEXXXX]'
            tags: [Accounts]
    /v1/accounts/decoy:
        post:
            operationId: AccountController_useDecoy
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UseDecoyRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'The user use decoy item [GME0602]'
            tags: [Accounts]
    /v1/guilds:
        get:
            operationId: GuildController_getGuildInfoOfUser
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}}
            security: [{bearer: []}]
            summary: 'Get guild information of requested user[GLD0101]'
            tags: [Guilds]
        put:
            operationId: GuildController_updateGuildInfo
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildInfoRequestDto'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update guild information by guild owner/admin [GLD0301, GLD0302]'
            tags: [Guilds]
        post:
            operationId: GuildController_createGuild
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateGuildRequestDto'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new guild [GLD0103, GLD0301, GLD0302]'
            tags: [Guilds]
        delete:
            operationId: GuildController_deleteGuild
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete guild by guild owner[GLDXXXX]'
            tags: [Guilds]
    '/v1/guilds/{guildId}':
        get:
            operationId: GuildController_getGuildInfo
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}}
            security: [{bearer: []}]
            summary: 'Get guild information from guild ID[GLD0103, GLD0201]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/request':
        post:
            operationId: GuildController_requestToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Request to join the quild [GLD0103, GLD0202]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/invite':
        post:
            operationId: GuildController_inviteToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Invite to join the guild [GLD0202]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/approve':
        put:
            operationId: GuildController_approveToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Approve to join the guild. userId != requested user, means approved "request". userId = requested user, means approved "invite".  [GLD0303]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/reject':
        delete:
            operationId: GuildController_rejectToJoinGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Reject to join the guild. userId != requested user, means rejected "request". userId = requested user, means rejected "invite".  [GLDXXXX]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/leave':
        delete:
            operationId: GuildController_leaveFromGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Leave from the guild. [GLD0202, GLD0303]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/kick':
        delete:
            operationId: GuildController_kickFromGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Kicked from guild. [GLD0102]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/members/{userId}/role':
        put:
            operationId: GuildController_updateGuildMember
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildMemberRoleRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Change guild member role. [GLDXXXX]'
            tags: [Guilds]
    '/v1/guilds/{guildId}/spots':
        get:
            operationId: GuildController_getGuildSpots
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GuildSpotsResponseDto'}}}}}
            security: [{bearer: []}]
            summary: 'Get all guild spots [GLD0401]'
            tags: [Guilds]
    /v1/photos:
        get:
            operationId: PhotosController_getAllPhotos
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all photos uploaded by Admin [GME0501]'
            tags: [Photos]
        post:
            operationId: PhotosController_uploadPhoto
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UploadPhotoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoUploadResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Uploaded a photo, separate Admin and User photo using PhotoType [ADM0101,GME0302]'
            tags: [Photos]
    '/v1/photos/{hash}':
        get:
            operationId: PhotosController_getPhotoByHash
            parameters: [{name: hash, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/PhotoResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get a photo by hash [GME0502]'
            tags: [Photos]
        delete:
            operationId: PhotosController_deletePhotoByHash
            parameters: [{name: hash, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete photo by hash, separate Admin and User photo using PhotoType [ADM0102]'
            tags: [Photos]
    /v1/spots:
        get:
            operationId: SpotController_getAllSpots
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all existing spots [GME0101, GME0501]'
            tags: [Spots]
        post:
            operationId: SpotController_createSpot
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {type: string}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new spot by Admin [ADM0101]'
            tags: [Spots]
    '/v1/spots/{spotId}':
        get:
            operationId: SpotController_getSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotDetailResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get a spot detail information by spotId [GLD0402, GME0502]'
            tags: [Spots]
        put:
            operationId: SpotController_updateSpotInfo
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotInfoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update a spot information by Admin [ADM0101]'
            tags: [Spots]
        delete:
            operationId: SpotController_deleteSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete a spot by Admin. This will automatically delete the photo in the DB [ADM0102]'
            tags: [Spots]
    '/v1/spots/{spotId}/photos':
        put:
            operationId: SpotController_updateSpotPhoto
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotPhotoRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update a spot main photo by Admin [ADM0101]'
            tags: [Spots]
    '/v1/spots/{spotId}/waeve':
        put:
            operationId: SpotController_waeveSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/WaeveRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Waeve the spot after upload the photo [GME0302, GME0303, GME0304, GME0305, GLD0404]'
            tags: [Spots]
    /v1/spot-attributes:
        get:
            operationId: SpotAttributeController_getAllAttributes
            parameters: [{name: rarity, required: false, in: query, description: 'Filter spot attributes by rarity', schema: {type: array, items: {type: string, enum: [COMMON, UNCOMMON, RARE, EPIC]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SpotAtributeListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all spot attributes by Admin [ADMXXXX]'
            tags: ['Spot Attributes']
        post:
            operationId: SpotAttributeController_createAttribute
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {type: string}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new spot attribute by Admin [ADMXXXX]'
            tags: ['Spot Attributes']
    '/v1/spot-attributes/{attributeId}':
        delete:
            operationId: SpotAttributeController_deleteAttribute
            parameters: [{name: attributeId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete a spot attribute by Admin [ADMXXXX]'
            tags: ['Spot Attributes']
    /v1/decks:
        get:
            operationId: DeckController_getOwnDeck
            parameters: [{name: userId, required: false, in: query, description: 'Get deck information of other user by userId', schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetDeckResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Retrieve deck information. Own deck if no query. [DCK0101]'
            tags: [Decks]
        post:
            operationId: DeckController_createDeck
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateDeckRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new deck [DCK0301]'
            tags: [Decks]
        put:
            operationId: DeckController_updateDeck
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateDeckRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update deck information [DCK0201]'
            tags: [Decks]
    '/v1/decks/{deckId}':
        get:
            operationId: DeckController_getDecksByUserId
            parameters: [{name: deckId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetDeckResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Retrieve deck information by deckId [DCK0101]'
            tags: [Decks]
    /v1/explorers:
        get:
            operationId: ExplorerController_getAllExplorers
            parameters: [{name: rarity, required: false, in: query, description: 'Filter explorers by rarity', schema: {type: array, items: {type: string, enum: [COMMON, UNCOMMON, RARE, EPIC]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all explorers [GME0201]'
            tags: [Explorers]
        post:
            operationId: ExplorerController_createExplorer
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {type: string}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new explorer [ADMXXXX]'
            tags: [Explorers]
    '/v1/explorers/{explorerId}/search':
        put:
            operationId: ExplorerController_updateExplorer
            parameters: [{name: explorerId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerSearchRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerSearchResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Perform search to find the spot [GME0202, GME0203, GME0204, GME0205]'
            tags: [Explorers]
    /v1/explorer-attributes:
        get:
            operationId: ExplorerAttributeController_getAllAttributes
            parameters: []
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/ExplorerAttributeListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all NFT Explorer attributes by Admin [ADMXXXX]'
            tags: ['Explorer Attributes']
        post:
            operationId: ExplorerAttributeController_createAttribute
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {type: string}}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new NFT explorer attribute by Admin [ADMXXXX]'
            tags: ['Explorer Attributes']
    '/v1/explorer-attributes/{attributeId}':
        delete:
            operationId: ExplorerAttributeController_deleteAttribute
            parameters: [{name: attributeId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete a NFT explorer attribute by Admin [ADMXXXX]'
            tags: ['Explorer Attributes']
    /v1/items:
        get:
            operationId: ItemController_getItems
            parameters: [{name: itemCategory, required: false, in: query, description: 'Filter items by itemCategory', schema: {type: array, items: {type: string, enum: [DECOY, FLAG_REPAIR, SCOUT]}}}, {name: itemStatus, required: false, in: query, description: 'Filter items by itemStatus', schema: {type: array, items: {type: string, enum: [NEW, ACTIVE, INACTIVE, DELETED]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemsResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all items by Admin [ADMXXXX]'
            tags: [Items]
        post:
            operationId: ItemController_createItem
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateItemRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create an item by Admin [ADMXXXX]'
            tags: [Items]
        put:
            operationId: ItemController_updateItem
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateItemRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update an item by Admin [ADMXXXX]'
            tags: [Items]
    '/v1/items/{itemId}':
        delete:
            operationId: ItemController_deleteItem
            parameters: [{name: itemId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete an item by Admin [ADMXXXX]'
            tags: [Items]
    /v1/item-boxes:
        get:
            operationId: ItemBoxController_getItemBoxes
            parameters: [{name: itemCategory, required: false, in: query, description: 'TBD : Filter item boxes by itemCategory', schema: {type: array, items: {type: string, enum: [DECOY, FLAG_REPAIR, SCOUT]}}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemBoxResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all unopened item boxes [GME0101]'
            tags: [Item-Boxes]
        post:
            operationId: ItemBoxController_createItemBox
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateItemBoxRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create an item box by Admin [ADMXXXX]'
            tags: [Item-Boxes]
    /v1/item-boxes/open:
        post:
            operationId: ItemBoxController_openBox
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/OpenBoxRequestDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/GetItemsResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Open an item box [GME0102]'
            tags: [Item-Boxes]
    '/v1/nft/metadata/{tokenId}.json':
        get:
            operationId: NftController_getMetadata
            parameters: [{name: tokenId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/NftMetadata'}}}}}
            security: [{bearer: []}]
            summary: 'Get NFT metadata'
            tags: [NFT]
    /v1/auth/email:
        post:
            operationId: AuthController_sendCode
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthEamilDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/SendCodeResponseDto'}}}}}
            summary: 'check email and send auth code'
            tags: [Auth]
    /v1/auth/login:
        post:
            operationId: AuthController_login
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthLoginDTO'}}}}
            responses: {'200': {description: "", content: {application/json: {schema: {$ref: '#/components/schemas/LoginResponseDto'}}}}}
            summary: 'check auth code and return access token'
            tags: [Auth]
info:
    title: 'SNPIT Guild APIs'
    description: 'API Document for SNPIT Guild'
    version: 0.0.1
    contact: {}
tags: []
servers: []
components:
    securitySchemes:
        bearer:
            scheme: bearer
            bearerFormat: JWT
            type: http
    schemas:
        UserRole:
            type: string
            enum: [USER, ADMIN]
        UserStatus:
            type: string
            enum: [NEW, INACTIVE, DELETED, BANNED]
        UserLoginStatus:
            type: string
            enum: [LOGIN, LOGOUT]
        AccountDto:
            type: object
            properties: {userId: {type: string, description: 'The id of the account', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, guildId: {type: string, description: 'Guild Id of the user', example: '1234567890', nullable: true}, userRole: {description: 'User Role (User or Admin).', nullable: false, allOf: [{$ref: '#/components/schemas/UserRole'}]}, userStatus: {description: 'Status of the user.', nullable: false, allOf: [{$ref: '#/components/schemas/UserStatus'}]}, loginStatus: {description: 'Login status of the user.', nullable: false, allOf: [{$ref: '#/components/schemas/UserLoginStatus'}]}}
            required: [userId, username, email, SNPITToken, userRole, userStatus, loginStatus]
        AccountResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'The account details', nullable: false, allOf: [{$ref: '#/components/schemas/AccountDto'}]}}
            required: [code, errorMessage, data]
        ItemCategory:
            type: string
            enum: [DECOY, FLAG_REPAIR, SCOUT]
        UserItemsDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}, itemQuantity: {type: number, description: 'Quantity of the item', example: 10, nullable: false}}
            required: [itemId, itemName, itemCategory, itemQuantity]
        GetUserItemsResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of items belong to user', nullable: false, type: array, items: {$ref: '#/components/schemas/UserItemsDTO'}}}
            required: [code, errorMessage, data]
        CreateAccountRequestDTO:
            type: object
            properties: {username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, userRole: {description: 'User Role (User or Admin).', nullable: false, allOf: [{$ref: '#/components/schemas/UserRole'}]}}
            required: [username, email, SNPITToken, userRole]
        EmptyResponseSchema:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, data: {type: string, description: 'error message if any'}, errorMessage: {type: string, description: 'error message if any', nullable: true}}
            required: [code, data, errorMessage]
        UseDecoyRequestDTO:
            type: object
            properties: {itemId: {type: string, description: 'The id of the item', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, spotId: {type: string, description: 'The id of the item', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, decoyLatitude: {type: number, description: 'Latitude of the user', example: 37.123456, nullable: false}, decoyLongitude: {type: number, description: 'Longitude of the user', example: -121.123456, nullable: false}}
            required: [itemId, spotId, decoyLatitude, decoyLongitude]
        UserUpdateType:
            type: string
            enum: [USER_INFO, BAN, UNBAN]
        UpdateAccountRequestDTO:
            type: object
            properties: {updateType: {description: 'Update type of the user', nullable: false, allOf: [{$ref: '#/components/schemas/UserUpdateType'}]}, userId: {type: string, description: 'The id of the account', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}}
            required: [updateType, userId, username, email, SNPITToken]
        GuildStatus:
            type: string
            enum: [ACTIVE, INACTIVE, DELETED]
        MemberRole:
            type: string
            enum: [OWNER, ADMIN, MEMBER]
        MemberStatus:
            type: string
            enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED]
        GuildMemberDto:
            type: object
            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, username: {type: string, description: Username., example: 'User 1', nullable: false}, role: {description: 'Role of the guild member.', nullable: false, allOf: [{$ref: '#/components/schemas/MemberRole'}]}, memberStatus: {description: 'Status of the guild member.', nullable: false, allOf: [{$ref: '#/components/schemas/MemberStatus'}]}, teamId: {type: string, description: 'TBD: Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, avatar: {type: string, description: 'Avatar URL of the user', example: www.guild.com/avatar.jpg, nullable: true}}
            required: [userId, username, role]
        GuildDto:
            type: object
            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildStatus: {description: 'Status of the guild.', nullable: false, allOf: [{$ref: '#/components/schemas/GuildStatus'}]}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: www.guild.com/avatar.jpg, nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: www.guild.com/banner.jpg, nullable: true}, guildSTP: {type: number, description: 'Guild STP', example: 100, nullable: false}, guildMembers: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
            required: [guildId, guildName, guildOwner, guildMembers]
        GuildInfoResponseDto:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Guild information.', nullable: false, allOf: [{$ref: '#/components/schemas/GuildDto'}]}}
            required: [code, errorMessage, data]
        UpdateGuildInfoRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Guild name', example: 'Guild Name', nullable: true, maxLength: 50}, guildDescription: {type: string, description: 'Guild description', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: 'Avatar of the guild', example: www.guild.com/avatar.jpg, nullable: true}, guildBanner: {type: string, description: 'Banner of the guild', example: www.guild.com/banner.jpg, nullable: true}}
        CreateGuildRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: www.guild.com/avatar.jpg, nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: www.guild.com/banner.jpg, nullable: true}}
            required: [guildName]
        UpdateGuildMemberRoleRequestDTO:
            type: object
            properties: {role: {description: 'Role of the guild member.', nullable: false, allOf: [{$ref: '#/components/schemas/MemberRole'}]}}
        SpotStatus:
            type: string
            enum: [NEW, PENDING, CAPTURED, FREE, DELETED]
        SpotRarity:
            type: string
            enum: [COMMON, UNCOMMON, RARE, EPIC]
        GuildSpotStatus:
            type: string
            enum: [FOUND, CAPTURED, REMOVED, DECOY, FLAGGED]
        GuildSpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, guildSpotStatus: {description: 'Guild spot status', nullable: false, allOf: [{$ref: '#/components/schemas/GuildSpotStatus'}]}}
            required: [spotId, spotName, spotStatus, rarity, photoUrl, spotLongitude, spotLatitude, spotAddress, guildSpotStatus]
        GuildSpotsResponseDto:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of guild spots.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildSpotDTO'}}}
            required: [code, errorMessage, data]
        PhotoType:
            type: string
            enum: [ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOS]
        PhotoStatus:
            type: string
            enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED]
        PhotoDTO:
            type: object
            properties: {photoHash: {type: string, description: 'SHA256 hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'My Photo', nullable: false}, uploadedUserId: {type: string, description: 'ID of the user who uploaded the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoSpecId: {type: string, description: '(TBD) ID of the photo specification', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoAtributeId: {type: string, description: '(TBD) ID of the photo attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful sunset', nullable: true}, photoType: {description: 'Type of the photo based on the uploader.', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoType'}]}, photoStatus: {description: 'Status of the photo.', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoStatus'}]}, photoActive: {type: boolean, description: 'Active status of the photo', example: true, nullable: false}, isPrivate: {type: boolean, description: '(TBD) Private flag status of the photo', example: false, nullable: false}, likes: {type: number, description: '(TBD) Number of likes the photo has received', example: 100, nullable: true}, stars: {type: number, description: '(TBD) Number of stars the photo has received', example: 4.5, nullable: true}, latitude: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
            required: [photoHash, photoUrl, photoName, uploadedUserId, photoType, photoStatus, latitude, longitude]
        PhotoListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of photos data', nullable: false, type: array, items: {$ref: '#/components/schemas/PhotoDTO'}}}
            required: [code, errorMessage, data]
        PhotoResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Photo data', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoDTO'}]}}
            required: [code, errorMessage, data]
        UploadPhotoRequestDTO:
            type: object
            properties: {name: {type: string, description: 'Name of the photo', example: Sunset, nullable: false}, description: {type: string, description: 'Description of the photo', example: 'A beautiful sunset over the mountains', nullable: true}, type: {description: 'Type of the photo', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoType'}]}, latitute: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
            required: [name, type, latitute, longitude]
        PhotoUploadDTO:
            type: object
            properties: {hash: {type: string, description: 'Hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, url: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, message: {type: string, description: 'Message associated with the photo', example: 'A beautiful sunset', nullable: true}}
            required: [hash, url]
        PhotoUploadResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Photo data', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoUploadDTO'}]}}
            required: [code, errorMessage, data]
        SpotDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}}
            required: [spotId, spotName, spotStatus, rarity, photoUrl, spotLongitude, spotLatitude, spotAddress]
        SpotListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of spots.', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotDTO'}}}
            required: [code, errorMessage, data]
        SpotPhotoDTO:
            type: object
            properties: {photoName: {type: string, description: 'Name of the photo', example: 'Spot Photo', nullable: false}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful spot photo', nullable: true}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, photoType: {description: 'Type of the photo', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoType'}]}, photoStatus: {type: string, description: 'Status of the photo', nullable: false, enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED]}, guildId: {type: string, description: 'ID of the guild', example: '1234567890', nullable: true}}
            required: [photoName, photoUrl, photoType, photoStatus]
        SpotDetailDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}}
            required: [spotId, spotName, spotStatus, rarity, spotLongitude, spotLatitude, spotAddress, autoIncome, attackIncome, spotPhotos]
        SpotDetailResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Detail information of the spot.', nullable: false, allOf: [{$ref: '#/components/schemas/SpotDetailDTO'}]}}
            required: [code, errorMessage, data]
        UpdateSpotInfoRequestDTO:
            type: object
            properties: {spotAttributeId: {type: string, description: 'ID of the attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false, maxLength: 50}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true, maxLength: 200}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 40.7128, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true, maxLength: 100}}
        UpdateSpotPhotoRequestDTO:
            type: object
            properties: {photoUrl: {type: string, description: 'URL of the photo', example: www.guild.com/photo.jpg, nullable: false}}
        WaeveRequestDTO:
            type: object
            properties: {photoUrl: {type: string, description: 'URL of the photo', example: www.guild.com/photo.jpg, nullable: false}, userLatitude: {type: number, description: 'Latitude of the user', example: 40.7128, nullable: false}, userLongitude: {type: number, description: 'Longitude of the user', example: -74.006, nullable: false}}
            required: [photoUrl, userLatitude, userLongitude]
        SpotAtributeDTO:
            type: object
            properties: {spotAttributeId: {type: string, description: 'Attribute ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 100}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 100}}
            required: [spotAttributeId, attributeName, rarity, autoIncome, attackIncome]
        SpotAtributeListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of spot attributes.', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotAtributeDTO'}}}
            required: [code, errorMessage, data]
        DeckStatus:
            type: string
            enum: [NEW, ACTIVE, INACTIVE, DELETED]
        DeckDTO:
            type: object
            properties: {deckId: {type: string, description: 'Deck Id', example: '1234567890', nullable: false}, userId: {type: string, description: 'User Id', example: '1234567890', nullable: false}, deckName: {type: string, description: 'Deck name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'New deck', nullable: true}, deckStatus: {description: 'Deck Status', nullable: false, allOf: [{$ref: '#/components/schemas/DeckStatus'}]}, deckCameras: {description: 'Camera Ids', example: ['1234567890', '1234567891', '1234567892', '1234567893'], nullable: false, type: array, items: {type: string}}}
            required: [deckId, userId, deckName, deckStatus, deckCameras]
        GetDeckResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of decks', nullable: false, type: array, items: {$ref: '#/components/schemas/DeckDTO'}}}
            required: [code, errorMessage, data]
        CreateDeckRequestDTO:
            type: object
            properties: {deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorerId: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
            required: [deckName, deckCameras, deckNftExplorerId]
        UpdateDeckType:
            type: string
            enum: [DECK_INFO, DECK_CAMERA]
        UpdateDeckRequestDTO:
            type: object
            properties: {updateType: {description: 'Update Type', nullable: false, allOf: [{$ref: '#/components/schemas/UpdateDeckType'}]}, deckId: {type: string, description: 'Deck Id', example: 'Deck Id', nullable: false}, deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorerId: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
            required: [updateType, deckId]
        ExplorerCategory:
            type: string
            enum: [NORMAL, CLIMBER, HUNTER, DIVER]
        ExplorerRarity:
            type: string
            enum: [COMMON, UNCOMMON, RARE, EPIC]
        ExplorerDTO:
            type: object
            properties: {explorerId: {type: string, description: 'NFT explorer ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'NFT explorer name', example: 'Explorer Name', nullable: false}, explorerDescription: {type: string, description: 'NFT explorer description', example: 'Explorer Description', nullable: true}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: www.guild.com/explorer.png, nullable: false}, explorerCategory: {description: 'Category of NFT explorer', nullable: false, allOf: [{$ref: '#/components/schemas/ExplorerCategory'}]}, energy: {type: number, description: 'Current available energy of NFT explorer', example: 100, nullable: false}, rarity: {description: 'Rarity of NFT explorer', nullable: false, allOf: [{$ref: '#/components/schemas/ExplorerRarity'}]}, energyConsumption: {type: number, description: 'Energy consumption of NFT explorer when used', example: 10, nullable: false}, range: {type: number, description: 'Range of NFT explorer', example: 10, nullable: false}, decoyFinding: {type: boolean, description: 'Decoy finding ability of NFT explorer. True if the explorer can distinguish decoys from real spots', example: true, nullable: false}, totalSearch: {type: number, description: 'Number of searches the NFT explorer has performed. This is a cumulative count', example: 3, nullable: false}, totalSpotFound: {type: number, description: 'Number of spots the NFT explorer has found. This is a cumulative count', example: 3, nullable: false}}
            required: [explorerId, tokenId, explorerName, explorerImage, explorerCategory, energy, rarity, energyConsumption, range, decoyFinding, totalSearch, totalSpotFound]
        ExplorerListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of NFT explorers', nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerDTO'}}}
            required: [code, errorMessage, data]
        ExplorerSearchRequestDTO:
            type: object
            properties: {explorerLongitude: {type: number, description: 'Longitude of the explorer', example: 40.7128, nullable: false}, explorerLatitude: {type: number, description: 'Latitude of the explorer', example: -74.006, nullable: false}}
            required: [explorerLongitude, explorerLatitude]
        SpotType:
            type: string
            enum: [NORMAL, DECOY, FLAG]
        SpotSearchResultDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, spotType: {description: 'Type of the Spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotType'}]}}
            required: [spotId, spotName, spotStatus, rarity, photoUrl, spotLongitude, spotLatitude, spotAddress, spotType]
        ExplorerSearchResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'NFT explorer search result', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotSearchResultDTO'}}}
            required: [code, errorMessage, data]
        ExplorerAttributeDTO:
            type: object
            properties: {explorerAttributeId: {type: string, description: 'NFT Explorer Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true}, rarity: {description: 'NFT Explorer Attribute Rarity', nullable: false, allOf: [{$ref: '#/components/schemas/ExplorerRarity'}]}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}, active: {type: boolean, description: 'NFT Explorer Attribute Active Status', example: true, nullable: false}}
            required: [explorerAttributeId, attributeName, rarity, initialEnergy, energyConsumption, range, decoyFinding, active]
        ExplorerAttributeListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of NFT Explorer Attributes', nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerAttributeDTO'}}}
            required: [code, errorMessage, data]
        ItemStatus:
            type: string
            enum: [NEW, ACTIVE, INACTIVE, DELETED]
        ItemDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {description: 'Item status', nullable: false, allOf: [{$ref: '#/components/schemas/ItemStatus'}]}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}}
            required: [itemId, itemName, itemPrice, itemStatus, itemCategory]
        GetItemsResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of items', nullable: false, type: array, items: {$ref: '#/components/schemas/ItemDTO'}}}
            required: [code, errorMessage, data]
        CreateItemRequestDTO:
            type: object
            properties: {itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {description: 'Item status', nullable: false, allOf: [{$ref: '#/components/schemas/ItemStatus'}]}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}}
            required: [itemName, itemPrice, itemStatus, itemCategory]
        UpdateItemRequestDTO:
            type: object
            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {description: 'Item status', nullable: false, allOf: [{$ref: '#/components/schemas/ItemStatus'}]}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}}
            required: [itemId]
        ItemBoxStatus:
            type: string
            enum: [BOXED, UNBOXED, USED, DELETED]
        ItemBoxDTO:
            type: object
            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemCategory: {description: 'Category of the item', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}, itemBoxStatus: {description: 'Status of the item box', nullable: false, allOf: [{$ref: '#/components/schemas/ItemBoxStatus'}]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 37.123456, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: -121.123456, nullable: false}}
            required: [itemBoxId, itemBoxName, itemBoxStatus, itemBoxLatitude, itemBoxLongitude]
        GetItemBoxResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of item boxes', nullable: false, type: array, items: {$ref: '#/components/schemas/ItemBoxDTO'}}}
            required: [code, errorMessage, data]
        CreateItemBoxRequestDTO:
            type: object
            properties: {itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 37.123456, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: -121.123456, nullable: false}}
            required: [itemBoxName, itemName, itemBoxLatitude, itemBoxLongitude]
        OpenBoxRequestDTO:
            type: object
            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, userLatitute: {type: number, description: 'User latitude', example: 37.123456, nullable: false}, userLongitude: {type: number, description: 'User longitude', example: -121.123456, nullable: false}}
            required: [itemBoxId, userLatitute, userLongitude]
        NftAttributes:
            type: object
            properties: {trait_type: {type: string, description: 'The trait type of the NFT', example: Rarity, nullable: false}, value: {type: string, description: 'The value of the NFT', example: COMMON, nullable: false}, trait_display_type: {type: string, description: 'The display type of the NFT', example: number, nullable: true}}
            required: [trait_type, value]
        NftMetadata:
            type: object
            properties: {name: {type: string, description: 'The name of the NFT', example: Explorer, nullable: false}, description: {type: string, description: 'The description of the NFT', example: 'A NFT that explores the world', nullable: true}, image: {type: string, description: 'The image of the NFT', example: 'https://example.com/image.png', nullable: false}, attributes: {description: 'The attributes of the NFT', nullable: false, type: array, items: {$ref: '#/components/schemas/NftAttributes'}}}
            required: [name, image, attributes]
        AuthEamilDTO:
            type: object
            properties: {email: {type: string, description: 'email address', example: test@gmail.com, nullable: false}}
            required: [email]
        SendCodeResponseDto:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {type: string, description: 'success message', example: 'OTA was sent to your in-app inbox.', nullable: false}}
            required: [code, errorMessage, data]
        AuthLoginDTO:
            type: object
            properties: {email: {type: string, description: 'email address', example: test@gmail.com, nullable: false}, code: {type: number, description: 'auth code', example: '1234', nullable: false}}
            required: [email, code]
        LoginResponseDto:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {type: object, description: 'return access token', example: '{ accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3MjU0MDgwMCwiZXhwIjoxNjcyNjI3MjAwfQ', nullable: false}}
            required: [code, errorMessage, data]

---

## 🔧 ツール
*2025/01/10 18:55:02*

**Identifying potential causes**

The null check error might stem from a missing or incorrect schema reference, an empty response, or a field expecting data that is null.

**Examining response structure**

The issue might arise from the absence of a content or schema for the "200" response, causing the code generator to attempt parsing a null value and lead to an error.

---

## 🤖 アシスタント
*2025/01/10 18:55:02*

原因として考えられるケースはいくつかありますが、最も多いのが以下のような「スキーマまわりで null が返ってきてしまう」ケースです。

- **`200` レスポンスなどに `content` / `schema` が定義されていないのに、ジェネレーターがそこからスキーマを生成しようとしている**  
- **`#/components/schemas/...` の参照先が存在しない (typo や指定ミス) ので、参照先が null になっている**  
- **内部的な処理で、必須と思われるフィールドが定義されていない** (例: 返却する `type: object` や `schema` の宣言)

-----

## どこで Null check operator が使われているのか

スタックトレースにあるように、

```
Null check operator used on a null value
package:openapi_freezed_dio_builder/src/openapi_code_builder.dart 552:33  OpenApiLibraryGenerator._createSchemaClass
```

という箇所でコケていることから、

1. `OpenApiLibraryGenerator._schemaReference(...)`
2. `OpenApiLibraryGenerator._createSchemaClass(...)`

のあたりで `null` をそのまま `!` (null チェック演算子) 付きで使ってしまい、エラーになっていることが推測されます。

-----

## どのレスポンスが問題になっているか

よくあるのは、「レスポンスに `content` セクションがない」または「`content` はあるが `schema` が定義されていない」ケースです。  
OpenAPI 的には `description` だけしか書かれていない「スキーマなしレスポンス」も一応は文法エラーではないのですが、  
`openapi_freezed_dio_builder` 側で「レスポンスには必ずスキーマがあるはず」という前提でコードを生成していると、そこが `null` 扱いとなってクラッシュする場合があります。

今回の定義を見ると、たとえば次のエンドポイントが該当しそうです:

```yaml
    /:
        get:
            operationId: AppController_getHello
            parameters: []
            responses:
                '200':
                    description: ""
            tags: [App]
```

ここは `200` のところに `content` も `schema` も指定されていません。  
この “スキーマのないレスポンス” をビルダーがうまく扱えずに null が返り、`!` 演算子で落ちてしまうパターンが多いです。

-----

## 対処方法

1. **何も返さない (空レスポンス) 場合でもスキーマを定義してあげる**  
   例えば、空のレスポンスならば `EmptyResponseSchema` を割り当てたり、最低限 `type: string` などダミーの `schema` を設定する方法が挙げられます。

   ```yaml
   responses:
     '200':
       description: ""
       content:
         application/json:
           schema:
             $ref: '#/components/schemas/EmptyResponseSchema'
   ```

   のように書いておくと、空レスポンスでも `openapi_freezed_dio_builder` がちゃんと処理できます。

2. **そもそも返却がない (ステータスコードのみ) のであれば `204 No Content` を使う**  
   もし本当にボディを返さないなら、OpenAPI の文脈では `200` よりも `204` の方がセマンティクス的に適切かもしれません。その際も `content: {}` が不要であれば付けない形で定義できます。ただしジェネレータによってはエラーになる可能性があるので、`204` の場合も最低限の `description` を記載しておくと良いです。
   
   ```yaml
   responses:
     '204':
       description: No content
   ```

3. **もし `$ref: '#/components/schemas/...'` がタイプミスで存在しない場合**  
   その参照先を正しいスキーマに修正してください。例: `#components/schemas/AccuntDto` のように一部スペルが違っているなどが原因で null になっているパターンがあります。

-----

## まとめ

- `Null check operator used on a null value` は Dart/Flutter 環境では「`!` 演算子をつけたオブジェクトが実は null だった」場合に起こる例外です。  
- OpenAPI 生成ツールがレスポンス定義や `$ref` の整合性をチェックする前提でコードを作っているため、**“schema が無い” レスポンス**や **存在しない `$ref`** があると、このように例外が発生しやすいです。  
- **何らかのスキーマ (または参照) をレスポンスに定義する** か、**本当にレスポンス本文がないなら `204 No Content` にする** 等で回避できます。  

このあたりを修正した上でもし同様の問題が起こる場合は、他のレスポンス(または components/schemas 配下)で参照ミスやスキーマ欠落がないか再度チェックしてみてください。

---

## 👤 ユーザー
*2025/01/10 18:58:03*

変更場所が以下のときにエラーになったので変更点に注目して欲しい

diff --git a/lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml b/lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml
index 3cece54..3a9d58c 100644
--- a/lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml
+++ b/lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml
@@ -454,17 +454,29 @@ components:
             bearerFormat: JWT
             type: http
     schemas:
+        UserRole:
+            type: string
+            enum: [USER, ADMIN]
+        UserStatus:
+            type: string
+            enum: [NEW, INACTIVE, DELETED, BANNED]
+        UserLoginStatus:
+            type: string
+            enum: [LOGIN, LOGOUT]
         AccountDto:
             type: object
-            properties: {userId: {type: string, description: 'The id of the account', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, guildId: {type: string, description: 'Guild Id of the user', example: '1234567890', nullable: true}, userRole: {type: string, description: 'User Role (User or Admin).', enum: [USER, ADMIN], nullable: false}, userStatus: {type: string, description: 'Status of the user.', enum: [NEW, INACTIVE, DELETED, BANNED], nullable: false}, loginStatus: {type: string, description: 'Login status of the user.', enum: [LOGIN, LOGOUT], nullable: false}}
+            properties: {userId: {type: string, description: 'The id of the account', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, guildId: {type: string, description: 'Guild Id of the user', example: '1234567890', nullable: true}, userRole: {description: 'User Role (User or Admin).', nullable: false, allOf: [{$ref: '#/components/schemas/UserRole'}]}, userStatus: {description: 'Status of the user.', nullable: false, allOf: [{$ref: '#/components/schemas/UserStatus'}]}, loginStatus: {description: 'Login status of the user.', nullable: false, allOf: [{$ref: '#/components/schemas/UserLoginStatus'}]}}
             required: [userId, username, email, SNPITToken, userRole, userStatus, loginStatus]
         AccountResponseDTO:
             type: object
             properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'The account details', nullable: false, allOf: [{$ref: '#/components/schemas/AccountDto'}]}}
             required: [code, errorMessage, data]
+        ItemCategory:
+            type: string
+            enum: [DECOY, FLAG_REPAIR, SCOUT]
         UserItemsDTO:
             type: object
-            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY, FLAG_REPAIR, SCOUT]}, itemQuantity: {type: number, description: 'Quantity of the item', example: 10, nullable: false}}
+            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}, itemQuantity: {type: number, description: 'Quantity of the item', example: 10, nullable: false}}
             required: [itemId, itemName, itemCategory, itemQuantity]
         GetUserItemsResponseDTO:
             type: object
@@ -472,7 +484,7 @@ components:
             required: [code, errorMessage, data]
         CreateAccountRequestDTO:
             type: object
-            properties: {username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, userRole: {type: string, description: 'User Role (User or Admin).', enum: [USER, ADMIN], nullable: false}}
+            properties: {username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, userRole: {description: 'User Role (User or Admin).', nullable: false, allOf: [{$ref: '#/components/schemas/UserRole'}]}}
             required: [username, email, SNPITToken, userRole]
         EmptyResponseSchema:
             type: object
@@ -482,17 +494,29 @@ components:
             type: object
             properties: {itemId: {type: string, description: 'The id of the item', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, spotId: {type: string, description: 'The id of the item', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, decoyLatitude: {type: number, description: 'Latitude of the user', example: 37.123456, nullable: false}, decoyLongitude: {type: number, description: 'Longitude of the user', example: -121.123456, nullable: false}}
             required: [itemId, spotId, decoyLatitude, decoyLongitude]
+        UserUpdateType:
+            type: string
+            enum: [USER_INFO, BAN, UNBAN]
         UpdateAccountRequestDTO:
             type: object
-            properties: {updateType: {type: string, description: 'Update type of the user', enum: [USER_INFO, BAN, UNBAN], nullable: false}, userId: {type: string, description: 'The id of the account', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}}
+            properties: {updateType: {description: 'Update type of the user', nullable: false, allOf: [{$ref: '#/components/schemas/UserUpdateType'}]}, userId: {type: string, description: 'The id of the account', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, username: {type: string, description: 'The username of the account', example: user1, nullable: false}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: false}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', example: '1234567890', nullable: false}, walletAddress: {type: string, description: 'Wallet address of the user', example: '0x1234567890abcdef1234567890abcdef12345678', nullable: true}, avatar: {type: string, description: 'Avatar shown in map (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}, profilePicture: {type: string, description: 'Profile picture of the user (hash value)', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: true}}
             required: [updateType, userId, username, email, SNPITToken]
+        GuildStatus:
+            type: string
+            enum: [ACTIVE, INACTIVE, DELETED]
+        MemberRole:
+            type: string
+            enum: [OWNER, ADMIN, MEMBER]
+        MemberStatus:
+            type: string
+            enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED]
         GuildMemberDto:
             type: object
-            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, username: {type: string, description: Username., example: 'User 1', nullable: false}, role: {type: string, description: 'Role of the guild member.', nullable: false, enum: [OWNER, ADMIN, MEMBER]}, memberStatus: {type: string, description: 'Status of the guild member.', nullable: false, enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED]}, teamId: {type: string, description: 'TBD: Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, avatar: {type: string, description: 'Avatar URL of the user', example: www.guild.com/avatar.jpg, nullable: true}}
+            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, username: {type: string, description: Username., example: 'User 1', nullable: false}, role: {description: 'Role of the guild member.', nullable: false, allOf: [{$ref: '#/components/schemas/MemberRole'}]}, memberStatus: {description: 'Status of the guild member.', nullable: false, allOf: [{$ref: '#/components/schemas/MemberStatus'}]}, teamId: {type: string, description: 'TBD: Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, avatar: {type: string, description: 'Avatar URL of the user', example: www.guild.com/avatar.jpg, nullable: true}}
             required: [userId, username, role]
         GuildDto:
             type: object
-            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildStatus: {type: string, description: 'Status of the guild.', nullable: false, enum: [ACTIVE, INACTIVE, DELETED]}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: www.guild.com/avatar.jpg, nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: www.guild.com/banner.jpg, nullable: true}, guildSTP: {type: number, description: 'Guild STP', example: 100, nullable: false}, guildMembers: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
+            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: 'Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildStatus: {description: 'Status of the guild.', nullable: false, allOf: [{$ref: '#/components/schemas/GuildStatus'}]}, guildAvatar: {type: string, description: 'Avatar URL of the guild', example: www.guild.com/avatar.jpg, nullable: true}, guildBanner: {type: string, description: 'Banner URL of the guild', example: www.guild.com/banner.jpg, nullable: true}, guildSTP: {type: number, description: 'Guild STP', example: 100, nullable: false}, guildMembers: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
             required: [guildId, guildName, guildOwner, guildMembers]
         GuildInfoResponseDto:
             type: object
@@ -507,18 +531,33 @@ components:
             required: [guildName]
         UpdateGuildMemberRoleRequestDTO:
             type: object
-            properties: {role: {type: string, description: 'Role of the guild member.', nullable: false, enum: [OWNER, ADMIN, MEMBER]}}
+            properties: {role: {description: 'Role of the guild member.', nullable: false, allOf: [{$ref: '#/components/schemas/MemberRole'}]}}
+        SpotStatus:
+            type: string
+            enum: [NEW, PENDING, CAPTURED, FREE, DELETED]
+        SpotRarity:
+            type: string
+            enum: [COMMON, UNCOMMON, RARE, EPIC]
+        GuildSpotStatus:
+            type: string
+            enum: [FOUND, CAPTURED, REMOVED, DECOY, FLAGGED]
         GuildSpotDTO:
             type: object
-            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, guildSpotStatus: {type: string, description: 'Guild spot status', nullable: false, enum: [FOUND, CAPTURED, REMOVED, DECOY, FLAGGED]}}
+            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, guildSpotStatus: {description: 'Guild spot status', nullable: false, allOf: [{$ref: '#/components/schemas/GuildSpotStatus'}]}}
             required: [spotId, spotName, spotStatus, rarity, photoUrl, spotLongitude, spotLatitude, spotAddress, guildSpotStatus]
         GuildSpotsResponseDto:
             type: object
             properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of guild spots.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildSpotDTO'}}}
             required: [code, errorMessage, data]
+        PhotoType:
+            type: string
+            enum: [ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOS]
+        PhotoStatus:
+            type: string
+            enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED]
         PhotoDTO:
             type: object
-            properties: {photoHash: {type: string, description: 'SHA256 hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'My Photo', nullable: false}, uploadedUserId: {type: string, description: 'ID of the user who uploaded the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoSpecId: {type: string, description: '(TBD) ID of the photo specification', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoAtributeId: {type: string, description: '(TBD) ID of the photo attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful sunset', nullable: true}, photoType: {type: string, description: 'Type of the photo based on the uploader.', enum: [ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOS], nullable: false}, photoStatus: {type: string, description: 'Status of the photo.', enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED], nullable: false}, photoActive: {type: boolean, description: 'Active status of the photo', example: true, nullable: false}, isPrivate: {type: boolean, description: '(TBD) Private flag status of the photo', example: false, nullable: false}, likes: {type: number, description: '(TBD) Number of likes the photo has received', example: 100, nullable: true}, stars: {type: number, description: '(TBD) Number of stars the photo has received', example: 4.5, nullable: true}, latitude: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
+            properties: {photoHash: {type: string, description: 'SHA256 hash of the photo', example: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'My Photo', nullable: false}, uploadedUserId: {type: string, description: 'ID of the user who uploaded the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoSpecId: {type: string, description: '(TBD) ID of the photo specification', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoAtributeId: {type: string, description: '(TBD) ID of the photo attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful sunset', nullable: true}, photoType: {description: 'Type of the photo based on the uploader.', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoType'}]}, photoStatus: {description: 'Status of the photo.', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoStatus'}]}, photoActive: {type: boolean, description: 'Active status of the photo', example: true, nullable: false}, isPrivate: {type: boolean, description: '(TBD) Private flag status of the photo', example: false, nullable: false}, likes: {type: number, description: '(TBD) Number of likes the photo has received', example: 100, nullable: true}, stars: {type: number, description: '(TBD) Number of stars the photo has received', example: 4.5, nullable: true}, latitude: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
             required: [photoHash, photoUrl, photoName, uploadedUserId, photoType, photoStatus, latitude, longitude]
         PhotoListResponseDTO:
             type: object
@@ -530,7 +569,7 @@ components:
             required: [code, errorMessage, data]
         UploadPhotoRequestDTO:
             type: object
-            properties: {name: {type: string, description: 'Name of the photo', example: Sunset, nullable: false}, description: {type: string, description: 'Description of the photo', example: 'A beautiful sunset over the mountains', nullable: true}, type: {type: string, description: 'Type of the photo', example: LANDSCAPE, nullable: false, enum: [ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOS]}, latitute: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
+            properties: {name: {type: string, description: 'Name of the photo', example: Sunset, nullable: false}, description: {type: string, description: 'Description of the photo', example: 'A beautiful sunset over the mountains', nullable: true}, type: {description: 'Type of the photo', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoType'}]}, latitute: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
             required: [name, type, latitute, longitude]
         PhotoUploadDTO:
             type: object
@@ -542,7 +581,7 @@ components:
             required: [code, errorMessage, data]
         SpotDTO:
             type: object
-            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}}
+            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}}
             required: [spotId, spotName, spotStatus, rarity, photoUrl, spotLongitude, spotLatitude, spotAddress]
         SpotListResponseDTO:
             type: object
@@ -550,11 +589,11 @@ components:
             required: [code, errorMessage, data]
         SpotPhotoDTO:
             type: object
-            properties: {photoName: {type: string, description: 'Name of the photo', example: 'Spot Photo', nullable: false}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful spot photo', nullable: true}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, photoType: {type: string, description: 'Type of the photo', nullable: false, enum: [ADMIN_PHOTOS, USER_PHOTOS, DECOY_PHOTOS]}, photoStatus: {type: string, description: 'Status of the photo', nullable: false, enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED]}, guildId: {type: string, description: 'ID of the guild', example: '1234567890', nullable: true}}
+            properties: {photoName: {type: string, description: 'Name of the photo', example: 'Spot Photo', nullable: false}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful spot photo', nullable: true}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, photoType: {description: 'Type of the photo', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoType'}]}, photoStatus: {type: string, description: 'Status of the photo', nullable: false, enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED]}, guildId: {type: string, description: 'ID of the guild', example: '1234567890', nullable: true}}
             required: [photoName, photoUrl, photoType, photoStatus]
         SpotDetailDTO:
             type: object
-            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}}
+            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}}
             required: [spotId, spotName, spotStatus, rarity, spotLongitude, spotLatitude, spotAddress, autoIncome, attackIncome, spotPhotos]
         SpotDetailResponseDTO:
             type: object
@@ -572,15 +611,18 @@ components:
             required: [photoUrl, userLatitude, userLongitude]
         SpotAtributeDTO:
             type: object
-            properties: {spotAttributeId: {type: string, description: 'Attribute ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 100}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 100}}
+            properties: {spotAttributeId: {type: string, description: 'Attribute ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false, maxLength: 50}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false, minimum: 0, maximum: 100}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false, minimum: 0, maximum: 100}}
             required: [spotAttributeId, attributeName, rarity, autoIncome, attackIncome]
         SpotAtributeListResponseDTO:
             type: object
             properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of spot attributes.', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotAtributeDTO'}}}
             required: [code, errorMessage, data]
+        DeckStatus:
+            type: string
+            enum: [NEW, ACTIVE, INACTIVE, DELETED]
         DeckDTO:
             type: object
-            properties: {deckId: {type: string, description: 'Deck Id', example: '1234567890', nullable: false}, userId: {type: string, description: 'User Id', example: '1234567890', nullable: false}, deckName: {type: string, description: 'Deck name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'New deck', nullable: true}, deckStatus: {type: string, description: 'Deck Status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, deckCameras: {description: 'Camera Ids', example: ['1234567890', '1234567891', '1234567892', '1234567893'], nullable: false, type: array, items: {type: string}}}
+            properties: {deckId: {type: string, description: 'Deck Id', example: '1234567890', nullable: false}, userId: {type: string, description: 'User Id', example: '1234567890', nullable: false}, deckName: {type: string, description: 'Deck name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'New deck', nullable: true}, deckStatus: {description: 'Deck Status', nullable: false, allOf: [{$ref: '#/components/schemas/DeckStatus'}]}, deckCameras: {description: 'Camera Ids', example: ['1234567890', '1234567891', '1234567892', '1234567893'], nullable: false, type: array, items: {type: string}}}
             required: [deckId, userId, deckName, deckStatus, deckCameras]
         GetDeckResponseDTO:
             type: object
@@ -590,13 +632,22 @@ components:
             type: object
             properties: {deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorerId: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
             required: [deckName, deckCameras, deckNftExplorerId]
+        UpdateDeckType:
+            type: string
+            enum: [DECK_INFO, DECK_CAMERA]
         UpdateDeckRequestDTO:
             type: object
-            properties: {updateType: {type: string, description: 'Update Type', nullable: false, enum: [DECK_INFO, DECK_CAMERA]}, deckId: {type: string, description: 'Deck Id', example: 'Deck Id', nullable: false}, deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorerId: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
+            properties: {updateType: {description: 'Update Type', nullable: false, allOf: [{$ref: '#/components/schemas/UpdateDeckType'}]}, deckId: {type: string, description: 'Deck Id', example: 'Deck Id', nullable: false}, deckName: {type: string, description: 'Deck Name', example: 'Deck 1', nullable: false}, deckDescription: {type: string, description: 'Deck Description', example: 'Deck Description', nullable: true}, deckCameras: {description: 'Camera Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}, deckNftExplorerId: {description: 'NFT Explorer Ids', example: '1234567890', nullable: false, type: array, items: {type: string}}}
             required: [updateType, deckId]
+        ExplorerCategory:
+            type: string
+            enum: [NORMAL, CLIMBER, HUNTER, DIVER]
+        ExplorerRarity:
+            type: string
+            enum: [COMMON, UNCOMMON, RARE, EPIC]
         ExplorerDTO:
             type: object
-            properties: {explorerId: {type: string, description: 'NFT explorer ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'NFT explorer name', example: 'Explorer Name', nullable: false}, explorerDescription: {type: string, description: 'NFT explorer description', example: 'Explorer Description', nullable: true}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: www.guild.com/explorer.png, nullable: false}, explorerCategory: {type: string, description: 'Category of NFT explorer', nullable: false, enum: [NORMAL, CLIMBER, HUNTER, DIVER]}, energy: {type: number, description: 'Current available energy of NFT explorer', example: 100, nullable: false}, rarity: {type: string, description: 'Rarity of NFT explorer', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, energyConsumption: {type: number, description: 'Energy consumption of NFT explorer when used', example: 10, nullable: false}, range: {type: number, description: 'Range of NFT explorer', example: 10, nullable: false}, decoyFinding: {type: boolean, description: 'Decoy finding ability of NFT explorer. True if the explorer can distinguish decoys from real spots', example: true, nullable: false}, totalSearch: {type: number, description: 'Number of searches the NFT explorer has performed. This is a cumulative count', example: 3, nullable: false}, totalSpotFound: {type: number, description: 'Number of spots the NFT explorer has found. This is a cumulative count', example: 3, nullable: false}}
+            properties: {explorerId: {type: string, description: 'NFT explorer ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, tokenId: {type: string, description: 'Token ID of NFT explorer', example: '800012345678', nullable: false}, explorerName: {type: string, description: 'NFT explorer name', example: 'Explorer Name', nullable: false}, explorerDescription: {type: string, description: 'NFT explorer description', example: 'Explorer Description', nullable: true}, explorerImage: {type: string, description: 'Image of NFT explorer (URL)', example: www.guild.com/explorer.png, nullable: false}, explorerCategory: {description: 'Category of NFT explorer', nullable: false, allOf: [{$ref: '#/components/schemas/ExplorerCategory'}]}, energy: {type: number, description: 'Current available energy of NFT explorer', example: 100, nullable: false}, rarity: {description: 'Rarity of NFT explorer', nullable: false, allOf: [{$ref: '#/components/schemas/ExplorerRarity'}]}, energyConsumption: {type: number, description: 'Energy consumption of NFT explorer when used', example: 10, nullable: false}, range: {type: number, description: 'Range of NFT explorer', example: 10, nullable: false}, decoyFinding: {type: boolean, description: 'Decoy finding ability of NFT explorer. True if the explorer can distinguish decoys from real spots', example: true, nullable: false}, totalSearch: {type: number, description: 'Number of searches the NFT explorer has performed. This is a cumulative count', example: 3, nullable: false}, totalSpotFound: {type: number, description: 'Number of spots the NFT explorer has found. This is a cumulative count', example: 3, nullable: false}}
             required: [explorerId, tokenId, explorerName, explorerImage, explorerCategory, energy, rarity, energyConsumption, range, decoyFinding, totalSearch, totalSpotFound]
         ExplorerListResponseDTO:
             type: object
@@ -606,25 +657,31 @@ components:
             type: object
             properties: {explorerLongitude: {type: number, description: 'Longitude of the explorer', example: 40.7128, nullable: false}, explorerLatitude: {type: number, description: 'Latitude of the explorer', example: -74.006, nullable: false}}
             required: [explorerLongitude, explorerLatitude]
+        SpotType:
+            type: string
+            enum: [NORMAL, DECOY, FLAG]
         SpotSearchResultDTO:
             type: object
-            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false}, spotPhotos: {description: 'Photos of the spot', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotPhotoDTO'}}, spotType: {type: string, description: 'Type of the Spot', nullable: false, enum: [NORMAL, DECOY, FLAG]}}
-            required: [spotId, spotName, spotStatus, rarity, spotLongitude, spotLatitude, spotAddress, autoIncome, attackIncome, spotPhotos, spotType]
+            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild that the captured spot', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotStatus: {description: 'Status of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotStatus'}]}, rarity: {description: 'Rarity of the spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotRarity'}]}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://guild.com/photo.jpg', nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: 40.7128, nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: false}, spotType: {description: 'Type of the Spot', nullable: false, allOf: [{$ref: '#/components/schemas/SpotType'}]}}
+            required: [spotId, spotName, spotStatus, rarity, photoUrl, spotLongitude, spotLatitude, spotAddress, spotType]
         ExplorerSearchResponseDTO:
             type: object
             properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'NFT explorer search result', nullable: false, type: array, items: {$ref: '#/components/schemas/SpotSearchResultDTO'}}}
             required: [code, errorMessage, data]
         ExplorerAttributeDTO:
             type: object
-            properties: {explorerAttributeId: {type: string, description: 'NFT Explorer Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true}, rarity: {type: string, description: 'NFT Explorer Attribute Rarity', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC]}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}, active: {type: boolean, description: 'NFT Explorer Attribute Active Status', example: true, nullable: false}}
+            properties: {explorerAttributeId: {type: string, description: 'NFT Explorer Attribute ID', example: 12345678-1234-1234-1234-123456789012, nullable: false}, attributeName: {type: string, description: 'NFT Explorer Attribute Name', example: Rare, nullable: false}, attributeDescription: {type: string, description: 'NFT Explorer Attribute Description', example: 'This is a description', nullable: true}, rarity: {description: 'NFT Explorer Attribute Rarity', nullable: false, allOf: [{$ref: '#/components/schemas/ExplorerRarity'}]}, initialEnergy: {type: number, description: 'NFT Explorer Attribute Initial Energy', example: 100, nullable: false}, energyConsumption: {type: number, description: 'NFT Explorer Attribute Energy Consumption per use', example: 10, nullable: false}, range: {type: number, description: 'NFT Explorer Attribute Range in km', example: 10, nullable: false}, decoyFinding: {type: boolean, description: 'NFT Explorer Attribute to find Decoy', example: true, nullable: false}, active: {type: boolean, description: 'NFT Explorer Attribute Active Status', example: true, nullable: false}}
             required: [explorerAttributeId, attributeName, rarity, initialEnergy, energyConsumption, range, decoyFinding, active]
         ExplorerAttributeListResponseDTO:
             type: object
             properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of NFT Explorer Attributes', nullable: false, type: array, items: {$ref: '#/components/schemas/ExplorerAttributeDTO'}}}
             required: [code, errorMessage, data]
+        ItemStatus:
+            type: string
+            enum: [NEW, ACTIVE, INACTIVE, DELETED]
         ItemDTO:
             type: object
-            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY, FLAG_REPAIR, SCOUT]}}
+            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {description: 'Item status', nullable: false, allOf: [{$ref: '#/components/schemas/ItemStatus'}]}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}}
             required: [itemId, itemName, itemPrice, itemStatus, itemCategory]
         GetItemsResponseDTO:
             type: object
@@ -632,15 +689,18 @@ components:
             required: [code, errorMessage, data]
         CreateItemRequestDTO:
             type: object
-            properties: {itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY, FLAG_REPAIR, SCOUT]}}
+            properties: {itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {description: 'Item status', nullable: false, allOf: [{$ref: '#/components/schemas/ItemStatus'}]}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}}
             required: [itemName, itemPrice, itemStatus, itemCategory]
         UpdateItemRequestDTO:
             type: object
-            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {type: string, description: 'Item status', nullable: false, enum: [NEW, ACTIVE, INACTIVE, DELETED]}, itemCategory: {type: string, description: 'Item category', nullable: false, enum: [DECOY, FLAG_REPAIR, SCOUT]}}
+            properties: {itemId: {type: string, description: 'Item ID', example: 123e4567-e89b-12d3-a456-426614174000, nullable: false}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemDescription: {type: string, description: 'Item description', example: 'Decoy to distract enemies', nullable: true}, itemPrice: {type: number, description: 'Item price', example: 100, nullable: false}, itemStatus: {description: 'Item status', nullable: false, allOf: [{$ref: '#/components/schemas/ItemStatus'}]}, itemCategory: {description: 'Item category', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}}
             required: [itemId]
+        ItemBoxStatus:
+            type: string
+            enum: [BOXED, UNBOXED, USED, DELETED]
         ItemBoxDTO:
             type: object
-            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemCategory: {type: string, description: 'Category of the item', nullable: false, enum: [DECOY, FLAG_REPAIR, SCOUT]}, itemBoxStatus: {type: string, description: 'Status of the item box', nullable: false, enum: [BOXED, UNBOXED, USED, DELETED]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 37.123456, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: -121.123456, nullable: false}}
+            properties: {itemBoxId: {type: string, description: 'Item Box ID', example: 100e4567-e89b-12d3-a456-426614174000, nullable: false}, itemBoxName: {type: string, description: 'Name of the item box', example: 'Decoy Box', nullable: false}, itemBoxDescription: {type: string, description: 'Description of the item box', example: 'Decoy Box to distract enemies', nullable: true}, itemName: {type: string, description: 'Name of the item', example: Decoy, nullable: false}, itemCategory: {description: 'Category of the item', nullable: false, allOf: [{$ref: '#/components/schemas/ItemCategory'}]}, itemBoxStatus: {description: 'Status of the item box', nullable: false, allOf: [{$ref: '#/components/schemas/ItemBoxStatus'}]}, itemBoxLatitude: {type: number, description: 'Latitude of the item box', example: 37.123456, nullable: false}, itemBoxLongitude: {type: number, description: 'Longitude of the item box', example: -121.123456, nullable: false}}
             required: [itemBoxId, itemBoxName, itemBoxStatus, itemBoxLatitude, itemBoxLongitude]
         GetItemBoxResponseDTO:
             type: object

---

## 🔧 ツール
*2025/01/10 18:59:01*

**Triaging the complexities**
I'm piecing together how the transition from inline definition to referencing external schemas might be causing issues. The placement, omissions, or duplicates can all complicate the process, especially with the openapi_freezed_dio_builder.

**Tracking schema changes**

I'm thinking through how referencing `UserRole` might lead to schema issues, especially with type and enum mismatches, version discrepancies, or undefined "200" responses.

**Verifying schema accuracy**

I’m gathering info on: ensuring `PhotoType` includes `type: string` and enum; aligning references with `openapi_freezed_dio_builder`; and confirming consistent operations for design accuracy.

**Switching up schema references**

Piecing together that the user substituted inline definitions with references, which might confuse the openapi_freezed_dio_builder. Incorrect `type: string + enum` handling could cause an issue here.

**Assessing openapi_freezed_dio_builder handling**

I'm considering whether openapi_freezed_dio_builder struggles with "allOf" references for "type: string" enumerations, which might explain the null check operator error.

---

## 🤖 アシスタント
*2025/01/10 18:59:01*

まず、今回の差分を見ると、**従来はフィールド定義の中に直接 `type: string` と `enum: [...]` を記述していた**部分を、**`#/components/schemas/XXX` への参照 (allOf での参照)** へ切り替えている、という変更が多く見られます。  
この変更自体は OpenAPI の文法上は問題なく記述できるケースが多いですが、**コード生成ツール(ここでは `openapi_freezed_dio_builder` など)** によっては「`allOf` でスカラー型 (string) + enum を参照している構造」を正しく扱えず、内部的に `null` を返してしまうケースがあり得ます。  

---

## 変更点に注目すると何が起きているか

### 1. enum の定義を “schema” で分離し、参照に切り替えた

たとえば以下のように、

```diff
- userRole: {
-   type: string,
-   enum: [USER, ADMIN],
-   nullable: false
- }
+ userRole: {
+   description: 'User Role (User or Admin).',
+   nullable: false,
+   allOf: [{$ref: '#/components/schemas/UserRole'}]
+ }
```

という書き方へ変更している部分があります。これ自体は「`UserRole` というスキーマを components.schemas 内に作り、そこに `type: string` と `enum: [...]` を書いておき、それを `allOf` で継承(マージ)して使う」という一般的な書き方です。

OpenAPI の定義上は、**`allOf` を使ってスカラー型や enum 型を再利用する**ことも可能ではあります。

ところが、**`openapi_freezed_dio_builder` などのコード生成ツールが “スカラー型 + enum” を参照で取り込むパターンを想定していない**場合があります。  
つまり、**`allOf` でスカラー (string) を受け取る場合**に「内部的に `type: object` とみなそうとしてパースに失敗している」「あるいは `allOf` スキーマの階層を追う過程で `null` を返してしまう」などの不具合が発生する場合があるのです。

&gt; **補足**  
&gt; allOf は通常「オブジェクトのマージ」によく使われますが、`type: string` + `enum: [...]` のスカラー定義にも一応使えるものの、ツールチェーンとの相性が悪いこともあります。

---

### 2. “型と enum” が inline ではなく参照先に隠れることで、ツールが型情報を取れなくなっている

`openapi_freezed_dio_builder` のような Dart/Flutter 向けコード生成では、「enum としてマッピングすべきか、それとも単なる文字列か」を自動判定するときに、**inline で `type: string, enum: [...]` が書かれているパターン**だと問題なく処理していたのに、**`allOf: [{$ref: ...}]`** に変わったことで、ツール側が「どこに enum の実体があるのかわからない」あるいは「内部的に null として扱われる」ケースが起きることがあります。

これによって、スタックトレースにあるように

```
Null check operator used on a null value
OpenApiLibraryGenerator._schemaReference
OpenApiLibraryGenerator._createSchemaClass
```

といった箇所で「想定していた型情報が入ってこない -&gt; `null` を無理やり `!` 演算子で取り出してしまう -&gt; 例外発生」という流れになっていると考えられます。

---

## どう対処するといいか

1. **ツールが `allOf` でのスカラー型参照に対応しているか確認する**  
   最新版の `openapi_freezed_dio_builder` (あるいは依存している `dart-openapi-maven-generator` や `openapi-codegen` 系) が、こういった書き方に対応していない可能性があります。  
   - 対応していない場合は、**再び inline で書く**（`type: string, enum: [...]` を直書きする）か、ツールをアップデート・設定調整する必要があります。

2. **`allOf` でなく `oneOf` や `anyOf` を試す**  
   場合によっては、スカラー型への参照を `allOf` でマージするのではなく、`oneOf` で “列挙の型” を参照するなどの方法も検討できます。  
   ただ、これもツール依存なので、必ずしも上手くいくとは限りません。

3. **enum 定義を再度 inline で持ってくる**  
   確実に動かすには、元のように

   ```yaml
   userRole:
     type: string
     enum: [USER, ADMIN]
   ```

   をそのまま書いておくのが安全です。  
   あるいは

   ```yaml
   userRole:
     $ref: '#/components/schemas/UserRole'
   ```
   のように直接参照（かつ `type: string, enum` が書かれた先を**同じレイヤー**で定義する）形にするなど、ツールが解釈しやすい書き方にする必要があります。

4. **必ずしも必要なければ、enum を共通スキーマとして分離しない**  
   コードジェネレーターが対応していないのであれば、enum の共通化はあきらめて元の inline の形に戻すのが手っ取り早い場合があります。

---

## よくあるパターンまとめ

- **`allOf` を用いて “スカラー型 + enum” を参照させる** → 一部のツールは想定していない → `null check operator used on a null value`  
- **レスポンスにスキーマが無い (content が定義されない) エンドポイントがある** → ジェネレーター側が対応していない場合、同様に `null` で落ちる  
- **`$ref` の先を typo しており、存在しない参照になっている** → 同様に `null` が返る

今回の差分を見ると、「(A) もともとの inline enum → (B) 参照先 schema への allOf」となっている箇所が非常に多いので、**(B) によって生成コードが想定外になり、null 参照が発生**しているのが原因と考えられます。

---

## 結論

- **OpenAPI 上は合法だけれど、`openapi_freezed_dio_builder` 側でサポートされていない構文** (スカラー型の enum を `allOf` で参照する) が混ざったために、コード生成時に `null` が返ってクラッシュしている可能性が高いです。  
- もし差し支えなければ、**inline で `type: string, enum` を記述する形に戻す**か、あるいは「ツールが正しく動作する書き方」に修正することでエラーを回避できます。  
- ツールのバージョンを上げる、あるいは `allOf` の部分を別の手法(`oneOf` / 直接 `$ref`) に変えるなど、**ツールの制約を満たす**ように修正するしかないケースもあります。  

こうした背景から、「今回の差分によって参照構造が変わり、ツールがそこを `null` とみなして落ちている」ことが、一番大きな原因と考えられます。

---

## 👤 ユーザー
*2025/01/10 19:05:31*

oneOf と allOf の違いは？

---

## 🤖 アシスタント
*2025/01/10 19:05:59*

OpenAPI で複数のスキーマを組み合わせる際に登場する **`allOf`** と **`oneOf`** は、**「定義したい型をどのように満たすべきか」** という条件が異なるものです。簡単に言うと:

1. **allOf**:  
   - **すべてのスキーマ** (定義) を満たす必要がある。  
   - 例えば、`allOf: [スキーマA, スキーマB]` と書いたら、データは **スキーマAの条件** も **スキーマBの条件** も **両方** 満たさなくてはならない。  
   - **オブジェクトの結合（マージ）** に使われることが多く、各スキーマのプロパティをすべて合わせた構造になる。  
   - 「**A でもあるし B でもある**」というイメージ。

2. **oneOf**:  
   - スキーマのうち **いずれか1つだけ** を満たす必要がある。  
   - 例えば、`oneOf: [スキーマA, スキーマB]` と書いたら、データは **スキーマA** か **スキーマB** のどちらか **一方のみ** に適合し、もう一方には適合してはいけない。  
   - 「**A か B かどちらか一方のみ**」というイメージ。  
   - たとえば “エラーレスポンスか通常レスポンスのどちらかしか返らない” といった使い方などで登場する。

#### 例えイメージ

- **`allOf`:** 「本人確認をする際、『運転免許証』**も**『健康保険証』**も**両方をセットで提出してください」といった状態。免許証だけ提出してもダメ、保険証だけでもダメ、両方を出さないと条件を満たさない。

- **`oneOf`:** 「身分証明書として『運転免許証』**か**『パスポート』のどちらか**1つ**が必要です」といった状態。どちらか片方だけで十分だが、両方出してしまうと「どちらか1つだけを出してください」というルールに違反する（OpenAPI では両方マッチするとエラーになる）。  

---

### まとめ

- `allOf` はスキーマを**足し合わせる・マージする**(“かつ”条件)。  
- `oneOf` は**相互排他的なパターン**を指定する(“どちらか一方のみ”条件)。  

それぞれ用途が違うため、使い分けに注意が必要です。

---
