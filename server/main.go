package main

import (
	"encoding/json"
	"log"
	"net/http"
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
	log.Printf("%v", result["current"])
}
