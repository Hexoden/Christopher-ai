# Security Policy

Thank you for helping keep Christopher AI secure.

## Supported Versions

Security fixes are provided for the latest code on `main` and the most recent release.

| Version | Supported |
| ------- | --------- |
| Latest release | :white_check_mark: |
| `main` branch | :white_check_mark: |
| Older releases | :x: |

## Reporting a Vulnerability

Please do **not** open a public issue for security vulnerabilities.

Use one of these channels:

1. GitHub Private Vulnerability Reporting (preferred):
   - https://github.com/Hexoden/Christopher-ai-r1/security/advisories/new
2. If private advisories are unavailable, open a normal issue with minimal details and request a private contact path:
   - https://github.com/Hexoden/Christopher-ai-r1/issues

## What to Include in a Report

Please include as much of the following as possible:

- A clear description of the vulnerability
- Impact and affected components
- Reproduction steps or proof of concept
- Environment details (OS, browser, Docker version, deployment mode)
- Any suggested mitigation

## Response Expectations

- Initial acknowledgement target: within 3 business days
- Triage target: within 7 business days
- Fix timeline: depends on severity and complexity

Critical issues will be prioritized first.

## Disclosure Process

- We will validate and triage the report.
- We may ask for additional details or testing help.
- A fix will be prepared and released.
- Public disclosure should happen after a fix is available.

## Scope Notes

This repository includes a self-hosted web interface and local deployment scripts.

In-scope examples:
- Authentication and profile handling issues
- Data exposure risks in local storage handling
- API route vulnerabilities
- Container and reverse-proxy misconfiguration risks caused by default project config

Out-of-scope examples:
- Vulnerabilities in third-party software not controlled by this project (unless directly caused by project configuration)
- Issues requiring physical/local machine compromise unrelated to Christopher AI
- General hardening advice without a demonstrable security flaw

## Safe Harbor

If you make a good-faith effort to follow this policy and avoid privacy disruption, we will treat your research as authorized and welcome your report.
