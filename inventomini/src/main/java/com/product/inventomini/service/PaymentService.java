package com.product.inventomini.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.product.inventomini.entity.*;
import com.product.inventomini.repository.*;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;

    public PaymentService(PaymentRepository paymentRepo,
                          OrderRepository orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }

    public Payment makePayment(Long orderId, Double amount) {

        Order order = orderRepo.findById(orderId).orElseThrow();

        List<Payment> payments = paymentRepo.findByOrder(order);

        double totalPaid = payments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        double newPaid = totalPaid + amount;
        double balance = order.getTotalAmount() - newPaid;

        if (balance < 0) {
            throw new RuntimeException("Payment exceeds order amount!");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(amount);
        payment.setBalance(balance);
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepo.save(payment);
    }

    public List<Payment> getByOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        return paymentRepo.findByOrder(order);
    }
}