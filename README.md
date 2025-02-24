# hazard

## Dependencies

- [Go](https://go.dev/)
- [Docker](https://www.docker.com/)
- [just](https://github.com/casey/just)

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
