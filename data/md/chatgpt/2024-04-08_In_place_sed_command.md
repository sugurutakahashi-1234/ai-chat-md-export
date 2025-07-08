# In-place sed command

日付: 2024-04-08

---

## 👤 ユーザー
*2024/4/8 17:08:46*

temp_file   wi

sed "s|${root_path}/||g" $output_file &gt; temp_file && mv temp_file $output_file

---

## 🤖 アシスタント
*2024/4/8 17:08:49*

It looks like you're working on a shell command to manipulate a file by replacing a

---
