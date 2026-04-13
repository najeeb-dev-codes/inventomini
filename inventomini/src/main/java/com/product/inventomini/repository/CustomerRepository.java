package com.product.inventomini.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.product.inventomini.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // 🔥 CORRECT METHOD
    List<Customer> findByCity(String city);
}