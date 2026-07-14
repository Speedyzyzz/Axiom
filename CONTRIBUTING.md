# Contributing to AttackChain AI

## The Golden Rule
Everything must help answer one question: **"Why is this incident malicious?"** If a feature does not help answer that question, do not build it.

## Code Review Checklist
Before every commit, ensure:
- [ ] No dead code
- [ ] No duplicate logic (Services own business logic, Endpoints only orchestrate)
- [ ] Response models are valid
- [ ] Naming conventions are consistent
- [ ] Typings are correct
- [ ] Tests pass (run the Audit Suite)
- [ ] Frontend builds successfully
- [ ] Backend starts without errors
- [ ] No console errors
- [ ] No TODOs remaining

## Adding Features
- Do not add features that convert this into a general SIEM.
- Validate all backend changes by running `audit_suite.py` first.
