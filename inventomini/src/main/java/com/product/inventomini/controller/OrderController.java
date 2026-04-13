package com.product.inventomini.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.product.inventomini.dto.OrderRequestDTO;
import com.product.inventomini.entity.Order;
import com.product.inventomini.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public Order create(@RequestBody OrderRequestDTO dto) {
        return service.createOrder(dto);
    }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id,
                        @RequestBody OrderRequestDTO dto) {
        return service.updateOrder(id, dto);
    }

    @GetMapping
    public List<Order> getAll() {
        return service.getAll();
    }
}