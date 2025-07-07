# Changing Flag Button Text Based on State

日付: 2025-04-15

---

## 👤 ユーザー
*2025/4/15 10:17:13*

\* Put up this flag をフラグの状態によって変えたいと思います。
   \* 構築可能: Put up this flag
   \* 建設済み: This flag is constructed （非活性）
   \* 破壊後: This flag is destroyed （非活性）

---

## 👤 ユーザー
*2025/4/15 10:18:21*

\* Put up this flag をフラグの状態によって変えたいと思います。
   \* 構築可能: Put up this flag
   \* 建設済み: This flag is constructed （非活性）
   \* 破壊後: This flag is destroyed （非活性）

/// FlagDTO
///
/// Properties:
/// \* \[flagId\] - NFT flag ID
/// \* \[spotId\] - Spot ID
/// \* \[tokenId\] - Token ID of NFT flag
/// \* \[flagName\] - NFT flag name
/// \* \[flagDescription\] - NFT flag description
/// \* \[flagImage\] - Image of NFT flag explorer (URL)
/// \* \[flagCategory\] - Category of NFT flag
/// \* \[flagStatus\] - Status of NFT flag
/// \* \[level\] - Current level of NFT flag
/// \* \[fullEndurance\] -  Full endurance of NFT flag
/// \* \[endurance\] - Current endurance of NFT flag
/// \* \[defended\] - The number of defenses against attacks from other guilds
/// \* \[rarity\] - Rarity of NFT flag
/// \* \[flagIncome\] - Income of NFT flag
@BuiltValue()
abstract class FlagDTO implements Built&lt;FlagDTO, FlagDTOBuilder&gt; {
  /// NFT flag ID
  @BuiltValueField(wireName: r'flagId')
  String get flagId;

  /// Spot ID
  @BuiltValueField(wireName: r'spotId')
  String? get spotId;

  /// Token ID of NFT flag
  @BuiltValueField(wireName: r'tokenId')
  String get tokenId;

  /// NFT flag name
  @BuiltValueField(wireName: r'flagName')
  String get flagName;

  /// NFT flag description
  @BuiltValueField(wireName: r'flagDescription')
  String? get flagDescription;

  /// Image of NFT flag explorer (URL)
  @BuiltValueField(wireName: r'flagImage')
  String get flagImage;

  /// Category of NFT flag
  @BuiltValueField(wireName: r'flagCategory')
  FlagCategory get flagCategory;
  // enum flagCategoryEnum {  NORMAL,  SPECIAL,  };

  /// Status of NFT flag
  @BuiltValueField(wireName: r'flagStatus')
  FlagStatus get flagStatus;
  // enum flagStatusEnum {  NEW,  CONSTRUCTED,  DESTROYED,  };

  /// Current level of NFT flag
  @BuiltValueField(wireName: r'level')
  num get level;

  ///  Full endurance of NFT flag
  @BuiltValueField(wireName: r'fullEndurance')
  num get fullEndurance;

  /// Current endurance of NFT flag
  @BuiltValueField(wireName: r'endurance')
  num get endurance;

  /// The number of defenses against attacks from other guilds
  @BuiltValueField(wireName: r'defended')
  num get defended;

  /// Rarity of NFT flag
  @BuiltValueField(wireName: r'rarity')
  Rarity get rarity;
  // enum rarityEnum {  CASUAL,  COMMON,  UNCOMMON,  RARE,  EPIC,  LEGENDARY,  };

  /// Income of NFT flag
  @BuiltValueField(wireName: r'flagIncome')
  num get flagIncome;

  FlagDTO.\_();

  factory FlagDTO(\[void updates(FlagDTOBuilder b)\]) = \_$FlagDTO;

  @BuiltValueHook(initializeBuilder: true)
  static void \_defaults(FlagDTOBuilder b) =&gt; b;

  @BuiltValueSerializer(custom: true)
  static Serializer&lt;FlagDTO&gt; get serializer =&gt; \_$FlagDTOSerializer();
}
class FlagStatus extends EnumClass {
  @BuiltValueEnumConst(wireName: r'NEW')
  static const FlagStatus NEW = \_$NEW;
  @BuiltValueEnumConst(wireName: r'CONSTRUCTED')
  static const FlagStatus CONSTRUCTED = \_$CONSTRUCTED;
  @BuiltValueEnumConst(wireName: r'DESTROYED')
  static const FlagStatus DESTROYED = \_$DESTROYED;

  static Serializer&lt;FlagStatus&gt; get serializer =&gt; \_$flagStatusSerializer;

  const FlagStatus.\_(String name) : super(name);

  static BuiltSet&lt;FlagStatus&gt; get values =&gt; \_$values;
  static FlagStatus valueOf(String name) =&gt; \_$valueOf(name);
}

---

## 🤖 アシスタント
*2025/4/15 10:17:45*

I'll help you modify the code to change the "Put up this flag" button text based on the flag's state. Let me analyze the code first to understand how the flag state is currently managed.
```
Analysis Tool outputs from the web feature preview aren’t yet supported on mobile.
```



Based on my analysis, I'll modify the code to change the "Put up this flag" button text according to the flag's state. Since the current code doesn't explicitly show how flag states are tracked, I'll add that functionality.
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```

---

## 🤖 アシスタント
*2025/4/15 10:19:01*

I'll update the code to change the button text and state based on the flag's status. Let me analyze the requirements first.

The button text should be:
- "Put up this flag" when it can be constructed (active)
- "This flag is constructed" when already constructed (disabled)
- "This flag is destroyed" when destroyed (disabled)

Here's the implementation:
```
Viewing artifacts created via the Analysis Tool web feature preview isn’t yet supported on mobile.
```



I've updated the FlagListPage widget to change the button text and state based on the flag's status. Here's what I modified:

1. Added a Builder widget in the bottomNavigationBar to access the current flag state
2. Determined the selected flag from the flagListAsyncValue
3. Created variables for button text and enabled state
4. Added a switch statement to set these variables based on the flag's status:
   - For NEW flags: "Put up this flag" (enabled when not loading)
   - For CONSTRUCTED flags: "This flag is constructed" (disabled)
   - For DESTROYED flags: "This flag is destroyed" (disabled)
5. Applied these variables to the ElevatedButton properties

The implementation preserves all the existing functionality while adding the requested status-based button behavior. Now users will see appropriate button text and state depending on whether the flag is new, already constructed, or destroyed.

---
