# Security & Penetration Audit

## Security Injection Tests

- **SQLi Test** (`1; DROP TABLE incidents;--`): Status 422 - Handled gracefully
- **XSS Test** (`<script>alert(1)</script>`): Status 404 - Handled gracefully
