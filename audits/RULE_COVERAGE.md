# Rule Coverage Validation

## Correlation Rule Combinatorics

- **Rule 1 (Threat Intel)**: Tested isolated, paired. Weight caps properly.
- **Rule 2 (Impossible Travel)**: Tested edge cases (identical IPs, large time gaps).
- **Conclusion**: Risk scoring math is deterministic and safe.
