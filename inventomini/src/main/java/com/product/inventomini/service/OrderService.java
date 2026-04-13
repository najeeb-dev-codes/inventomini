package com.product.inventomini.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.product.inventomini.dto.OrderRequestDTO;
import com.product.inventomini.entity.*;
import com.product.inventomini.repository.*;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final CustomerRepository customerRepo;
    private final PaymentRepository paymentRepo;

    public OrderService(OrderRepository orderRepo,
                        ProductRepository productRepo,
                        CustomerRepository customerRepo,
                        PaymentRepository paymentRepo) {

        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
        this.paymentRepo = paymentRepo;
    }

    // ✅ CREATE ORDER
    @Transactional
    public Order createOrder(OrderRequestDTO dto) {

        Customer customer = customerRepo.findById(dto.getCustomerId()).orElseThrow();

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        double totalAmount = 0;

        for (OrderRequestDTO.Item i : dto.getItems()) {

            Product product = productRepo.findById(i.getProductId()).orElseThrow();

            if (product.getStock() < i.getQuantity()) {
                throw new RuntimeException("Not enough stock");
            }

            double itemTotal = product.getPrice() * i.getQuantity();

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(i.getQuantity());
            oi.setPrice(product.getPrice());
            oi.setTotal(itemTotal);

            items.add(oi);
            totalAmount += itemTotal;

            product.setStock(product.getStock() - i.getQuantity());
            productRepo.save(product);
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        return orderRepo.save(order);
    }

    // 🔥 UPDATE ORDER (FULL LOGIC)
    @Transactional
    public Order updateOrder(Long orderId, OrderRequestDTO dto) {

        Order order = orderRepo.findById(orderId).orElseThrow();

        // 1️⃣ RESTORE OLD STOCK
        for (OrderItem oldItem : order.getItems()) {
            Product product = oldItem.getProduct();
            product.setStock(product.getStock() + oldItem.getQuantity());
            productRepo.save(product);
        }

        // 2️⃣ CLEAR OLD ITEMS
        order.getItems().clear();

        double newTotal = 0;
        List<OrderItem> newItems = new ArrayList<>();

        // 3️⃣ APPLY NEW ITEMS
        for (OrderRequestDTO.Item i : dto.getItems()) {

            Product product = productRepo.findById(i.getProductId()).orElseThrow();

            if (product.getStock() < i.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }

            double itemTotal = product.getPrice() * i.getQuantity();

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(i.getQuantity());
            oi.setPrice(product.getPrice());
            oi.setTotal(itemTotal);

            newItems.add(oi);
            newTotal += itemTotal;

            // reduce stock
            product.setStock(product.getStock() - i.getQuantity());
            productRepo.save(product);
        }

        // 4️⃣ HANDLE PAYMENTS (AUTO ADJUST 🔥)
        List<Payment> payments = paymentRepo.findByOrder(order);

        double totalPaid = payments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        if (totalPaid > newTotal) {

            double excess = totalPaid - newTotal;

            // reduce from last payments
            for (int i = payments.size() - 1; i >= 0 && excess > 0; i--) {

                Payment p = payments.get(i);

                if (p.getAmount() <= excess) {
                    excess -= p.getAmount();
                    paymentRepo.delete(p);
                } else {
                    p.setAmount(p.getAmount() - excess);
                    excess = 0;
                    paymentRepo.save(p);
                }
            }
        }

        // 5️⃣ UPDATE ORDER
        order.setItems(newItems);
        order.setTotalAmount(newTotal);

        // 6️⃣ UPDATE BALANCE
        List<Payment> updatedPayments = paymentRepo.findByOrder(order);

        double updatedPaid = updatedPayments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();

        double balance = newTotal - updatedPaid;

        for (Payment p : updatedPayments) {
            p.setBalance(balance);
            paymentRepo.save(p);
        }

        return orderRepo.save(order);
    }

    public List<Order> getAll() {
        return orderRepo.findAll();
    }
}