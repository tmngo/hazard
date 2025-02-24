set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

db:
  docker compose up

db-down:
  docker compose down

psql:
  psql -h localhost -d postgres -U postgres
