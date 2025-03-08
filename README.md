# hazard

## Dependencies

- [Go](https://go.dev/)
- [Docker](https://www.docker.com/)
- [just](https://github.com/casey/just)
- [pnpm](https://pnpm.io/)

## Getting started

1. Install dependencies. Once installed, the following commands should all succeed.
```
> go version
go version go1.24.0 windows/amd6

> docker --version
Docker version 27.5.1, build 9f9e405

> just --version
just 1.13.0
```

2. Clone the repository.

3. Open the repository folder in VS Code.

4. From the terminal, start the database.  Check out the `justfile` to see the details of this command.
```sh
just init
```

5. In one terminal, start the server.
```sh
just server
```

6. In another terminal, start the client.
```sh
just client
```

7. In your browser, navigate to http://localhost:5173/. The app should be working!


## Notes

```bash
# Pull the image
docker pull ghcr.io/osgeo/gdal:alpine-small-latest

# Convert from .gdb to .geojson
docker run --rm -v .:/home -w /home ghcr.io/osgeo/gdal:alpine-small-latest \
    ogr2ogr FHSZRA_23_3.geojson FHSZRA_23_3.gdb

# Copy geojson data into postgres
docker run --rm -v .:/home -w /home --network hazard_default ghcr.io/osgeo/gdal:alpine-small-latest \
    ogr2ogr postgresql://postgres:secret7@db:5432/fh data/out.geojson \
    -overwrite -progress --config PG_USE_COPY=YES

# Copy gdb data into postgres
docker run --rm -v .:/home -w /home --network hazard_default ghcr.io/osgeo/gdal:alpine-small-latest \
    ogr2ogr postgresql://postgres:secret7@db:5432/fh data/FHSZSRA_23_3.gdb.zip \
    -overwrite -progress --config PG_USE_COPY=YES -nlt CONVERT_TO_CURVE
```
