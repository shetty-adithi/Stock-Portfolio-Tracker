package com.portfolio.controller;

import com.portfolio.model.Stock;
import com.portfolio.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @RestController
    public class HomeController {
        @GetMapping("/")
        public String home() {
            return "Welcome to the Stock Portfolio Tracker API!";
        }
    }

    @GetMapping
    public List<Stock> getAll() {
        return service.getAllStocks();
    }

    @PostMapping
    public Stock add(@RequestBody Stock stock) {
        return service.addStock(stock);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteStock(id);
    }
}