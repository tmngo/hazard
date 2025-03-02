package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
)

func main() {
	resp, err := http.Get("https://api.open-meteo.com/v1/forecast?latitude=47.66215077661546&longitude=-122.34999967453409&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m")
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	var result map[string]any
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	databaseURL := "postgresql://postgres:secret7@localhost:5432/fh"
	conn, err := pgx.Connect(context.Background(), databaseURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)

	var greeting string
	err = conn.QueryRow(ctx, "select 'Hello, world!'").Scan(&greeting)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	log.Printf("%v %v", result["current"], greeting)
}
