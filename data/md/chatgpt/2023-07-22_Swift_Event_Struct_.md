# Swift Event Struct.

日付: 2023-07-22

---

## 👤 ユーザー
*2023/07/22 18:24:23*

Swift イベント名のstruct を変数名をつくって定義して欲しい

イベント名	送信するタイミング	備考	データ送信の有無	message	 screen_name	error	measurement_id	session_id	orientation	analysis_measurement_type	is_completed
		　		String	String	AppError(String)	String	String	AppUIInterfaceOrientation(String)	AnalysisMeasurementType(String)	Bool
debug_log	デバッグログとして送信したい場合			Y							
appear_screen	画面の表示開始（ViewのonAppear() or onTask()）				Y						
disappear_screen	画面の表示終了（ViewのonDisAppear()）				Y						
occur_error	エラーが発生したとき					Y					
show_alert	アラートを表示したとき	まだ送っていないイベント				Y					
create_session	create_session 成功後						Y	Y			
start_analysis	動画 or Web調査開始後						Y	Y	Y	Y	
end_analysis	動画 or Web調査のデータ送信後（中断含む）						Y	Y	Y	Y	Y

---

## 🤖 アシスタント
*2023/07/22 18:25:46*

イベント名、そのタイミング、メッセージ、スクリーン名、エラー、計測ID、セッションID、画面の向き、分析の計測タイプ、完了フラグなどが含まれるイベントを示す構造体を以下のように定義できます。ここでは各イベントの構造体をそれぞれ定義しています。

Swiftのenumを使用し、各イベントが持つパラメーターを関連値として定義します。また、それぞれのイベントに対応する構造体を定義し、それぞれのパラメーターをプロパティとして持つようにします。

```swift
enum AppUIInterfaceOrientation: String {
    case portrait
    case landscape
}

enum AnalysisMeasurementType: String {
    case video
    case web
}

enum AppError: Error {
    case someError(String)
}

struct DebugLogEvent {
    let message: String
}

struct AppearScreenEvent {
    let screenName: String
}

struct DisappearScreenEvent {
    let screenName: String
}

struct OccurErrorEvent {
    let error: AppError
}

struct ShowAlertEvent {
    let screenName: String
}

struct CreateSessionEvent {
    let screenName: String
    let sessionId: String
}

struct StartAnalysisEvent {
    let measurementId: String
    let sessionId: String
    let orientation: AppUIInterfaceOrientation
    let analysisMeasurementType: AnalysisMeasurementType
}

struct EndAnalysisEvent {
    let measurementId: String
    let sessionId: String
    let orientation: AppUIInterfaceOrientation
    let analysisMeasurementType: AnalysisMeasurementType
    let isCompleted: Bool
}

enum AnalyticsEvent {
    case debugLog(DebugLogEvent)
    case appearScreen(AppearScreenEvent)
    case disappearScreen(DisappearScreenEvent)
    case occurError(OccurErrorEvent)
    case showAlert(ShowAlertEvent)
    case createSession(CreateSessionEvent)
    case startAnalysis(StartAnalysisEvent)
    case endAnalysis(EndAnalysisEvent)
}
```

上記のように、各イベントに対応する構造体を定義することで、各イベントが必要とするパラメーターを明確にすることができます。そして、`AnalyticsEvent` enumを使用することで、これらの構造体を1つの型で扱うことができます。

---
