package com.product.inventomini.service;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.product.inventomini.entity.Order;
import com.product.inventomini.entity.Payment;
import com.product.inventomini.repository.OrderRepository;
import com.product.inventomini.repository.PaymentRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
public class ExcelService {

    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;

    public ExcelService(OrderRepository orderRepo,
                        PaymentRepository paymentRepo) {
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
    }

    public byte[] generateExcel(LocalDate fromDate, LocalDate toDate) {

        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.atTime(23, 59, 59);

        List<Order> orders = orderRepo.findByOrderDateBetween(from, to);

        double totalSales = 0;
        double totalPaid = 0;

        for (Order o : orders) {
            totalSales += o.getTotalAmount();

            List<Payment> payments = paymentRepo.findByOrder(o);
            for (Payment p : payments) {
                totalPaid += p.getAmount();
            }
        }

        double balance = totalSales - totalPaid;

        long customerCount = orders.stream()
                .map(o -> o.getCustomer().getId())
                .distinct()
                .count();

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Report");

            int rowNum = 0;

            // 🔥 TITLE
            Row title = sheet.createRow(rowNum++);
            title.createCell(0).setCellValue("INVENTOMINI WHOLESALE REPORT");

            rowNum++;

            // 🔥 SUMMARY
            sheet.createRow(rowNum++).createCell(0).setCellValue("From: " + fromDate);
            sheet.createRow(rowNum++).createCell(0).setCellValue("To: " + toDate);

            sheet.createRow(rowNum++).createCell(0).setCellValue("Total Orders: " + orders.size());
            sheet.createRow(rowNum++).createCell(0).setCellValue("Customers: " + customerCount);
            sheet.createRow(rowNum++).createCell(0).setCellValue("Total Sales: ₹" + totalSales);
            sheet.createRow(rowNum++).createCell(0).setCellValue("Total Paid: ₹" + totalPaid);
            sheet.createRow(rowNum++).createCell(0).setCellValue("Balance: ₹" + balance);

            rowNum++;

            // 🔥 HEADER
            Row header = sheet.createRow(rowNum++);
            header.createCell(0).setCellValue("Type");
            header.createCell(1).setCellValue("Order ID");
            header.createCell(2).setCellValue("Customer");
            header.createCell(3).setCellValue("Amount");
            header.createCell(4).setCellValue("Date");

            // 🔥 DATA
            for (Order o : orders) {

                Row orderRow = sheet.createRow(rowNum++);
                orderRow.createCell(0).setCellValue("ORDER");
                orderRow.createCell(1).setCellValue(o.getId());
                orderRow.createCell(2).setCellValue(o.getCustomer().getShopName());
                orderRow.createCell(3).setCellValue(o.getTotalAmount());
                orderRow.createCell(4).setCellValue(o.getOrderDate().toString());

                List<Payment> payments = paymentRepo.findByOrder(o);

                for (Payment p : payments) {
                    Row payRow = sheet.createRow(rowNum++);
                    payRow.createCell(0).setCellValue("PAYMENT");
                    payRow.createCell(1).setCellValue(o.getId());
                    payRow.createCell(2).setCellValue("-");
                    payRow.createCell(3).setCellValue(p.getAmount());
                    payRow.createCell(4).setCellValue(p.getPaymentDate().toString());
                }
            }

            // 🔥 AUTO SIZE
            for (int i = 0; i < 5; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Excel generation error");
        }
    }
}