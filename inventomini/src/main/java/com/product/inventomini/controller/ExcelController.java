package com.product.inventomini.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import com.product.inventomini.service.ExcelService;

@RestController
@RequestMapping("/api/reports")
public class ExcelController {

    private final ExcelService service;

    public ExcelController(ExcelService service) {
        this.service = service;
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> getExcel(
            @RequestParam String from,
            @RequestParam String to) {

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        byte[] excel = service.generateExcel(fromDate, toDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=report.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }
}