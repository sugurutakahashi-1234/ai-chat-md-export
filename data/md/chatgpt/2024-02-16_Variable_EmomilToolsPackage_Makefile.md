# Variable EmomilToolsPackage Makefile

日付: 2024-02-16

---

## 👤 ユーザー
*2024/02/16 10:39:09*

以下のMakefileについてEmomilToolsPackageを変数化したい



.PHONY: help
help:
	@awk 'BEGIN {FS = ":"} /^[a-zA-Z0-9_-]+:/ {if ($$2 == "") print "make " $$1}' Makefile

.PHONY: open
open:
	open `find . -maxdepth 1 -mindepth 1 -iname "*.xcworkspace"`

.PHONY: setup-githooks
setup-githooks:
	git config --local core.hooksPath .githooks

.PHONY: cleanup-githooks
cleanup-githooks:
	git config --local --unset core.hooksPath .githooks

.PHONY: swiftformat-run
swiftformat-run:
	swift run --package-path EmomilToolsPackage swiftformat .

.PHONY: swiftformat-lint
swiftformat-lint:
	swift run --package-path EmomilToolsPackage swiftformat --lint .

.PHONY: swiftgen-run
swiftgen-run:
	swift package --package-path EmomilPackage --allow-writing-to-package-directory generate-code-for-resources

.PHONY: mint-bootstrap
mint-bootstrap:
	swift run --package-path EmomilToolsPackage mint bootstrap

.PHONY: mint-uninstall
mint-uninstall:
	swift run --package-path EmomilToolsPackage mint uninstall peripheryapp/periphery

.PHONY: periphery-run
periphery-run:
	./Periphery/periphery.sh

.PHONY: docc-run
docc-run:
	./Swift-DocC/docc.sh

.PHONY: mockolo-run
mockolo-run:
	swift run --package-path EmomilToolsPackage mockolo -s ./ -d ./EmomilPackage/Sources/EmomilCore/Domain/Protocol/Mock/Mockolo.swift -x Images Strings --mock-final

.PHONY: setup
setup:
	$(MAKE) mint-bootstrap
	$(MAKE) setup-githooks
	$(MAKE) open

.PHONY: cleanup
cleanup:
	$(MAKE) mint-uninstall
	$(MAKE) cleanup-githooks

---

## 🤖 アシスタント
*2024/02/16 10:39:52*

変数化を行うには、`Makefile`内で`EmomilToolsPackage`を参照する部分に変数を使用します。変数を定義して、その変数をコマンドラインで上書きできるようにすることで、パッケージパスを柔軟に変更できます。以下は`EmomilToolsPackage`を変数`EMOMIL_TOOLS_PACKAGE`で置き換えた例です。

```makefile
# 変数定義
EMOMIL_TOOLS_PACKAGE := EmomilToolsPackage

.PHONY: help
help:
	@awk 'BEGIN {FS = ":"} /^[a-zA-Z0-9_-]+:/ {if ($$2 == "") print "make " $$1}' Makefile

.PHONY: open
open:
	open `find . -maxdepth 1 -mindepth 1 -iname "*.xcworkspace"`

.PHONY: setup-githooks
setup-githooks:
	git config --local core.hooksPath .githooks

.PHONY: cleanup-githooks
cleanup-githooks:
	git config --local --unset core.hooksPath .githooks

.PHONY: swiftformat-run
swiftformat-run:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) swiftformat .

.PHONY: swiftformat-lint
swiftformat-lint:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) swiftformat --lint .

.PHONY: swiftgen-run
swiftgen-run:
	swift package --package-path EmomilPackage --allow-writing-to-package-directory generate-code-for-resources

.PHONY: mint-bootstrap
mint-bootstrap:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) mint bootstrap

.PHONY: mint-uninstall
mint-uninstall:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) mint uninstall peripheryapp/periphery

.PHONY: periphery-run
periphery-run:
	./Periphery/periphery.sh

.PHONY: docc-run
docc-run:
	./Swift-DocC/docc.sh

.PHONY: mockolo-run
mockolo-run:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) mockolo -s ./ -d ./EmomilPackage/Sources/EmomilCore/Domain/Protocol/Mock/Mockolo.swift -x Images Strings --mock-final

.PHONY: setup
setup:
	$(MAKE) mint-bootstrap
	$(MAKE) setup-githooks
	$(MAKE) open

.PHONY: cleanup
cleanup:
	$(MAKE) mint-uninstall
	$(MAKE) cleanup-githooks
```

この変更により、`EmomilToolsPackage`のパスが変わった場合、Makefileを編集せずにコマンドラインから新しいパスを指定できます。例えば、次のようにコマンドを実行することで、別のパッケージパスを使用できます。

```bash
make swiftformat-run EMOMIL_TOOLS_PACKAGE=NewEmomilToolsPackagePath
```

この方法で、Makefile内の`EmomilToolsPackage`への参照を柔軟に管理できます。

---

## 👤 ユーザー
*2024/02/16 10:40:28*

makefileを編集してもいい

---

## 🤖 アシスタント
*2024/02/16 10:41:02*

Makefileを編集して、`EmomilToolsPackage`を変数化する場合、以下のように編集できます。ここでは、`EMOMIL_TOOLS_PACKAGE`という変数を導入して、この変数を使って`EmomilToolsPackage`のパスを指定します。また、`EmomilPackage`のパスも変数化する可能性があるため、それも同様に変数化する例を示します。

```makefile
# 変数定義
EMOMIL_TOOLS_PACKAGE := EmomilToolsPackage
EMOMIL_PACKAGE := EmomilPackage

.PHONY: help
help:
	@awk 'BEGIN {FS = ":"} /^[a-zA-Z0-9_-]+:/ {if ($$2 == "") print "make " $$1}' Makefile

.PHONY: open
open:
	open `find . -maxdepth 1 -mindepth 1 -iname "*.xcworkspace"`

.PHONY: setup-githooks
setup-githooks:
	git config --local core.hooksPath .githooks

.PHONY: cleanup-githooks
cleanup-githooks:
	git config --local --unset core.hooksPath .githooks

.PHONY: swiftformat-run
swiftformat-run:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) swiftformat .

.PHONY: swiftformat-lint
swiftformat-lint:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) swiftformat --lint .

.PHONY: swiftgen-run
swiftgen-run:
	swift package --package-path $(EMOMIL_PACKAGE) --allow-writing-to-package-directory generate-code-for-resources

.PHONY: mint-bootstrap
mint-bootstrap:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) mint bootstrap

.PHONY: mint-uninstall
mint-uninstall:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) mint uninstall peripheryapp/periphery

.PHONY: periphery-run
periphery-run:
	./Periphery/periphery.sh

.PHONY: docc-run
docc-run:
	./Swift-DocC/docc.sh

.PHONY: mockolo-run
mockolo-run:
	swift run --package-path $(EMOMIL_TOOLS_PACKAGE) mockolo -s ./ -d ./$(EMOMIL_PACKAGE)/Sources/EmomilCore/Domain/Protocol/Mock/Mockolo.swift -x Images Strings --mock-final

.PHONY: setup
setup:
	$(MAKE) mint-bootstrap
	$(MAKE) setup-githooks
	$(MAKE) open

.PHONY: cleanup
cleanup:
	$(MAKE) mint-uninstall
	$(MAKE) cleanup-githooks
```

この編集により、`EmomilToolsPackage`および`EmomilPackage`のパスをMakefileの上部で簡単に変更できます。また、コマンドラインからこれらの変数に異なる値を指定することも可能です。例えば、以下のコマンドは`EMOMIL_TOOLS_PACKAGE`と`EMOMIL_PACKAGE`に異なるパスを指定します。

```bash
make swiftformat-run EMOMIL_TOOLS_PACKAGE=NewEmomilToolsPackagePath EMOMIL_PACKAGE=NewEmomilPackagePath
```

このようにMakefileを変更することで、パッケージパスを柔軟に扱うことができます。

---
