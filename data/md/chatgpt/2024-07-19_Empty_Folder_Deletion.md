# Empty Folder Deletion

日付: 2024-07-19

---

## 👤 ユーザー
*2024/07/19 14:18:23*

最後にadd delete diff についてフォルダが空であれば消してほしい

import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import parse from 'parse-git-diff';
import os from 'os';

// __filename と __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// プロジェクトのルートディレクトリを取得
let projectRoot;
try {
    projectRoot = execSync('git rev-parse --show-toplevel').toString().trim();
} catch (error) {
    console.error('Error getting project root directory:', error.message);
    process.exit(1);
}

// 現在のブランチを取得
let currentBranch;
try {
    currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectRoot }).toString().trim();
} catch (error) {
    console.error('Error getting current branch:', error.message);
    process.exit(1);
}

// コマンドライン引数を取得
let [sourceBranch = currentBranch, targetBranch = 'main', snapshotsDir = 'SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__'] = process.argv.slice(2);

// 各ブランチの短いコミットハッシュを取得
let sourceCommitHash;
let targetCommitHash;
try {
    sourceCommitHash = execSync(`git rev-parse --short ${sourceBranch}`, { cwd: projectRoot }).toString().trim();
    targetCommitHash = execSync(`git rev-parse --short ${targetBranch}`, { cwd: projectRoot }).toString().trim();
    console.log(`Source commit hash (${sourceBranch}): ${sourceCommitHash}, Target commit hash (${targetBranch}): ${targetCommitHash}`);
} catch (error) {
    console.error('Error getting commit hash:', error.message);
    process.exit(1);
}

// スナップショットディレクトリの絶対パスを構築
const outputParentDir = path.resolve(projectRoot, 'pixelmatch/output');
const outputDir = path.resolve(outputParentDir, `${sourceBranch.replace(/\//g, '_')}_vs_${targetBranch.replace(/\//g, '_')}_${sourceCommitHash}_${targetCommitHash}`);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-temp-'));
const addedDir = path.join(outputDir, 'add');
const deletedDir = path.join(outputDir, 'delete');
const changedDir = path.join(outputDir, 'diff');

if (!fs.existsSync(outputParentDir)) {
    fs.mkdirSync(outputParentDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.mkdirSync(addedDir, { recursive: true });
fs.mkdirSync(deletedDir, { recursive: true });
fs.mkdirSync(changedDir, { recursive: true });

// Gitの差分を取得して解析
let diffOutput;
try {
    diffOutput = execSync(`git diff ${targetBranch} ${sourceBranch} -- ${snapshotsDir}`, { cwd: projectRoot }).toString();
} catch (error) {
    console.error('Error getting git diff:', error.message);
    process.exit(1);
}

const parsedDiff = parse(diffOutput);
console.log('Parsed diff:', parsedDiff);

if (!parsedDiff.files) {
    console.error('No files found in the parsed diff.');
    process.exit(1);
}

// 一時ディレクトリにターゲットブランチのファイルをチェックアウト
parsedDiff.files.forEach(file =&gt; {
    const relativePath = path.relative(projectRoot, file.path);
    const tempFilePath = path.join(tempDir, relativePath);

    // ディレクトリが存在しない場合は作成
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });

    // 削除されたファイルを除外してチェックアウト
    if (file.type !== 'AddedFile') {
        try {
            execSync(`git show ${targetBranch}:${relativePath} > ${tempFilePath}`, { cwd: projectRoot });
        } catch (error) {
            console.error(`Skipping ${relativePath} as it doesn't exist in ${targetBranch}`);
        }
    }
});

parsedDiff.files.forEach(file =&gt; {
    const sourceFilePath = path.resolve(projectRoot, file.path);
    const targetFilePath = path.resolve(tempDir, file.path);

    if (file.type === 'AddedFile') {
        if (fs.existsSync(sourceFilePath)) {
            fs.copyFileSync(sourceFilePath, path.join(addedDir, path.basename(file.path)));
            console.log(`🟩 Add    : ${file.path}`);
        }
    } else if (file.type === 'DeletedFile') {
        if (fs.existsSync(targetFilePath)) {
            const targetImage = PNG.sync.read(fs.readFileSync(targetFilePath));
            fs.writeFileSync(path.join(deletedDir, path.basename(file.path)), PNG.sync.write(targetImage));
            console.log(`🟥 Delete : ${file.path}`);
        } else {
            console.log(`Target file does not exist: ${targetFilePath}`);
        }
    } else if (file.type === 'ChangedFile') {
        if (fs.existsSync(sourceFilePath) && fs.existsSync(targetFilePath)) {
            const sourceImage = PNG.sync.read(fs.readFileSync(sourceFilePath));
            const targetImage = PNG.sync.read(fs.readFileSync(targetFilePath));
            const { width, height } = sourceImage;
            const diffImage = new PNG({ width, height });

            const numDiffPixels = pixelmatch(sourceImage.data, targetImage.data, diffImage.data, width, height, { threshold: 0.1 });

            fs.writeFileSync(path.join(changedDir, path.basename(file.path)), PNG.sync.write(diffImage));
            console.log(`🟦 Diff   : ${file.path}`);
        } else {
            console.log(`No matching file for ${file.path}`);
        }
    }
});

// 一時ディレクトリを削除
fs.rmSync(tempDir, { recursive: true, force: true });

---

## 🤖 アシスタント
*2024/07/19 14:19:02*

フォルダが空であれば削除する処理を追加するには、最後にフォルダの内容をチェックして、空の場合は削除するコードを追加します。以下に修正したスクリプトを示します：

```javascript
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import parse from 'parse-git-diff';
import os from 'os';

// __filename と __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// プロジェクトのルートディレクトリを取得
let projectRoot;
try {
    projectRoot = execSync('git rev-parse --show-toplevel').toString().trim();
} catch (error) {
    console.error('Error getting project root directory:', error.message);
    process.exit(1);
}

// 現在のブランチを取得
let currentBranch;
try {
    currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectRoot }).toString().trim();
} catch (error) {
    console.error('Error getting current branch:', error.message);
    process.exit(1);
}

// コマンドライン引数を取得
let [sourceBranch = currentBranch, targetBranch = 'main', snapshotsDir = 'SmallTalkPackage/Tests/ViewSnapshotTest/__Snapshots__'] = process.argv.slice(2);

// 各ブランチの短いコミットハッシュを取得
let sourceCommitHash;
let targetCommitHash;
try {
    sourceCommitHash = execSync(`git rev-parse --short ${sourceBranch}`, { cwd: projectRoot }).toString().trim();
    targetCommitHash = execSync(`git rev-parse --short ${targetBranch}`, { cwd: projectRoot }).toString().trim();
    console.log(`Source commit hash (${sourceBranch}): ${sourceCommitHash}, Target commit hash (${targetBranch}): ${targetCommitHash}`);
} catch (error) {
    console.error('Error getting commit hash:', error.message);
    process.exit(1);
}

// スナップショットディレクトリの絶対パスを構築
const outputParentDir = path.resolve(projectRoot, 'pixelmatch/output');
const outputDir = path.resolve(outputParentDir, `${sourceBranch.replace(/\//g, '_')}_vs_${targetBranch.replace(/\//g, '_')}_${sourceCommitHash}_${targetCommitHash}`);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-temp-'));
const addedDir = path.join(outputDir, 'add');
const deletedDir = path.join(outputDir, 'delete');
const changedDir = path.join(outputDir, 'diff');

if (!fs.existsSync(outputParentDir)) {
    fs.mkdirSync(outputParentDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.mkdirSync(addedDir, { recursive: true });
fs.mkdirSync(deletedDir, { recursive: true });
fs.mkdirSync(changedDir, { recursive: true });

// Gitの差分を取得して解析
let diffOutput;
try {
    diffOutput = execSync(`git diff ${targetBranch} ${sourceBranch} -- ${snapshotsDir}`, { cwd: projectRoot }).toString();
} catch (error) {
    console.error('Error getting git diff:', error.message);
    process.exit(1);
}

const parsedDiff = parse(diffOutput);
console.log('Parsed diff:', parsedDiff);

if (!parsedDiff.files) {
    console.error('No files found in the parsed diff.');
    process.exit(1);
}

// 一時ディレクトリにターゲットブランチのファイルをチェックアウト
parsedDiff.files.forEach(file => {
    const relativePath = path.relative(projectRoot, file.path);
    const tempFilePath = path.join(tempDir, relativePath);

    // ディレクトリが存在しない場合は作成
    fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });

    // 削除されたファイルを除外してチェックアウト
    if (file.type !== 'AddedFile') {
        try {
            execSync(`git show ${targetBranch}:${relativePath} > ${tempFilePath}`, { cwd: projectRoot });
        } catch (error) {
            console.error(`Skipping ${relativePath} as it doesn't exist in ${targetBranch}`);
        }
    }
});

parsedDiff.files.forEach(file => {
    const sourceFilePath = path.resolve(projectRoot, file.path);
    const targetFilePath = path.resolve(tempDir, file.path);

    if (file.type === 'AddedFile') {
        if (fs.existsSync(sourceFilePath)) {
            fs.copyFileSync(sourceFilePath, path.join(addedDir, path.basename(file.path)));
            console.log(`🟩 Add    : ${file.path}`);
        }
    } else if (file.type === 'DeletedFile') {
        if (fs.existsSync(targetFilePath)) {
            const targetImage = PNG.sync.read(fs.readFileSync(targetFilePath));
            fs.writeFileSync(path.join(deletedDir, path.basename(file.path)), PNG.sync.write(targetImage));
            console.log(`🟥 Delete : ${file.path}`);
        } else {
            console.log(`Target file does not exist: ${targetFilePath}`);
        }
    } else if (file.type === 'ChangedFile') {
        if (fs.existsSync(sourceFilePath) && fs.existsSync(targetFilePath)) {
            const sourceImage = PNG.sync.read(fs.readFileSync(sourceFilePath));
            const targetImage = PNG.sync.read(fs.readFileSync(targetFilePath));
            const { width, height } = sourceImage;
            const diffImage = new PNG({ width, height });

            const numDiffPixels = pixelmatch(sourceImage.data, targetImage.data, diffImage.data, width, height, { threshold: 0.1 });

            fs.writeFileSync(path.join(changedDir, path.basename(file.path)), PNG.sync.write(diffImage));
            console.log(`🟦 Diff   : ${file.path}`);
        } else {
            console.log(`No matching file for ${file.path}`);
        }
    }
});

// 一時ディレクトリを削除
fs.rmSync(tempDir, { recursive: true, force: true });

// フォルダが空であれば削除する関数
function removeEmptyDirs(directory) {
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        if (files.length === 0) {
            fs.rmdirSync(directory);
            console.log(`Removed empty directory: ${directory}`);
        } else {
            files.forEach(file => {
                const fullPath = path.join(directory, file);
                if (fs.lstatSync(fullPath).isDirectory()) {
                    removeEmptyDirs(fullPath);
                }
            });
            // 再度チェックしてフォルダが空なら削除
            if (fs.readdirSync(directory).length === 0) {
                fs.rmdirSync(directory);
                console.log(`Removed empty directory: ${directory}`);
            }
        }
    }
}

// 出力ディレクトリが空であれば削除
removeEmptyDirs(addedDir);
removeEmptyDirs(deletedDir);
removeEmptyDirs(changedDir);
removeEmptyDirs(outputDir);
```

このコードは、`removeEmptyDirs`関数を追加して、指定されたディレクトリが空であれば再帰的に削除します。`addedDir`、`deletedDir`、`changedDir`、および`outputDir`に対してこの関数を呼び出し、必要に応じてディレクトリを削除します。

---
