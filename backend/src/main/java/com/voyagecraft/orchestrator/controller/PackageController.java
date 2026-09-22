package com.voyagecraft.orchestrator.controller;

import com.voyagecraft.orchestrator.dto.ApiResponse;
import com.voyagecraft.orchestrator.model.TravelPackageEntity;
import com.voyagecraft.orchestrator.service.PackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/packages")
@CrossOrigin(origins = "*")
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TravelPackageEntity>>> getAllPackages() {
        List<TravelPackageEntity> list = packageService.getAllPackages();
        return ResponseEntity.ok(ApiResponse.ok("Package catalog retrieved from SQL database", list, "TRC-PKG-" + UUID.randomUUID().toString().substring(0, 6)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TravelPackageEntity>> getPackageById(@PathVariable String id) {
        return packageService.getPackageById(id)
                .map(pkg -> ResponseEntity.ok(ApiResponse.ok("Package details found in SQL", pkg, "TRC-PKG-DET")))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TravelPackageEntity>> createPackage(@RequestBody TravelPackageEntity pkg) {
        TravelPackageEntity created = packageService.createPackage(pkg);
        return ResponseEntity.ok(ApiResponse.ok("Package persisted to SQL successfully", created, "TRC-PKG-CRT"));
    }
}
