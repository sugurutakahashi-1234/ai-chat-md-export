# Android Bottom Sheet マテリアルデザイン

日付: 2024-12-06

---

## 👤 ユーザー
*2024/12/06 19:25:31*

Android sheet遷移

---

## 🤖 アシスタント
*2024/12/06 19:25:43*

Androidでボトムシートの遷移を実装する場合、`BottomSheetDialogFragment` や `BottomSheetBehavior` を使用する方法があります。以下は基本的な遷移の手順について解説します。

---

### **1. BottomSheetDialogFragmentを使用した遷移**
`BottomSheetDialogFragment` は簡単にボトムシートを表示するためのフラグメントです。

#### **実装手順**
1. **カスタムレイアウトの作成**
   res/layout/bottom_sheet_layout.xml:
   ```xml
   <LinearLayout
       xmlns:android="http://schemas.android.com/apk/res/android"
       android:layout_width="match_parent"
       android:layout_height="wrap_content"
       android:orientation="vertical"
       android:padding="16dp">
       
       <TextView
           android:id="@+id/titleText"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:text="Bottom Sheet Title"
           android:textSize="18sp" />
       
       <Button
           android:id="@+id/closeButton"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:text="Close" />
   </LinearLayout>
   ```

2. **BottomSheetDialogFragmentの作成**
   ```kotlin
   class MyBottomSheetFragment : BottomSheetDialogFragment() {
       override fun onCreateView(
           inflater: LayoutInflater, container: ViewGroup?,
           savedInstanceState: Bundle?
       ): View? {
           val view = inflater.inflate(R.layout.bottom_sheet_layout, container, false)
           
           view.findViewById<Button>(R.id.closeButton).setOnClickListener {
               dismiss() // ボトムシートを閉じる
           }
           return view
       }
   }
   ```

3. **表示のトリガー**
   ActivityやFragmentで以下を呼び出します。
   ```kotlin
   val bottomSheet = MyBottomSheetFragment()
   bottomSheet.show(supportFragmentManager, bottomSheet.tag)
   ```

---

### **2. BottomSheetBehaviorを使用した遷移**
`BottomSheetBehavior` を使用する場合、任意の `View` をボトムシートとして制御できます。

#### **実装手順**
1. **カスタムレイアウトの作成**
   res/layout/activity_main.xml:
   ```xml
   <CoordinatorLayout
       xmlns:android="http://schemas.android.com/apk/res/android"
       android:layout_width="match_parent"
       android:layout_height="match_parent">
       
       <FrameLayout
           android:layout_width="match_parent"
           android:layout_height="match_parent" />

       <LinearLayout
           android:id="@+id/bottomSheet"
           android:layout_width="match_parent"
           android:layout_height="wrap_content"
           android:background="@android:color/white"
           android:orientation="vertical"
           app:layout_behavior="com.google.android.material.bottomsheet.BottomSheetBehavior">
           
           <TextView
               android:id="@+id/sheetTitle"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:text="Hello Bottom Sheet" />

           <Button
               android:id="@+id/closeButton"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:text="Close" />
       </LinearLayout>
   </CoordinatorLayout>
   ```

2. **Behaviorの設定**
   ```kotlin
   class MainActivity : AppCompatActivity() {
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           setContentView(R.layout.activity_main)

           val bottomSheet = findViewById<LinearLayout>(R.id.bottomSheet)
           val behavior = BottomSheetBehavior.from(bottomSheet)

           // 初期状態を設定
           behavior.state = BottomSheetBehavior.STATE_COLLAPSED

           // ボタンで開閉
           findViewById<Button>(R.id.closeButton).setOnClickListener {
               if (behavior.state == BottomSheetBehavior.STATE_EXPANDED) {
                   behavior.state = BottomSheetBehavior.STATE_COLLAPSED
               } else {
                   behavior.state = BottomSheetBehavior.STATE_EXPANDED
               }
           }
       }
   }
   ```

---

### **追加のポイント**
- **モーションアニメーション**: ボトムシートの表示に `MotionLayout` を組み合わせることで、滑らかな遷移を実現できます。
- **ドラッグ操作の検出**: `BottomSheetCallback` を利用してドラッグ時の挙動をカスタマイズ可能です。
- **Material Designの導入**: `com.google.android.material:material` ライブラリを活用することで、統一感のあるUIを実現できます。

---

### **シナリオごとの遷移**
1. **単純なモーダル表示**: `BottomSheetDialogFragment` を使用。
2. **カスタマイズ可能なインタラクション**: `BottomSheetBehavior` を使用。
3. **高度なアニメーション**: `MotionLayout` を追加で検討。

必要に応じて詳細な実装をサポートしますのでお知らせください！

---
