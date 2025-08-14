package com.portfolio.service;

import com.portfolio.model.Stock;
import com.portfolio.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {
    private final StockRepository repo;

    public StockService(StockRepository repo) {
        this.repo = repo;
    }

    public List<Stock> getAllStocks() {
        return repo.findAll();
    }

    public Stock addStock(Stock stock) {
        return repo.save(stock);
    }

    public void deleteStock(Long id) {
        repo.deleteById(id);
    }
}