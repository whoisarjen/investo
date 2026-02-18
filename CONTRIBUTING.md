# Contributing to Investo

Thank you for your interest in contributing to Investo. This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository on GitHub.

2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/investo.git
cd investo
```

3. Install dependencies:

```bash
npm install
```

4. Create a branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

5. Start the development server:

```bash
npm run dev
```

## Code Style

- Use TypeScript with strict mode enabled
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add JSDoc comments for public functions and complex logic
- Format code with Prettier (configuration is included)

## Commit Messages

Write clear and meaningful commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests when relevant

## Pull Request Process

1. Ensure your code passes linting:

```bash
npm run lint
```

2. Ensure your code builds without errors:

```bash
npm run build
```

3. Update the README.md if you have added new features or changed existing behavior.

4. Submit a pull request with a clear title and description.

5. Your pull request will be reviewed by maintainers. Please be responsive to feedback.

## Reporting Issues

When reporting issues, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Browser and operating system information
- Screenshots if applicable

## Feature Requests

Feature requests are welcome. Please provide:

- A clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Any relevant mockups or examples

## Questions

If you have questions about contributing, please open an issue with the "question" label.

## License

By contributing to Investo, you agree that your contributions will be licensed under the MIT License.
