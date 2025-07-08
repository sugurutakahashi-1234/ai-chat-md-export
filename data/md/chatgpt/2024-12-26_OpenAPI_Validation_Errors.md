# OpenAPI Validation Errors

Date: 2024-12-26

---

## 👤 User
*2024-12-26 11:45:27*

openapi-generator validate -i ./lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml                                                                                                              130 ↵
Validating spec (./lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml)
[main] ERROR o.o.codegen.utils.ModelUtils - Undefined array inner type for `null`. Default to String.
[main] ERROR o.o.codegen.utils.ModelUtils - Undefined array inner type for `null`. Default to String.
[main] ERROR o.o.codegen.utils.ModelUtils - Undefined array inner type for `null`. Default to String.
[main] ERROR o.o.codegen.utils.ModelUtils - Undefined array inner type for `null`. Default to String.
[main] ERROR o.o.codegen.utils.ModelUtils - Undefined array inner type for `null`. Default to String.
[main] ERROR o.o.codegen.utils.ModelUtils - Undefined array inner type for `null`. Default to String.
Errors:
        - attribute components.schemas.SpotDetailDTO.items is missing
        - paths.'/v1/guilds/{guildId}/spots'. Declared path parameter guildId needs to be defined as
          a path parameter in path or operation level
        - attribute components.schemas.SpotListResponseDTO.items is missing
        - attribute components.schemas.SpotAtributeListResponseDTO.items is missing

[error] Spec has 4 errors.


openapi: 3.0.0
paths:
    /:
        get:
            operationId: AppController_getHello
            parameters: []
            responses: {'200': {description: ""}}
            tags: [App]
    /v1/accounts:
        post:
            operationId: AccountController_createAccount
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AccountDto'}}}}
            responses: {'200': {description: 'Created account successfully', content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/AccountDto'}}}}}}
            tags: [Account]
        get:
            operationId: AccountController_getCurrentUserAccounts
            parameters: []
            responses: {'200': {description: 'Retrieved user Id', content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/AccountDto'}}}}}}
            tags: [Account]
    '/v1/accounts/{userId}':
        get:
            operationId: AccountController_getAccountbyId
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Retrieved account by userId', content: {application/json: {schema: {$ref: '#/components/schemas/AccountDto'}}}}}
            tags: [Account]
        put:
            operationId: AccountController_updateAccount
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/AccountDto'}}}}}
            responses: {'200': {description: 'Updated account successfully', content: {application/json: {schema: {$ref: '#/components/schemas/AccountDto'}}}}}
            tags: [Account]
        delete:
            operationId: AccountController_deleteAccount
            parameters: [{name: userId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Deleted account successfully', content: {application/json: {schema: {type: string}}}}}
            tags: [Account]
    /v1/guilds:
        get:
            operationId: GuildController_getGuildInfoOfUser
            parameters: []
            responses: {'200': {description: 'Guild information retrieved successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}}
            security: [{bearer: []}]
            summary: 'Get guild information of requested user[GLD0101]'
            tags: [Guild]
        post:
            operationId: GuildController_createGuild
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateGuildRequestDto'}}}}
            responses: {'200': {description: 'Guild created successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new guild [GLD0103]'
            tags: [Guild]
        put:
            operationId: GuildController_updateGuildInfo
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildInfoRequestDto'}}}}
            responses: {'200': {description: 'Guild information updated successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update guild information by admin or guild owner [GLD0302]'
            tags: [Guild]
        delete:
            operationId: GuildController_deleteGuild
            parameters: []
            responses: {'200': {description: 'Guild member deleted successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete guild by guild owner[GLD0102]'
            tags: [Guild]
    '/v1/guilds/{guildId}':
        get:
            operationId: GuildController_getGuildInfo
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Guild information retrieved successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/GuildInfoResponseDto'}}}}}
            security: [{bearer: []}]
            summary: 'Get guild information from guild ID[GLD0101]'
            tags: [Guild]
    '/v1/guilds/{guildId}/members/{userId}':
        post:
            operationId: GuildController_updateGuildMember
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildMemberRequestDto'}}}}
            responses: {'200': {description: 'Guild member updated successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update guild member information [GLD0102, GLD0202, GLD0303]'
            tags: [Guild]
    '/v1/guilds/{guildId}/spots':
        get:
            operationId: GuildController_getGuildSpots
            parameters: []
            responses: {'200': {description: 'Guild spots retrieved successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/GuildSpotsResponseDto'}}}}}
            security: [{bearer: []}]
            summary: 'Get all guild spots[GLD0402]'
            tags: [Guild]
    /v1/photos:
        get:
            operationId: PhotosController_getAllPhotos
            parameters: []
            responses: {'200': {description: 'Photos retrieved successfully', content: {application/json: {schema: {$ref: '#/components/schemas/PhotoListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all photos uploaded by Admin [GME0501]'
            tags: [Photos]
        post:
            operationId: PhotosController_uploadPhoto
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UploadPhotoRequestDTO'}}}}
            responses: {'200': {description: 'Photo saved to database successfully', content: {application/json: {schema: {$ref: '#/components/schemas/PhotoUploadResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Uploaded a photo, separate Admin and User photo using PhotoType [ADM0101,GME0302]'
            tags: [Photos]
    '/v1/photos/{hash}':
        get:
            operationId: PhotosController_getPhotoByHash
            parameters: [{name: hash, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Photo retrieved successfully', content: {application/json: {schema: {$ref: '#/components/schemas/PhotoResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get a photo by hash [GME0502]'
            tags: [Photos]
        delete:
            operationId: PhotosController_deletePhotoByHash
            parameters: [{name: hash, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Photo deleted successfully'}}
            security: [{bearer: []}]
            summary: 'Delete photo by hash, separate Admin and User photo using PhotoType [ADM0102]'
            tags: [Photos]
    '/v1/photos/image/{url}':
        get:
            operationId: PhotosController_getPhotoByUrl
            parameters: [{name: url, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Photo retrieved successfully', content: {application/json: {schema: {$ref: '#/components/schemas/PhotoResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: '(TBD) Get a photo by URL [GME0502]'
            tags: [Photos]
    /v1/spots:
        get:
            operationId: SpotController_getAllSpots
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}
            responses: {'200': {description: 'Retrieve all spots', content: {application/json: {schema: {$ref: '#/components/schemas/SpotListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all spots uploaded by Admin [GME0501]'
            tags: [Spots]
        post:
            operationId: SpotController_createSpot
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateSpotRequestDTO'}}}}
            responses: {'200': {description: 'Spot registered successfully', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new spot by Admin [ADM0101]'
            tags: [Spots]
    '/v1/spots/{spotId}':
        get:
            operationId: SpotController_getSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/SpotDetailResponseDTO'}}}}
            responses: {'200': {description: 'Retrieve spot detail information', content: {application/json: {schema: {$ref: '#/components/schemas/SpotDetailResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get a spot detail information by spotId [GLD0402]'
            tags: [Spots]
        put:
            operationId: SpotController_updateIncentives
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateSpotRequestDTO'}}}}
            responses: {'200': {description: 'Spot updated successfully', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update a spot information by Admin [ADM0101]'
            tags: [Spots]
        delete:
            operationId: SpotController_deleteSpot
            parameters: [{name: spotId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}
            responses: {'200': {description: 'Spot deleted successfully', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete a spot by Admin [ADM0102]'
            tags: [Spots]
    /v1/spots/attributes:
        get:
            operationId: SpotController_getAllAttributes
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/SpotAtributeListResponseDTO'}}}}
            responses: {'200': {description: 'Retrieve all spot attributes', content: {application/json: {schema: {$ref: '#/components/schemas/SpotAtributeListResponseDTO'}}}}}
            security: [{bearer: []}]
            summary: 'Get all spot attributes by Admin [ADMXXXX]'
            tags: [Spots]
        post:
            operationId: SpotController_createAttribute
            parameters: []
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/CreateSpotAttributeRequestDTO'}}}}
            responses: {'200': {description: 'Spot attribute registered successfully', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Create a new spot attribute by Admin [ADMXXXX]'
            tags: [Spots]
    '/v1/spots/attributes/{attributeId}':
        delete:
            operationId: SpotController_deleteAttribute
            parameters: [{name: attributeId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}
            responses: {'200': {description: 'Spot attribute deleted successfully', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete a spot attribute by Admin [ADMXXXX]'
            tags: [Spots]
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
        AccountDto:
            type: object
            properties: {username: {type: string, description: 'The username of the account', example: user1, nullable: true}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: true}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', nullable: true}, Avatar: {type: string, description: 'Avatar shown in map', enum: [AVATAR1, AVATAR2, AVATAR3], nullable: false}, userStatus: {type: string, description: 'Status of the user.', enum: [NEW, INACTIVE, DELETED, BANNED], nullable: false}}
            required: [Avatar, userStatus]
        GuildMemberDto:
            type: object
            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, username: {type: string, description: Username., example: 'User 1', nullable: false}, avatar: {type: string, description: 'Avatar URL of the user.', example: 'http://guildsnpit.com/avatar.png', nullable: false}, role: {type: string, description: 'Role of the guild member.', enum: [OWNER, ADMIN, MEMBER], nullable: false}, memberStatus: {type: string, description: 'Status of the guild member.', enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED], nullable: false}, teamId: {type: string, description: '(Optional) Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, active: {type: boolean, description: 'Flag to indicate if the guild member is active in the guild.', nullable: false}}
            required: [userId, username, avatar, role, memberStatus]
        GuildDto:
            type: object
            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: '(Optional) Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildStatus: {type: string, description: 'Status of the guild.', enum: [ACTIVE, INACTIVE, DELETED], nullable: false}, guildAvatar: {type: string, description: '(Optional) Avatar URL of the guild.', example: 'http://guildsnpit.com/avatar.png', nullable: true}, guildBanner: {type: string, description: '(Optional) Banner URL of the guild.', example: 'http://guildsnpit.com/banner.png', nullable: true}, guildMembers: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
            required: [guildId, guildName, guildOwner, guildStatus, guildMembers]
        GuildInfoResponseDto:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Guild information.', nullable: false, allOf: [{$ref: '#/components/schemas/GuildDto'}]}}
            required: [code, errorMessage, data]
        CreateGuildRequestDto:
            type: object
            properties: {guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: '(Optional) Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildAvatar: {type: string, description: '(Optional) Avatar URL of the guild.', example: 'http://guildsnpit.com/avatar.png', nullable: true}, guildBanner: {type: string, description: '(Optional) Banner URL of the guild.', example: 'http://guildsnpit.com/banner.png', nullable: true}}
            required: [guildName]
        EmptyResponseSchema:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, data: {type: string, description: 'error message if any'}, errorMessage: {type: string, description: 'error message if any', nullable: true}}
            required: [code, data, errorMessage]
        UpdateGuildMemberRequestDto:
            type: object
            properties: {updateType: {type: string, description: 'Decide the type of update to be performed on the guild member.', enum: [ROLE, STATUS, TEAM], nullable: false}, role: {type: string, description: 'Role of the guild member.', enum: [OWNER, ADMIN, MEMBER], nullable: false}, memberStatus: {type: string, description: 'Status of the guild member.', enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED], nullable: false}, teamId: {type: string, description: 'Team ID of the guild member. If not provided, the team ID will not be updated.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}}
            required: [updateType]
        UpdateGuildInfoRequestDto:
            type: object
            properties: {guildName: {type: string, description: '(Optional) Update guild name. If not provided, the guild name will not be updated.', example: 'Guild Name', nullable: true, maxLength: 50}, guildDescription: {type: string, description: '(Optional) Update guild description. If not provided, the guild description will not be updated.', example: 'This is a description of the guild.', nullable: true}, guildAvatar: {type: string, description: '(Optional) Update avatar URL of the guild. If not provided, the avatar URL will not be updated.', example: 'http://guildsnpit.com/avatar.png', nullable: true}, guildBanner: {type: string, description: '(Optional) Update banner URL of the guild. If not provided, the avatar URL will not be updated.', example: 'http://guildsnpit.com/banner.png', nullable: true}}
        GuildSpotsDTO:
            type: object
            properties: {spotId: {type: string, description: 'Unique identifier for the spot belong to the guild.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}}
            required: [spotId]
        GuildSpotsResponseDto:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of guild spots.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildSpotsDTO'}}}
            required: [code, errorMessage, data]
        PhotoDTO:
            type: object
            properties: {photoHash: {type: string, description: 'SHA256 hash of the photo', example: 84f97eaecb11665ad401a3b94a8fc12015b7fb9e1092758b50aa7bc9c39cd4b8, nullable: false}, photoUrl: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'My Photo', nullable: false}, uploadedUserId: {type: string, description: 'ID of the user who uploaded the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoSpecId: {type: string, description: '(TBD) ID of the photo specification', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoAtributeId: {type: string, description: '(TBD) ID of the photo attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful sunset', nullable: true}, photoType: {type: string, description: 'Type of the photo based on the uploader.', enum: [ADMIN_PHOTOS, USER_PHOTOS], nullable: false}, photoStatus: {type: string, description: 'Status of the photo.', enum: [NEW, APPROVED, VALIDATED, BANNED, DELETED], nullable: false}, photoActive: {type: boolean, description: 'Active status of the photo', example: true, nullable: false}, isPrivate: {type: boolean, description: '(TBD) Private flag status of the photo', example: false, nullable: false}, likes: {type: number, description: '(TBD) Number of likes the photo has received', example: 100, nullable: true}, stars: {type: number, description: '(TBD) Number of stars the photo has received', example: 4.5, nullable: true}, latitude: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
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
            properties: {name: {type: string, description: 'Name of the photo', example: Sunset, nullable: false}, description: {type: string, description: 'Description of the photo', example: 'A beautiful sunset over the mountains', nullable: true}, type: {type: string, description: 'Type of the photo', example: LANDSCAPE, nullable: false, enum: [ADMIN_PHOTOS, USER_PHOTOS]}, latitute: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
            required: [name, type, latitute, longitude]
        PhotoUploadDTO:
            type: object
            properties: {hash: {type: string, description: 'Hash of the photo', example: 84f97eaecb11665ad401a3b94a8fc12015b7fb9e1092758b50aa7bc9c39cd4b8, nullable: false}, url: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, message: {type: string, description: 'Message associated with the photo', example: 'A beautiful sunset', nullable: true}}
            required: [hash, url]
        PhotoUploadResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Photo data', nullable: false, allOf: [{$ref: '#/components/schemas/PhotoUploadDTO'}]}}
            required: [code, errorMessage, data]
        SpotListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of spots.', nullable: false, items: {type: array}, type: array}}
            required: [code, errorMessage, data]
        SpotDetailDTO:
            type: object
            properties: {spotId: {type: string, description: 'ID of the spot', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, guildId: {type: string, description: 'ID of the guild', example: '1234567890', nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 40.7128, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: -74.006, nullable: false}, spotStatus: {type: string, description: 'Status of the spot', nullable: false, enum: [NEW, PENDING, CAPTURED, FREE, DELETED]}, rarity: {type: string, description: 'Rarity of the spot', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, createdAt: {format: date-time, type: string, description: 'Creation date of the spot', example: '2023-01-01T00:00:00Z', nullable: false}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true}, endurance: {type: number, description: 'Endurance of the spot', example: 100, nullable: false}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false}, spotPhotos: {description: 'Photos of the spot', nullable: false, items: {type: array}, type: array}}
            required: [spotId, spotName, spotLatitude, spotLongitude, spotStatus, rarity, createdAt, endurance, autoIncome, attackIncome, spotPhotos]
        SpotDetailResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'Detail information of the spot.', nullable: false, allOf: [{$ref: '#/components/schemas/SpotDetailDTO'}]}}
            required: [code, errorMessage, data]
        CreateSpotRequestDTO:
            type: object
            properties: {spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: false}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 40.7128, nullable: false}, spotLongitude: {type: number, description: 'Longitude of the spot', example: -74.006, nullable: false}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false}, photoHash: {type: string, description: 'SHA256 hash of the photo', example: 84f97eaecb11665ad401a3b94a8fc12015b7fb9e1092758b50aa7bc9c39cd4b8, nullable: false}}
            required: [spotName, spotLatitude, spotLongitude, attributeName, photoHash]
        UpdateSpotRequestDTO:
            type: object
            properties: {spotUpdateType: {type: string, description: 'Type of the spot update', nullable: false, enum: [RARITY, DETAIL, PHOTO]}, attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: true}, photoHash: {type: string, description: 'SHA256 hash of the photo', example: 84f97eaecb11665ad401a3b94a8fc12015b7fb9e1092758b50aa7bc9c39cd4b8, nullable: true}, spotName: {type: string, description: 'Name of the spot', example: 'Beautiful Spot', nullable: true}, spotDescription: {type: string, description: 'Description of the spot', example: 'A detailed description of the spot', nullable: true}, spotLatitude: {type: number, description: 'Latitude of the spot', example: 40.7128, nullable: true}, spotLongitude: {type: number, description: 'Longitude of the spot', example: -74.006, nullable: true}, spotAddress: {type: string, description: 'Address of the spot', example: '123 Main St', nullable: true}}
            required: [spotUpdateType]
        SpotAtributeListResponseDTO:
            type: object
            properties: {code: {type: number, enum: [0, -1], example: 0}, errorMessage: {type: string, description: 'error message if any', nullable: true}, data: {description: 'List of spot attributes.', nullable: false, items: {type: array}, type: array}}
            required: [code, errorMessage, data]
        CreateSpotAttributeRequestDTO:
            type: object
            properties: {attributeName: {type: string, description: 'Name of the attribute', example: 'Attribute Name', nullable: false}, attributeDescription: {type: string, description: 'Description of the attribute', example: 'A detailed description of the attribute', nullable: true}, rarity: {type: string, description: 'Rarity of the attribute', nullable: false, enum: [COMMON, UNCOMMON, RARE, EPIC, LEGENDARY]}, autoIncome: {type: number, description: 'STP Auto income every 24 hours', example: 100, nullable: false}, attackIncome: {type: number, description: 'STP Attack income when attacked by other guilds', example: 50, nullable: false}}
            required: [attributeName, rarity, autoIncome, attackIncome]

---

## 🤖 Assistant
*2024-12-26 11:45:39*

The OpenAPI validation errors point to specific issues in your API definition. Here’s a breakdown of the errors and how to fix them:

### Errors Breakdown and Fixes:

#### 1. **Undefined array inner type for `null`. Default to String.**
   - **Problem:** Some schemas define arrays with `items` as `null` or missing. OpenAPI requires the `items` property for arrays to specify the type of elements within the array.
   - **Fix:** Update the schemas to define the `items` type properly. Examples:
     - **Before:**
       ```yaml
       data:
         type: array
         items: null
       ```
     - **After:**
       ```yaml
       data:
         type: array
         items:
           type: string
       ```

#### 2. **`components.schemas.SpotDetailDTO.items` is missing**
   - **Problem:** The `SpotDetailDTO` schema has a property that is an array but lacks the `items` definition.
   - **Fix:** Define `items` in the `SpotDetailDTO` schema. For example:
     - **Before:**
       ```yaml
       spotPhotos:
         description: 'Photos of the spot'
         nullable: false
         items: {type: array}
         type: array
       ```
     - **After:**
       ```yaml
       spotPhotos:
         description: 'Photos of the spot'
         nullable: false
         type: array
         items:
           type: object
           properties:
             url:
               type: string
               description: 'URL of the photo'
       ```

#### 3. **Path parameter `guildId` needs to be defined at the path or operation level**
   - **Problem:** The path `/v1/guilds/{guildId}/spots` includes a parameter `{guildId}` but doesn't define it in the `parameters` section.
   - **Fix:** Add the `guildId` parameter definition. For example:
     - **Before:**
       ```yaml
       /v1/guilds/{guildId}/spots:
         get:
           operationId: GuildController_getGuildSpots
           parameters: []
       ```
     - **After:**
       ```yaml
       /v1/guilds/{guildId}/spots:
         get:
           operationId: GuildController_getGuildSpots
           parameters:
             - name: guildId
               in: path
               required: true
               schema:
                 type: string
       ```

#### 4. **`components.schemas.SpotListResponseDTO.items` is missing**
   - **Problem:** The `SpotListResponseDTO` schema lacks an `items` type for the `data` property, which is defined as an array.
   - **Fix:** Add a proper `items` definition. For example:
     - **Before:**
       ```yaml
       data:
         description: 'List of spots.'
         nullable: false
         items: {type: array}
         type: array
       ```
     - **After:**
       ```yaml
       data:
         description: 'List of spots.'
         nullable: false
         type: array
         items:
           $ref: '#/components/schemas/SpotDetailDTO'
       ```

#### 5. **`components.schemas.SpotAtributeListResponseDTO.items` is missing**
   - **Problem:** The `SpotAtributeListResponseDTO` schema's `data` property is an array but lacks an `items` definition.
   - **Fix:** Add the `items` definition. For example:
     - **Before:**
       ```yaml
       data:
         description: 'List of spot attributes.'
         nullable: false
         items: {type: array}
         type: array
       ```
     - **After:**
       ```yaml
       data:
         description: 'List of spot attributes.'
         nullable: false
         type: array
         items:
           $ref: '#/components/schemas/CreateSpotAttributeRequestDTO'
       ```

### Steps to Validate Again:
1. Update the OpenAPI file with the fixes.
2. Run the validation command again:
   ```bash
   openapi-generator validate -i ./lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.yaml
   ```
3. Address any new or remaining errors iteratively.

These changes should address the validation issues. Let me know if you encounter further problems!

---
