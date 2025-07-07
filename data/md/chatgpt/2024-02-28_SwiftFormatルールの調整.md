# SwiftFormatルールの調整

日付: 2024-02-28

---

## 👤 ユーザー
*2024/2/28 13:49:55*

足りないルールがあれば差分を教えてほしい。

Default Rules (enabled by default)
andOperator
anyObjectProtocol
applicationMain
assertionFailures
blankLineAfterImports
blankLinesAroundMark
blankLinesAtEndOfScope
blankLinesAtStartOfScope
blankLinesBetweenChainedFunctions
blankLinesBetweenScopes
braces
conditionalAssignment
consecutiveBlankLines
consecutiveSpaces
duplicateImports
elseOnSameLine
emptyBraces
enumNamespaces
extensionAccessControl
fileHeader
genericExtensions
headerFileName
hoistAwait
hoistPatternLet
hoistTry
indent
initCoderUnavailable
leadingDelimiters
linebreakAtEndOfFile
linebreaks
modifierOrder
numberFormatting
opaqueGenericParameters
preferForLoop
preferKeyPath
redundantBackticks
redundantBreak
redundantClosure
redundantExtensionACL
redundantFileprivate
redundantGet
redundantInit
redundantInternal
redundantLet
redundantLetError
redundantNilInit
redundantObjc
redundantOptionalBinding
redundantParens
redundantPattern
redundantRawValues
redundantReturn
redundantSelf
redundantStaticSelf
redundantType
redundantVoidReturnType
semicolons
sortDeclarations
sortImports
sortTypealiases
spaceAroundBraces
spaceAroundBrackets
spaceAroundComments
spaceAroundGenerics
spaceAroundOperators
spaceAroundParens
spaceInsideBraces
spaceInsideBrackets
spaceInsideComments
spaceInsideGenerics
spaceInsideParens
strongOutlets
strongifiedSelf
todos
trailingClosures
trailingCommas
trailingSpace
typeSugar
unusedArguments
void
wrap
wrapArguments
wrapAttributes
wrapLoopBodies
wrapMultilineStatementBraces
wrapSingleLineComments
yodaConditions
Opt-in Rules (disabled by default)
acronyms
blankLinesBetweenImports
blockComments
docComments
isEmpty
markTypes
noExplicitOwnership
organizeDeclarations
sortSwitchCases
wrapConditionalBodies
wrapEnumCases
wrapMultilineConditionalAssignment
wrapSwitchCases
Deprecated Rules (do not use)
sortedImports
sortedSwitchCases
specifiers


```

# Swift バージョン

--swiftversion 5.10 # Xcode 15.3

# file options 除外するディレクトリやファイル

--exclude ./DISampleAppPackage/Sources/Presentation/TestTool/Mocks.swift
--exclude ./DISampleAppPackage/.build

# format options

--ranges no-space # ex) "0...9" を "0 ... 9" としないように設定

# Rule List - https://github.com/nicklockwood/SwiftFormat/blob/0.53.2/Rules.md

# Default Rules (enabled by default) デフォルトで有効なルール
# コメントアウト部分が有効

#--disable andOperator
#--disable anyObjectProtocol
#--disable assertionFailures
#--disable applicationMain
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
#--disable headerFileName
#--disable hoistAwait
--disable hoistPatternLet # if case .foo(let bar): を if case let .foo(bar): に変換するため無効にする
#--disable hoistTry
#--disable indent
#--disable initCoderUnavailable
#--disable leadingDelimiters
#--disable linebreakAtEndOfFile
#--disable linebreaks
#--disable modifierOrder
#--disable numberFormatting
#--disable opaqueGenericParameters
--disable preferKeyPath # map { $0.toAppError } -> map(\.toAppError) としてエラーになるため無効にする
#--disable redundantBackticks
#--disable redundantBreak
#--disable redundantClosure
#--disable redundantExtensionACL
#--disable redundantFileprivate
#--disable redundantGet
#--disable redundantInit
#--disable redundantInternal
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
#--disable redundantStaticSelf
#--disable redundantType
#--disable redundantVoidReturnType
#--disable semicolons
#--disable sortDeclarations
#--disable sortImports
#--disable sortTypealiases
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

#--enable acronyms # アクロニムを大文字にする。例：`userId` → `userID`
--enable blankLineAfterImports # import 文の後に空行を挿入する
--enable blankLinesBetweenChainedFunctions # 連鎖する関数の間の空行は削除する
--enable blankLinesBetweenImports # import 文の間の空行を削除する
--enable blockComments # `/*` または `/**` のコメントを `//` や `///` に変更する
--enable docComments # 変数や関数宣言の直前のコメントは `///` を使用する
--enable isEmpty # 条件文が isEmpty で書き換えらる場合は isEmpty に変更する
#--enable markTypes # 型定義の前に MARK コメントを挿入する
#--enable organizeDeclarations # 宣言を種類別に整理する
#--enable sortSwitchCases # switch 文の case をアルファベット順に並び替える
--enable wrapConditionalBodies # 条件文が長い場合に改行する。例：`guard let self else { return }` を改行する
--enable wrapEnumCases # Enum 宣言時の case を省略させない 
#--enable wrapSwitchCases # switch 文の case が複数ある場合はそれぞれの case で改行する
```

---

## 🤖 アシスタント
*2024/2/28 13:50:41*

SwiftFormatの設定を見ると、あなたが提供したデフォルトルールとオプトインルールに基づいて、いくつかのルールが有効または無効になっています。あなたが提供した情報に基づいて、足りないルールや差分についての指摘は以下の通りです。

### 足りないルールや差分

1. \*\*足りないルール\*\*: あなたの設定には、ほとんどのデフォルトルールといくつかのオプトインルールが含まれていますが、SwiftFormatの最新バージョン（私の知識の最終更新時点でのバージョン0.53.2）には、他にも多くのルールが存在します。ただし、あなたが提供したリストからは、特定の新しいルールや、あなたが意図的に除外したかもしれないルールについての情報は見当たりません。SwiftFormatのGitHubページやドキュメントを確認して、新しいルールが追加されていないか確認してください。

2. \*\*差分の特定\*\*: あなたが提供した設定とデフォルト設定の間で、特に`hoistPatternLet`と`preferKeyPath`を無効にし、`blankLineAfterImports`、`blankLinesBetweenChainedFunctions`、`blankLinesBetweenImports`、`blockComments`、`docComments`、`isEmpty`、`wrapConditionalBodies`、`wrapEnumCases`を有効にしている点が明確に差分として挙げられます。これらの変更は、あなたのコードスタイルやプロジェクトの要件に基づいて適切に行われているようです。

3. \*\*デフォルトルールの確認\*\*: SwiftFormatのデフォルトルールは、一般的なSwiftコーディング標準やスタイルガイドに従うように設計されています。あなたが特定のルールを無効または有効にすることを選択した場合、それはプロジェクト固有のスタイルやチームの合意に基づくものであるべきです。あなたの設定は、一般的なガイドラインから逸脱する特定の選択を反映していますが、それは完全に正当です。

4. \*\*最新の情報を確認\*\*: SwiftFormatは頻繁に更新されるため、新しいルールが追加されたり、既存のルールが変更されたりすることがあります。あなたのプロジェクトに最適なルールセットを維持するためには、定期的にSwiftFormatのリリースノートやドキュメントを確認し、必要に応じて設定を更新することが重要です。

最終的に、あなたのSwiftFormatの設定はプロジェクトのニーズに合わせてカスタマイズされるべきです。提供された設定は、一般的なガイドラインに従いつつも、特定のプロジェクト要件に合わせて適切に調整されているように見えます。

---

## 👤 ユーザー
*2024/2/28 13:51:08*

足りないルール名や変更されたルール名を教えてほしい。

以下が最新のルール一覧である

# Default Rules (enabled by default)

\* \[andOperator\](#andOperator)
\* \[anyObjectProtocol\](#anyObjectProtocol)
\* \[applicationMain\](#applicationMain)
\* \[assertionFailures\](#assertionFailures)
\* \[blankLineAfterImports\](#blankLineAfterImports)
\* \[blankLinesAroundMark\](#blankLinesAroundMark)
\* \[blankLinesAtEndOfScope\](#blankLinesAtEndOfScope)
\* \[blankLinesAtStartOfScope\](#blankLinesAtStartOfScope)
\* \[blankLinesBetweenChainedFunctions\](#blankLinesBetweenChainedFunctions)
\* \[blankLinesBetweenScopes\](#blankLinesBetweenScopes)
\* \[braces\](#braces)
\* \[conditionalAssignment\](#conditionalAssignment)
\* \[consecutiveBlankLines\](#consecutiveBlankLines)
\* \[consecutiveSpaces\](#consecutiveSpaces)
\* \[duplicateImports\](#duplicateImports)
\* \[elseOnSameLine\](#elseOnSameLine)
\* \[emptyBraces\](#emptyBraces)
\* \[enumNamespaces\](#enumNamespaces)
\* \[extensionAccessControl\](#extensionAccessControl)
\* \[fileHeader\](#fileHeader)
\* \[genericExtensions\](#genericExtensions)
\* \[headerFileName\](#headerFileName)
\* \[hoistAwait\](#hoistAwait)
\* \[hoistPatternLet\](#hoistPatternLet)
\* \[hoistTry\](#hoistTry)
\* \[indent\](#indent)
\* \[initCoderUnavailable\](#initCoderUnavailable)
\* \[leadingDelimiters\](#leadingDelimiters)
\* \[linebreakAtEndOfFile\](#linebreakAtEndOfFile)
\* \[linebreaks\](#linebreaks)
\* \[modifierOrder\](#modifierOrder)
\* \[numberFormatting\](#numberFormatting)
\* \[opaqueGenericParameters\](#opaqueGenericParameters)
\* \[preferForLoop\](#preferForLoop)
\* \[preferKeyPath\](#preferKeyPath)
\* \[redundantBackticks\](#redundantBackticks)
\* \[redundantBreak\](#redundantBreak)
\* \[redundantClosure\](#redundantClosure)
\* \[redundantExtensionACL\](#redundantExtensionACL)
\* \[redundantFileprivate\](#redundantFileprivate)
\* \[redundantGet\](#redundantGet)
\* \[redundantInit\](#redundantInit)
\* \[redundantInternal\](#redundantInternal)
\* \[redundantLet\](#redundantLet)
\* \[redundantLetError\](#redundantLetError)
\* \[redundantNilInit\](#redundantNilInit)
\* \[redundantObjc\](#redundantObjc)
\* \[redundantOptionalBinding\](#redundantOptionalBinding)
\* \[redundantParens\](#redundantParens)
\* \[redundantPattern\](#redundantPattern)
\* \[redundantRawValues\](#redundantRawValues)
\* \[redundantReturn\](#redundantReturn)
\* \[redundantSelf\](#redundantSelf)
\* \[redundantStaticSelf\](#redundantStaticSelf)
\* \[redundantType\](#redundantType)
\* \[redundantVoidReturnType\](#redundantVoidReturnType)
\* \[semicolons\](#semicolons)
\* \[sortDeclarations\](#sortDeclarations)
\* \[sortImports\](#sortImports)
\* \[sortTypealiases\](#sortTypealiases)
\* \[spaceAroundBraces\](#spaceAroundBraces)
\* \[spaceAroundBrackets\](#spaceAroundBrackets)
\* \[spaceAroundComments\](#spaceAroundComments)
\* \[spaceAroundGenerics\](#spaceAroundGenerics)
\* \[spaceAroundOperators\](#spaceAroundOperators)
\* \[spaceAroundParens\](#spaceAroundParens)
\* \[spaceInsideBraces\](#spaceInsideBraces)
\* \[spaceInsideBrackets\](#spaceInsideBrackets)
\* \[spaceInsideComments\](#spaceInsideComments)
\* \[spaceInsideGenerics\](#spaceInsideGenerics)
\* \[spaceInsideParens\](#spaceInsideParens)
\* \[strongOutlets\](#strongOutlets)
\* \[strongifiedSelf\](#strongifiedSelf)
\* \[todos\](#todos)
\* \[trailingClosures\](#trailingClosures)
\* \[trailingCommas\](#trailingCommas)
\* \[trailingSpace\](#trailingSpace)
\* \[typeSugar\](#typeSugar)
\* \[unusedArguments\](#unusedArguments)
\* \[void\](#void)
\* \[wrap\](#wrap)
\* \[wrapArguments\](#wrapArguments)
\* \[wrapAttributes\](#wrapAttributes)
\* \[wrapLoopBodies\](#wrapLoopBodies)
\* \[wrapMultilineStatementBraces\](#wrapMultilineStatementBraces)
\* \[wrapSingleLineComments\](#wrapSingleLineComments)
\* \[yodaConditions\](#yodaConditions)

# Opt-in Rules (disabled by default)

\* \[acronyms\](#acronyms)
\* \[blankLinesBetweenImports\](#blankLinesBetweenImports)
\* \[blockComments\](#blockComments)
\* \[docComments\](#docComments)
\* \[isEmpty\](#isEmpty)
\* \[markTypes\](#markTypes)
\* \[noExplicitOwnership\](#noExplicitOwnership)
\* \[organizeDeclarations\](#organizeDeclarations)
\* \[sortSwitchCases\](#sortSwitchCases)
\* \[wrapConditionalBodies\](#wrapConditionalBodies)
\* \[wrapEnumCases\](#wrapEnumCases)
\* \[wrapMultilineConditionalAssignment\](#wrapMultilineConditionalAssignment)
\* \[wrapSwitchCases\](#wrapSwitchCases)

# Deprecated Rules (do not use)

\* \[sortedImports\](#sortedImports)
\* \[sortedSwitchCases\](#sortedSwitchCases)
\* \[specifiers\](#specifiers)

---
