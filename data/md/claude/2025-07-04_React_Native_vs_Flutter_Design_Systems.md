# React Native vs Flutter Design Systems

日付: 2025-07-04

---

## 👤 ユーザー
*2025/7/4 19:36:25*

flutterは基本的に実装するとGoogleのマテリアルデザインライクに実装されると思うがreact ネイティブの特にexpoではデフォルトでどんなデザインが適応されるのか？

---

## 🤖 アシスタント
*2025/7/4 19:36:40*

React Native（特にExpo）では、Flutterのようなデフォルトのデザインシステムは**適用されません**。主な特徴は以下の通りです：

## React Native/Expoのデフォルトデザイン

### 基本的な見た目
- **最小限のスタイル**のみが適用される
- テキストは黒色、背景は白（または透明）
- ボタンなどのコンポーネントも非常にシンプルな見た目
- プラットフォーム固有の基本的なスタイルのみ

### プラットフォームごとの違い
```javascript
// 例：Buttonコンポーネント
<Button title="Press me" onPress={handlePress} />
```
- **iOS**: システムのデフォルトボタン（青いテキスト）
- **Android**: マテリアルデザインの簡易版ボタン

### スタイリングの必要性
React Native/Expoでは、開発者が明示的にスタイルを定義する必要があります：

```javascript
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
  }
});
```

## UIライブラリの選択肢

Expoでよく使われるUIライブラリ：

1. **NativeBase** - マテリアルデザインベース
2. **React Native Elements** - クロスプラットフォーム対応
3. **React Native Paper** - マテリアルデザイン準拠
4. **Tamagui** - モダンでカスタマイズ可能
5. **Gluestack UI** - 最新のコンポーネントライブラリ

これらを使用することで、Flutterのような統一されたデザインシステムを実現できます。

---

## 👤 ユーザー
*2025/7/4 19:38:22*

react ネイティブでiOSとAndroidでそれぞれのOSに合わせたような体験をしてもらいたい場合はどうしたらいいのか？

例えばflutterでGo routerで遷移すればそれぞれのOSに合わせた繊維をしたりナビゲーションバーのきょどうをしてくれるとおもう

---

## 🤖 アシスタント
*2025/7/4 19:38:56*

React Nativeで各OSネイティブな体験を提供する方法をいくつか紹介します：

## 1. React Navigationでのプラットフォーム対応

React Navigationは、プラットフォームに応じた遷移アニメーションを自動的に適用します：

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            // iOS: スライド、Android: フェード＋スライドアップ
            animation: 'default' // 自動でOS別アニメーション
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 2. プラットフォーム別のコンポーネント使い分け

### Platform APIを使用
```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 44 : 56,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### プラットフォーム別ファイル
```
Button.ios.js    // iOS用
Button.android.js // Android用

// 使用時は通常通りimport
import Button from './Button'; // 自動で適切なファイルが選択される
```

## 3. ネイティブUIコンポーネントの活用

### iOS/Android標準のUIを使用
```javascript
import { 
  ActionSheetIOS,  // iOS専用
  ToastAndroid,    // Android専用
  Alert,           // クロスプラットフォーム
} from 'react-native';

// アクションシートの例
const showActionSheet = () => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Delete'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) handleDelete();
      }
    );
  } else {
    Alert.alert(
      'Delete Item',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDelete, style: 'destructive' }
      ]
    );
  }
};
```

## 4. React Native PaperでのAdaptive Components

```javascript
import { 
  Appbar,
  BottomNavigation,
  NavigationBar 
} from 'react-native-paper';

// 自動でプラットフォームに適応
<Appbar.Header>
  <Appbar.BackAction onPress={() => {}} />
  <Appbar.Content title="Title" />
  {Platform.OS === 'ios' ? (
    <Appbar.Action icon="dots-horizontal" onPress={() => {}} />
  ) : (
    <Appbar.Action icon="dots-vertical" onPress={() => {}} />
  )}
</Appbar.Header>
```

## 5. 推奨ライブラリの組み合わせ

### 最適なセットアップ
```javascript
// package.json
{
  "dependencies": {
    "@react-navigation/native": "^6.x",
    "@react-navigation/native-stack": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@react-navigation/material-top-tabs": "^6.x",
    "react-native-safe-area-context": "^4.x",
    "react-native-screens": "^3.x",
    "react-native-gesture-handler": "^2.x"
  }
}
```

### ナビゲーション設定例
```javascript
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        // iOS: 下部タブ、Android: 状況に応じて上部/下部
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'white',
          },
          android: {
            backgroundColor: '#f5f5f5',
            elevation: 8,
          },
        }),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## 6. ジェスチャーの違いも考慮

```javascript
import { 
  SwipeableListView,  // iOS風スワイプ
  DrawerLayout        // Android風ドロワー
} from 'react-native-gesture-handler';

// iOS: スワイプで削除
// Android: 長押しで選択モード
const ListItem = ({ item, onDelete }) => {
  if (Platform.OS === 'ios') {
    return (
      <Swipeable
        renderRightActions={() => (
          <DeleteAction onPress={() => onDelete(item.id)} />
        )}
      >
        <ItemContent item={item} />
      </Swipeable>
    );
  } else {
    return (
      <TouchableNativeFeedback
        onLongPress={() => setSelectionMode(true)}
        background={TouchableNativeFeedback.Ripple()}
      >
        <ItemContent item={item} />
      </TouchableNativeFeedback>
    );
  }
};
```

これらの方法を組み合わせることで、FlutterのGo Routerと同様に、各プラットフォームにネイティブな体験を提供できます。React Navigationが特に優れているのは、デフォルトで各OSの標準的な遷移アニメーションとナビゲーション動作を提供する点です。

---
