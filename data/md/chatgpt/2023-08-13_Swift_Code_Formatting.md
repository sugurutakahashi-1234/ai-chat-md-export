# Swift Code Formatting

日付: 2023-08-13

---

## 👤 ユーザー
*2023/8/13 20:19:02*

今の設定は以下です。

```
# Default Rules (enabled by default) デフォルトで有効なルール
# コメントアウト部分が有効

#--disable andOperator
#--disable anyObjectProtocol
#--disable assertionFailures
#--disable blankLinesAroundMark
#--disable blankLinesAtEndOfScope
#--disable blankLinesAtStartOfScope
#--disable blankLinesBetweenScopes
#--disable braces
#--disable conditionalAssignment
#--disable consecutiveBlankLines
#--disable consecutiveSpaces
#--disable duplicateImports
#--disable elseOnSameLine
#--disable emptyBraces
#--disable enumNamespaces
#--disable extensionAccessControl
#--disable fileHeader
#--disable genericExtensions
#--disable hoistAwait
--disable hoistPatternLet # if case .foo(let bar): -> if case let .foo(bar):
#--disable hoistTry
#--disable indent
#--disable initCoderUnavailable
#--disable leadingDelimiters
#--disable linebreakAtEndOfFile
#--disable linebreaks
#--disable modifierOrder
#--disable numberFormatting
#--disable opaqueGenericParameters
--disable preferKeyPath # map { $0.asAppError } -> map(\.asAppError) としてエラーになるため無効にする
#--disable redundantBackticks
#--disable redundantBreak
#--disable redundantClosure
#--disable redundantExtensionACL
#--disable redundantFileprivate
#--disable redundantGet
#--disable redundantInit
#--disable redundantLet
#--disable redundantLetError
#--disable redundantNilInit
#--disable redundantObjc
#--disable redundantOptionalBinding
#--disable redundantParens
#--disable redundantPattern
#--disable redundantRawValues
#--disable redundantReturn
#--disable redundantSelf
#--disable redundantType
#--disable redundantVoidReturnType
#--disable semicolons
#--disable sortDeclarations
#--disable sortedImports
#--disable spaceAroundBraces
#--disable spaceAroundBrackets
#--disable spaceAroundComments
#--disable spaceAroundGenerics
#--disable spaceAroundOperators
#--disable spaceAroundParens
#--disable spaceInsideBraces
#--disable spaceInsideBrackets
#--disable spaceInsideComments
#--disable spaceInsideGenerics
#--disable spaceInsideParens
#--disable strongOutlets
#--disable strongifiedSelf
#--disable todos
#--disable trailingClosures
#--disable trailingCommas
#--disable trailingSpace
#--disable typeSugar
#--disable unusedArguments
#--disable void
#--disable wrap
#--disable wrapArguments
#--disable wrapAttributes
#--disable wrapMultilineStatementBraces
#--disable wrapSingleLineComments
#--disable yodaConditions

# Opt-in Rules (disabled by default) デフォルトで無効なルール
# コメントアウト部分は無効

#--enable acronyms
#--enable blankLineAfterImports
#--enable blankLinesBetweenImports
#--enable blockComments
#--enable docComments
#--enable isEmpty
#--enable markTypes
#--enable organizeDeclarations
#--enable sortedSwitchCases
#--enable wrapConditionalBodies
--enable wrapEnumCases # Enum 宣言時の case を省略させない 
#--enable wrapSwitchCases
```

---

## 🤖 アシスタント
*2023/8/13 20:19:41*

この設定は、Swift のコードの書式設定やリントのルールに関するものと思われます。具体的には、SwiftFormat や SwiftLint のようなツールで使われる設定で、どのルールを有効にし、どのルールを無効にするかを定義しています。

以下はこの設定から読み取れる内容になります：

1. **Default Rules (デフォルトのルール)**:
    - デフォルトで有効になっているルール群ですが、その中で特に以下のルールが無効化されています：
        1. `hoistPatternLet`: このルールは、`if case .foo(let bar):` というパターンを `if case let .foo(bar):` と書き換えるものですが、無効化されています。
        2. `preferKeyPath`: このルールは、`map { $0.asAppError }` を `map(\.asAppError)` に書き換えるものですが、エラーが出る可能性があるため無効化されています。

2. **Opt-in Rules (オプトインのルール)**:
    - デフォルトでは無効になっているルール群ですが、その中で以下のルールが有効化されています：
        1. `wrapEnumCases`: このルールは、Enum の宣言時に `case` を省略させないようにするものです。

その他のコメントアウトされているルールは、現在の設定では変更が加えられていません。それは、デフォルトの状態（有効または無効）が維持されていることを意味します。

この設定に基づいて、Swift のコードが整形される際に、どのような書式ルールが適用されるか、または適用されないかが決まります。

---

## 👤 ユーザー
*2023/8/13 20:19:44*

足りないものがあったら追加してほしい。

```
# Default Rules (enabled by default)

* [andOperator](#andOperator)
* [anyObjectProtocol](#anyObjectProtocol)
* [assertionFailures](#assertionFailures)
* [blankLinesAroundMark](#blankLinesAroundMark)
* [blankLinesAtEndOfScope](#blankLinesAtEndOfScope)
* [blankLinesAtStartOfScope](#blankLinesAtStartOfScope)
* [blankLinesBetweenScopes](#blankLinesBetweenScopes)
* [braces](#braces)
* [conditionalAssignment](#conditionalAssignment)
* [consecutiveBlankLines](#consecutiveBlankLines)
* [consecutiveSpaces](#consecutiveSpaces)
* [duplicateImports](#duplicateImports)
* [elseOnSameLine](#elseOnSameLine)
* [emptyBraces](#emptyBraces)
* [enumNamespaces](#enumNamespaces)
* [extensionAccessControl](#extensionAccessControl)
* [fileHeader](#fileHeader)
* [genericExtensions](#genericExtensions)
* [hoistAwait](#hoistAwait)
* [hoistPatternLet](#hoistPatternLet)
* [hoistTry](#hoistTry)
* [indent](#indent)
* [initCoderUnavailable](#initCoderUnavailable)
* [leadingDelimiters](#leadingDelimiters)
* [linebreakAtEndOfFile](#linebreakAtEndOfFile)
* [linebreaks](#linebreaks)
* [modifierOrder](#modifierOrder)
* [numberFormatting](#numberFormatting)
* [opaqueGenericParameters](#opaqueGenericParameters)
* [preferKeyPath](#preferKeyPath)
* [redundantBackticks](#redundantBackticks)
* [redundantBreak](#redundantBreak)
* [redundantClosure](#redundantClosure)
* [redundantExtensionACL](#redundantExtensionACL)
* [redundantFileprivate](#redundantFileprivate)
* [redundantGet](#redundantGet)
* [redundantInit](#redundantInit)
* [redundantLet](#redundantLet)
* [redundantLetError](#redundantLetError)
* [redundantNilInit](#redundantNilInit)
* [redundantObjc](#redundantObjc)
* [redundantOptionalBinding](#redundantOptionalBinding)
* [redundantParens](#redundantParens)
* [redundantPattern](#redundantPattern)
* [redundantRawValues](#redundantRawValues)
* [redundantReturn](#redundantReturn)
* [redundantSelf](#redundantSelf)
* [redundantType](#redundantType)
* [redundantVoidReturnType](#redundantVoidReturnType)
* [semicolons](#semicolons)
* [sortDeclarations](#sortDeclarations)
* [sortedImports](#sortedImports)
* [spaceAroundBraces](#spaceAroundBraces)
* [spaceAroundBrackets](#spaceAroundBrackets)
* [spaceAroundComments](#spaceAroundComments)
* [spaceAroundGenerics](#spaceAroundGenerics)
* [spaceAroundOperators](#spaceAroundOperators)
* [spaceAroundParens](#spaceAroundParens)
* [spaceInsideBraces](#spaceInsideBraces)
* [spaceInsideBrackets](#spaceInsideBrackets)
* [spaceInsideComments](#spaceInsideComments)
* [spaceInsideGenerics](#spaceInsideGenerics)
* [spaceInsideParens](#spaceInsideParens)
* [strongOutlets](#strongOutlets)
* [strongifiedSelf](#strongifiedSelf)
* [todos](#todos)
* [trailingClosures](#trailingClosures)
* [trailingCommas](#trailingCommas)
* [trailingSpace](#trailingSpace)
* [typeSugar](#typeSugar)
* [unusedArguments](#unusedArguments)
* [void](#void)
* [wrap](#wrap)
* [wrapArguments](#wrapArguments)
* [wrapAttributes](#wrapAttributes)
* [wrapMultilineStatementBraces](#wrapMultilineStatementBraces)
* [wrapSingleLineComments](#wrapSingleLineComments)
* [yodaConditions](#yodaConditions)

# Opt-in Rules (disabled by default)

* [acronyms](#acronyms)
* [blankLineAfterImports](#blankLineAfterImports)
* [blankLinesBetweenImports](#blankLinesBetweenImports)
* [blockComments](#blockComments)
* [docComments](#docComments)
* [isEmpty](#isEmpty)
* [markTypes](#markTypes)
* [organizeDeclarations](#organizeDeclarations)
* [sortedSwitchCases](#sortedSwitchCases)
* [wrapConditionalBodies](#wrapConditionalBodies)
* [wrapEnumCases](#wrapEnumCases)
* [wrapSwitchCases](#wrapSwitchCases)
```

---

## 🤖 アシスタント
*2023/8/13 20:19:51*

あなたが提供したリストを検証した結果、前回の設定から欠落しているルールを以下に示します。

### Default Rules (enabled by default):

なし

### Opt-in Rules (disabled by default):

なし

すべてのルールがリストに含まれており、足りないルールはありませんでした。安心してご使用いただけます。

---

## 👤 ユーザー
*2023/8/13 20:20:14*

逆で、追加が必要なものを教えて欲しい

---

## 🤖 アシスタント
*2023/8/13 20:21:38*

申し訳ございません、誤解してしまいました。

前回の設定から、新たに追加するべきルールを以下にリストアップします。

### Default Rules (enabled by default):

- [ ] `[andOperator](#andOperator)`
- [ ] `[anyObjectProtocol](#anyObjectProtocol)`
- [ ] `[assertionFailures](#assertionFailures)`
- [ ] `[blankLinesAroundMark](#blankLinesAroundMark)`
- [ ] `[blankLinesAtEndOfScope](#blankLinesAtEndOfScope)`
- [ ] `[blankLinesAtStartOfScope](#blankLinesAtStartOfScope)`
- [ ] `[blankLinesBetweenScopes](#blankLinesBetweenScopes)`
- [ ] `[braces](#braces)`
- [ ] `[conditionalAssignment](#conditionalAssignment)`
- [ ] `[consecutiveBlankLines](#consecutiveBlankLines)`
- [ ] `[consecutiveSpaces](#consecutiveSpaces)`
- [ ] `[duplicateImports](#duplicateImports)`
- [ ] `[elseOnSameLine](#elseOnSameLine)`
- [ ] `[emptyBraces](#emptyBraces)`
- [ ] `[enumNamespaces](#enumNamespaces)`
- [ ] `[extensionAccessControl](#extensionAccessControl)`
- [ ] `[fileHeader](#fileHeader)`
- [ ] `[genericExtensions](#genericExtensions)`
- [ ] `[hoistAwait](#hoistAwait)`
- [ ] `[hoistTry](#hoistTry)`
- [ ] `[indent](#indent)`
- [ ] `[initCoderUnavailable](#initCoderUnavailable)`
- [ ] `[leadingDelimiters](#leadingDelimiters)`
- [ ] `[linebreakAtEndOfFile](#linebreakAtEndOfFile)`
- [ ] `[linebreaks](#linebreaks)`
- [ ] `[modifierOrder](#modifierOrder)`
- [ ] `[numberFormatting](#numberFormatting)`
- [ ] `[opaqueGenericParameters](#opaqueGenericParameters)`
- [ ] `[redundantBackticks](#redundantBackticks)`
- [ ] `[redundantBreak](#redundantBreak)`
- [ ] `[redundantClosure](#redundantClosure)`
- [ ] `[redundantExtensionACL](#redundantExtensionACL)`
- [ ] `[redundantFileprivate](#redundantFileprivate)`
- [ ] `[redundantGet](#redundantGet)`
- [ ] `[redundantInit](#redundantInit)`
- [ ] `[redundantLetError](#redundantLetError)`
- [ ] `[redundantNilInit](#redundantNilInit)`
- [ ] `[redundantObjc](#redundantObjc)`
- [ ] `[redundantOptionalBinding](#redundantOptionalBinding)`
- [ ] `[redundantParens](#redundantParens)`
- [ ] `[redundantPattern](#redundantPattern)`
- [ ] `[redundantRawValues](#redundantRawValues)`
- [ ] `[redundantReturn](#redundantReturn)`
- [ ] `[redundantSelf](#redundantSelf)`
- [ ] `[redundantType](#redundantType)`
- [ ] `[redundantVoidReturnType](#redundantVoidReturnType)`
- [ ] `[semicolons](#semicolons)`
- [ ] `[sortedImports](#sortedImports)`
- [ ] `[spaceAroundBraces](#spaceAroundBraces)`
- [ ] `[spaceAroundBrackets](#spaceAroundBrackets)`
- [ ] `[spaceAroundComments](#spaceAroundComments)`
- [ ] `[spaceAroundGenerics](#spaceAroundGenerics)`
- [ ] `[spaceAroundOperators](#spaceAroundOperators)`
- [ ] `[spaceAroundParens](#spaceAroundParens)`
- [ ] `[spaceInsideBraces](#spaceInsideBraces)`
- [ ] `[spaceInsideBrackets](#spaceInsideBrackets)`
- [ ] `[spaceInsideComments](#spaceInsideComments)`
- [ ] `[spaceInsideGenerics](#spaceInsideGenerics)`
- [ ] `[spaceInsideParens](#spaceInsideParens)`
- [ ] `[strongOutlets](#strongOutlets)`
- [ ] `[strongifiedSelf](#strongifiedSelf)`
- [ ] `[todos](#todos)`
- [ ] `[trailingCommas](#trailingCommas)`
- [ ] `[trailingSpace](#trailingSpace)`
- [ ] `[typeSugar](#typeSugar)`
- [ ] `[unusedArguments](#unusedArguments)`
- [ ] `[void](#void)`
- [ ] `[wrapAttributes](#wrapAttributes)`
- [ ] `[wrapSingleLineComments](#wrapSingleLineComments)`
- [ ] `[yodaConditions](#yodaConditions)`

### Opt-in Rules (disabled by default):

- [ ] `[acronyms](#acronyms)`
- [ ] `[blockComments](#blockComments)`
- [ ] `[docComments](#docComments)`
- [ ] `[isEmpty](#isEmpty)`
- [ ] `[markTypes](#markTypes)`
- [ ] `[organizeDeclarations](#organizeDeclarations)`
- [ ] `[sortedSwitchCases](#sortedSwitchCases)`
- [ ] `[wrapSwitchCases](#wrapSwitchCases)`

こちらのリストは前回の設定と比較して新たに追加されるべきルールの一覧です。

---
