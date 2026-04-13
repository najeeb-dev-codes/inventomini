package com.product.inventomini.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.product.inventomini.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}