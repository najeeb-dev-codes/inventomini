package com.product.inventomini.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.product.inventomini.service.PdfService;

@RestController
@RequestMapping("/api/customers")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @GetMapping("/{id}/ledger/pdf")
    public ResponseEntity<byte[]> downloadLedger(@PathVariable Long id) {

        byte[] pdf = pdfService.generateLedgerPdf(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=ledger_" + id + ".pdf") // 🔥 HERE
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}