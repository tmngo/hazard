select
    objectid, sra, fhsz, fhsz_description, shape_length, shape_area
from fhszsra_23_3
where ST_Intersects(
    shape, 
    ST_Transform(
        ST_SetSRID(
            ST_MakePoint(-121.91203243540977, 37.87996799541805), -- mt diablo
            4326
        ),
        3310
    )
);

select
    objectid, sra, fhsz, fhsz_description, shape_length, shape_area
from fhszsra_23_3
where ST_Intersects(
    shape, 
    ST_Transform(
        ST_SetSRID(
            ST_MakePoint(-122.43362129934872, 37.69086827939584), -- san bruno mountain
            4326
        ),
        3310
    )
);
