package com.product.inventomini.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.product.inventomini.entity.Customer;
import com.product.inventomini.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    public Customer create(@RequestBody Customer c) {
        return service.save(c);
    }

    @GetMapping
    public List<Customer> getAll() {
        return service.getAll();
    }

    // 🔥 SEARCH BY CITY
    @GetMapping("/city/{city}")
    public List<Customer> getByCity(@PathVariable String city) {
        return service.getByCity(city);
    }
}