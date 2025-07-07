# Flutter Debug Launch Config

日付: 2024-12-10

---

## 👤 ユーザー
*2024/12/10 18:13:54*

vscode flutter debug launch json

---

## 🤖 アシスタント
*2024/12/10 18:14:15*

To configure the Flutter debugging environment in Visual Studio Code (VS Code), you need to define the launch configuration in a `launch.json` file. This file allows you to specify how you want to run or debug your Flutter application.

Here’s an example `launch.json` for a Flutter project:

### Example `launch.json`
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter: Launch",
      "type": "dart",
      "request": "launch",
      "program": "lib/main.dart",
      "cwd": "${workspaceFolder}",
      "args": [
        "--flavor",
        "development"
      ]
    },
    {
      "name": "Flutter: Attach",
      "type": "dart",
      "request": "attach",
      "deviceId": "flutter-tester",
      "cwd": "${workspaceFolder}"
    },
    {
      "name": "Flutter: Run Tests",
      "type": "dart",
      "request": "launch",
      "program": "test/all_tests.dart",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Configuration Details

1. **Flutter: Launch**
   - Runs your Flutter app starting with the specified file (`lib/main.dart` in this case).
   - Includes optional `args` to pass additional command-line arguments, such as `--flavor` for different build configurations.

2. **Flutter: Attach**
   - Attaches to an already running Flutter application (useful for debugging on physical devices or emulators).
   - You can specify a `deviceId` if needed.

3. **Flutter: Run Tests**
   - Runs your Flutter tests.
   - You can specify the path to a test entry point (e.g., `test/all_tests.dart`).

### Adding `launch.json` to Your Project
1. Open the **Run and Debug** sidebar in VS Code (`Ctrl + Shift + D` or `Cmd + Shift + D` on macOS).
2. Click the **Create a launch.json file** link.
3. Select the `Dart & Flutter` environment.
4. Modify the generated `launch.json` file to suit your project's needs.

### Notes
- The `cwd` (current working directory) is usually set to the workspace folder.
- You can customize `args` to pass Flutter-specific commands or environment variables.
- For flavors or specific build configurations, ensure your Flutter project is set up to support them (e.g., using `flutter build --flavor`).

If you need more customization, let me know your specific requirements!

---
