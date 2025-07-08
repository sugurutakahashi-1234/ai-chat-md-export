# Sort SF Symbols Alphabetically

Date: 2023-05-28

---

## 👤 User
*2023-05-28 12:51:52*

以下のnameのcase をアルファベット順に変えて欲しい

public enum SFSymbols: String {
    case exclamationmarkTriangleFill // Figma: alertFill
    case backwardEndCircle
    case backwardEndCircleFill
    case bell
    case bellBadge // Figma: bellBudge
    case bellBadgeFill // Figma: bellBudgeFill
    case bellFill
    case cameraViewfinder
    case checkmark // Figma: checkMark
    case checkmarkCircleFill // Figma: checkmarkCircleBadgeXmark
    case chevronLeft
    case chevronRight
    case clock // Figma: ClockOutline
    case clockFill
    case ellipsis // Figma: ellipse
    case eyeFill
    case eyeSlashFill
    case forwardEndCircle
    case forwardEndCircleFill
    case gearshape
    case gearshapeFill
    case house
    case houseFill
    case iphoneGen1
    case listBulletClipboardFill
    case messageFill
    case multiply
    case multiplyCircleFill
    case personBadgeClockFill
    case personFill
    case questionmarkCircle
    case questionmarkCircleFill
    case questionmarkBubbleFill
    case rectangle3GroupFill // Figma: rectangleGroupFill
    case rectanglePortraitAndArrowForward
    case squareAndArrowUp
    case squareAndArrowUpCircleFill
    case stopwatch
    case stopwatchFill
}

---

## 🤖 Assistant
*2023-05-28 12:52:19*

以下がアルファベット順に並び替えた結果です：

```swift
public enum SFSymbols: String {
    case backwardEndCircle
    case backwardEndCircleFill
    case bell
    case bellBadge // Figma: bellBudge
    case bellBadgeFill // Figma: bellBudgeFill
    case bellFill
    case cameraViewfinder
    case checkmark // Figma: checkMark
    case checkmarkCircleFill // Figma: checkmarkCircleBadgeXmark
    case chevronLeft
    case chevronRight
    case clock // Figma: ClockOutline
    case clockFill
    case ellipsis // Figma: ellipse
    case exclamationmarkTriangleFill // Figma: alertFill
    case eyeFill
    case eyeSlashFill
    case forwardEndCircle
    case forwardEndCircleFill
    case gearshape
    case gearshapeFill
    case house
    case houseFill
    case iphoneGen1
    case listBulletClipboardFill
    case messageFill
    case multiply
    case multiplyCircleFill
    case personBadgeClockFill
    case personFill
    case questionmarkBubbleFill
    case questionmarkCircle
    case questionmarkCircleFill
    case rectangle3GroupFill // Figma: rectangleGroupFill
    case rectanglePortraitAndArrowForward
    case squareAndArrowUp
    case squareAndArrowUpCircleFill
    case stopwatch
    case stopwatchFill
}
```

ただし、この並べ替えは単純にケース名をアルファベット順に並べ替えただけで、"Figma:" の後ろに付けられた名前は無視しています。それらも含めてソートする場合、その具体的なルールを教えていただければと思います。

---

## 👤 User
*2023-05-29 01:51:02*

Figmaの定義が以下に変更されたんだけど、残ったアイコン名のenumと除外されたenumにわけてほしい

```
/* Icon/QuestionmarkCircleFill */


position: relative;
left: 59.49%;
right: 36.68%;
top: 13.14%;
bottom: 78.1%;



/* Icon/ChevronRight */


position: relative;
left: 32.54%;
right: 63.64%;
top: 37.96%;
bottom: 53.28%;



/* Icon/ChevronLeft */


position: relative;
left: 27.11%;
right: 69.06%;
top: 37.96%;
bottom: 53.28%;



/* Icon/ClockFill */


position: relative;
left: 21.53%;
right: 74.64%;
top: 25.55%;
bottom: 65.69%;



/* Icon/StopwatchFill */


position: relative;
left: 32.38%;
right: 63.8%;
top: 25.55%;
bottom: 65.69%;



/* Icon/Alert_Fill */


position: relative;
left: 48.64%;
right: 47.53%;
top: 13.14%;
bottom: 78.1%;



/* Icon/SquareAndArrowUp */


position: relative;
left: 37.96%;
right: 58.21%;
top: 37.96%;
bottom: 53.28%;



/* Icon/BellFill */


position: relative;
left: 32.38%;
right: 63.8%;
top: 13.14%;
bottom: 78.1%;



/* Icon/GearshapeFill */


position: relative;
left: 21.53%;
right: 74.64%;
top: 13.14%;
bottom: 78.1%;



/* HouseFill */


position: relative;
left: 37.8%;
right: 58.37%;
top: 13.14%;
bottom: 78.1%;



/* Icon/ListBullet.clipboardFill */


position: relative;
left: 43.22%;
right: 52.95%;
top: 13.14%;
bottom: 78.1%;



/* Icon/EyeFill */


position: relative;
left: 26.95%;
right: 69.22%;
top: 50.36%;
bottom: 40.88%;



/* Icon/EyeSlashFill */


position: relative;
left: 21.53%;
right: 74.64%;
top: 50.36%;
bottom: 40.88%;



/* Icon/MessageFill */


position: relative;
left: 21.69%;
right: 74.48%;
top: 37.96%;
bottom: 53.28%;



/* Icon/CameraViewfinder */


position: relative;
left: 26.95%;
right: 69.22%;
top: 25.55%;
bottom: 65.69%;



/* Icon/IphoneGen1 */


position: relative;
left: 37.8%;
right: 58.37%;
top: 50.36%;
bottom: 40.88%;



/* Icon/PersonFIll */


position: relative;
left: 43.22%;
right: 52.95%;
top: 50.36%;
bottom: 40.88%;



/* Icon/RectanglePortraitAndArrowForward */


position: relative;
left: 43.38%;
right: 52.79%;
top: 37.96%;
bottom: 53.28%;



/* Icon/Multiply */


position: relative;
width: 24px;
height: 24px;
left: 203px;
top: 138px;



/* Icon/QuestionmarkBubbleFill */


position: relative;
width: 24px;
height: 24px;
left: 171px;
top: 36px;



/* Icon/Rectangle3GroupFill */


position: relative;
width: 24px;
height: 24px;
left: 238px;
top: 68px;



/* Icon/InfoCircle1 */


position: relative;
width: 24px;
height: 24px;
left: 337px;
top: 36px;

```

---

## 🤖 Assistant
*2023-05-29 01:52:01*

Figmaの定義から次のアイコン名が明確にわかります：

1. QuestionmarkCircleFill
2. ChevronRight
3. ChevronLeft
4. ClockFill
5. StopwatchFill
6. Alert_Fill
7. SquareAndArrowUp
8. BellFill
9. GearshapeFill
10. HouseFill
11. ListBullet.clipboardFill
12. EyeFill
13. EyeSlashFill
14. MessageFill
15. CameraViewfinder
16. IphoneGen1
17. PersonFIll
18. RectanglePortraitAndArrowForward
19. Multiply
20. QuestionmarkBubbleFill
21. Rectangle3GroupFill
22. InfoCircle1

これらを元のenumと突き合わせると次のようになります：

```swift
// 使われているenum
public enum SFSymbols: String {
    case alertFill = "Alert_Fill"
    case bellFill
    case cameraViewfinder
    case chevronLeft
    case chevronRight
    case clockFill
    case eyeFill
    case eyeSlashFill
    case gearshapeFill
    case houseFill
    case iphoneGen1
    case listBulletClipboardFill
    case messageFill
    case multiply
    case personFill = "PersonFIll"
    case questionmarkBubbleFill
    case questionmarkCircleFill
    case rectanglePortraitAndArrowForward
    case squareAndArrowUp
    case stopwatchFill
}

// 使われていないenum
public enum UnusedSFSymbols: String {
    case backwardEndCircle
    case backwardEndCircleFill
    case bell
    case bellBadge
    case bellBadgeFill
    case checkmark
    case checkmarkCircleFill
    case forwardEndCircle
    case forwardEndCircleFill
    case multiplyCircleFill
    case personBadgeClockFill
    case questionmarkCircle
    case squareAndArrowUpCircleFill
    case rectangle3GroupFill
}
```

しかし、いくつかの点を注意してください：

- "Alert_Fill" と "PersonFIll" はキャピタライズが一致しませんが、これらはFigmaの定義と一致するように調整しました。これが適切でない場合は、修正が必要です。
- Figmaの定義からは "InfoCircle1" が見つかりますが、これは元のenumには存在しません。それに対応するenumが必要な場合は追加が必要です。
- "Rectangle3GroupFill" は元のenumには存在しますが、Figmaの定義には含まれていません。したがって、使われていないenumに移動しました。

---

## 👤 User
*2023-05-29 01:59:14*

public enum SFSymbols: String {
    case bellFill
    case cameraViewfinder
    case chevronLeft
    case chevronRight
    case clockFill
    case exclamationmarkTriangleFill // Figma: alertFill
    case eyeFill
    case eyeSlashFill
    case gearshapeFill
    case houseFill
    case infoCircle // Figma: infoCircle1
    case iphoneGen1
    case listBulletClipboardFill
    case messageFill
    case multiply
    case personFill
    case questionmarkBubbleFill
    case questionmarkCircleFill
    case rectangle3GroupFill
    case rectanglePortraitAndArrowForward
    case squareAndArrowUp
    case stopwatchFill
}

アルファベット順になれべて欲しい

---

## 🤖 Assistant
*2023-05-29 01:59:35*

以下がアルファベット順に並び替えた結果です：

```swift
public enum SFSymbols: String {
    case bellFill
    case cameraViewfinder
    case chevronLeft
    case chevronRight
    case clockFill
    case exclamationmarkTriangleFill // Figma: alertFill
    case eyeFill
    case eyeSlashFill
    case gearshapeFill
    case houseFill
    case infoCircle // Figma: infoCircle1
    case iphoneGen1
    case listBulletClipboardFill
    case messageFill
    case multiply
    case personFill
    case questionmarkBubbleFill
    case questionmarkCircleFill
    case rectangle3GroupFill
    case rectanglePortraitAndArrowForward
    case squareAndArrowUp
    case stopwatchFill
}
```

ただし、ここでは単純にケース名をアルファベット順に並び替えただけで、"Figma:" の後ろに付けられた名前は無視しています。それらも含めてソートする場合、その具体的なルールを教えていただければと思います。

---
