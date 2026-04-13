package com.product.inventomini.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import com.product.inventomini.dto.LedgerDTO;
import com.product.inventomini.entity.*;
import com.product.inventomini.repository.*;

@Service
public class LedgerService {

    private final CustomerRepository customerRepo;
    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;

    public LedgerService(CustomerRepository customerRepo,
                         OrderRepository orderRepo,
                         PaymentRepository paymentRepo) {
        this.customerRepo = customerRepo;
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
    }

    public List<LedgerDTO> getLedger(Long customerId) {

        Customer customer = customerRepo.findById(customerId).orElseThrow();

        List<Order> orders = orderRepo.findByCustomer(customer);

        List<LedgerDTO> ledger = new ArrayList<>();

        double runningBalance = 0;

        for (Order order : orders) {

            // 🔥 ADD ORDER ENTRY
            runningBalance += order.getTotalAmount();

            ledger.add(new LedgerDTO(
                    "ORDER",
                    order.getId(),
                    order.getTotalAmount(),
                    runningBalance,
                    order.getOrderDate()
            ));

            // 🔥 ADD PAYMENTS FOR THIS ORDER
            List<Payment> payments = paymentRepo.findByOrder(order);

            for (Payment p : payments) {

                runningBalance -= p.getAmount();

                ledger.add(new LedgerDTO(
                        "PAYMENT",
                        order.getId(),
                        p.getAmount(),
                        runningBalance,
                        p.getPaymentDate()
                ));
            }
        }

        return ledger;
    }
}