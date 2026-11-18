# Payment Service 💳

> Enterprise Cloud Payment Processing Microservice — Supply Chain Guardian (SCG) Evaluation Benchmark Target

## Overview
`payment-service` is an enterprise payment gateway microservice handling payment authorization, charge settlement, and webhook dispatches. It serves as the primary showcase repository for **Supply Chain Guardian (SCG)**.

## Security Posture & Supply Chain Invariants
This repository exhibits real-world software supply chain scenarios:
1. **Directly Reachable Vulnerability**:
   - `jsonwebtoken@8.5.1` is used directly in [`src/middleware/auth.js`](./src/middleware/auth.js) via `jwt.verify()`.
   - Vulnerable to **CVE-2022-23529** (Key confusion in `jwt.verify` allows authentication bypass).
   - SCG AST reachability analysis classifies this as `DIRECT_IMPORTED` (Weight: 1.0, Risk Tier: `HIGH`).
2. **Direct Middleware**:
   - `body-parser@1.20.1` and `express@4.18.2`.
3. **Unreferenced / Latent Dependency**:
   - `uuid` is declared in `package.json` but unreferenced in application source code, demonstrating SCG's ability to classify dependencies as `UNREFERENCED_LATENT` (Weight: 0.2) rather than raising false-positive alerts.
4. **Development Tooling Cluster**:
   - `jest`, `supertest`, and `eslint` are isolated in `devDependencies` and clustered as `DEV_DEPENDENCY` (Weight: 0.1).

## Automated Remediation
SCG autonomously synthesizes non-breaking SemVer upgrade pull requests:
- Target: `jsonwebtoken` upgraded from `8.5.1` to `9.0.0`
- Verified by AST symbol compatibility and test regression suites.

## Getting Started

```bash
npm install
npm test
npm start
```
