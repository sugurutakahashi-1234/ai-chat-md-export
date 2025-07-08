# TanStack Query vs SWR

Date: 2025-06-23

---

## 👤 User
*2025-06-23 13:21:27*

TanStack QueryとSWR比較をしてほしい。 
どういう時のどちらを採用すべきか、 そういったことも教えてほしい。

---

## 🤖 Assistant
*2025-06-23 13:21:48*

### TanStack Query と SWR の位置づけ

| 観点 | TanStack Query | SWR |
|---|---|---|
| 主眼 | **“サーバー状態管理”**——取得・キャッシュ・更新・失敗復旧までを包括的に扱う | **“stale-while-revalidate な取得”**——最小 API で軽量な再取得体験を提供 |
| API | `useQuery / useMutation / queryClient…` など粒度の細かいフック群 | `useSWR(key, fetcher)` と `mutate()` が中心のシンプル設計 |
| ミューテーション | **組み込み**（楽観的更新・ロールバック・共通 DevTools） | `mutate()` で手動更新。楽観的更新は自前実装 |
| デフォルトキャッシュ | タイムベース + ガベコレ + 永続化/ブロードキャストプラグイン | グローバルキャッシュ（Map 相当）＋焦点復帰/再接続で自動 revalidate |
| 無限スクロール・ページング | `useInfiniteQuery`（`maxPages` 等 v5で強化） | `useSWRInfinite` あり・機能は最小 |
| SSR/RSC | Hydration・React 18 Suspense・RSC 対応。Next.js App Router 用プリフェッチ API も公式ドキュメントあり | `fallback` に初期データを流し込む形で SSG/SSR。RSC ではクライアント側で再使用 |
| DevTools | 公式 DevTools（Chrome Ext／埋め込みパネル） | なし（サードパーティのみ） |
| サポートフレームワーク | React / Vue / Svelte / Solid / React Native | React（Core はフレームワーク非依存だが公式は React Hook が中心） |
| バンドルサイズ* | 18-20 kB gzip（react-query パス） | 7-8 kB gzip（v2系） |
| Star 数（2025-06） | **45.6 k** citeturn2view0 | **31.6 k** citeturn1view0 |

* ざっくり目安。ビルド設定で変動します。

---

### 2024-25 アップデートで増えた差分

* **TanStack Query v5**  
  * `useMutationState` で「ミューテーションの進行状況を横断監視」 citeturn0search8  
  * `maxPages` で無限クエリのメモリ制御 citeturn0search0  
  * `onSuccess/onError` コールバックを hook 外に分離し副作用の予測性向上 citeturn0search6  

* **SWR v2.x**（最新 v2.3.*）  
  * React 18 の Streaming/Suspense 最適化  
  * `middleware` API が安定化（自動リトライや JWT 更新を追加しやすい）  
  * 依然として「軽量シンプル」の路線 citeturn0search10  

---

### どちらを採用すべきか —— 判断フロー

| こんな場合 | 推奨 |
|---|---|
| CRUD が多く、**キャッシュとミューテーションを統一的に管理**したい（楽観的更新・差分ロールバック・オフライン永続化など） | **TanStack Query** |
| **Next.js 15 以降の RSC × App Router** でクライアント再取得のレイヤだけ欲しい | どちらでも可だが、**SWR** の方が設定が少ない |
| **複数 UI フレームワーク**（React と Vue など）を同一コードで扱いたい | **TanStack Query** |
| 画面はシンプルで **GET 中心**。バンドルを 10 kB でも削りたい & 設定ファイルを極力書きたくない | **SWR** |
| **GraphQL** を使わず REST + キャッシュ戦略を細かく設計したい | **TanStack Query** |
| 社内の既存コードが `useSWR` で統一済み／ドキュメントも揃っている | **SWR 継続**（学習コスト最小） |
| DevTools で **キャッシュ状態を可視化しながらデバッグ** したい | **TanStack Query** |
| **モバイル (React Native)** でネイティブストレージ永続化・ネットワーク復旧同期が必要 | **TanStack Query** |
| とりあえず「ローディング・エラーをいい感じに差し替えたい」程度 | **SWR**（1 Hook で導入できる） |

---

### 選定のヒント

1. **規模と将来の拡張性**  
   * 小さく始めたい → SWR で十分。あとから TanStack Query へ移行も比較的容易（キー設計の見直しは必要）。  
   * 最初からマイクロフロントエンドやオフライン要件が見えている → TanStack Query の方が後付けの負債が少ない。

2. **キー設計とキャッシュ哲学**  
   * SWR は “データの同一性 ＝ キー文字列” という割り切りが強い。  
   * TanStack Query は **キーの配列構造** + `queryFn` の分離で名前空間管理が柔軟。

3. **学習コスト**  
   * SWR ≒ React Hook ×1 で学習コスト最小。  
   * TanStack Query は概念（Query Client／Observer など）が多いが、その分ハンドリングできる範囲も広い。

4. **コミュニティ & エコシステム**  
   * TanStack Query は Router・Table・Virtual など TanStack 製品と横連携が進行中 citeturn4view0。  
   * SWR は Next.js・Vercel 製エコシステムとの相性が良く、Middleware で徐々に拡張。

---

## まとめ

- **SWR** は「キャッシュしてすぐ UI を描画し、裏で再検証する」という *１つの体験* に全振りしたミニマル志向。  
- **TanStack Query** は「取得〜更新〜エラー処理〜永続化」までを **フロントエンドの“サーバー状態レイヤ”** として統合するフルスタック志向。  

プロジェクトの**複雑度・将来要件・開発チームの習熟度**を天秤にかけ、上表の判断フローに沿って選択すると失敗が少ないでしょう。

---
