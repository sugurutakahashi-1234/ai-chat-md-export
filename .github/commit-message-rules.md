# Commit Message Rules

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
<type>: <subject>

<body>
```

## Required Rules

### Type
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `build`: Build system or dependencies
- `ci`: CI/CD changes
- `chore`: Other changes

### Subject
- 5-72 characters
- Present tense, imperative mood
- Must start with lowercase letter (e.g., `add` not `Add`)
- No period at end

## Tips

- Write commit messages in English
- Body is optional - use it when the change needs explanation
- Bullet points in body are recommended for clarity
- Reference issues with `#123` format

## Examples

```
feat: add JSON output format

fix: handle special characters in markdown export

refactor: simplify error handling logic

- Remove redundant try-catch blocks
- Consolidate error messages
- Add proper error types
```