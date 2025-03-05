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
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
}

func run() error {
	err := testOpenMeteoAPI()
	if err != nil {
		return err
	}
	err = testPostgres()
	if err != nil {
		return err
	}
	handler := NewHandler()
	err = http.ListenAndServe(":3001", handler)
	return err
}

func testOpenMeteoAPI() error {
	resp, err := http.Get("https://api.open-meteo.com/v1/forecast?latitude=47.66215077661546&longitude=-122.34999967453409&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m")
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	var result map[string]any
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return err
	}

	log.Printf("test open-meteo api: %v", result["current"])
	return nil
}

func testPostgres() error {
	ctx := context.Background()
	databaseURL := "postgresql://postgres:secret7@localhost:5432/fh"
	conn, err := pgx.Connect(ctx, databaseURL)
	if err != nil {
		return err
	}
	defer conn.Close(ctx)

	var greeting string
	err = conn.QueryRow(ctx, "select 'Hello, world!'").Scan(&greeting)
	if err != nil {
		return err
	}

	log.Printf("test postgres: %v", greeting)
	return nil
}
