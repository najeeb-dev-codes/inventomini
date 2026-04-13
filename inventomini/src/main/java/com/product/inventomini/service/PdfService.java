package com.product.inventomini.service;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.product.inventomini.dto.LedgerDTO;
import com.product.inventomini.entity.Customer;
import com.product.inventomini.repository.CustomerRepository;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

@Service
public class PdfService {

    private final LedgerService ledgerService;
    private final CustomerRepository customerRepo;

    public PdfService(LedgerService ledgerService,
                      CustomerRepository customerRepo) {
        this.ledgerService = ledgerService;
        this.customerRepo = customerRepo;
    }

    public byte[] generateLedgerPdf(Long customerId) {

        Customer customer = customerRepo.findById(customerId).orElseThrow();
        List<LedgerDTO> ledger = ledgerService.getLedger(customerId);

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // 🔥 TITLE
            document.add(new Paragraph("CUSTOMER LEDGER REPORT"));
            document.add(new Paragraph("Shop: " + customer.getShopName()));
            document.add(new Paragraph("Owner: " + customer.getOwnerName()));
            document.add(new Paragraph("City: " + customer.getCity()));
            document.add(new Paragraph(" "));

            // 🔥 CONTENT
            for (LedgerDTO entry : ledger) {

                String line = entry.getType() +
                        " | Order: " + entry.getOrderId() +
                        " | Amount: " + entry.getAmount() +
                        " | Balance: " + entry.getBalance();

                document.add(new Paragraph(line));
            }

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF");
        }
    }
}