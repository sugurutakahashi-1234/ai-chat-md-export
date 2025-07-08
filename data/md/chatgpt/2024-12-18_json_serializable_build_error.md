# json_serializable build error

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/19 0:25:48*

make build                                                                                                                    2 ↵
fvm flutter pub run build_runner build --delete-conflicting-outputs
Deprecated. Use `dart run` instead.
[INFO] Generating build script completed, took 138ms
FlutterGen v5.8.0 Loading ...
Reading FlutterGen options from pubspec.yaml
[INFO] Reading cached asset graph completed, took 137ms
[INFO] Checking for updates since last build completed, took 606ms
[INFO] Running build completed, took 6.0s
[INFO] Caching finalized dependency graph completed, took 82ms
[SEVERE] json_serializable on lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart (cached):

UnimplementedError: (InvalidTypeImpl) InvalidType
[SEVERE] Failed after 6.1s
Failed to update packages.
make: *** [build] Error 1

---

## 🤖 アシスタント
*2024/12/19 0:26:00*

The error you're encountering seems to be related to the `json_serializable` package processing a type it doesn't know how to handle in the file `snapit_guild_api.openapi.dart`. Here are the steps you can take to debug and fix the issue:

### 1. **Analyze the Error Source**
   - The key line is:
     ```
     UnimplementedError: (InvalidTypeImpl) InvalidType
     ```
   - This typically occurs when `json_serializable` encounters an unsupported or invalid type in a `@JsonSerializable` annotated class.

### 2. **Check the Problematic File**
   - Open `snapit_guild_api.openapi.dart`.
   - Look for any classes, fields, or annotations that use custom or complex types.
   - Pay attention to fields that:
     - Use generic types (e.g., `Map<String, dynamic>`).
     - Reference types not annotated with `@JsonSerializable`.
     - Use types not directly supported by `json_serializable`.

### 3. **Fix Invalid or Unsupported Types**
   - Ensure all referenced types are properly annotated with `@JsonSerializable`.
   - If you are using types like `Map` or `dynamic`, consider replacing them with strongly typed equivalents.
   - Example:
     ```dart
     // Unsupported
     Map<String, dynamic> myField;

     // Preferred
     Map<String, MyCustomType> myField;
     ```

### 4. **Rebuild with Verbose Logging**
   - Run the build process

---

## 👤 ユーザー
*2024/12/19 0:27:30*

どこにエラーがありそうか？

SEVERE] json_serializable on lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart (cached):

UnimplementedError: (InvalidTypeImpl) InvalidType
package:json_serializable/src/utils.dart 231:3              typeToCode
package:json_serializable/src/helper_core.dart 78:44        createInvalidGenerationError
package:json_serializable/src/decode_helper.dart 241:13     DecodeHelper._deserializeForField
package:json_serializable/src/decode_helper.dart 56:9       DecodeHelper.createFactory.deserializeFun
package:json_serializable/src/decode_helper.dart 335:32     _writeConstructorInvocation.<fn>
dart:core                                                   StringBuffer.writeAll
package:json_serializable/src/decode_helper.dart 333:9      _writeConstructorInvocation
package:json_serializable/src/decode_helper.dart 59:18      DecodeHelper.createFactory
package:json_serializable/src/generator_helper.dart 86:28   GeneratorHelper.generate
dart:_internal                                              WhereIterator.moveNext
package:json_serializable/src/json_part_builder.dart 64:27  _UnifiedGenerator.generate
package:source_gen/src/builder.dart 342:23                  _generate
dart:async                                                  Stream.toList.<fn>
package:source_gen/src/builder.dart 107:9                   _Builder._generateForLibrary
package:source_gen/src/builder.dart 99:5                    _Builder.build

[SEVERE] Build:
Failed after 106ms
IO  : Writing 7341 characters to text file /Users/sugurutakahashi/.pub-cache/log/pub_log.txt.
MSG : Logs written to /Users/sugurutakahashi/.pub-cache/log/pub_log.txt.
[+1929 ms] pub failed
                    command: "/Users/sugurutakahashi/fvm/versions/3.27.1/bin/cache/dart-sdk/bin/dart pub --suppress-analytics run build_runner build --delete-conflicting-outputs
                    -v"
                    pub env: {
                      "FLUTTER_ROOT": "/Users/sugurutakahashi/fvm/versions/3.27.1",
                      "PUB_ENVIRONMENT": "flutter_cli:forward",
                    }
                    exit code: 1

[   +3 ms] "flutter run" took 1,999ms.
[   +3 ms] Failed to update packages.
[        ] 
           #0      throwToolExit (package:flutter_tools/src/base/common.dart:10:3)
           #1      _DefaultPub._runWithStdioInherited (package:flutter_tools/src/dart/pub.dart:503:7)
           <asynchronous suspension>
           #2      _DefaultPub.interactively (package:flutter_tools/src/dart/pub.dart:589:5)
           <asynchronous suspension>
           #3      PackagesForwardCommand.runCommand (package:flutter_tools/src/commands/packages.dart:137:5)
           <asynchronous suspension>
           #4      FlutterCommand.run.<anonymous closure> (package:flutter_tools/src/runner/flutter_command.dart:1450:27)
           <asynchronous suspension>
           #5      AppContext.run.<anonymous closure> (package:flutter_tools/src/base/context.dart:153:19)
           <asynchronous suspension>
           #6      CommandRunner.runCommand (package:args/command_runner.dart:212:13)
           <asynchronous suspension>
           #7      FlutterCommandRunner.runCommand.<anonymous closure> (package:flutter_tools/src/runner/flutter_command_runner.dart:421:9)
           <asynchronous suspension>
           #8      AppContext.run.<anonymous closure> (package:flutter_tools/src/base/context.dart:153:19)
           <asynchronous suspension>
           #9      FlutterCommandRunner.runCommand (package:flutter_tools/src/runner/flutter_command_runner.dart:364:5)
           <asynchronous suspension>
           #10     run.<anonymous closure>.<anonymous closure> (package:flutter_tools/runner.dart:131:9)
           <asynchronous suspension>
           #11     AppContext.run.<anonymous closure> (package:flutter_tools/src/base/context.dart:153:19)
           <asynchronous suspension>
           #12     main (package:flutter_tools/executable.dart:94:3)
           <asynchronous suspension>
           
           
[ +159 ms] ensureAnalyticsSent: 158ms
[        ] Running 1 shutdown hook
[        ] Shutdown hooks complete
[   +3 ms] exiting with code 1
make: *** [build] Error 1
~/git/gallusys/snpit_guild_app  ‹feature/39*› $


```
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
            operationId: AccountController_getAllAccounts
            parameters: []
            responses: {'200': {description: 'Retrieved all existing accounts', content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/AccountDto'}}}}}}
            tags: [Account]
    '/v1/accounts/{userId}':
        get:
            operationId: AccountController_getAccount
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
            operationId: GuildController_getGuildInfo
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
    '/v1/guilds/{guildId}/members/{userId}':
        post:
            operationId: GuildController_updateGuildMember
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}, {name: userId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildMemberRequestDto'}}}}
            responses: {'200': {description: 'Guild member updated successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update guild member information [GLD0102, GLD0202, GLD0303]'
            tags: [Guild]
    '/v1/guilds/{guildId}':
        put:
            operationId: GuildController_updateGuildInfo
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/UpdateGuildInfoRequestDto'}}}}
            responses: {'200': {description: 'Guild information updated successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Update guild information by admin or guild owner [GLD0302]'
            tags: [Guild]
        delete:
            operationId: GuildController_deleteGuild
            parameters: [{name: guildId, required: true, in: path, schema: {type: string}}]
            responses: {'200': {description: 'Guild member deleted successfully.', content: {application/json: {schema: {$ref: '#/components/schemas/EmptyResponseSchema'}}}}}
            security: [{bearer: []}]
            summary: 'Delete guild by guild owner[GLD0102]'
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
            properties: {username: {type: string, description: 'The username of the account', example: user1, nullable: true}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: true}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', nullable: true}, Avatar: {type: string, description: 'Avatar shown in map', enum: [AVATAR1, AVATAR2, AVATAR3], nullable: false}}
            required: [Avatar]
        GuildMemberDto:
            type: object
            properties: {userId: {type: string, description: 'Unique identifier for the user.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, role: {type: string, description: 'Role of the guild member.', enum: [OWNER, ADMIN, MEMBER], nullable: false}, memberStatus: {type: string, description: 'Status of the guild member.', enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED], nullable: false}, teamId: {type: string, description: '(Optional) Team ID of the guild member.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}, active: {type: boolean, description: 'Flag to indicate if the guild member is active in the guild.', nullable: false}}
            required: [userId, role, memberStatus]
        GuildDto:
            type: object
            properties: {guildId: {type: string, description: '10 digits code of the guild.', example: '1234567890', nullable: false}, guildName: {type: string, description: 'Name of the guild.', example: 'Guild Name', nullable: false, maxLength: 50}, guildDescription: {type: string, description: '(Optional) Description of the guild.', example: 'This is a description of the guild.', nullable: true, maxLength: 200}, guildOwner: {type: string, description: 'Unique identifier for the guild owner.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: false}, guildAvatar: {type: string, description: '(Optional) Avatar URL of the guild.', example: 'http://guildsnpit.com/avatar.png', nullable: true}, guildBanner: {type: string, description: '(Optional) Banner URL of the guild.', example: 'http://guildsnpit.com/banner.png', nullable: true}, guild_members: {description: 'List of guild members.', nullable: false, type: array, items: {$ref: '#/components/schemas/GuildMemberDto'}}}
            required: [guildId, guildName, guildOwner, guild_members]
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
            properties: {updateRole: {type: boolean, description: 'Flag to update role of the guild member. Set to true to update the role.', nullable: false}, role: {type: string, description: 'Role of the guild member.', enum: [OWNER, ADMIN, MEMBER], nullable: false}, updateStatus: {type: boolean, description: 'Flag to update status of the guild member. Set to true to update the status.', nullable: false}, memberStatus: {type: string, description: 'Status of the guild member.', enum: [INVITED, JOINED, LEFT, KICKED, REQUESTED, APPROVED], nullable: false}, updateTeam: {type: boolean, description: 'Flag to update team ID of the guild member. Set to true to update the team ID.', nullable: false}, teamId: {type: string, description: 'Team ID of the guild member. If not provided, the team ID will not be updated.', example: 123e4567-e89b-12d3-a456-426614174002, nullable: true}}
        UpdateGuildInfoRequestDto:
            type: object
            properties: {guildName: {type: string, description: '(Optional) Update guild name. If not provided, the guild name will not be updated.', example: 'Guild Name', nullable: true, maxLength: 50}, guildDescription: {type: string, description: '(Optional) Update guild description. If not provided, the guild description will not be updated.', example: 'This is a description of the guild.', nullable: true}, guildAvatar: {type: string, description: '(Optional) Update avatar URL of the guild. If not provided, the avatar URL will not be updated.', example: 'http://guildsnpit.com/avatar.png', nullable: true}, guildBanner: {type: string, description: '(Optional) Update banner URL of the guild. If not provided, the avatar URL will not be updated.', example: 'http://guildsnpit.com/banner.png', nullable: true}}
        Uint8Array:
            type: object
            properties: {}
        PhotoDTO:
            type: object
            properties: {photoHash: {type: string, description: 'SHA256 hash of the photo', example: 84f97eaecb11665ad401a3b94a8fc12015b7fb9e1092758b50aa7bc9c39cd4b8, nullable: false}, url: {type: string, description: 'URL of the photo', example: 'http://example.com/photo.jpg', nullable: false}, photoName: {type: string, description: 'Name of the photo', example: 'My Photo', nullable: false}, photoData: {description: 'Binary data of the photo', format: binary, nullable: false, allOf: [{$ref: '#/components/schemas/Uint8Array'}]}, uploadedUserId: {type: string, description: 'ID of the user who uploaded the photo', example: 123e4567-e89b-12d3-a456-426614174001, nullable: false}, photoSpecId: {type: string, description: '(TBD) ID of the photo specification', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoAtributeId: {type: string, description: '(TBD) ID of the photo attribute', example: 123e4567-e89b-12d3-a456-426614174001, nullable: true}, photoDescription: {type: string, description: 'Description of the photo', example: 'A beautiful sunset', nullable: true}, photoType: {type: string, description: 'Type of the photo based on the uploader.', enum: [ADMIN_PHOTOS, USER_PHOTOS], nullable: false}, photoActive: {type: boolean, description: 'Active status of the photo', example: true, nullable: false}, isPrivate: {type: boolean, description: '(TBD) Private flag status of the photo', example: false, nullable: false}, likes: {type: number, description: '(TBD) Number of likes the photo has received', example: 100, nullable: true}, stars: {type: number, description: '(TBD) Number of stars the photo has received', example: 4.5, nullable: true}, latitude: {type: number, description: 'Latitude of the photo location', example: 37.7749, nullable: false}, longitude: {type: number, description: 'Longitude of the photo location', example: -122.4194, nullable: false}}
            required: [photoHash, url, photoName, photoData, uploadedUserId, photoType, latitude, longitude]
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
```

---

## 🤖 アシスタント
*2024/12/19 0:28:13*

The error appears to originate from an unsupported or unrecognized type in the `snapit_guild_api.openapi.dart` file during code generation using `json_serializable`. Here's a step-by-step analysis and likely problematic areas:

### **Key Observations:**
1. The error suggests a problem with how the types are serialized or deserialized.
2. The `UnimplementedError: (InvalidTypeImpl)` often occurs when:
   - A type in the OpenAPI schema does not have a direct mapping in Dart.
   - There's a mismatch between the schema definitions and how the generator interprets them.

---

### **Likely Problematic Areas in the OpenAPI Spec**
#### **1. `Uint8Array` Schema**
   ```yaml
   Uint8Array:
       type: object
       properties: {}
   ```
   - **Problem**: The `Uint8Array` schema is defined as an object with no properties, which might confuse the code generator.
   - **Fix**: Replace it with a better representation, such as:
     ```yaml
     Uint8Array:
         type: array
         items:
             type: integer
             format: uint8
     ```

#### **2. `allOf` Usage**
   - **Example**:
     ```yaml
     GuildInfoResponseDto:
         type: object
         properties:
             data:
                 description: 'Guild information.'
                 nullable: false
                 allOf: [{$ref: '#/components/schemas/GuildDto'}]
     ```
   - **Problem**: The `allOf` construct is used to extend the schema, but the code generator might not handle it properly.
   - **Fix**: Replace `allOf` with a direct `$ref`:
     ```yaml
     data:
         $ref: '#/components/schemas/GuildDto'
     ```

#### **3. Binary Data (`photoData`)**
   ```yaml
   photoData:
       description: 'Binary data of the photo'
       format: binary
       nullable: false
       allOf: [{$ref: '#/components/schemas/Uint8Array'}]
   ```
   - **Problem**: Combining `format: binary` with `allOf` is ambiguous and likely unsupported.
   - **Fix**: Replace with:
     ```yaml
     photoData:
         type: string
         format: binary
     ```

#### **4. Enum Handling**
   - **Example**:
     ```yaml
     Avatar:
         type: string
         description: 'Avatar shown in map'
         enum: [AVATAR1, AVATAR2, AVATAR3]
         nullable: false
     ```
   - **Problem**: Nullable enums may cause issues.
   - **Fix**: Explicitly specify non-nullable enum behavior:
     ```yaml
     Avatar:
         type: string
         description: 'Avatar shown in map'
         enum: [AVATAR1, AVATAR2, AVATAR3]
     ```

---

### **Steps to Resolve**
1. **Fix OpenAPI Schema**
   - Update the problematic areas as suggested above.
   - Re-run the generator.

2. **Re-run the Generator**
   ```bash
   fvm flutter pub run build_runner build --delete-conflicting-outputs
   ```

3. **Enable Verbose Output for Debugging**
   - Add the `-v` flag for detailed logs:
     ```bash
     fvm flutter pub run build_runner build --delete-conflicting-outputs -v
     ```

4. **Check the Generated Code**
   - Inspect `snapit_guild_api.openapi.dart` for any unrecognized or incomplete types.

5. **Validate the OpenAPI Spec**
   - Use a tool like [Swagger Editor](https://editor.swagger.io/) to validate your OpenAPI specification for errors or warnings.

---

### **Potential Next Steps**
If the above steps don't resolve the issue:
- **Share the generated Dart file** to pinpoint specific errors in the context of `json_serializable`.
- **Validate Dependencies**:
  - Ensure you're using compatible versions of `json_serializable`, `build_runner`, and `flutter_gen`.
  - Update dependencies if needed:
    ```bash
    dart pub upgrade
    ```

Let me know if you need further assistance!

---

## 👤 ユーザー
*2024/12/19 0:31:15*

```
[FINE] json_serializable on lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart:Running JsonSerializableGenerator - 1 of 2
[SEVERE] json_serializable on lib/infrastructure/snapit_guild_api/snapit_guild_api.openapi.dart:

UnimplementedError: (InvalidTypeImpl) InvalidType
package:json_serializable/src/utils.dart 231:3              typeToCode
package:json_serializable/src/helper_core.dart 78:44        createInvalidGenerationError
package:json_serializable/src/decode_helper.dart 241:13     DecodeHelper._deserializeForField
package:json_serializable/src/decode_helper.dart 56:9       DecodeHelper.createFactory.deserializeFun
package:json_serializable/src/decode_helper.dart 335:32     _writeConstructorInvocation.<fn>
dart:core                                                   StringBuffer.writeAll
package:json_serializable/src/decode_helper.dart 333:9      _writeConstructorInvocation
package:json_serializable/src/decode_helper.dart 59:18      DecodeHelper.createFactory
package:json_serializable/src/generator_helper.dart 86:28   GeneratorHelper.generate
dart:_internal                                              WhereIterator.moveNext
package:json_serializable/src/json_part_builder.dart 64:27  _UnifiedGenerator.generate
package:source_gen/src/builder.dart 342:23                  _generate
dart:async                                                  Stream.toList.<fn>
package:source_gen/src/builder.dart 107:9                   _Builder._generateForLibrary
package:source_gen/src/builder.dart 99:5                    _Builder.build

[FINE] json_serializable on lib/presentation/pages/login_page.dart:Running JsonSerializableGenerator - 1 of 2```

```
// GENERATED CODE - DO NOT MODIFY BY HAND

// ignore_for_file: prefer_initializing_formals, unnecessary_brace_in_string_interps

import 'dart:core';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:http_parser/http_parser.dart';
import 'dart:convert';
part 'snapit_guild_api.openapi.g.dart';
part 'snapit_guild_api.openapi.freezed.dart';

enum AccountDtoAvatar {
  @JsonValue('AVATAR1')
  AVATAR1,
  @JsonValue('AVATAR2')
  AVATAR2,
  @JsonValue('AVATAR3')
  AVATAR3,
}

extension AccountDtoAvatarExt on AccountDtoAvatar {
  static final Map<String, AccountDtoAvatar> _names = {
    'AVATAR1': AccountDtoAvatar.AVATAR1,
    'AVATAR2': AccountDtoAvatar.AVATAR2,
    'AVATAR3': AccountDtoAvatar.AVATAR3,
  };
  static AccountDtoAvatar fromName(String name) =>
      _names[name] ??
      _throwStateError('Invalid enum name: $name for AccountDtoAvatar');
  String get name => toString().substring(17);
}

@freezed
class AccountDto with _$AccountDto {
  factory AccountDto({
    @JsonKey(name: 'username') String? username,
    @JsonKey(name: 'email') String? email,
    @JsonKey(name: 'sNPITToken') String? sNPITToken,
    @JsonKey(name: 'avatar') required AccountDtoAvatar? avatar,
  }) = _AccountDto;

  factory AccountDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$AccountDtoFromJson(jsonMap);
}

enum GuildMemberDtoRole {
  @JsonValue('OWNER')
  OWNER,
  @JsonValue('ADMIN')
  ADMIN,
  @JsonValue('MEMBER')
  MEMBER,
}

extension GuildMemberDtoRoleExt on GuildMemberDtoRole {
  static final Map<String, GuildMemberDtoRole> _names = {
    'OWNER': GuildMemberDtoRole.OWNER,
    'ADMIN': GuildMemberDtoRole.ADMIN,
    'MEMBER': GuildMemberDtoRole.MEMBER,
  };
  static GuildMemberDtoRole fromName(String name) =>
      _names[name] ??
      _throwStateError('Invalid enum name: $name for GuildMemberDtoRole');
  String get name => toString().substring(19);
}

enum GuildMemberDtoMemberStatus {
  @JsonValue('INVITED')
  INVITED,
  @JsonValue('JOINED')
  JOINED,
  @JsonValue('LEFT')
  LEFT,
  @JsonValue('KICKED')
  KICKED,
  @JsonValue('REQUESTED')
  REQUESTED,
  @JsonValue('APPROVED')
  APPROVED,
}

extension GuildMemberDtoMemberStatusExt on GuildMemberDtoMemberStatus {
  static final Map<String, GuildMemberDtoMemberStatus> _names = {
    'INVITED': GuildMemberDtoMemberStatus.INVITED,
    'JOINED': GuildMemberDtoMemberStatus.JOINED,
    'LEFT': GuildMemberDtoMemberStatus.LEFT,
    'KICKED': GuildMemberDtoMemberStatus.KICKED,
    'REQUESTED': GuildMemberDtoMemberStatus.REQUESTED,
    'APPROVED': GuildMemberDtoMemberStatus.APPROVED,
  };
  static GuildMemberDtoMemberStatus fromName(String name) =>
      _names[name] ??
      _throwStateError(
          'Invalid enum name: $name for GuildMemberDtoMemberStatus');
  String get name => toString().substring(27);
}

@freezed
class GuildMemberDto with _$GuildMemberDto {
  factory GuildMemberDto({
    @JsonKey(name: 'userId') required String? userId,
    @JsonKey(name: 'role') required GuildMemberDtoRole? role,
    @JsonKey(name: 'memberStatus')
    required GuildMemberDtoMemberStatus? memberStatus,
    @JsonKey(name: 'teamId') String? teamId,
    @JsonKey(name: 'active') bool? active,
  }) = _GuildMemberDto;

  factory GuildMemberDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$GuildMemberDtoFromJson(jsonMap);
}

@freezed
class GuildDto with _$GuildDto {
  factory GuildDto({
    @JsonKey(name: 'guildId') required String? guildId,
    @JsonKey(name: 'guildName') required String? guildName,
    @JsonKey(name: 'guildDescription') String? guildDescription,
    @JsonKey(name: 'guildOwner') required String? guildOwner,
    @JsonKey(name: 'guildAvatar') String? guildAvatar,
    @JsonKey(name: 'guildBanner') String? guildBanner,
    @JsonKey(name: 'guildMembers') required List<GuildMemberDto>? guildMembers,
  }) = _GuildDto;

  factory GuildDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$GuildDtoFromJson(jsonMap);
}

/// Guild information.
@freezed
class GuildInfoResponseDtoData with _$GuildInfoResponseDtoData {
  factory GuildInfoResponseDtoData({
    @JsonKey(name: 'guildId') required String? guildId,
    @JsonKey(name: 'guildName') required String? guildName,
    @JsonKey(name: 'guildDescription') String? guildDescription,
    @JsonKey(name: 'guildOwner') required String? guildOwner,
    @JsonKey(name: 'guildAvatar') String? guildAvatar,
    @JsonKey(name: 'guildBanner') String? guildBanner,
    @JsonKey(name: 'guildMembers') required List<GuildMemberDto>? guildMembers,
  }) = _GuildInfoResponseDtoData;

  factory GuildInfoResponseDtoData.fromJson(Map<String, dynamic> jsonMap) =>
      _$GuildInfoResponseDtoDataFromJson(jsonMap);
}

@freezed
class GuildInfoResponseDto with _$GuildInfoResponseDto {
  factory GuildInfoResponseDto({
    @JsonKey(name: 'code') required num? code,
    @JsonKey(name: 'errorMessage') required String? errorMessage,
    @JsonKey(name: 'data') required GuildInfoResponseDtoData? data,
  }) = _GuildInfoResponseDto;

  factory GuildInfoResponseDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$GuildInfoResponseDtoFromJson(jsonMap);
}

@freezed
class CreateGuildRequestDto with _$CreateGuildRequestDto {
  factory CreateGuildRequestDto({
    @JsonKey(name: 'guildName') required String? guildName,
    @JsonKey(name: 'guildDescription') String? guildDescription,
    @JsonKey(name: 'guildAvatar') String? guildAvatar,
    @JsonKey(name: 'guildBanner') String? guildBanner,
  }) = _CreateGuildRequestDto;

  factory CreateGuildRequestDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$CreateGuildRequestDtoFromJson(jsonMap);
}

@freezed
class EmptyResponseSchema with _$EmptyResponseSchema {
  factory EmptyResponseSchema({
    @JsonKey(name: 'code') required num? code,
    @JsonKey(name: 'data') required String? data,
    @JsonKey(name: 'errorMessage') required String? errorMessage,
  }) = _EmptyResponseSchema;

  factory EmptyResponseSchema.fromJson(Map<String, dynamic> jsonMap) =>
      _$EmptyResponseSchemaFromJson(jsonMap);
}

enum UpdateGuildMemberRequestDtoRole {
  @JsonValue('OWNER')
  OWNER,
  @JsonValue('ADMIN')
  ADMIN,
  @JsonValue('MEMBER')
  MEMBER,
}

extension UpdateGuildMemberRequestDtoRoleExt
    on UpdateGuildMemberRequestDtoRole {
  static final Map<String, UpdateGuildMemberRequestDtoRole> _names = {
    'OWNER': UpdateGuildMemberRequestDtoRole.OWNER,
    'ADMIN': UpdateGuildMemberRequestDtoRole.ADMIN,
    'MEMBER': UpdateGuildMemberRequestDtoRole.MEMBER,
  };
  static UpdateGuildMemberRequestDtoRole fromName(String name) =>
      _names[name] ??
      _throwStateError(
          'Invalid enum name: $name for UpdateGuildMemberRequestDtoRole');
  String get name => toString().substring(32);
}

enum UpdateGuildMemberRequestDtoMemberStatus {
  @JsonValue('INVITED')
  INVITED,
  @JsonValue('JOINED')
  JOINED,
  @JsonValue('LEFT')
  LEFT,
  @JsonValue('KICKED')
  KICKED,
  @JsonValue('REQUESTED')
  REQUESTED,
  @JsonValue('APPROVED')
  APPROVED,
}

extension UpdateGuildMemberRequestDtoMemberStatusExt
    on UpdateGuildMemberRequestDtoMemberStatus {
  static final Map<String, UpdateGuildMemberRequestDtoMemberStatus> _names = {
    'INVITED': UpdateGuildMemberRequestDtoMemberStatus.INVITED,
    'JOINED': UpdateGuildMemberRequestDtoMemberStatus.JOINED,
    'LEFT': UpdateGuildMemberRequestDtoMemberStatus.LEFT,
    'KICKED': UpdateGuildMemberRequestDtoMemberStatus.KICKED,
    'REQUESTED': UpdateGuildMemberRequestDtoMemberStatus.REQUESTED,
    'APPROVED': UpdateGuildMemberRequestDtoMemberStatus.APPROVED,
  };
  static UpdateGuildMemberRequestDtoMemberStatus fromName(String name) =>
      _names[name] ??
      _throwStateError(
          'Invalid enum name: $name for UpdateGuildMemberRequestDtoMemberStatus');
  String get name => toString().substring(40);
}

@freezed
class UpdateGuildMemberRequestDto with _$UpdateGuildMemberRequestDto {
  factory UpdateGuildMemberRequestDto({
    @JsonKey(name: 'updateRole') bool? updateRole,
    @JsonKey(name: 'role') UpdateGuildMemberRequestDtoRole? role,
    @JsonKey(name: 'updateStatus') bool? updateStatus,
    @JsonKey(name: 'memberStatus')
    UpdateGuildMemberRequestDtoMemberStatus? memberStatus,
    @JsonKey(name: 'updateTeam') bool? updateTeam,
    @JsonKey(name: 'teamId') String? teamId,
  }) = _UpdateGuildMemberRequestDto;

  factory UpdateGuildMemberRequestDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$UpdateGuildMemberRequestDtoFromJson(jsonMap);
}

@freezed
class UpdateGuildInfoRequestDto with _$UpdateGuildInfoRequestDto {
  factory UpdateGuildInfoRequestDto({
    @JsonKey(name: 'guildName') String? guildName,
    @JsonKey(name: 'guildDescription') String? guildDescription,
    @JsonKey(name: 'guildAvatar') String? guildAvatar,
    @JsonKey(name: 'guildBanner') String? guildBanner,
  }) = _UpdateGuildInfoRequestDto;

  factory UpdateGuildInfoRequestDto.fromJson(Map<String, dynamic> jsonMap) =>
      _$UpdateGuildInfoRequestDtoFromJson(jsonMap);
}

@freezed
class Uint8Array with _$Uint8Array {
  factory Uint8Array() = _Uint8Array;

  factory Uint8Array.fromJson(Map<String, dynamic> jsonMap) =>
      _$Uint8ArrayFromJson(jsonMap);
}

/// Binary data of the photo
@freezed
class PhotoDTOPhotoData with _$PhotoDTOPhotoData {
  factory PhotoDTOPhotoData() = _PhotoDTOPhotoData;

  factory PhotoDTOPhotoData.fromJson(Map<String, dynamic> jsonMap) =>
      _$PhotoDTOPhotoDataFromJson(jsonMap);
}

enum PhotoDTOPhotoType {
  @JsonValue('ADMIN_PHOTOS')
  ADMIN_PHOTOS,
  @JsonValue('USER_PHOTOS')
  USER_PHOTOS,
}

extension PhotoDTOPhotoTypeExt on PhotoDTOPhotoType {
  static final Map<String, PhotoDTOPhotoType> _names = {
    'ADMIN_PHOTOS': PhotoDTOPhotoType.ADMIN_PHOTOS,
    'USER_PHOTOS': PhotoDTOPhotoType.USER_PHOTOS,
  };
  static PhotoDTOPhotoType fromName(String name) =>
      _names[name] ??
      _throwStateError('Invalid enum name: $name for PhotoDTOPhotoType');
  String get name => toString().substring(18);
}

@freezed
class PhotoListResponseDTO with _$PhotoListResponseDTO {
  factory PhotoListResponseDTO({
    @JsonKey(name: 'code') required num? code,
    @JsonKey(name: 'errorMessage') required String? errorMessage,
    @JsonKey(name: 'data') required List<PhotoDTO>? data,
  }) = _PhotoListResponseDTO;

  factory PhotoListResponseDTO.fromJson(Map<String, dynamic> jsonMap) =>
      _$PhotoListResponseDTOFromJson(jsonMap);
}

/// Photo data
@freezed
class PhotoResponseDTOData with _$PhotoResponseDTOData {
  factory PhotoResponseDTOData({
    @JsonKey(name: 'photoHash') required String? photoHash,
    @JsonKey(name: 'url') required String? url,
    @JsonKey(name: 'photoName') required String? photoName,
    @JsonKey(name: 'photoData') required PhotoDTOPhotoData? photoData,
    @JsonKey(name: 'uploadedUserId') required String? uploadedUserId,
    @JsonKey(name: 'photoSpecId') String? photoSpecId,
    @JsonKey(name: 'photoAtributeId') String? photoAtributeId,
    @JsonKey(name: 'photoDescription') String? photoDescription,
    @JsonKey(name: 'photoType') required PhotoDTOPhotoType? photoType,
    @JsonKey(name: 'photoActive') bool? photoActive,
    @JsonKey(name: 'isPrivate') bool? isPrivate,
    @JsonKey(name: 'likes') num? likes,
    @JsonKey(name: 'stars') num? stars,
    @JsonKey(name: 'latitude') required num? latitude,
    @JsonKey(name: 'longitude') required num? longitude,
  }) = _PhotoResponseDTOData;
}

@freezed
class PhotoResponseDTO with _$PhotoResponseDTO {
  factory PhotoResponseDTO({
    @JsonKey(name: 'code') required num? code,
    @JsonKey(name: 'errorMessage') required String? errorMessage,
    @JsonKey(name: 'data') required PhotoResponseDTOData? data,
  }) = _PhotoResponseDTO;

  factory PhotoResponseDTO.fromJson(Map<String, dynamic> jsonMap) =>
      _$PhotoResponseDTOFromJson(jsonMap);
}

enum UploadPhotoRequestDTOType {
  @JsonValue('ADMIN_PHOTOS')
  ADMIN_PHOTOS,
  @JsonValue('USER_PHOTOS')
  USER_PHOTOS,
}

extension UploadPhotoRequestDTOTypeExt on UploadPhotoRequestDTOType {
  static final Map<String, UploadPhotoRequestDTOType> _names = {
    'ADMIN_PHOTOS': UploadPhotoRequestDTOType.ADMIN_PHOTOS,
    'USER_PHOTOS': UploadPhotoRequestDTOType.USER_PHOTOS,
  };
  static UploadPhotoRequestDTOType fromName(String name) =>
      _names[name] ??
      _throwStateError(
          'Invalid enum name: $name for UploadPhotoRequestDTOType');
  String get name => toString().substring(26);
}

@freezed
class UploadPhotoRequestDTO with _$UploadPhotoRequestDTO {
  factory UploadPhotoRequestDTO({
    @JsonKey(name: 'name') required String? name,
    @JsonKey(name: 'description') String? description,
    @JsonKey(name: 'type') required UploadPhotoRequestDTOType? type,
    @JsonKey(name: 'latitute') required num? latitute,
    @JsonKey(name: 'longitude') required num? longitude,
  }) = _UploadPhotoRequestDTO;

  factory UploadPhotoRequestDTO.fromJson(Map<String, dynamic> jsonMap) =>
      _$UploadPhotoRequestDTOFromJson(jsonMap);
}

@freezed
class PhotoUploadDTO with _$PhotoUploadDTO {
  factory PhotoUploadDTO({
    @JsonKey(name: 'hash') required String? hash,
    @JsonKey(name: 'url') required String? url,
    @JsonKey(name: 'message') String? message,
  }) = _PhotoUploadDTO;

  factory PhotoUploadDTO.fromJson(Map<String, dynamic> jsonMap) =>
      _$PhotoUploadDTOFromJson(jsonMap);
}

/// Photo data
@freezed
class PhotoUploadResponseDTOData with _$PhotoUploadResponseDTOData {
  factory PhotoUploadResponseDTOData({
    @JsonKey(name: 'hash') required String? hash,
    @JsonKey(name: 'url') required String? url,
    @JsonKey(name: 'message') String? message,
  }) = _PhotoUploadResponseDTOData;

  factory PhotoUploadResponseDTOData.fromJson(Map<String, dynamic> jsonMap) =>
      _$PhotoUploadResponseDTODataFromJson(jsonMap);
}

@freezed
class PhotoUploadResponseDTO with _$PhotoUploadResponseDTO {
  factory PhotoUploadResponseDTO({
    @JsonKey(name: 'code') required num? code,
    @JsonKey(name: 'errorMessage') required String? errorMessage,
    @JsonKey(name: 'data') required PhotoUploadResponseDTOData? data,
  }) = _PhotoUploadResponseDTO;

  factory PhotoUploadResponseDTO.fromJson(Map<String, dynamic> jsonMap) =>
      _$PhotoUploadResponseDTOFromJson(jsonMap);
}

class AppApi {
  AppApi(
    this.dio,
    this.baseUri,
  );

  final Dio dio;

  final Uri baseUri;

  /// get: /
  ///
  Future<Response<void>> appControllerGetHello() async {
    final queryParams = <String, dynamic>{};
    final uri =
        baseUri.replace(queryParameters: queryParams, path: baseUri.path + '/');
    final response = await dio.getUri<void>(uri);
    return response;
  }
}

@freezed
class AccountControllerUpdateAccountSchema
    with _$AccountControllerUpdateAccountSchema {
  factory AccountControllerUpdateAccountSchema() =
      _AccountControllerUpdateAccountSchema;

  factory AccountControllerUpdateAccountSchema.fromJson(
          Map<String, dynamic> jsonMap) =>
      _$AccountControllerUpdateAccountSchemaFromJson(jsonMap);
}

@freezed
class AccountControllerDeleteAccountResponse
    with _$AccountControllerDeleteAccountResponse {
  factory AccountControllerDeleteAccountResponse() =
      _AccountControllerDeleteAccountResponse;

  factory AccountControllerDeleteAccountResponse.fromJson(
          Map<String, dynamic> jsonMap) =>
      _$AccountControllerDeleteAccountResponseFromJson(jsonMap);
}

class AccountApi {
  AccountApi(
    this.dio,
    this.baseUri,
  );

  final Dio dio;

  final Uri baseUri;

  /// get: /v1/accounts
  ///
  Future<Response<List<AccountDto>>> accountControllerGetAllAccounts() async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/accounts');
    final response = await dio.getUri<List<dynamic>>(uri);
    final parsed = response.data!
        .map((dynamic e) => AccountDto.fromJson(e as Map<String, dynamic>))
        .toList();
    return Response<List<AccountDto>>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// post: /v1/accounts
  ///
  Future<Response<List<AccountDto>>> accountControllerCreateAccount(
      AccountDto body) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/accounts');
    final response = await dio.postUri<List<dynamic>>(uri, data: body);
    final parsed = response.data!
        .map((dynamic e) => AccountDto.fromJson(e as Map<String, dynamic>))
        .toList();
    return Response<List<AccountDto>>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// get: /v1/accounts/{userId}
  ///
  Future<Response<AccountDto>> accountControllerGetAccount(
      {required String userId}) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/accounts/${userId}');
    final response = await dio.getUri<Map<String, dynamic>>(uri);
    final parsed = AccountDto.fromJson(response.data!);
    return Response<AccountDto>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// put: /v1/accounts/{userId}
  ///
  Future<Response<AccountDto>> accountControllerUpdateAccount(
    AccountControllerUpdateAccountSchema body, {
    required String userId,
  }) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/accounts/${userId}');
    final response = await dio.putUri<Map<String, dynamic>>(uri, data: body);
    final parsed = AccountDto.fromJson(response.data!);
    return Response<AccountDto>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// delete: /v1/accounts/{userId}
  ///
  Future<Response<AccountControllerDeleteAccountResponse>>
      accountControllerDeleteAccount({required String userId}) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/accounts/${userId}');
    final response = await dio.deleteUri<Map<String, dynamic>>(uri);
    final parsed =
        AccountControllerDeleteAccountResponse.fromJson(response.data!);
    return Response<AccountControllerDeleteAccountResponse>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }
}

class GuildApi {
  GuildApi(
    this.dio,
    this.baseUri,
  );

  final Dio dio;

  final Uri baseUri;

  /// Get guild information of requested user[GLD0101]
  /// get: /v1/guilds
  ///
  Future<Response<GuildInfoResponseDto>> guildControllerGetGuildInfo() async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/guilds');
    final response = await dio.getUri<Map<String, dynamic>>(uri);
    final parsed = GuildInfoResponseDto.fromJson(response.data!);
    return Response<GuildInfoResponseDto>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Create a new guild [GLD0103]
  /// post: /v1/guilds
  ///
  Future<Response<EmptyResponseSchema>> guildControllerCreateGuild(
      CreateGuildRequestDto body) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/guilds');
    final response = await dio.postUri<Map<String, dynamic>>(uri, data: body);
    final parsed = EmptyResponseSchema.fromJson(response.data!);
    return Response<EmptyResponseSchema>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Update guild member information [GLD0102, GLD0202, GLD0303]
  /// post: /v1/guilds/{guildId}/members/{userId}
  ///
  Future<Response<EmptyResponseSchema>> guildControllerUpdateGuildMember(
    UpdateGuildMemberRequestDto body, {
    required String guildId,
    required String userId,
  }) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/guilds/${guildId}/members/${userId}');
    final response = await dio.postUri<Map<String, dynamic>>(uri, data: body);
    final parsed = EmptyResponseSchema.fromJson(response.data!);
    return Response<EmptyResponseSchema>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Update guild information by admin or guild owner [GLD0302]
  /// put: /v1/guilds/{guildId}
  ///
  Future<Response<EmptyResponseSchema>> guildControllerUpdateGuildInfo(
    UpdateGuildInfoRequestDto body, {
    required String guildId,
  }) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/guilds/${guildId}');
    final response = await dio.putUri<Map<String, dynamic>>(uri, data: body);
    final parsed = EmptyResponseSchema.fromJson(response.data!);
    return Response<EmptyResponseSchema>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Delete guild by guild owner[GLD0102]
  /// delete: /v1/guilds/{guildId}
  ///
  Future<Response<EmptyResponseSchema>> guildControllerDeleteGuild(
      {required String guildId}) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/guilds/${guildId}');
    final response = await dio.deleteUri<Map<String, dynamic>>(uri);
    final parsed = EmptyResponseSchema.fromJson(response.data!);
    return Response<EmptyResponseSchema>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }
}

class PhotosApi {
  PhotosApi(
    this.dio,
    this.baseUri,
  );

  final Dio dio;

  final Uri baseUri;

  /// Get all photos uploaded by Admin [GME0501]
  /// get: /v1/photos
  ///
  Future<Response<PhotoListResponseDTO>> photosControllerGetAllPhotos() async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/photos');
    final response = await dio.getUri<Map<String, dynamic>>(uri);
    final parsed = PhotoListResponseDTO.fromJson(response.data!);
    return Response<PhotoListResponseDTO>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Uploaded a photo, separate Admin and User photo using PhotoType [ADM0101,GME0302]
  /// post: /v1/photos
  ///
  Future<Response<PhotoUploadResponseDTO>> photosControllerUploadPhoto(
      UploadPhotoRequestDTO body) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams, path: baseUri.path + '/v1/photos');
    final response = await dio.postUri<Map<String, dynamic>>(uri, data: body);
    final parsed = PhotoUploadResponseDTO.fromJson(response.data!);
    return Response<PhotoUploadResponseDTO>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Get a photo by hash [GME0502]
  /// get: /v1/photos/{hash}
  ///
  Future<Response<PhotoResponseDTO>> photosControllerGetPhotoByHash(
      {required String hash}) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/photos/${hash}');
    final response = await dio.getUri<Map<String, dynamic>>(uri);
    final parsed = PhotoResponseDTO.fromJson(response.data!);
    return Response<PhotoResponseDTO>(
      data: parsed,
      headers: response.headers,
      requestOptions: response.requestOptions,
      isRedirect: response.isRedirect,
      statusCode: response.statusCode,
      redirects: response.redirects,
      extra: response.extra,
    );
  }

  /// Delete photo by hash, separate Admin and User photo using PhotoType [ADM0102]
  /// delete: /v1/photos/{hash}
  ///
  Future<Response<void>> photosControllerDeletePhotoByHash(
      {required String hash}) async {
    final queryParams = <String, dynamic>{};
    final uri = baseUri.replace(
        queryParameters: queryParams,
        path: baseUri.path + '/v1/photos/${hash}');
    final response = await dio.deleteUri<void>(uri);
    return response;
  }
}

T _throwStateError<T>(String message) => throw StateError(message);
```

---

## 🤖 アシスタント
*2024/12/19 0:32:16*

From the information provided, the root cause of the error seems to be related to how `json_serializable` handles specific types or structures in the generated Dart code. Let's pinpoint the issues:

---

### **Potential Issues in the Code**

#### **1. `Uint8Array` and `PhotoDTOPhotoData`**
- **Code Fragment**:
  ```dart
  @freezed
  class Uint8Array with _$Uint8Array {
    factory Uint8Array() = _Uint8Array;

    factory Uint8Array.fromJson(Map<String, dynamic> jsonMap) =>
        _$Uint8ArrayFromJson(jsonMap);
  }

  @freezed
  class PhotoDTOPhotoData with _$PhotoDTOPhotoData {
    factory PhotoDTOPhotoData() = _PhotoDTOPhotoData;

    factory PhotoDTOPhotoData.fromJson(Map<String, dynamic> jsonMap) =>
        _$PhotoDTOPhotoDataFromJson(jsonMap);
  }
  ```
- **Problem**:
  - Both `Uint8Array` and `PhotoDTOPhotoData` are defined as empty classes with no fields, which may not generate valid serialization/deserialization code.
  - This structure likely corresponds to unsupported types in the OpenAPI spec, such as `format: binary` or empty object definitions.

- **Solution**:
  - Modify `Uint8Array` and `PhotoDTOPhotoData` to include at least one recognizable field or use `List<int>` for binary data:
    ```dart
    @freezed
    class Uint8Array with _$Uint8Array {
      factory Uint8Array({required List<int> data}) = _Uint8Array;

      factory Uint8Array.fromJson(Map<String, dynamic> jsonMap) =>
          _$Uint8ArrayFromJson(jsonMap);
    }

    @freezed
    class PhotoDTOPhotoData with _$PhotoDTOPhotoData {
      factory PhotoDTOPhotoData({required List<int> data}) = _PhotoDTOPhotoData;

      factory PhotoDTOPhotoData.fromJson(Map<String, dynamic> jsonMap) =>
          _$PhotoDTOPhotoDataFromJson(jsonMap);
    }
    ```

---

#### **2. `allOf` in OpenAPI Spec**
- **Generated Code**:
  ```dart
  @freezed
  class GuildInfoResponseDtoData with _$GuildInfoResponseDtoData {
    factory GuildInfoResponseDtoData({
      @JsonKey(name: 'guildId') required String? guildId,
      ...
    }) = _GuildInfoResponseDtoData;

    factory GuildInfoResponseDtoData.fromJson(Map<String, dynamic> jsonMap) =>
        _$GuildInfoResponseDtoDataFromJson(jsonMap);
  }
  ```
  - This structure seems to have been generated from OpenAPI's `allOf`.

- **Problem**:
  - OpenAPI's `allOf` merges multiple schemas, which might confuse `json_serializable` if the generator didn't flatten the fields into one structure.

- **Solution**:
  - Avoid using `allOf` in OpenAPI. Replace it with flattened schema definitions.

---

#### **3. Nullable Enums**
- **Code Fragment**:
  ```dart
  @JsonKey(name: 'avatar') required AccountDtoAvatar? avatar,
  ```
- **Problem**:
  - Nullable enums like `AccountDtoAvatar?` might cause issues if the generator does not expect null values.

- **Solution**:
  - Ensure that the enum fields are non-nullable if required, or explicitly handle `null` in your code.

---

#### **4. Type Casting Issues in API Methods**
- **Example**:
  ```dart
  final response = await dio.getUri<List<dynamic>>(uri);
  final parsed = response.data!
      .map((dynamic e) => AccountDto.fromJson(e as Map<String, dynamic>))
      .toList();
  ```
- **Problem**:
  - Casting `List<dynamic>` to `Map<String, dynamic>` assumes that the data returned from the API always matches the expected schema.

- **Solution**:
  - Validate API responses before casting, or use safer casting techniques:
    ```dart
    final data = response.data;
    if (data is List) {
      final parsed = data
          .map((e) => AccountDto.fromJson(e as Map<String, dynamic>))
          .toList();
    } else {
      throw StateError('Invalid data format');
    }
    ```

---

### **Next Steps**
1. **Update the OpenAPI Spec**
   - Replace `allOf` with flattened fields.
   - Use `type: array` with `items: {type: integer, format: uint8}` for binary data.

2. **Re-run the Code Generation**
   - Ensure the updated OpenAPI spec generates compatible Dart code.

3. **Manually Adjust Generated Code**
   - If updates to the OpenAPI spec are not feasible, manually fix issues in the generated Dart code as described above.

4. **Test the Changes**
   - Test serialization and API calls to ensure all cases are handled correctly.

Let me know if you need further clarification or help with any specific part!

---
