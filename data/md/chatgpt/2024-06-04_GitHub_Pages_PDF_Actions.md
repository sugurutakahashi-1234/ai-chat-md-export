# GitHub Pages PDF Actions

日付: 2024-06-04

---

## 👤 ユーザー
*2024/6/4 18:29:19*

GitHub Pages を pdf 化する GitHub Actions はないか？

---

## 🤖 アシスタント
*2024/6/4 18:29:40*

There are several GitHub Actions available to convert GitHub Pages or markdown files into PDF documents:

1. **Markdown to PDF and HTML**:
   - This action creates both PDF and HTML files from Markdown using a GitHub (or custom) theme. You can specify the input path for markdown files, output directory, and other settings.
   - Example configuration in `.yml`:
     ```yaml
     name: Docs to PDF
     on:
       push:
         branches:
           - main
         paths:
           - 'docs/**.md'
     jobs:
       converttopdf:
         name: Build PDF
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v3
           - uses: BaileyJM02/markdown-to-pdf@v1.2.0
             with:
               input_path: docs
               output_dir: pdfs
               build_pdf: true
           - uses: actions/upload-artifact@v3
             with:
               name: docs
               path: pdfs
     ```
   - More details can be found on [GitHub Marketplace](https://github.com/marketplace/actions/markdown-to-pdf-and-html).

2. **Pandoc with GitHub Actions**:
   - Pandoc can convert markdown files to PDF via LaTeX. You can use the `docker://pandoc/latex` image for LaTeX-based PDF conversion.
   - Example configuration in `.yml`:
     ```yaml
     name: Convert Markdown to PDF
     on: push
     jobs:
       convert_via_pandoc:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v2
           - run: mkdir output
           - uses: docker://pandoc/core:2.9
             with:
               args: >
                 --standalone
                 --output=output/document.pdf
                 docs/document.md
           - uses: actions/upload-artifact@v2
             with:
               name: document-pdf
               path: output
     ```
   - More information is available on [GitHub](https://github.com/pandoc/pandoc-action-example).

3. **Convert HTML to PDF**:
   - This action converts HTML files into PDF using `chrome-headless-render-pdf`.
   - Example configuration in `.yml`:
     ```yaml
     name: Convert HTML to PDF
     on: push
     jobs:
       build:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v2
           - name: Convert HTML to PDF
             uses: markwilson/html2pdf@v1.1
             with:
               htmlPath: 'index.html'
               pdfName: 'output'
           - uses: actions/upload-artifact@v2
             with:
               name: pdf
               path: 'output.pdf'
     ```
   - For more details, visit the [GitHub Marketplace](https://github.com/marketplace/actions/convert-html-to-pdf).

These actions should help you automate the conversion of your GitHub Pages or markdown files to PDF documents as part of your CI/CD workflow.

---
