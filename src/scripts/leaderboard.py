#!/usr/bin/env python3
import json
import os
import time
import secrets
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler

SCORES_FILE = "/home/ubuntu/lobster-game/src/data/scores.json"
MAX_SCORE = 10000
RATE_LIMIT_SECONDS = 10
POINTS_PER_SECOND = 50  # Max reasonable scoring rate

# Active game sessions: session_id -> {start_time, ip}
active_sessions = {}
last_submission = {}

def load_scores():
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE) as f:
            return json.load(f)
    return []

def save_scores(scores):
    with open(SCORES_FILE, "w") as f:
        json.dump(scores, f)

class LeaderboardHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass
    
    def send_json(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
    
    def do_GET(self):
        if self.path == "/start":
            # Start new game session
            session_id = secrets.token_hex(16)
            active_sessions[session_id] = {
                "start": time.time(),
                "ip": self.client_address[0]
            }
            # Clean old sessions (>30 min)
            cutoff = time.time() - 1800
            for sid in list(active_sessions.keys()):
                if active_sessions[sid]["start"] < cutoff:
                    del active_sessions[sid]
            
            self.send_json(200, {"session": session_id})
            return
        
        # Default: return scores
        scores = load_scores()
        best_scores = {}
        for entry in scores:
            name, score = entry["name"], entry["score"]
            if name not in best_scores or score > best_scores[name]:
                best_scores[name] = score
        
        deduped = [{"name": k, "score": v} for k, v in best_scores.items()]
        deduped.sort(key=lambda x: x["score"], reverse=True)
        self.send_json(200, deduped[:10])
    
    def do_POST(self):
        client_ip = self.client_address[0]
        now = time.time()
        
        # Rate limiting
        if client_ip in last_submission:
            if now - last_submission[client_ip] < RATE_LIMIT_SECONDS:
                self.send_json(429, {"error": "Too fast! Wait a few seconds."})
                return
        
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode()
        
        try:
            data = json.loads(body)
            name = data.get("name", "Anonymous")[:20].strip()
            score = int(data.get("score", 0))
            session_id = data.get("session", "")
            
            # Validation
            if not name or name.lower() in ["anonymous", "your name"]:
                raise ValueError("Please enter a real name")
            
            if score <= 0:
                raise ValueError("Score must be positive")
            
            if score > MAX_SCORE:
                raise ValueError(f"Nice try! Max score is {MAX_SCORE} 🦞")
            
            # Session validation
            if session_id and session_id in active_sessions:
                session = active_sessions[session_id]
                elapsed = now - session["start"]
                max_possible = int(elapsed * POINTS_PER_SECOND)
                
                if score > max_possible:
                    raise ValueError(f"Score too high for {int(elapsed)}s of play. Nice try! 🦞")
                
                # Clean up session
                del active_sessions[session_id]
            
            # Save score
            scores = load_scores()
            existing = None
            for i, entry in enumerate(scores):
                if entry["name"].lower() == name.lower():
                    existing = i
                    break
            
            if existing is not None:
                if score > scores[existing]["score"]:
                    scores[existing]["score"] = score
                    scores[existing]["name"] = name
            else:
                scores.append({"name": name, "score": score})
            
            scores.sort(key=lambda x: x["score"], reverse=True)
            scores = scores[:100]
            save_scores(scores)
            
            last_submission[client_ip] = now
            self.send_json(200, {"ok": True})
            
        except Exception as e:
            self.send_json(400, {"error": str(e)})

if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8081), LeaderboardHandler)
    print("Leaderboard API running on port 8081")
    server.serve_forever()
