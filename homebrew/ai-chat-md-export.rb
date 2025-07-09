class AiChatMdExport < Formula
  desc "CLI tool to convert ChatGPT and Claude chat history to Markdown"
  homepage "https://github.com/sugurutakahashi/ai-chat-md-export"
  version "0.1.0"
  license "MIT"

  # Platform-specific URLs will be updated when releases are available
  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/sugurutakahashi/ai-chat-md-export/releases/download/v#{version}/ai-chat-md-export-darwin-arm64.tar.gz"
      sha256 "PLACEHOLDER_SHA256_DARWIN_ARM64"
    else
      url "https://github.com/sugurutakahashi/ai-chat-md-export/releases/download/v#{version}/ai-chat-md-export-darwin-x64.tar.gz"
      sha256 "PLACEHOLDER_SHA256_DARWIN_X64"
    end
  end

  on_linux do
    url "https://github.com/sugurutakahashi/ai-chat-md-export/releases/download/v#{version}/ai-chat-md-export-linux-x64.tar.gz"
    sha256 "PLACEHOLDER_SHA256_LINUX_X64"
  end

  def install
    bin.install "ai-chat-md-export"
  end

  test do
    # Test basic functionality
    assert_match "ai-chat-md-export", shell_output("#{bin}/ai-chat-md-export --help", 0)
    assert_match version.to_s, shell_output("#{bin}/ai-chat-md-export --version", 0)
  end
end