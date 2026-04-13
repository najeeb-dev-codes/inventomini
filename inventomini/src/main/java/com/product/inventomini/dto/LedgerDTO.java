package com.product.inventomini.dto;

import java.time.LocalDateTime;

public class LedgerDTO {

    private String type; // ORDER / PAYMENT
    private Long orderId;
    private Double amount;
    private Double balance;
    private LocalDateTime date;

    public LedgerDTO(String type, Long orderId, Double amount, Double balance, LocalDateTime date) {
        this.type = type;
        this.orderId = orderId;
        this.amount = amount;
        this.balance = balance;
        this.date = date;
    }

    public String getType() { return type; }
    public Long getOrderId() { return orderId; }
    public Double getAmount() { return amount; }
    public Double getBalance() { return balance; }
    public LocalDateTime getDate() { return date; }
}