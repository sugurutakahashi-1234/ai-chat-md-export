# Audio App Development Strategy

日付: 2024-05-10

---

## 👤 ユーザー
*2024/05/10 11:07:11*

User
presenter.audioData がひとつもなかった時の簡単な画面を作りたい。からであることを画像で表せればいいよSFSymbolつかってほしい

@MainActor
struct AudioListView: View {
    @StateObject private var presenter: AudioListPresenter

    init() {
        _presenter = .init(wrappedValue: .init())
    }

    var body: some View {
        List {
            ForEach(presenter.audioData) { audioData in
                DisclosureGroup {
                    Text(audioData.createdAt.asISO8601)
                    Text(audioData.fileSize.formattedSize)
                    Text(audioData.duration.mmss)
                } label: {
                    Button {
                        presenter.onTapAudio(audioData: audioData)
                    } label: {
                        Text(audioData.fileUrl.lastPathComponent)
                    }
                }
            }
        }
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    presenter.onTapTrash()
                } label: {
                    SFSymbols.trash.image
                        .foregroundStyle(.red)
                }
            }
        }
        .navigationTitle("Audio List")
        .overlayLoading(isPresented: $presenter.isLoading, isGestureReactable: false)
        .appErrorAlert(isPresented: $presenter.showAlert, appError: presenter.appError, onOk: { _ in
            presenter.onTapOkDelete()
        })
        .task {
            await presenter.onAppear()
        }
    }
}

#Preview {
    AudioListView()
        .navigationStacked()
}

---
