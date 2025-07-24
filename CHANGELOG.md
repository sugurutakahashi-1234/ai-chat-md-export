# Changelog

## [1.0.2](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v1.0.1...v1.0.2) (2025-07-24)


### 📚 Documentation

* clarify that ai-chat-md-export is a CLI tool ([#75](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/75)) ([5ef48a6](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/5ef48a64e3b77caf2ec76d2504d5be144dc93fc4))

## [1.0.1](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v1.0.0...v1.0.1) (2025-07-23)


### 📚 Documentation

* reorganize README badges for better information hierarchy ([#72](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/72)) ([e2c2b6b](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/e2c2b6b1c43096799ce1e0d363414c49fc93dc06))


### 🔧 Maintenance

* pin exact dependency versions and update schemas ([#74](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/74)) ([d2a6454](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/d2a6454790349fff06e8abdc5f22e84154091dd8))

## [1.0.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.8.5...v1.0.0) (2025-07-23)


### ✨ Features

* add demo GIF to README files ([#71](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/71)) ([f069bc6](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/f069bc6ae40fd6a2ea37869e338028eab2381007))


### ♻️ Code Refactoring

* replace picocolors with consola and separate logger/spinner concerns ([#67](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/67)) ([5359e8d](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/5359e8d367b595ac8583e0f97c989c677a7c726c))
* update options handling in filters and writers ([#69](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/69)) ([94b5483](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/94b5483e2fad8ee1534b7580ff4fb428be95a836))


### 🔧 Maintenance

* bump version to 1.0.0 ([7fb472d](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/7fb472d7cd9b74be7455daff7f7debdccc6c94c6))

## [0.8.5](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.8.4...v0.8.5) (2025-07-22)


### 🐛 Bug Fixes

* ubuntu binary permission error in CI ([#65](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/65)) ([c60f2f6](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c60f2f6376445980d0dc1dea6d50b08d6cb82c3f))

## [0.8.4](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.8.3...v0.8.4) (2025-07-22)


### 🐛 Bug Fixes

* remove Pre-compress Windows executables step to fix binary tests ([#63](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/63)) ([44f2865](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/44f2865d902c7dceec635ea72c03f975a79d129c))

## [0.8.3](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.8.2...v0.8.3) (2025-07-22)


### 🐛 Bug Fixes

* set proper permissions for all binaries in GoReleaser ([#61](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/61)) ([f2db3ca](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/f2db3ca0c503ae6870daa2b0c7c13c34e8f07a17))

## [0.8.2](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.8.1...v0.8.2) (2025-07-22)


### 🐛 Bug Fixes

* debug and workaround for Windows artifact upload permission issue ([#59](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/59)) ([e3cadc5](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/e3cadc508d5b3299c0548c1c2e97c8df0e829efc))

## [0.8.1](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.8.0...v0.8.1) (2025-07-22)


### 🐛 Bug Fixes

* add GitHub Actions permissions for artifact upload ([#57](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/57)) ([a0f993e](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/a0f993e4b16517b1ba2f1fdf07be5ff3df5c4ab7))

## [0.8.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.7.6...v0.8.0) (2025-07-22)


### ✨ Features

* add -v option support and improve error message display ([#47](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/47)) ([033e1b4](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/033e1b42f89ef738e1ea6f1d44c14893f1ad9ad6))
* add JSON output format and split/combine options ([#50](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/50)) ([7e9706b](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/7e9706bcae7822db270f23f2f3ff2503ceee52b8))
* remove directory input support for simpler codebase ([#51](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/51)) ([c3a300c](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c3a300c36ff6c62a64cdfd83a018e8dd691161a3))


### ♻️ Code Refactoring

* reorganize architecture with clean architecture principles ([#56](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/56)) ([0e43d17](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/0e43d17d6f535b8474894911853285598a2d139c))

## [0.7.6](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.7.5...v0.7.6) (2025-07-17)


### 🐛 Bug Fixes

* add missing closing bracket in Homebrew Cask post-install hook ([#44](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/44)) ([8d8f47f](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8d8f47fc7468641df9d9afdd6671b6d6832c9a7e))

## [0.7.5](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.7.4...v0.7.5) (2025-07-17)


### 🐛 Bug Fixes

* add post-install hook to remove macOS quarantine attributes ([#42](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/42)) ([fbb9985](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/fbb99855a8fe18dc8a17da3849641b853be6ce96))

## [0.7.4](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.7.3...v0.7.4) (2025-07-17)


### 🐛 Bug Fixes

* add multi-repository permissions for GitHub App token ([#40](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/40)) ([8a0f595](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8a0f5954642daac8b31fea9ffddce29fcd72d277))

## [0.7.3](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.7.2...v0.7.3) (2025-07-17)


### 🐛 Bug Fixes

* add id-token permission to npm release workflow ([#38](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/38)) ([ba851d4](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/ba851d4d89793b5b9427f7e7f82e95aa89fc894d))
* use workflow_call instead of gh workflow run for Homebrew release ([#37](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/37)) ([bd0d893](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/bd0d893c81bf142f4745cab211869d81380bbd6d))

## [0.7.2](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.6.2...v0.7.2) (2025-07-17)


### ✨ Features

* add GitHub App token support for protected branch pushes ([#33](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/33)) ([b86ce8a](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/b86ce8a9e5e315e1549055da7a50ac8090bfbd1f))


### 🐛 Bug Fixes

* add permissions to pr-auto-assign workflow ([#36](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/36)) ([a8d3311](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/a8d33111be7475ec08c87dcd90d4f561eda11822))
* remove reason parameter from manual version bump workflow ([#35](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/35)) ([cb329ed](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/cb329edc8701946a7451b94599065fab704edb09))


### 🔧 Maintenance

* Force version bump to resolve version mismatch ([5eebb5d](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/5eebb5df53db02cbe5e1333b910d6c7b60c3dac7))

## [0.6.2](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.6.1...v0.6.2) (2025-07-17)


### 🐛 Bug Fixes

* configure release workflows for local execution and version management ([#31](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/31)) ([2196266](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/2196266d7ef4e2cfd8954cffbeb4bc1d17ba72eb))

## [0.6.1](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.6.0...v0.6.1) (2025-07-16)


### 🐛 Bug Fixes

* disable husky hooks in CI/CD environments for release workflows ([#30](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/30)) ([e44af61](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/e44af614939ae0dbf257c7e2538018403d0f3d94))
* enable Homebrew releases from release-please and manual workflows ([#27](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/27)) ([8c0b888](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8c0b888c7dff1db4e6b4c97793e98359d9089c33))
* improve release workflow and documentation ([#29](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/29)) ([7698b39](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/7698b395e63b1d746c2a44a844fe45c29c89c01e))

## [0.6.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.5.0...v0.6.0) (2025-07-15)


### ✨ Features

* add branch name validation with git-branch-lint ([#12](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/12)) ([c51927a](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c51927a4679b294830db34a5b3271f2592faf940))
* improve release workflows and add GoReleaser testing ([#19](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/19)) ([c6800be](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c6800bebb9a4644f10328922001a6d516c911b75))


### 🐛 Bug Fixes

* add issues permission and main branch protection ([#16](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/16)) ([de2af25](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/de2af2582c61b356d6f2cc8e1881a947c86fe5ce))
* improve release automation settings ([#26](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/26)) ([4ef46e3](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/4ef46e3f0dca655ffce58f366bab9f969467b037))
* improve release-please configuration and pin dependencies ([#17](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/17)) ([0fab977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/0fab9775c6d32c17081afba431f3eede22d1d90b))
* release-please configuration and npm package improvements ([#14](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/14)) ([85ead43](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/85ead43fe00b60387a1ea0d7d9137d045deecfd6))
* update CI badge links and add npm and Homebrew release badges in README ([#23](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/23)) ([fbe9977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/fbe997763e450d0f05327ff13d7cfe1c5a76f78d))
* update CI binary selection and improve test infrastructure ([#21](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/21)) ([75b470c](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/75b470c68ecbcebc7effe70aa37da8744469fecf))
* update GoReleaser targets for Bun builder and reorganize CI workflows ([#20](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/20)) ([5737b58](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/5737b58e6ca57a625c7638a0e5ce550a59d04d5c))


### 🔧 Maintenance

* release v0.2.0 ([#13](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/13)) ([8a3c934](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8a3c934dcb694f06e78a8587933ba3e946ece544))
* release v0.3.0 ([#15](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/15)) ([58033af](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/58033af7affca261af9993e3ac4450c279658c12))
* release v0.4.0 ([#18](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/18)) ([23b697b](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/23b697bfeb095628fa00158263cc522eb096a27a))
* release v0.5.0 ([#24](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/24)) ([7cfb488](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/7cfb4886cb3112d82ee8750ac4263082e21b5b99))

## [0.5.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.4.0...v0.5.0) (2025-07-15)


### ✨ Features

* add branch name validation with git-branch-lint ([#12](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/12)) ([c51927a](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c51927a4679b294830db34a5b3271f2592faf940))
* improve release workflows and add GoReleaser testing ([#19](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/19)) ([c6800be](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c6800bebb9a4644f10328922001a6d516c911b75))


### 🐛 Bug Fixes

* add issues permission and main branch protection ([#16](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/16)) ([de2af25](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/de2af2582c61b356d6f2cc8e1881a947c86fe5ce))
* improve release-please configuration and pin dependencies ([#17](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/17)) ([0fab977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/0fab9775c6d32c17081afba431f3eede22d1d90b))
* release-please configuration and npm package improvements ([#14](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/14)) ([85ead43](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/85ead43fe00b60387a1ea0d7d9137d045deecfd6))
* update CI badge links and add npm and Homebrew release badges in README ([#23](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/23)) ([fbe9977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/fbe997763e450d0f05327ff13d7cfe1c5a76f78d))
* update CI binary selection and improve test infrastructure ([#21](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/21)) ([75b470c](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/75b470c68ecbcebc7effe70aa37da8744469fecf))
* update GoReleaser targets for Bun builder and reorganize CI workflows ([#20](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/20)) ([5737b58](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/5737b58e6ca57a625c7638a0e5ce550a59d04d5c))


### 🔧 Maintenance

* release v0.2.0 ([#13](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/13)) ([8a3c934](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8a3c934dcb694f06e78a8587933ba3e946ece544))
* release v0.3.0 ([#15](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/15)) ([58033af](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/58033af7affca261af9993e3ac4450c279658c12))
* release v0.4.0 ([#18](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/18)) ([23b697b](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/23b697bfeb095628fa00158263cc522eb096a27a))

## [0.4.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.3.0...v0.4.0) (2025-07-15)


### ✨ Features

* add branch name validation with git-branch-lint ([#12](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/12)) ([c51927a](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c51927a4679b294830db34a5b3271f2592faf940))
* improve release workflows and add GoReleaser testing ([#19](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/19)) ([c6800be](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c6800bebb9a4644f10328922001a6d516c911b75))


### 🐛 Bug Fixes

* add issues permission and main branch protection ([#16](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/16)) ([de2af25](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/de2af2582c61b356d6f2cc8e1881a947c86fe5ce))
* improve release-please configuration and pin dependencies ([#17](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/17)) ([0fab977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/0fab9775c6d32c17081afba431f3eede22d1d90b))
* release-please configuration and npm package improvements ([#14](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/14)) ([85ead43](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/85ead43fe00b60387a1ea0d7d9137d045deecfd6))
* update CI badge links and add npm and Homebrew release badges in README ([#23](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/23)) ([fbe9977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/fbe997763e450d0f05327ff13d7cfe1c5a76f78d))
* update CI binary selection and improve test infrastructure ([#21](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/21)) ([75b470c](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/75b470c68ecbcebc7effe70aa37da8744469fecf))
* update GoReleaser targets for Bun builder and reorganize CI workflows ([#20](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/20)) ([5737b58](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/5737b58e6ca57a625c7638a0e5ce550a59d04d5c))


### 🔧 Maintenance

* release v0.2.0 ([#13](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/13)) ([8a3c934](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8a3c934dcb694f06e78a8587933ba3e946ece544))
* release v0.3.0 ([#15](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/15)) ([58033af](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/58033af7affca261af9993e3ac4450c279658c12))

## [0.3.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/v0.2.0...v0.3.0) (2025-07-14)


### ✨ Features

* add branch name validation with git-branch-lint ([#12](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/12)) ([c51927a](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c51927a4679b294830db34a5b3271f2592faf940))


### 🐛 Bug Fixes

* add issues permission and main branch protection ([#16](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/16)) ([de2af25](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/de2af2582c61b356d6f2cc8e1881a947c86fe5ce))
* improve release-please configuration and pin dependencies ([#17](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/17)) ([0fab977](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/0fab9775c6d32c17081afba431f3eede22d1d90b))
* release-please configuration and npm package improvements ([#14](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/14)) ([85ead43](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/85ead43fe00b60387a1ea0d7d9137d045deecfd6))


### 🔧 Maintenance

* release v0.2.0 ([#13](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/13)) ([8a3c934](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/8a3c934dcb694f06e78a8587933ba3e946ece544))

## [0.2.0](https://github.com/sugurutakahashi-1234/ai-chat-md-export/compare/ai-chat-md-export-v0.1.1...ai-chat-md-export-v0.2.0) (2025-07-14)


### ✨ Features

* add branch name validation with git-branch-lint ([#12](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/12)) ([c51927a](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/c51927a4679b294830db34a5b3271f2592faf940))


### 🐛 Bug Fixes

* release-please configuration and npm package improvements ([#14](https://github.com/sugurutakahashi-1234/ai-chat-md-export/issues/14)) ([85ead43](https://github.com/sugurutakahashi-1234/ai-chat-md-export/commit/85ead43fe00b60387a1ea0d7d9137d045deecfd6))
