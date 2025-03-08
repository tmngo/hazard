set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

db:
  docker compose up

db-detach:
  docker compose up --detach

db-down:
  docker compose down

psql:
  docker exec -it hazard-db-1 psql -U postgres -d postgres

load-fh-data:
  docker run --rm -v .:/home -w /home --network hazard_default ghcr.io/osgeo/gdal:alpine-small-latest \
    ogr2ogr postgresql://postgres:secret7@db:5432/fh data/FHSZSRA_23_3.gdb.zip \
    -overwrite -progress --config PG_USE_COPY=YES -nlt CONVERT_TO_CURVE

init: db-detach load-fh-data

server:
  cd server; air

client:
  cd client; pnpm dev
