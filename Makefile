dev:
	docker compose -f dev/docker-compose.yml up --build

sprites:
	cd dev && uv run python scripts/remove_bg.py
