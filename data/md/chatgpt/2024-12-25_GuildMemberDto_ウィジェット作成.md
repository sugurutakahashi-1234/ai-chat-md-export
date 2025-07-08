# GuildMemberDto ウィジェット作成

日付: 2024-12-25

---

## 👤 ユーザー
*2024/12/25 14:14:24*

member（GuildMemberDto）を引数にしたプライベートウィジェットを定義してほしい

ListView.builder(
                              itemCount: guildInfo.guildMembers?.length ?? 0,
                              itemBuilder: (context, index) {
                                final member = guildInfo.guildMembers![index];
                                return Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 8,
                                    horizontal: 16,
                                  ),
                                  child: DecoratedBox(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: ColorToken.secondary,
                                      ),
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(12),
                                      child: Row(
                                        children: [
                                          CircleAvatar(
                                            radius: 16,
                                            backgroundImage: NetworkImage(
                                              UriExtensions.randomImageUrl
                                                  .toString(),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                  member.userId ?? 'Unknown',
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 16,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 8),
                                                Row(
                                                  children: List.generate(
                                                    4,
                                                    (badgeIndex) =&gt; Padding(
                                                      padding:
                                                          const EdgeInsets.only(
                                                        right: 4,
                                                      ),
                                                      child: ClipRRect(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(4),
                                                        child: SizedBox(
                                                          width: 28,
                                                          height: 28,
                                                          child: Image.network(
                                                            UriExtensions
                                                                .randomImageUrl
                                                                .toString(),
                                                            fit: BoxFit.cover,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.end,
                                            children: [
                                              _buildStatRow('Q', 13),
                                              _buildStatRow('E', 48),
                                              _buildStatRow('L', 7),
                                              _buildStatRow('B', 5),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),

---

## 🤖 アシスタント
*2024/12/25 14:14:40*

以下のように、`GuildMemberDto`を引数に取るプライベートウィジェットを定義できます。このウィジェットは、各メンバーのデータを表示する責務を持ちます。

### 修正コード

```dart
class GuildMemberDto {
  final String? userId;
  // 他の必要なプロパティを追加してください。

  GuildMemberDto({this.userId});
}

class MemberListView extends StatelessWidget {
  final List<GuildMemberDto> guildMembers;

  const MemberListView({required this.guildMembers, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: guildMembers.length,
      itemBuilder: (context, index) {
        final member = guildMembers[index];
        return _GuildMemberTile(member: member);
      },
    );
  }
}

class _GuildMemberTile extends StatelessWidget {
  final GuildMemberDto member;

  const _GuildMemberTile({required this.member, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(4),
          border: Border.all(color: ColorToken.secondary),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundImage: NetworkImage(
                  UriExtensions.randomImageUrl.toString(),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      member.userId ?? 'Unknown',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: List.generate(
                        4,
                        (badgeIndex) => Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: SizedBox(
                              width: 28,
                              height: 28,
                              child: Image.network(
                                UriExtensions.randomImageUrl.toString(),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  _buildStatRow('Q', 13),
                  _buildStatRow('E', 48),
                  _buildStatRow('L', 7),
                  _buildStatRow('B', 5),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, int value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            value.toString(),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
```

### 主な変更点
1. `GuildMemberDto`を引数に取るプライベートウィジェット `_GuildMemberTile` を作成。
2. `ListView.builder`では、各メンバーを表示するために `_GuildMemberTile` を使用。
3. `_GuildMemberTile`にメンバー情報を渡してUIを構築。

これにより、UIロジックが分離され、コードが読みやすく、メンテナンスがしやすくなります。

---
