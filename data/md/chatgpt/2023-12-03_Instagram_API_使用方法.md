# Instagram API 使用方法

日付: 2023-12-03

---

## 👤 ユーザー
*2023/12/3 19:54:54*

Webサイトにインスタグラムの投稿を埋め込みたい。リストで取得したい。こーどをかいてほしい

---

## 🤖 アシスタント
*2023/12/3 19:55:31*

ウェブサイトにInstagramの投稿をリスト形式で埋め込むには、InstagramのAPIと埋め込み機能を使用する必要があります。ただし、Instagram APIの利用にはアクセストークンが必要で、これを取得するためにはInstagramの開発者アカウントとアプリケーションの登録が必要です。

基本的な手順は次の通りです：

1. **Instagram Developer Accountを作成**: Instagramのデベロッパーアカウントを作成し、アプリケーションを登録します。

2. **Access Tokenを取得**: 登録したアプリケーションに対してアクセストークンを取得します。

3. **Instagram APIを使用**: アクセストークンを使用してInstagramのAPIにアクセスし、必要なデータを取得します。

4. **ウェブサイトに埋め込む**: 取得したデータをウェブサイトに埋め込むためのコードを書きます。

サンプルコードは以下のようになります（こちらは基本的な概念を示すもので、実際のAPIの詳細や変更には対応していない可能性があります）：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Instagram Feed</title>
</head>
<body>
    <div id="instagram-feed"></div>

    <script>
        // Access Tokenを設定
        var accessToken = 'YOUR_ACCESS_TOKEN';

        // Instagram APIへのリクエストを行う
        fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
            // データを表示する
            const posts = data.data;
            let html = '';
            posts.forEach(post => {
                html += `
                    <div class="post">
                        <img src="${post.media_url}" alt="${post.caption}" />
                        <p>${post.caption}</p>
                        <a href="${post.permalink}" target="_blank">View on Instagram</a>
                    </div>
                `;
            });
            document.getElementById('instagram-feed').innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    </script>
</body>
</html>
```

このコードは、指定されたInstagramアカウントの最近の投稿を取得し、ウェブページに表示する基本的な方法を示しています。ただし、実際の実装ではInstagramのAPIの利用規約、アクセス制限、セキュリティの側面を考慮する必要があります。また、InstagramのAPIは頻繁に更新されるため、最新のドキュメントを確認することが重要です。

---

## 👤 ユーザー
*2023/12/3 19:55:49*

hrmlとJavascriptのコードを分けて書いてほしい

---

## 🤖 アシスタント
*2023/12/3 19:56:46*

了解しました。HTMLとJavaScriptのコードを分けて記述します。

### HTMLファイル (index.html)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Instagram Feed</title>
</head>
<body>
    <div id="instagram-feed"></div>

    <!-- JavaScriptファイルの読み込み -->
    <script src="script.js"></script>
</body>
</html>
```

### JavaScriptファイル (script.js)
```javascript
// Access Tokenを設定
var accessToken = 'YOUR_ACCESS_TOKEN';

// Instagram APIへのリクエストを行う
fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`)
.then(response => response.json())
.then(data => {
    // データを表示する
    const posts = data.data;
    let html = '';
    posts.forEach(post => {
        html += `
            <div class="post">
                <img src="${post.media_url}" alt="${post.caption}" />
                <p>${post.caption}</p>
                <a href="${post.permalink}" target="_blank">View on Instagram</a>
            </div>
        `;
    });
    document.getElementById('instagram-feed').innerHTML = html;
})
.catch(error => {
    console.error('Error:', error);
});
```

この構成では、`index.html`ファイルでページの構造を定義し、`script.js`ファイルにJavaScriptコードを記述します。`script.js`は`index.html`の最後で読み込まれ、ページのDOM要素が全て読み込まれた後に実行されます。

`accessToken`は、InstagramのAPIを使用するために必要なアクセストークンです。これは自分のInstagramアプリケーションの設定から取得してください。

また、実際のウェブサイトでこのコードを使用する場合は、セキュリティとプライバシーの観点からアクセストークンを公開しないように注意してください。プロダクション環境では、アクセストークンをサーバーサイドで管理し、クライアントサイドのJavaScriptから直接アクセスしないようにすることをお勧めします。

---

## 👤 ユーザー
*2023/12/3 19:58:17*

インタスグラムグラフAPI使ってるのかな？

---

## 🤖 アシスタント
*2023/12/3 19:58:42*

はい、提供したサンプルコードではInstagram Graph APIを使用しています。Instagram Graph APIは、特にビジネスアカウントやクリエイターアカウントのデータにアクセスするために設計されており、投稿のデータやインサイトなどを取得することができます。

サンプルコードでは、`https://graph.instagram.com/me/media`というエンドポイントを使用しています。このエンドポイントを使うと、認証されたユーザーのメディアオブジェクトのリストを取得することができます。リクエストにはアクセストークンが必要で、このトークンはInstagramのデベロッパープラットフォームでアプリケーションを登録し、適切な権限を持つことで取得できます。

ただし、InstagramのAPIは使用規約やアクセスポリシーが厳格で、定期的に更新されるため、実際の実装前に最新のドキュメントを確認し、適切な手続きを行うことが重要です。また、アクセストークンを安全に管理し、直接ウェブページに埋め込まないようにすることも重要です。プロダクション環境では、サーバーサイドでアクセストークンを扱うことが推奨されます。

---
