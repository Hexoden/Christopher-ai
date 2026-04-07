# Contributing to Christopher AI

Thank you for your interest in contributing to Christopher AI! This document outlines how you can help make this project better while respecting our core values of **privacy**, **transparency**, and **local-first computing**.

## 🌟 Our Values

Before contributing, please understand what drives this project:

1. **Privacy First** - No telemetry, no data collection, and no ongoing runtime cloud dependency or call-home behavior
2. **Transparency** - All code is open, all modifications must be shared (AGPL v3)
3. **Local-First** - The software should work offline on your own hardware
4. **Accessibility** - Should run on modest hardware (4-8GB RAM minimum)
5. **Community-Owned** - No single entity controls the project's direction

Clarification on cloud use: setup-time pulls from external sources (for example model downloads or package registries) can occur, but the running project should not require continuous cloud services to function.

The project director serves to help steer direction and maintain coherence, but Christopher AI remains open to a variety of contribution paths and ideas, as long as they align with these values and the mission statement:

~ Always keep yourself, information and data safe. ~

---

## 🚀 Getting Started

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Compose (Linux)
- Node.js 18+ (for development)
- Git
- Basic familiarity with terminal commands

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/christopher-ai/christopher.git
cd christopher

# Install dependencies
npm install

# Start development server
npm run dev

# Build Docker image
docker compose build

# Run the application
docker compose up -d
```
---

# 📝 How to Contribute
# 1. Reporting Bugs
Before creating a bug report, please check existing issues. When filing a new bug:
- Use the bug report template
- Include your OS, Docker version, and hardware specs
- Provide steps to reproduce
- Include error logs if applicable

# 2. Suggesting Features
Feature suggestions are welcome! Please:

- Check if a similar suggestion exists
- Describe the use case clearly
- Explain how it aligns with our values (privacy, local-first, etc.)
- Consider hardware constraints (will this work on 8GB RAM?)

We are especially interested in contributions that move Christopher toward a native desktop or mobile app experience instead of a browser-only interface.

# 3. Submitting Code Changes
## Workflow
1. Fork the repository
2. Create a branch from main:
```bash
git checkout -b feature/your-feature-name
```
3. Make your changes with clear, descriptive commit messages
4. Test thoroughly on your local environment
5. Push to your fork
6. Open a Pull Request

## Pull Request Policy
All contribution work should be reviewed through a Pull Request (PR).

### AI-Assisted Code Policy
AI-generated or AI-assisted code submissions are welcome in this community and are permitted under our contribution terms.

If you use AI tools while contributing, you are responsible for the submitted code quality. Contributors must:

- Review and validate AI-generated output for bugs, regressions, and hallucinated logic.
- Confirm that code is safe, accurate, and aligned with this project's privacy and security expectations.
- Ensure they understand how the submitted code works well enough to discuss and revise it during review.

Submissions may be sent back for revision if the contributor cannot explain key implementation decisions or if unreviewed AI output introduces avoidable issues.

### Branch Naming
Use clear, prefixed branch names:

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `security/<short-description>`

### PR Requirements
Each PR should include:

- A clear summary of what changed and why
- Linked issue(s) when applicable
- Testing evidence (commands run and results)
- Screenshots for UI/UX changes
- Notes on any breaking change or migration impact
- Security impact statement for auth, storage, transport, API, or deployment changes

### Security-Related Changes
- Do not disclose exploit details in a public PR before a fix is available.
- Follow the vulnerability process in [SECURITY.md](SECURITY.md) for sensitive reports.

### Review and Merge Expectations
- Keep PRs focused and reasonably small where possible.
- Address review feedback before requesting re-review.
- Maintainers may request additional tests or documentation updates before merge.
- CI/build checks and required approvals must pass before merge.

### Draft PRs
Draft PRs are encouraged for early feedback. Convert to ready-for-review only when:

- Core implementation is complete
- Relevant tests pass
- Documentation and screenshots are updated (if applicable)

# Commit Message Guidelines
Follow conventional commits for clarity:
```
feat: add new chat export feature
fix: resolve memory leak in Ollama connection
docs: update installation instructions
style: format code according to project standards
refactor: improve Docker volume handling
test: add unit tests for authentication
```
# Code Style
- Use meaningful variable and function names
- Comment complex logic
- Keep functions focused and small
- Follow existing code patterns
- No hardcoded secrets or credentials

# Security Baseline
- Preserve local-first behavior and avoid adding cloud telemetry.
- Keep password-required profile flows intact.
- Do not store chat content in plaintext in browser storage.
- Keep the default secure LAN IP deployment path working (`https://<host-ip>:3001`).
- Keep HTTP fallback support optional (`http://<host-ip>:3002`) and clearly documented as a fallback-only compatibility path.
- Preserve self-signed certificate generation and trust documentation for first-time client connections.
- Preserve the runtime transport status indicator in the UI so users can verify HTTPS vs HTTP at a glance.

# 4. Testing Your Changes
Before submitting a PR:

 - Code builds without errors
 - All existing tests pass
 - New features have tests (if applicable)
 - Tested on at least one supported OS (Windows/Mac/Linux)
 - Docker container starts successfully
 - Default setup scripts leave `llama3.2:1b` available in Ollama (`docker compose -p christopher exec -T ollama ollama list`)
 - Default secure LAN URL loads successfully (example: `https://<host-ip>:3001`)
 - Optional fallback-only HTTP compatibility path still works when needed (example: `http://<host-ip>:3002`)
 - Certificate warning behavior is documented and expected for first-time client connections
 - Transport status indicator correctly reflects the loaded protocol (HTTPS or HTTP)
 - No console errors in browser
 - New profile creation requires a password (minimum policy still enforced)
 - Chat history remains encrypted at rest for password-protected profiles
 - Performance impact is acceptable on minimum specs (4-8GB RAM)

# 🤝 Code Review Process
1. All PRs require at least one review from a maintainer
2. CI/CD checks must pass (linting, tests, build)
3. Be respectful and constructive in feedback
4. Address reviewer comments promptly
5. PRs may be merged once approved and passing all checks

# 📄 License Agreement
By contributing to Christopher AI, you agree that:

- Your contributions will be licensed under AGPL v3
- You have the right to license your contributions under AGPL v3
- Your contributions may be used in future versions of the project
- This ensures all modifications remain open and available to the community.

🧠 AI Model Considerations
When working with AI model integration:

- **Do not** bundle model weights in the repository
- Document how users can download models via Ollama
- Respect third-party model licenses (Meta, Mistral, etc.)
- Add clear notices about model licensing in documentation

# 🌐 Documentation Contributions
Documentation is as important as code! We welcome:

- Installation guides for different OSes
- Troubleshooting articles
- Feature explanations
- Translations (contact maintainers first)
- Code comments and inline documentation

# 💬 Getting Help
- **Questions?** Open a Discussion on GitHub
- **Urgent issues?** Check the troubleshooting guide first
- **General chat?** Join our community channels (link in README)

# 🎯 Areas Needing Help
Currently, we're looking for contributions in:

 - Mobile responsiveness improvements
 - Additional language support
 - Performance optimization for low-end hardware
 - Enhanced security features
 - Cybersecurity experts / security testers (including penetration testing)
 - Better error handling and user feedback
 - Documentation translations
 - Native UI exploration for a desktop or mobile client

#🙏 Thank You
Every contribution matters, whether it's:

- A bug fix
- A documentation improvement
- A feature suggestion
- Sharing the project with others
- Together, we're building a truly private, community-owned AI experience.

---

Built with ❤️ for privacy enthusiasts and self-hosters.

Last Updated: April 6, 2026
