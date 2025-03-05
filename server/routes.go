package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
)

func NewHandler() http.Handler {
	mux := http.NewServeMux()
	addRoutes(mux)
	var handler http.Handler = mux
	handler = cors(handler)
	return handler
}

func cors(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		handler.ServeHTTP(w, r)
	})
}

func addRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/hello", helloHandler)
	mux.HandleFunc("/api/geocode", rateLimit(geocodeHandler, 1200*time.Millisecond))
	mux.HandleFunc("/api/fh", fhHandler)
}

func helloHandler(w http.ResponseWriter, req *http.Request) {
	io.WriteString(w, "Hello, client!")
}

type geocodeResponse struct {
	DisplayName string `json:"display_name"`
	PlaceID     int64  `json:"place_id"`
	Lat         string `json:"lat"`
	Lon         string `json:"lon"`
	Type        string `json:"type"`
}

func geocodeHandler(w http.ResponseWriter, req *http.Request) {
	q := req.URL.Query().Get("q")
	url := fmt.Sprintf("https://nominatim.openstreetmap.org/search?format=jsonv2&q=%s", q)
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var result []geocodeResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	io.WriteString(w, fmt.Sprintf("%#v", result))
}

func rateLimit(f func(http.ResponseWriter, *http.Request), d time.Duration) func(http.ResponseWriter, *http.Request) {
	limiter := time.Tick(d)
	return func(w http.ResponseWriter, req *http.Request) {
		select {
		case <-limiter:
			f(w, req)
		default:
			fmt.Printf("limited! %v\n", req.URL.Path)
			io.WriteString(w, fmt.Sprintf("More than 1 request / %v. Try again later!", d))
		}
	}
}

type fhResponse struct {
	objectID        int
	sra             string
	fhsz            int
	fhszDescription string
	shapeLength     float64
	shapeArea       float64
}

func fhHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	ctx := req.Context()
	databaseURL := "postgresql://postgres:secret7@localhost:5432/fh"
	conn, err := pgx.Connect(ctx, databaseURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close(ctx)

	lat := req.URL.Query().Get("lat")
	lon := req.URL.Query().Get("lon")

	var r fhResponse
	err = conn.QueryRow(ctx, `
		select objectid, sra, fhsz, fhsz_description, shape_length, shape_area
		from fhszsra_23_3
		where ST_Intersects(
			shape, 
			ST_Transform(
				ST_SetSRID(
					ST_MakePoint($1, $2),
					4326
				),
				3310
			)
		)
	`, lon, lat).Scan(&r.objectID, &r.sra, &r.fhsz, &r.fhszDescription, &r.shapeLength, &r.shapeArea)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, fmt.Sprintf("%#v", r))
}
