# Git Submodule Clone Error

日付: 2024-09-20

---

## 👤 ユーザー
*2024/09/20 15:56:13*

git --no-optional-locks -c color.branch=false -c color.diff=false -c color.status=false -c diff.mnemonicprefix=false -c core.quotepath=false -c credential.helper=sourcetree checkout marge/shared-module-ios-marge-develop-240920 
Your branch is up to date with 'origin/marge/shared-module-ios-marge-develop-240920'.
Switched to branch 'marge/shared-module-ios-marge-develop-240920'


git --no-optional-locks -c color.branch=false -c color.diff=false -c color.status=false -c diff.mnemonicprefix=false -c core.quotepath=false -c credential.helper=sourcetree submodule update --init 
Cloning into '/Users/sugurutakahashi/git/daVinciAppIOS/shared-module-ios'...
ERROR: Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:progrit/shared-module-ios.git' into submodule path '/Users/sugurutakahashi/git/daVinciAppIOS/shared-module-ios' failed
Failed to clone 'shared-module-ios'. Retry scheduled
Cloning into '/Users/sugurutakahashi/git/daVinciAppIOS/shared-module-ios'...
ERROR: Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
fatal: clone of 'git@github.com:progrit/shared-module-ios.git' into submodule path '/Users/sugurutakahashi/git/daVinciAppIOS/shared-module-ios' failed
Failed to clone 'shared-module-ios' a second time, aborting

---

## 🤖 アシスタント
*2024/09/20 15:56:25*

The error message indicates that the repository `git@github.com:progrit/shared-module-ios.git` is either not available or you don't have the correct access rights to clone it.

Here are some steps you can follow to troubleshoot and resolve this issue:

1. **Verify Repository URL**: 
   Make sure the URL `git@github.com:progrit/shared-module-ios.git` is correct. You can try to manually visit the repository URL in your browser to confirm that the repository exists.

2. **Check Your SSH Key**:
   If you're using SSH to clone the repository, ensure that your SSH key is correctly added to your GitHub account.
   - Run the following command to check if the correct SSH key is in use:
     ```bash
     ssh -T git@github.com
     ```
     This should prompt a message confirming your GitHub username. If it fails, you may need to add your SSH key to GitHub or configure the correct one.

3. **Verify Access Permissions**:
   Ensure you have the required permissions (read or write access) to clone the repository. If this is a private repository, confirm that your GitHub account has access.

4. **Update Submodule URL** (if the URL is outdated):
   Sometimes submodule URLs might need to be updated. You can do this by modifying the `.gitmodules` file in your project:
   - Open the `.gitmodules` file and verify the `url` for the `shared-module-ios`.
   - If necessary, update the URL and then run:
     ```bash
     git submodule sync
     git submodule update --init --recursive
     ```

5. **Use HTTPS Instead of SSH**:
   If SSH access is causing problems, you can try switching to HTTPS:
   - Change the submodule URL to use HTTPS in the `.gitmodules` file:
     ```bash
     url = https://github.com/progrit/shared-module-ios.git
     ```
   - Then, run the update command again:
     ```bash
     git submodule sync
     git submodule update --init
     ```

Following these steps should help you resolve the issue. Let me know if you encounter any other problems!

---
