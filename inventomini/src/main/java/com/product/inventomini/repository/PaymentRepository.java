package com.product.inventomini.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.product.inventomini.entity.Payment;
import com.product.inventomini.entity.Order;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByOrder(Order order);
}