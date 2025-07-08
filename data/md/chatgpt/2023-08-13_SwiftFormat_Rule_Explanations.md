# SwiftFormat Rule Explanations

日付: 2023-08-13

---

## 👤 ユーザー
*2023/8/13 20:22:36*

現在のSwif formatの設定項目は以下で在る。

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

---

## 🤖 アシスタント
*2023/8/13 20:23:12*

The list you've provided appears to be a detailed breakdown of rules for a Swift formatting tool, likely "SwiftFormat." SwiftFormat is a tool for automatically reformatting Swift code to conform to a set of style rules. The tool is extremely configurable and supports a broad array of rules.

Here's a brief summary of what some of these rules might mean based on their names and my knowledge as of my last update in September 2021:

### Default Rules:
- **andOperator**: Likely enforces style choices related to the use of the "and" operator.
- **assertionFailures**: Deals with how assertion failures are formatted.
- **blankLinesAroundMark**: Enforces blank lines around `MARK` comments.
- **braces**: Dictates the position and style of braces `{ }`.
- **consecutiveBlankLines**: Removes extra blank lines if there are more than one consecutively.
- **elseOnSameLine**: Ensures `else` statements appear on the same line as the preceding brace.
- **fileHeader**: Manages the file headers (like copyright notices).
- **indent**: Enforces consistent indentation.
- **modifierOrder**: Ensures that modifier keywords (like `public`, `static`, etc.) are in a consistent order.
- **redundantSelf**: Removes `self` where it's not needed.
- **semicolons**: Possibly removes extraneous semicolons or ensures there aren't multiple commands on one line separated by semicolons.
- **spaceAroundOperators**: Enforces spaces around operators (like `=`, `+`, etc.).
- **strongifiedSelf**: Enforces certain unwrapping styles for self in closures.
- **wrap**: Manages how lines are wrapped when they exceed a certain length.

### Opt-in Rules:
- **acronyms**: Might be related to the capitalization of acronyms in variable/function names.
- **blankLineAfterImports**: Ensures there's a blank line after import statements.
- **docComments**: Manages the style of documentation comments.
- **isEmpty**: Possibly promotes using `.isEmpty` over checking count or length properties.
- **sortedSwitchCases**: Ensures `switch` case statements are in a certain order.
- **wrapSwitchCases**: Manages how `switch` case lines are wrapped.

For a detailed description of each rule, you'd likely need to refer to SwiftFormat's official documentation or repository. Remember, the functionality of each rule might vary based on the version of the tool you're using, so always refer to the specific version's documentation for accurate details.

---

## 👤 ユーザー
*2023/8/13 20:23:26*

ここから、以下の一覧で上記に記載がないルールをおしえてほしい。

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
--disable hoistPatternLet # if case .foo(let bar): -&gt; if case let .foo(bar):
#--disable hoistTry
#--disable indent
#--disable initCoderUnavailable
#--disable leadingDelimiters
#--disable linebreakAtEndOfFile
#--disable linebreaks
#--disable modifierOrder
#--disable numberFormatting
#--disable opaqueGenericParameters
--disable preferKeyPath # map { $0.asAppError } -&gt; map(\.asAppError) としてエラーになるため無効にする
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

---

## 🤖 アシスタント
*2023/8/13 20:23:53*

上記のリストに基づいて、デフォルトで有効になっているルールのうち、コメントアウトが解除されているルールは以下の2つです：

1. `hoistPatternLet`: `if case .foo(let bar):` のようなコードを `if case let .foo(bar):` のように変更します。
2. `preferKeyPath`: このルールは、`map { $0.asAppError }` のようなコードを `map(\.asAppError)` としてエラーになるため無効にすることが記載されています。

デフォルトで無効なルールのうち、コメントアウトが解除されて有効にされているルールは以下の1つです：

1. `wrapEnumCases`: Enumの宣言時に `case` を省略させないために有効にされています。

これらのルールはSwiftFormatの動作をカスタマイズするためのもので、具体的な動作や影響についてはSwiftFormatの公式ドキュメントなどで詳しく確認することができます。

---
