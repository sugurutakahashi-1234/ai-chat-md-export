# FrameCoordinate Conversion Model

Date: 2023-07-19

---

## 👤 User
*2023-07-19 19:28:33*

FrameCoordinate を

public enum FrameCoordinate: Codable {
    case cgPoint(Double)
    case pixel(Double)

    public var cgPointSystemValue: Double {
        switch self {
        case .cgPoint(let cgPointSystemValue):
            return cgPointSystemValue
        case .pixel(let pixelSystemValue):
            return pixelSystemValue / UIScreen.main.scale
        }
    }

    public var pixelSystemValue: Double {
        switch self {
        case .cgPoint(let cgPointSystemValue):
            return cgPointSystemValue * UIScreen.main.scale
        case .pixel(let pixelSystemValue):
            return pixelSystemValue
        }
    }
}

---

## 🤖 Assistant
*2023-07-19 19:28:38*

The `FrameCoordinate` enum you provided is written in Swift and is defined with two cases: `cgPoint` and `pixel`. Each case has associated data of type `Double`.

This enum is also `Codable`, which means it can be converted to or from a serialized format (like JSON).

The enum includes two computed properties, `cgPointSystem

---
