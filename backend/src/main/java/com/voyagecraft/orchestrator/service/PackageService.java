package com.voyagecraft.orchestrator.service;

import com.voyagecraft.orchestrator.model.TravelPackageEntity;
import com.voyagecraft.orchestrator.repository.PackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PackageService {

    private final PackageRepository packageRepository;

    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    public List<TravelPackageEntity> getAllPackages() {
        return packageRepository.findAll();
    }

    public Optional<TravelPackageEntity> getPackageById(String id) {
        return packageRepository.findById(id);
    }

    public TravelPackageEntity createPackage(TravelPackageEntity pkg) {
        if (pkg.getId() == null) {
            pkg.setId("PKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (pkg.getStatus() == null) pkg.setStatus("ACTIVE");
        return packageRepository.save(pkg);
    }

    /**
     * Atomic lock acquisition to prevent double booking in SQL database.
     */
    public synchronized boolean acquireAtomicLock(String packageId, int seats) {
        Optional<TravelPackageEntity> opt = packageRepository.findById(packageId);
        if (opt.isEmpty()) return false;

        TravelPackageEntity pkg = opt.get();
        int available = pkg.getTotalCapacity() - pkg.getBookedSlots() - pkg.getLockedSlots();
        if (available < seats) {
            return false;
        }

        pkg.setLockedSlots(pkg.getLockedSlots() + seats);
        packageRepository.save(pkg);
        return true;
    }

    /**
     * Release temporary hold if saga fails or cancels.
     */
    public synchronized void releaseLock(String packageId, int seats) {
        packageRepository.findById(packageId).ifPresent(pkg -> {
            pkg.setLockedSlots(Math.max(0, pkg.getLockedSlots() - seats));
            packageRepository.save(pkg);
        });
    }

    /**
     * Commit locked slots to booked slots upon payment settlement in SQL.
     */
    public synchronized void commitBooking(String packageId, int seats) {
        packageRepository.findById(packageId).ifPresent(pkg -> {
            pkg.setLockedSlots(Math.max(0, pkg.getLockedSlots() - seats));
            pkg.setBookedSlots(pkg.getBookedSlots() + seats);
            if (pkg.getBookedSlots() >= pkg.getTotalCapacity()) {
                pkg.setStatus("SOLD_OUT");
            } else if (pkg.getTotalCapacity() - pkg.getBookedSlots() <= 3) {
                pkg.setStatus("LIMITED");
            }
            packageRepository.save(pkg);
        });
    }

    /**
     * Restore inventory on cancellation.
     */
    public synchronized void restoreInventory(String packageId, int seats) {
        packageRepository.findById(packageId).ifPresent(pkg -> {
            pkg.setBookedSlots(Math.max(0, pkg.getBookedSlots() - seats));
            if (pkg.getBookedSlots() < pkg.getTotalCapacity()) {
                pkg.setStatus("ACTIVE");
            }
            packageRepository.save(pkg);
        });
    }
}
