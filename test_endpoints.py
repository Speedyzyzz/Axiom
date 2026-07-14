import time
import json
import urllib.request
import urllib.error

endpoints = [
    ("POST", "/api/v1/demo/reset", b"{}"),
    ("GET", "/api/v1/dashboard", None),
    ("GET", "/api/v1/incidents", None),
    ("GET", "/api/v1/incidents/1", None),
    ("GET", "/api/v1/timeline/1", None),
    ("GET", "/api/v1/graph/1", None),
    ("GET", "/api/v1/attack-chain/1", None),
    ("GET", "/api/v1/mitre-coverage", None),
    ("POST", "/api/v1/chat", b'{"query": "hello", "incident_id": 1}'),
]

base_url = "http://127.0.0.1:8000"

print("endpoint | status | time | notes")
for method, path, data in endpoints:
    url = base_url + path
    start = time.time()
    
    req = urllib.request.Request(url, data=data, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        
    try:
        with urllib.request.urlopen(req) as res:
            status = res.status
            body = res.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        status = e.code
        body = e.read().decode('utf-8')
    except Exception as e:
        print(f"{path} | ERROR | 0.0s | {str(e)}")
        continue
        
    end = time.time()
    duration = end - start
    
    notes = "OK"
    try:
        json_data = json.loads(body)
        if not json_data:
            notes = "Empty JSON"
        print(f"--- {path} JSON output ---")
        if "incidents/1" in path or "attack-chain/1" in path or "timeline/1" in path:
            print(json.dumps(json_data, indent=2))
        else:
            print(json.dumps(json_data, indent=2)[:500])
    except Exception:
        notes = "Failed to parse JSON"
        print(f"--- {path} TEXT output ---")
        print(body[:500])
        
    print(f"RESULT: {path} | {status} | {duration:.2f}s | {notes}")
