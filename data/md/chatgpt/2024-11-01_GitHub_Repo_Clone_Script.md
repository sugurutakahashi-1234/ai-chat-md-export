# GitHub Repo Clone Script

日付: 2024-11-01

---

## 👤 ユーザー
*2024/11/01 21:59:30*

my github repository all clone one liner

---

## 🤖 アシスタント
*2024/11/01 21:59:34*

To clone all repositories from your GitHub account in one line, you can use the following script. This requires GitHub's CLI (`gh`) tool. First, ensure it’s installed and authenticated:

```bash
gh repo list <username> --limit 1000 | awk '{print $1}' | xargs -L1 gh repo clone
```

Replace `<username>` with your GitHub username. This command will list all your repositories (up to 1000) and clone each one individually.

---

## 👤 ユーザー
*2024/11/01 22:03:52*

clone submodule

---

## 🤖 アシスタント
*2024/11/01 22:03:56*

To clone a repository with its submodules, you can use the following command:

```bash
git clone --recurse-submodules <repository_url>
```

This command will clone the repository along with all of its submodules. If you’ve already cloned the repository without submodules, you can initialize and update them afterward with:

```bash
git submodule update --init --recursive
```

This will ensure all submodules are downloaded and up-to-date within the cloned repository.

---
