# Change Output to Git Logs

日付: 2023-08-13

---

## 👤 ユーザー
*2023/08/13 20:44:02*

In ci_post_xcodebuild.sh of Xcode Cloud, currently it outputs the 5 latest git logs, but I would like to change this to output the difference git logs since the last distribution.

```
#!/bin/zsh
# Ref: https://developer.apple.com/documentation/xcode/including-notes-for-testers-with-a-beta-release-of-your-app

if [[ -d "$CI_APP_STORE_SIGNED_APP_PATH" ]] && [[ "$CI_WORKFLOW" == "Upload Staging ipa to TestFlight" ]]; then
  TESTFLIGHT_DIR_PATH=../TestFlight
  mkdir $TESTFLIGHT_DIR_PATH
  git fetch --deepen 5 && git log -5 --pretty=format:"%s" >! $TESTFLIGHT_DIR_PATH/WhatToTest.en-US.txt
fi

# tag のアップロードのタイミングは別途検討する
# if [[ -d "$CI_APP_STORE_SIGNED_APP_PATH" ]] && [[ "$CI_WORKFLOW" == "Upload ipa to Production AppStoreConnect" ]]; then
#   sh $CI_PROJECT_FILE_PATH/../Scripts/CI/pushTag.sh
# fi

```

---

## 🤖 アシスタント
*2023/08/13 20:44:39*

If you want to capture the difference in git logs since the last distribution, you'll need to identify the commit hash of the last distribution. Assuming you're using git tags to mark your distributions, you can compare the current commit with the latest tag to achieve this.

Here's an example of how to capture the git log differences since the last tag (assuming your distribution is marked with a git tag):

```bash
#!/bin/zsh

# Ref: https://developer.apple.com/documentation/xcode/including-notes-for-testers-with-a-beta-release-of-your-app

if [[ -d "$CI_APP_STORE_SIGNED_APP_PATH" ]] && [[ "$CI_WORKFLOW" == "Upload Staging ipa to TestFlight" ]]; then
  TESTFLIGHT_DIR_PATH=../TestFlight
  mkdir -p $TESTFLIGHT_DIR_PATH
  
  # Get the latest tag
  LATEST_TAG=$(git describe --tags --abbrev=0)

  # If the tag exists, fetch the logs from the last tag up to the current commit.
  # Otherwise, fetch the last 5 logs (as fallback).
  if [[ ! -z "$LATEST_TAG" ]]; then
    git log $LATEST_TAG..HEAD --pretty=format:"%s" > $TESTFLIGHT_DIR_PATH/WhatToTest.en-US.txt
  else
    git fetch --deepen 5 && git log -5 --pretty=format:"%s" >! $TESTFLIGHT_DIR_PATH/WhatToTest.en-US.txt
  fi
fi

# tag のアップロードのタイミングは別途検討する
# if [[ -d "$CI_APP_STORE_SIGNED_APP_PATH" ]] && [[ "$CI_WORKFLOW" == "Upload ipa to Production AppStoreConnect" ]]; then
#   sh $CI_PROJECT_FILE_PATH/../Scripts/CI/pushTag.sh
# fi
```

What's changed:
- We used `git describe --tags --abbrev=0` to fetch the latest git tag.
- Using `git log $LATEST_TAG..HEAD`, we captured the log differences between the last tag (assumed to be the last distribution) and the current commit.
- We provided a fallback to fetch the last 5 logs in case no tag is found, preserving some functionality of your original script.

Note: This assumes you're using git tags for marking your distributions. If you use a different method, the approach will need to be adapted accordingly.

---
