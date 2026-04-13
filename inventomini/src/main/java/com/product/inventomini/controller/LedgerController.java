package com.product.inventomini.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.product.inventomini.dto.LedgerDTO;
import com.product.inventomini.service.LedgerService;

@RestController
@RequestMapping("/api/customers")
public class LedgerController {

    private final LedgerService service;

    public LedgerController(LedgerService service) {
        this.service = service;
    }

    @GetMapping("/{id}/ledger")
    public List<LedgerDTO> getLedger(@PathVariable Long id) {
        return service.getLedger(id);
    }
}