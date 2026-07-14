# AttackChain AI Scenarios

## Active Scenarios
### Scenario 1 — Credential Theft → Wire Fraud ✅
* **Story:** An attacker steals an employee's credentials, logs in via an unknown VPN, escalates privileges to access the banking database, creates three unauthorized beneficiaries, and executes a high-value wire transfer.
* **Timeline:** Login (T+0) → VPN (T+5m) → Device (T+10s) → Escalation (T+2m) → Access (T+30s) → Beneficiary (T+1m) → Transfer (T+10s)
* **MITRE:** T1078, T1133, T1078, T1068, T1078, T1098, T1565
* **Rules Fired:** Threat Intel, Impossible Travel, Unknown Device, Privilege Escalation, Suspicious Beneficiary, Large Transaction.
* **Confidence:** 100/100
* **Demo Notes:** This is the "golden scenario" used for the hackathon demo. Everything must work perfectly for this path.

## Future Scenarios
* Scenario 2 — Insider Data Exfiltration
* Scenario 3 — Mule Network
* Scenario 4 — Malware
* Scenario 5 — Ransomware
* Scenario 6 — ATM Fraud
* Scenario 7 — SWIFT Fraud
