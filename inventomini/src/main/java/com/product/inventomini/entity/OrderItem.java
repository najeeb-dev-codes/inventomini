package com.product.inventomini.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;
    private Double price;
    private Double total;

    @ManyToOne
    // ✅ Removed @JsonIgnore — product is now included in API response
    private Product product;

    @ManyToOne
    @JsonBackReference
    private Order order;

    // getters & setters
    public Long getId() { return id; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}