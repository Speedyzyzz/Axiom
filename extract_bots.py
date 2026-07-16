import os
import json
import gzip
import urllib.request
import tempfile

urls = {
    "sysmon": "https://s3.amazonaws.com/botsdataset/botsv1/json-by-sourcetype/botsv1.XmlWinEventLog-Microsoft-Windows-Sysmon-Operational.json.gz",
    "fgt": "https://s3.amazonaws.com/botsdataset/botsv1/json-by-sourcetype/botsv1.fgt_traffic.json.gz",
    "win": "https://s3.amazonaws.com/botsdataset/botsv1/json-by-sourcetype/botsv1.WinEventLog-Security.json.gz"
}

output_events = []

def download_and_extract(url, keywords, max_events=50):
    print(f"Downloading {url}...")
    temp_file = tempfile.mktemp(suffix=".gz")
    try:
        # Download the file
        urllib.request.urlretrieve(url, temp_file)
        
        print(f"Extracting from {temp_file}...")
        extracted = 0
        with gzip.open(temp_file, 'rt', encoding='utf-8') as f:
            for line in f:
                if any(kw in line.lower() for kw in keywords):
                    try:
                        data = json.loads(line)
                        if "result" in data:
                            output_events.append(data["result"])
                            extracted += 1
                            if extracted >= max_events:
                                break
                    except Exception as e:
                        pass
        print(f"Extracted {extracted} events.")
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

# The Wayne Enterprises BOTS v1 attack keywords:
# Attacker IP: 40.80.148.42 (AcmeVPN)
# Target Web: we8105.it (192.168.250.70)
# Ransomware: cerber
sysmon_keywords = ["cerber", "mimikatz", "vssadmin.exe delete shadows", "powershell.exe -executionpolicy bypass", "192.168.250.70", "192.168.250.100"]
fgt_keywords = ["40.80.148.42", "23.22.63.114"]
win_keywords = ["40.80.148.42", "administrator", "bob.smith"]

print("Starting extraction...")
download_and_extract(urls["sysmon"], sysmon_keywords, 50)
download_and_extract(urls["fgt"], fgt_keywords, 50)
# Skipping WinEventLog to save time/bandwidth, Sysmon+FGT is enough for an attack chain

output_path = "data/splunk_bots_official_subset.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    json.dump(output_events, f, indent=2)

print(f"Done. Saved {len(output_events)} total events to {output_path}")
