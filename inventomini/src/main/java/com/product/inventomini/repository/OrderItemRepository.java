package com.product.inventomini.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.product.inventomini.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}