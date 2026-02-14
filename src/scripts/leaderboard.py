#!/usr/bin/env python3
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs

SCORES_FILE = '/home/ubuntu/lobster-game/src/data/scores.json'

def load_scores():
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE) as f:
            return json.load(f)
    return []

def save_scores(scores):
    with open(SCORES_FILE, 'w') as f:
        json.dump(scores, f)

class LeaderboardHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress logging
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        scores = load_scores()
        
        # Deduplicate: keep only highest score per name
        best_scores = {}
        for entry in scores:
            name = entry['name']
            score = entry['score']
            if name not in best_scores or score > best_scores[name]:
                best_scores[name] = score
        
        # Convert back to list and sort
        deduped = [{'name': k, 'score': v} for k, v in best_scores.items()]
        deduped.sort(key=lambda x: x['score'], reverse=True)
        top10 = deduped[:10]
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(top10).encode())
    
    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode()
        
        try:
            data = json.loads(body)
            name = data.get('name', 'Anonymous')[:20]  # Limit name length
            score = int(data.get('score', 0))
            
            if score > 0 and score < 1000000:  # Sanity check
                scores = load_scores()
                
                # Check if player exists
                existing = None
                for i, entry in enumerate(scores):
                    if entry['name'] == name:
                        existing = i
                        break
                
                if existing is not None:
                    # Only update if new score is higher
                    if score > scores[existing]['score']:
                        scores[existing]['score'] = score
                else:
                    # New player
                    scores.append({'name': name, 'score': score})
                
                scores.sort(key=lambda x: x['score'], reverse=True)
                scores = scores[:100]  # Keep top 100
                save_scores(scores)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'ok': True}).encode())
            else:
                raise ValueError('Invalid score')
        except Exception as e:
            self.send_response(400)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8081), LeaderboardHandler)
    print('Leaderboard API running on port 8081')
    server.serve_forever()
