# SwiftProtoBufオプションの生成

Date: 2023-06-28

---

## 👤 User
*2023-06-28 11:45:50*

SwiftProtoBufの生成コマンド時のオプションについて教えて欲しい
protoc --swift_out=. interaction.proto

---

## 🤖 Assistant
*2023-06-28 11:46:35*

`protoc --swift_out=. interaction.proto`というコマンドは、Protocol Buffers (ProtoBuf) のコンパイラ`protoc`を使用して、`.proto`ファイルをSwift言語のコードに変換するものです。ここでは `interaction.proto` というファイルを変換しています。`--swift_out=.`オプションは、生成されたSwiftコードを現在のディレクトリに出力することを指示しています。

しかし、SwiftでProtocol Buffersを使用するためには`SwiftProtobuf`プラグインが必要です。このプラグインを使って生成する場合、コマンドは以下のようになります：

`protoc --swift_opt=Visibility=Public --swift_out=. interaction.proto`

これらのオプションの詳細：

- `--swift_out=.`
  Swift用の出力を指定するオプション。ここでは現在のディレクトリ（`.`）に出力します。

- `--swift_opt=Visibility=Public`
  これは`SwiftProtobuf`プラグイン用のオプションで、生成される全てのSwiftの型のアクセスレベルを指定します。値`Public`は、生成された型がどのモジュールからでもアクセス可能であることを意味します。他の有効な値には`Internal`（デフォルト）、`Fileprivate`、および`Private`があります。

コマンド実行に必要な`protoc`と`SwiftProtobuf`プラグインは、適切なパスにインストールされ、パスが通っていることを確認してください。それぞれのインストールガイドは以下のリンクから参照できます：

- Protocol Buffers： https://developers.google.com/protocol-buffers
- SwiftProtobuf Plugin：https://github.com/apple/swift-protobuf

なお、現時点（2021年9月まで）の情報に基づいていますので、それ以降のバージョンではオプションや使用方法が変わっている可能性もあります。それぞれの公式ドキュメンテーションをご確認ください。

---

## 👤 User
*2023-06-28 11:46:49*

他にもオプションがあれば教えてほしい

---

## 🤖 Assistant
*2023-06-28 11:47:22*

SwiftProtobufのオプションは現在（2021年9月までの情報）主に2つあります：

1. `--swift_opt=Visibility=`
   これは上述の通り、生成される全てのSwiftの型のアクセスレベルを指定します。値は`Public`、`Internal`（デフォルト）、`Fileprivate`、および`Private`です。

2. `--swift_opt=ProtoPathModuleMappings=path/to/module_mappings.pb`
   このオプションは、`.proto`ファイルがSwiftモジュールとどのように関連付けられるかを定義するmodule mappingsファイルへのパスを指定します。これは主に、別のモジュールで定義された型を使用している`.proto`ファイルをコンパイルする場合に必要になります。

以上が、現時点（2021年9月まで）でのSwiftProtobufのオプションになります。なお、それ以降のバージョンではオプションや使用方法が変わっている可能性もあります。公式ドキュメンテーションをご確認ください。

なお、これらのオプションを使用する際には、`protoc`コマンドの一部として渡す必要があります。以下にその例を示します：

```bash
protoc --swift_opt=Visibility=Public --swift_out=. interaction.proto
protoc --swift_opt=ProtoPathModuleMappings=mappings.pb --swift_out=. interaction.proto
```

これらのコマンドは、それぞれ`Public`アクセスレベルのSwiftコードを生成し、`mappings.pb`に定義されたmodule mappingsを使用してSwiftコードを生成します。

---

## 👤 User
*2023-06-28 11:48:29*

これが最新のオプションについての説明らしい

The protoc-gen-swift program is a plugin to Google's protoc compiler that works with protoc to translate proto files into Swift code.

Getting Started
If you've worked with Protocol Buffers before, adding Swift support is very simple: you just need to build the protoc-gen-swift program and copy it into any directory in your PATH. The protoc program will find and use it automatically, allowing you to build Swift sources for your proto files. You will also, of course, need to add the corresponding Swift runtime library to your project.

System Requirements
To use Swift with Protocol buffers, you'll need:

A recent Swift 4.0 compiler that includes the Swift Package Manager. We recommend using the latest release build from Swift.org or the command-line tools included with the latest version of Xcode.

Google's protoc compiler. You can get recent versions from Google's github repository.

Build and Install
Building the plugin should be simple on any supported Swift platform:

$ git clone https://github.com/apple/swift-protobuf
$ cd swift-protobuf
$ swift build -c release
This will create a binary called protoc-gen-swift in the .build/release directory. To install, just copy this one executable anywhere in your PATH.

NOTE: The Swift runtime support is now included with macOS. If you are using old Xcode versions or are on older system versions, you might need to use also use --static-swift-stdlib with swift build.

Converting .proto files into Swift
To generate Swift output for your .proto files, you run the protoc command as usual, using the --swift_out=&lt;directory&gt; option:

$ protoc --swift_out=. my.proto
The protoc program will automatically look for protoc-gen-swift in your PATH and use it.

Each .proto input file will get translated to a corresponding .pb.swift file in the output directory.

How to Specify Code-Generation Options
The plugin tries to use reasonable default behaviors for the code it generates, but there are a few things that can be configured to specific needs.

You can use the --swift_opt argument to protoc to pass options to the Swift code generator as follows:

$ protoc --swift_opt=[NAME]=[VALUE] --swift_out:. foo/bar/*.proto mumble/*.proto
If you need to specify multiple options, you can use more than one --swift_opt argument:

$ protoc \
    --swift_opt=[NAME1]=[VALUE1] \
    --swift_opt=[NAME2]=[VALUE2] \
    --swift_out=. foo/bar/*.proto mumble/*.proto
NOTE: protoc 3.2.0 does not recognize --swift_opt if you rely on protoc-gen-swift being found on the PATH. To work around this, you need to explicitly add the argument --plugin=[PATH-TO-protoc-gen-swift] to the command line, then the --swift_opt argument will be understood. If you are using protoc 3.2.1 or later, then this workaround is not needed.

Generation Option: FileNaming - Naming of Generated Sources
By default, the paths to the proto files are maintained on the generated files. So if you pass foo/bar/my.proto, you will get foo/bar/my.pb.swift in the output directory. The Swift plugin supports an option to control the generated file names, the option is given as part of the --swift_opt argument like this:

$ protoc --swift_opt=FileNaming=[value] --swift_out=. foo/bar/*.proto mumble/*.proto
The possible values for FileNaming are:

FullPath (default): Like all other languages, "foo/bar/baz.proto" makes "foo/bar/baz.pb.swift.
PathToUnderscores: To help with things like the Swift Package Manager where someone might want all the files in one directory; "foo/bar/baz.proto" makes "foo_bar_baz.pb.swift".
DropPath: Drop the path from the input and just write all files into the output directory; "foo/bar/baz.proto" makes "baz.pb.swift".
Generation Option: Visibility - Visibility of Generated Types
By default, SwiftProtobuf does not specify a visibility for the generated types, methods, and properties. As a result, these will end up with the default (internal) access. You can change this with the Visibility option:

$ protoc --swift_opt=Visibility=[value] --swift_out=. foo/bar/*.proto mumble/*.proto
The possible values for Visibility are:

Internal (default): No visibility is set for the types, so they get the default internal visibility.
Public: The visibility on the types is set to public so the types will be exposed outside the module they are compiled into.
Generation Option: ProtoPathModuleMappings - Swift Module names for proto paths
By default, the code generator assumes all of the resulting Swift files will be put into the same module. However, since protos can reference types from another proto file, those generated files might end up in different modules. This option allows you to specify that the code generated from the proto files will be distributed in multiple modules. This data is used during generation to then import the module and scope the types. This option takes the path of a file providing the mapping:

$ protoc --swift_opt=ProtoPathModuleMappings=[path.asciipb] --swift_out=. foo/bar/*.proto
The format of that mapping file is defined in swift_protobuf_module_mappings.proto, and files would look something like:

mapping {
  module_name: "MyModule"
  proto_file_path: "foo/bar.proto"
}
mapping {
  module_name: "OtherModule"
  proto_file_path: "mumble.proto"
  proto_file_path: "other/file.proto"
}
The proto_file_path values here should match the paths used in the proto file import statements.

Generation Option: ImplementationOnlyImports - @_implementationOnly-annotated imports
By default, SwiftProtobuf does not annotate any imports with @_implementationOnly. However, in some scenarios, such as when distributing an XCFramework, imports for types used only internally should be annotated as @_implementationOnly to avoid exposing internal symbols to clients. You can change this with the ImplementationOnlyImports option:

$ protoc --swift_opt=ImplementationOnlyImports=[value] --swift_out=. foo/bar/*.proto mumble/*.proto
The possible values for ImplementationOnlyImports are:

false (default): The @_implementationOnly annotation will never be used.
true: Imports of internal dependencies and any modules defined in the module mappings will be annotated as @_implementationOnly.
Important: Modules cannot be imported as implementation-only if they're exposed via public API, so even if ImplementationOnlyImports is set to true, this will only work if the Visibility is set to internal.

Building your project
After copying the .pb.swift files into your project, you will need to add the SwiftProtobuf library to your project to support the generated code. If you are using the Swift Package Manager, you should first check what version of protoc-gen-swift you are currently using:

$ protoc-gen-swift --version
protoc-gen-swift 1.0.1
And then add a dependency to your Package.swift file. Adjust the Version() here to match the protoc-gen-swift version you checked above:

dependencies: [
    .package(name: "SwiftProtobuf", url: "https://github.com/apple/swift-protobuf.git", from: "1.6.0"),
]
If you are using Xcode, then you should:

Add the Swift source files generated from your protos directly to your project.
Add this SwiftPM package as dependency of your xcode project: Apple Docs

---

## 🤖 Assistant
*2023-06-28 11:49:24*

SwiftProtobufのドキュメンテーションの内容によると、コード生成におけるオプションは以下の4つです：

1. **FileNaming** - 生成されるソースファイルの名前付けについて。
   `protoc --swift_opt=FileNaming=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   
   FileNamingの値は以下の3つがあります：
   - **FullPath (default)**: すべての他の言語と同様に、"foo/bar/baz.proto"は"foo/bar/baz.pb.swift"を作成します。
   - **PathToUnderscores**: Swift Package Managerのようなもので、すべてのファイルを1つのディレクトリに入れたい場合に役立ちます。"foo/bar/baz.proto"は"foo_bar_baz.pb.swift"を作成します。
   - **DropPath**: 入力からパスをドロップし、すべてのファイルを出力ディレクトリに書き込みます。"foo/bar/baz.proto"は"baz.pb.swift"を作成します。

2. **Visibility** - 生成される型の可視性について。
   `protoc --swift_opt=Visibility=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   
   Visibilityの値は以下の2つがあります：
   - **Internal (default)**: 型に対して可視性が設定されていないため、デフォルトのinternal可視性が得られます。
   - **Public**: 型の可視性がpublicに設定されるため、それらの型はそれらがコンパイルされるモジュールの外部に公開されます。

3. **ProtoPathModuleMappings** - protoパスのSwiftモジュール名について。
   `protoc --swift_opt=ProtoPathModuleMappings=[path.asciipb] --swift_out=. foo/bar/*.proto`
   
   これは、生成されるSwiftファイルが同一モジュールに存在するとは限らない状況を想定したものです。このオプションを使用すると、生成されるファイルが複数のモジュールに分散されることを指定できます。この情報は、生成中にモジュールをインポートし、型をスコープするために使用されます。

4. **ImplementationOnlyImports** - `@_implementationOnly` が注釈付きのインポートについて。
   `protoc --swift_opt=ImplementationOnlyImports=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   
   ImplementationOnlyImportsの値は以下の2つがあります：
   - **false (default)**: `@_implementationOnly`注釈は一切使用されません。
   - **true**: 内部依存関係とモジュールマッピングで定義された任意のモジュ

---

## 🤖 Assistant
*2023-06-28 11:49:42*

ールのインポートに`@_implementationOnly`注釈が付けられます。

   注意: モジュールはパブリックAPIを介して公開されていない場合にのみ実装専用としてインポートできます。したがって、ImplementationOnlyImportsがtrueに設定されていても、Visibilityがinternalに設定されている場合にのみ機能します。

---

## 👤 User
*2023-06-28 11:51:04*

上記のオプションの内容をマークダウン式でかいてほしい。### 以下のレベルでやってほしい

---

## 🤖 Assistant
*2023-06-28 11:51:58*

### SwiftProtobuf: Code-Generation Options

SwiftProtobufには4つの主要なコード生成オプションがあります。これらは、コマンドラインから`protoc`コマンドに渡すことで指定します。

1. **FileNaming**
   - このオプションは、生成されるソースファイルの命名規則を制御します。
   - 使用方法: `protoc --swift_opt=FileNaming=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   - 可能な値:
     - **FullPath (default)**: 他の言語と同様、"foo/bar/baz.proto"は"foo/bar/baz.pb.swift"を生成します。
     - **PathToUnderscores**: Swift Package Managerなどで、すべてのファイルを1つのディレクトリに格納したい場合に有用です。"foo/bar/baz.proto"は"foo_bar_baz.pb.swift"を生成します。
     - **DropPath**: 入力パスを削除し、すべてのファイルを出力ディレクトリに書き込みます。"foo/bar/baz.proto"は"baz.pb.swift"を生成します。

2. **Visibility**
   - このオプションは、生成される型の可視性を制御します。
   - 使用方法: `protoc --swift_opt=Visibility=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   - 可能な値:
     - **Internal (default)**: 型に対して明示的な可視性が設定されていないため、デフォルトの`internal`可視性が適用されます。
     - **Public**: 型の可視性が`public`に設定されるため、これらの型はコンパイルされるモジュールの外部に公開されます。

3. **ProtoPathModuleMappings**
   - このオプションは、protoファイルのパスに対応するSwiftモジュール名を指定します。
   - 使用方法: `protoc --swift_opt=ProtoPathModuleMappings=[path.asciipb] --swift_out=. foo/bar/*.proto`
   - これは、生成されるSwiftファイルが同一モジュールに存在するとは限らない状況を想定したものです。このオプションを使用すると、生成されるファイルが複数のモジュールに分散されることを指定できます。この情報は、生成中にモジュールをインポートし、型をスコープするために使用されます。

4. **ImplementationOnlyImports**
   - このオプションは、`@_implementationOnly`が注釈付きのインポートを制御します。
   - 使用方法: `protoc --swift_opt=ImplementationOnlyImports=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   - 可能な値:
     - **false

---

## 🤖 Assistant
*2023-06-28 11:52:26*

(default)**: `@_implementationOnly`注釈は一切使用されません。
     - **true**: 内部依存関係とモジュールマッピングで定義された任意のモジュールのインポートに`@_implementationOnly`注釈が付けられます。
   - 注意: モジュールはパブリックAPIを介して公開されていない場合にのみ実装専用としてインポートできます。したがって、ImplementationOnlyImportsがtrueに設定されていても、Visibilityがinternalに設定されている場合にのみ機能します。

---

## 👤 User
*2023-06-28 11:53:12*

コピペして、そのままgithubのissueに貼りたいのでその形式で書いて欲しい

---

## 🤖 Assistant
*2023-06-28 11:53:50*

以下はGitHubのissueにコピペするためのマークダウン形式です:

```
### SwiftProtobuf: Code-Generation Options

SwiftProtobuf includes four main code generation options. These are specified through the command line when passing the `protoc` command.

1. **FileNaming**
   - This option controls the naming convention of the generated source files.
   - Usage: `protoc --swift_opt=FileNaming=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   - Possible Values:
     - **FullPath (default)**: Like all other languages, "foo/bar/baz.proto" generates "foo/bar/baz.pb.swift".
     - **PathToUnderscores**: Useful for scenarios like Swift Package Manager where you might want all files in a single directory; "foo/bar/baz.proto" generates "foo_bar_baz.pb.swift".
     - **DropPath**: Drops the input path and simply writes all files into the output directory; "foo/bar/baz.proto" generates "baz.pb.swift".

2. **Visibility**
   - This option controls the visibility of the generated types.
   - Usage: `protoc --swift_opt=Visibility=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   - Possible Values:
     - **Internal (default)**: No explicit visibility is set for the types, thus they get the default `internal` visibility.
     - **Public**: The visibility of the types is set to `public`, thus the types will be exposed outside the module they are compiled into.

3. **ProtoPathModuleMappings**
   - This option specifies the Swift module names corresponding to proto file paths.
   - Usage: `protoc --swift_opt=ProtoPathModuleMappings=[path.asciipb] --swift_out=. foo/bar/*.proto`
   - This is intended for scenarios where the generated Swift files may not all reside in the same module. Using this option, you can specify that the generated files will be distributed across multiple modules. This information is used during generation to import the module and scope the types.

4. **ImplementationOnlyImports**
   - This option controls `@_implementationOnly`-annotated imports.
   - Usage: `protoc --swift_opt=ImplementationOnlyImports=[value] --swift_out=. foo/bar/*.proto mumble/*.proto`
   - Possible Values:
     - **false (default)**: The `@_implementationOnly` annotation will never be used.
     - **true**: Imports of internal dependencies and any modules defined in the module mappings will be annotated as `@_implementationOnly`.
   - Important: Modules cannot be imported as implementation-only if they're exposed via public API, so even if ImplementationOnlyImports is set to true, this will only work if the Visibility is set to internal.
```

---
