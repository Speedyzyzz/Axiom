# AttackChain AI Threat Model

## Assets
- Customer Accounts
- Employee Credentials
- Banking Transactions

## Threat Actors
- External Attacker
- Insider
- Malware
- Credential Stuffing
- Rogue Employee

## Attack Paths (Scenario 1)
Credential Theft
→ VPN
→ New Device
→ Privilege Escalation
→ DB Access
→ Beneficiary Creation
→ Transaction

## Detection Points
- `[x]` Login
- `[x]` VPN
- `[x]` Device
- `[x]` Privilege
- `[x]` Database
- `[x]` Beneficiary
- `[x]` Transaction
