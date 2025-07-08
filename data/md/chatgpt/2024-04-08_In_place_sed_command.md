# In-place sed command

Date: 2024-04-08

---

## 👤 User
*2024-04-08 17:08:46*

temp_file   wi

sed "s|${root_path}/||g" $output_file &gt; temp_file && mv temp_file $output_file

---

## 🤖 Assistant
*2024-04-08 17:08:49*

It looks like you're working on a shell command to manipulate a file by replacing a

---
