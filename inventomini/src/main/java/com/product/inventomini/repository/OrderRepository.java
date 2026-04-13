package com.product.inventomini.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.product.inventomini.entity.Customer;
import com.product.inventomini.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	List<Order> findByCustomer(Customer customer);
	
	List<Order> findByOrderDateBetween(LocalDateTime from, LocalDateTime to);
}