# Nullable false in enum

日付: 2024-12-18

---

## 👤 ユーザー
*2024/12/19 08:20:11*

openapiでenumって nullable false って意味あるの？

properties: {username: {type: string, description: 'The username of the account', example: user1, nullable: true}, email: {type: string, description: 'The email of the account', example: guild@gmail.com, nullable: true}, SNPITToken: {type: string, description: 'The SNPIT token to link the Guild account with SNPIT account', nullable: true}, Avatar: {type: string, description: 'Avatar shown in map', enum: [AVATAR1, AVATAR2, AVATAR3], nullable: false}}

---

## 🤖 アシスタント
*2024/12/19 08:20:21*

`nullable: false` in OpenAPI has a specific meaning, even when applied to an `enum`. Let's break it down:

### `nullable: false` with `enum`
- When `nullable: false` is specified for a property with an `enum`, the property **cannot** have a `null` value. 
- The value of the property must be one of the values listed in the `enum`.

### Why `nullable: false` Matters for Enums
Without explicitly setting `nullable: false`, some tools or libraries may assume that the property could be `null` in addition to any of the `enum` values. For example:
```yaml
enum: [AVATAR1, AVATAR2, AVATAR3]
nullable: false
```
This explicitly states that the only valid values are:
- `"AVATAR1"`
- `"AVATAR2"`
- `"AVATAR3"`

If `nullable: true` were used instead:
```yaml
enum: [AVATAR1, AVATAR2, AVATAR3]
nullable: true
```
Then the valid values would be:
- `"AVATAR1"`
- `"AVATAR2"`
- `"AVATAR3"`
- `null`

### Does `nullable: false` Add Value for Enums?
If the default behavior in your OpenAPI toolchain assumes non-nullable properties (i.e., properties are `nullable: false` by default), then explicitly adding `nullable: false` may not be strictly necessary. However:
- **Clarity**: Specifying `nullable: false` explicitly ensures that everyone (including tools and collaborators) knows that `null` is not an option.
- **Tool Compatibility**: Some tools may behave differently if `nullable` is not explicitly stated. Declaring it ensures consistency across tools.

### Practical Use
In your example:
```yaml
Avatar: {type: string, description: 'Avatar shown in map', enum: [AVATAR1, AVATAR2, AVATAR3], nullable: false}
```
This ensures that `Avatar`:
1. Must have a value.
2. The value must be one of `AVATAR1`, `AVATAR2`, or `AVATAR3`.
3. `null` is not an acceptable value.

This can be helpful when you need stricter validation in your API.

---
