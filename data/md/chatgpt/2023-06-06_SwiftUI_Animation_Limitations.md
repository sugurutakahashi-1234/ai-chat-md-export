# SwiftUI Animation Limitations

Date: 2023-06-06

---

## 👤 User
*2023-06-06 18:34:22*

SwiftUI で fullScreenCover が消える際のアニメーションを変えるにはどうしたらいい？

---

## 🤖 Assistant
*2023-06-06 18:35:00*

SwiftUI はビューのトランジションとアニメーションを非常に簡単に扱うことができますが、現在のところ (2021年9月までの情報に基づく)、fullScreenCover または sheet の表示・非表示のアニメーションを直接カスタマイズする機能は提供していません。

つまり、現状では fullScreenCover が表示される際や消える際のアニメーションを直接変更することはできません。これは SwiftUI の規定によるもので、Apple が future releases でこれを変更する可能性はありますが、現在のところは制限されています。

しかしながら、カスタムビューを用意し、そのビュー内部でアニメーションを制御することで、ある程度アニメーションの見せ方を変更することが可能です。例えば、カスタムビューが表示された時にアニメーションを起動し、そのアニメーションが終わったら fullScreenCover を閉じる、といった方法です。

ただし、これには注意が必要で、fullScreenCover 自体の表示・非表示アニメーションと、カスタムビューのアニメーションとが同時に動くことになるため、期待したアニメーション効果が得られない場合もあります。

---

## 👤 User
*2023-06-06 18:36:37*

以下のようなコードを書くとアニメーションが無効になるときいた。

var transaction = Transaction()
                transaction.disablesAnimations = true
                withTransaction(transaction) {
                    isPresented = true
                }

---

## 🤖 Assistant
*2023-06-06 18:37:20*

はい、SwiftUIで`Transaction`と`withTransaction`を使うとビューのアニメーションを制御できます。`disablesAnimations`プロパティを`true`に設定すると、そのトランザクションの範囲内でアニメーションが無効になります。

しかし、`fullScreenCover`や`sheet`などのモーダルビューの表示と非表示のアニメーションは`Transaction`によって無効化できません。これはiOSシステムが制御する部分であり、SwiftUIのアニメーションやトランジションはこの部分に対して影響を及ぼせません。そのため、このコードは`fullScreenCover`や`sheet`の表示・非表示のアニメーションを無効にすることはできません。

なお、上述のコードで`isPresented`が`true`に設定されると`fullScreenCover`が表示されますが、この表示アニメーションは`Transaction`によって無効化されません。`fullScreenCover`内部のビューに対するアニメーション（例えばビューの位置やサイズの変更など）は無効化されますが、`fullScreenCover`自体の表示・非表示のアニメーションは影響を受けません。

---
