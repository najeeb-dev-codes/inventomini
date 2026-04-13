package com.product.inventomini.service;

import org.springframework.stereotype.Service;
import java.util.List;

import com.product.inventomini.entity.Customer;
import com.product.inventomini.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public Customer save(Customer c) {
        return repo.save(c);
    }

    public List<Customer> getAll() {
        return repo.findAll();
    }

    public Customer getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    // 🔥 FIXED METHOD
    public List<Customer> getByCity(String city) {
        return repo.findByCity(city);
    }
}