set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

db:
  docker compose up

db-down:
  docker compose down

psql:
  docker exec -it hazard-db-1 psql -U postgres -d postgres
