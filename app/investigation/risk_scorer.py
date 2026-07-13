def score_evidence(flags: list) -> int:
    score = 0
    if "impossible travel" in flags: score += 20
    if "new device" in flags: score += 15
    if "privilege escalation" in flags: score += 25
    if "unusual database access" in flags: score += 15
    if "beneficiary creation" in flags: score += 10
    if "abnormal transaction" in flags: score += 20
    return min(score, 100)
