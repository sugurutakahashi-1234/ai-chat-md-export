# リファクタリング: AppIntroductionView

Date: 2023-06-14

---

## 👤 User
*2023-06-15 04:36:14*

以下をリファクタリングしてください

public struct AppIntroductionView: View {
    @StateObject private var presenter = AppIntroductionPresenter()
    @Environment(\.dismiss) private var dismiss

    public init() {
        // TabViewのIndicator色設定
        UIPageControl.appearance().currentPageIndicatorTintColor = CoreAssets.Color.Primary.primary100.color
        UIPageControl.appearance().pageIndicatorTintColor = CoreAssets.Color.Neutral.neutral30.color
    }

    public var body: some View {
        ZStack(alignment: .top) {
            VStack(spacing: 0) {
                TabView(selection: $presenter.selectedTab) {
                    firstView
                        .tag(IntroductionStep.introduction1)
                    secondView
                        .tag(IntroductionStep.introduction2)
                    thirdView
                        .tag(IntroductionStep.introduction3)
                    fourthView
                        .tag(IntroductionStep.introduction4)
                }
                .tabViewStyle(.page)
                .indexViewStyle(.page(backgroundDisplayMode: .automatic))
                Spacer()
                Button {
                    presenter.nextButtonTapped()
                } label: {
                    Text(presenter.nextButtonText)
                }
                .buttonStyle(CustomButtonStyle(.secondary))
                .padding(.horizontal, 16)
            }
            .background(CoreAssets.Color.Neutral.neutral5.swiftUIColor)

            // Statusbarの背景の色設定
            GeometryReader { reader in
                CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor
                    .frame(height: reader.safeAreaInsets.top, alignment: .top)
                    .ignoresSafeArea()
            }
        }
        .onReceive(presenter.onboardingCompletionSubject) {
            dismiss()
        }
    }
}

private extension AppIntroductionView {
    var firstView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding1.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }

    var secondView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding2.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }

    var thirdView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding3.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 0) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3.title)
                    .typographyStyle(.title2)
                    .padding(.top, 24)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }

    var fourthView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding4.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }
}

---

## 🤖 Assistant
*2023-06-15 04:37:21*

以下のようにリファクタリングしてみます。コードの冗長性を減らすために、共通部分を抽出して`onboardingView(for:onboarding:)`という新しいprivateメソッドを作成しました。

```swift
public struct AppIntroductionView: View {
    @StateObject private var presenter = AppIntroductionPresenter()
    @Environment(\.dismiss) private var dismiss

    public init() {
        UIPageControl.appearance().configureAppearance()
    }

    public var body: some View {
        ZStack(alignment: .top) {
            VStack(spacing: 0) {
                TabView(selection: $presenter.selectedTab) {
                    ForEach(IntroductionStep.allCases, id: \.self) { step in
                        onboardingView(for: step.onboardingImage, onboarding: step.onboardingText)
                            .tag(step)
                    }
                }
                .tabViewStyle(.page)
                .indexViewStyle(.page(backgroundDisplayMode: .automatic))

                Spacer()

                Button {
                    presenter.nextButtonTapped()
                } label: {
                    Text(presenter.nextButtonText)
                }
                .buttonStyle(CustomButtonStyle(.secondary))
                .padding(.horizontal, 16)
            }
            .background(CoreAssets.Color.Neutral.neutral5.swiftUIColor)

            GeometryReader { reader in
                CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor
                    .frame(height: reader.safeAreaInsets.top, alignment: .top)
                    .ignoresSafeArea()
            }
        }
        .onReceive(presenter.onboardingCompletionSubject) {
            dismiss()
        }
    }

    private func onboardingView(for image: Image, onboarding: Onboarding) -&gt; some View {
        VStack(spacing: 32) {
            image
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(onboarding.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(onboarding.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }
}

private extension UIPageControl {
    func configureAppearance() {
        currentPageIndicatorTintColor = CoreAssets.Color.Primary.primary100.color
        pageIndicatorTintColor = CoreAssets.Color.Neutral.neutral30.color
    }
}

private extension IntroductionStep {
    var onboardingImage: Image {
        switch self {
        case .introduction1:
            return CoreAssets.Image.Onboarding.onboarding1.swiftUIImage
        case .introduction2:
            return CoreAssets.Image.Onboarding.onboarding2.swiftUIImage
        case .introduction3:
            return CoreAssets.Image.Onboarding.onboarding3.swiftUIImage
        case .introduction4:
            return CoreAssets.Image.Onboarding.onboarding4.swiftUIImage
        }
    }

    var onboardingText: Onboarding {
        switch self {
        case .introduction1:
            return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1
        case .introduction2:
            return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2
        case .introduction3:
            return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3
        case .introduction4:
            return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4
        }
    }
}

struct Onboarding {
    let title: String
    let description: String
}

---

## 🤖 Assistant
*2023-06-15 04:37:40*

```

このリファクタリングでは、新しいメソッド`onboardingView(for:onboarding:)`を使用して共通のビューを生成しています。また、`TabView`内のビュー生成を`ForEach`を使用し、Enumの全ケースを通じて一般化しました。このようにすることで、新たなインターフェースが追加されても、Enumとその対応する画像とテキストを追加するだけで対応可能となります。このコードはあくまで一例で、具体的な要件やコードの状況により最適なリファクタリングは変わります。

---

## 👤 User
*2023-06-15 04:43:35*

OnboardingStepのextension で Image と title と description の 3つのコンピュテーっとプロパティを生やして、func onboardingView() の引数にそれぞれをせっていするようにしてほしい

enum OnboardingStep: CaseIterable {
    case onboarding1
    case onboarding2
    case onboarding3
    case onboarding4
}

public struct AppIntroductionView: View {
    @StateObject private var presenter = AppIntroductionPresenter()
    @Environment(\.dismiss) private var dismiss

    public init() {
        // TabViewのIndicator色設定
        UIPageControl.appearance().currentPageIndicatorTintColor = CoreAssets.Color.Primary.primary100.color
        UIPageControl.appearance().pageIndicatorTintColor = CoreAssets.Color.Neutral.neutral30.color
    }

    public var body: some View {
        ZStack(alignment: .top) {
            VStack(spacing: 0) {
                TabView(selection: $presenter.selectedTab) {
                    firstView
                        .tag(OnboardingStep.onboarding1)
                    secondView
                        .tag(OnboardingStep.onboarding2)
                    thirdView
                        .tag(OnboardingStep.onboarding3)
                    fourthView
                        .tag(OnboardingStep.onboarding4)
                }
                .tabViewStyle(.page)
                .indexViewStyle(.page(backgroundDisplayMode: .automatic))
                Spacer()
                Button {
                    presenter.nextButtonTapped()
                } label: {
                    Text(presenter.nextButtonText)
                }
                .buttonStyle(CustomButtonStyle(.secondary))
                .padding(.horizontal, 16)
            }
            .background(CoreAssets.Color.Neutral.neutral5.swiftUIColor)

            // Statusbarの背景の色設定
            GeometryReader { reader in
                CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor
                    .frame(height: reader.safeAreaInsets.top, alignment: .top)
                    .ignoresSafeArea()
            }
        }
        .onReceive(presenter.onboardingCompletionSubject) {
            dismiss()
        }
    }
}

private extension AppIntroductionView {
    var firstView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding1.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }

    var secondView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding2.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }

    var thirdView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding3.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 0) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3.title)
                    .typographyStyle(.title2)
                    .padding(.top, 24)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }

    var fourthView: some View {
        VStack(spacing: 32) {
            CoreAssets.Image.Onboarding.onboarding4.swiftUIImage
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4.title)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4.description)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }
}

struct AppIntroductionView_Previews: PreviewProvider {
    static var previews: some View {
        AppIntroductionView()
    }
}

---

## 🤖 Assistant
*2023-06-15 04:44:38*

ご要望に応じて、`OnboardingStep`の拡張に3つのコンピューテッドプロパティ（`onboardingImage`、`title`、`description`）を追加し、これらを引数として新しく定義した`onboardingView(for:onboardingTitle:onboardingDescription:)`メソッドに渡すように変更しました。

また、`TabView`でそれぞれのビューを`.tag()`として設定する部分も`ForEach`を用いて一般化しました。

```swift
enum OnboardingStep: CaseIterable {
    case onboarding1
    case onboarding2
    case onboarding3
    case onboarding4

    var onboardingImage: Image {
        switch self {
        case .onboarding1: return CoreAssets.Image.Onboarding.onboarding1.swiftUIImage
        case .onboarding2: return CoreAssets.Image.Onboarding.onboarding2.swiftUIImage
        case .onboarding3: return CoreAssets.Image.Onboarding.onboarding3.swiftUIImage
        case .onboarding4: return CoreAssets.Image.Onboarding.onboarding4.swiftUIImage
        }
    }

    var title: String {
        switch self {
        case .onboarding1: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1.title
        case .onboarding2: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2.title
        case .onboarding3: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3.title
        case .onboarding4: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4.title
        }
    }

    var description: String {
        switch self {
        case .onboarding1: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding1.description
        case .onboarding2: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding2.description
        case .onboarding3: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding3.description
        case .onboarding4: return CoreStrings.EmomilOnboarding.AppIntroduction.Onboarding4.description
        }
    }
}

public struct AppIntroductionView: View {
    @StateObject private var presenter = AppIntroductionPresenter()
    @Environment(\.dismiss) private var dismiss

    public init() {
        UIPageControl.appearance().configureAppearance()
    }

    public var body: some View {
        ZStack(alignment: .top) {
            VStack(spacing: 0) {
                TabView(selection: $presenter.selectedTab) {
                    ForEach(OnboardingStep.allCases, id: \.self) { step in
                        onboardingView(for: step.onboardingImage, onboardingTitle: step.title, onboardingDescription: step.description)
                            .tag(step)
                    }
                }
                .tabViewStyle(.page)
                .indexViewStyle(.page(backgroundDisplayMode: .automatic))

                Spacer()

                Button {
                    presenter.nextButtonTapped()
                } label: {
                    Text(presenter.nextButtonText)
                }
                .buttonStyle(CustomButtonStyle(.secondary))
                .padding(.horizontal, 16)
            }
            .background(CoreAssets.Color.Neutral.neutral5.swiftUIColor)

            GeometryReader { reader in
                CoreAssets.Color.PrimaryBackgroundNoGradation.primaryBackgroundNoGradation100.swiftUIColor
                    .frame(height: reader.safeAreaInsets.top, alignment: .top)
                    .ignoresSafeArea()
            }
        }
        .on

---

## 👤 User
*2023-06-15 04:45:37*

つづき

---

## 🤖 Assistant
*2023-06-15 04:46:06*

申し訳ありません、メッセージが途切れました。以下が続きです。

```swift
        .onReceive(presenter.onboardingCompletionSubject) {
            dismiss()
        }
    }

    private func onboardingView(for image: Image, onboardingTitle: String, onboardingDescription: String) -> some View {
        VStack(spacing: 32) {
            image
                .resizable()
                .scaledToFit()
            VStack(alignment: .leading, spacing: 24) {
                Text(onboardingTitle)
                    .typographyStyle(.title2)
                    .foregroundColor(CoreAssets.Color.Primary.primary100.swiftUIColor)
                Text(onboardingDescription)
                    .typographyStyle(.body2)
                    .foregroundColor(CoreAssets.Color.Neutral.neutral80.swiftUIColor)
                Spacer()
            }
            .padding(.horizontal, 16)
        }
    }
}

struct AppIntroductionView_Previews: PreviewProvider {
    static var previews: some View {
        AppIntroductionView()
    }
}
```

これにより、同様のビューを生成する部分を`onboardingView(for:onboardingTitle:onboardingDescription:)`メソッドにまとめることができました。また、`OnboardingStep`の各ケースに対応する画像、タイトル、説明の指定も`OnboardingStep`の拡張に記述することで、それぞれの情報が一箇所にまとまり、見通しもよくなりました。

---
