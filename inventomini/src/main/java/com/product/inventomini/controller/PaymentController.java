package com.product.inventomini.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.product.inventomini.entity.Payment;
import com.product.inventomini.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/{orderId}")
    public Payment pay(@PathVariable Long orderId,
                       @RequestParam Double amount) {
        return service.makePayment(orderId, amount);
    }

    @GetMapping("/{orderId}")
    public List<Payment> get(@PathVariable Long orderId) {
        return service.getByOrder(orderId);
    }
}