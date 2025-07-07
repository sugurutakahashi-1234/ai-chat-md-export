# Create Error Enums 2.0

日付: 2023-08-05

---

## 👤 ユーザー
*2023/8/5 20:35:49*

AppErrorにCaseIterable を適応させたい。RecordingManagerErrorやApiRequestManagerErrorなどもenumなので、それもCaseIterableに対応させて、AppError.allCasesでそれぞれのパターンも網羅したい。また、今後enumの定義が各RecordingManagerErrorやApiRequestManagerErrorやAppErrorが増えても、それの追記を忘れないような仕組みも作りたい。

public enum AppError: LocalizedError {
    // 共通
    case customMessageError(message: String) // 困ったときに使うエラー
    case generalError
    case unexpectedError
    case noInternetConnection
    case nilAppError // AppError を Optional とすると困る場合に使う。実質的には nil である AppError
    case unknown

    // ログイン
    case loginSessionExpired

    // 基本情報登録
    case getUserAttributesError
    case saveUserAttributesError

    // Base
    case maintenanceError(title: String, message: String)
    case appUpdate

    // Manager Error
    case apiRequestError(ApiRequestManagerError)
    case authError(AuthManagerError)
    case recordingError(RecordingManagerError)
    case gazeTrackError(GazeTrackManagerError)

    // Interactor Error
    case anchorAndEmotionAnalysisError(AnchorAndEmotionAnalysisInteractorError)

    // Calibration
    case calibrationError
    case requireCalibrationError
    case skipCalibration

    // Camera Permission
    case cameraPermissionError

    // Sound Permission
    case soundPermissionRequired

    // Research
    case fetchVideoFromStorageFailed
    
    // Video Measurement
    case videoInterruptedError

    // Questionnaire Measurement
    case submitAnswersError

    // Web Measurement
    case websiteInterruptedError
    case websiteAccessControlError(URL)
    case websiteSessionTimeout
}
public enum ApiRequestManagerError: Error {
    case domainEntityInitializationError
    case requestParameterError(Any)
}
public enum AuthManagerError: Error {
    case fetchAuthSessionError(Error)
    case signInError(Error)
    case appIdTokenNotFound
}
public enum RecordingManagerError: Error {
    case allowRecordingError(Error)
    case discardError
}

public enum GazeTrackManagerError: Error {
    case trackerNotFound
    case calibrationError
}



public enum AnchorAndEmotionAnalysisInteractorError: Error {
    case calibrationDataNotFound
    case invalidData
}

---

## 🤖 アシスタント
*2023/8/5 20:36:21*

Swiftの`CaseIterable`プロトコルはenumのすべてのケースに対して自動的に適用できます。ただし、各ケースがアソシエイティッドバリューを持たない場合のみ適用できます。

上記のコードでは、多くのenumケースがアソシエイティッドバリュー（関連値）を持っているため、`CaseIterable`プロトコルはそのままでは適用できません。関連値を持たないenumのみ`CaseIterable`プロトコルを採用することができます。

したがって、関連値を持たないenum（例：`RecordingManagerError`）に`CaseIterable`を適用することは可能ですが、`AppError`のような複雑なenumに対しては手動ですべてのケースを列挙する必要があります。

関連値を持たないenumに対して`CaseIterable`を適用する例：

```swift
public enum RecordingManagerError: Error, CaseIterable {
    case allowRecordingError
    case discardError
}
```

関連値を持つenumに対して`CaseIterable`を適用するための一般的な方法は、関連値を持たないラッパーenumを定義することです。ただし、これには多くの手動の作業が必要であり、エラーが増加するたびに手動で更新する必要があります。

今後の追記を忘れないような仕組みを構築するには、コメント、ドキュメント、テストなどを活用して開発者に通知するようにすると良いでしょう。例えば、新しいエラーケースを追加する際に更新が必要な箇所についてのコメントを残すなどが考えられます。

自動化の手段としては、コード生成ツールを使用してエラー定義から必要なコードを生成するなどの方法も考えられますが、これは実装が複雑になる可能性があるため、プロジェクトの規模とニーズに応じて検討する必要があります。

---
