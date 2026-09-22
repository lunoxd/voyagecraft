package com.voyagecraft.orchestrator.controller;

import com.voyagecraft.orchestrator.dto.ApiResponse;
import com.voyagecraft.orchestrator.dto.AuthRequest;
import com.voyagecraft.orchestrator.dto.AuthResponse;
import com.voyagecraft.orchestrator.dto.SignUpRequest;
import com.voyagecraft.orchestrator.model.UserEntity;
import com.voyagecraft.orchestrator.repository.UserRepository;
import com.voyagecraft.orchestrator.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(@RequestBody SignUpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("User with this email already exists in SQL database", "TRC-SIGNUP-ERR"));
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase() : "TRAVELER";
        UserEntity newUser = new UserEntity(
                "USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                request.getName(),
                email,
                request.getPassword(), // In production BCryptPasswordEncoder
                role
        );
        userRepository.save(newUser);

        List<String> permissions = getPermissionsForRole(role);
        String token = jwtUtil.generateToken(email, role, permissions);
        AuthResponse response = new AuthResponse(token, email, newUser.getName(), role, permissions);

        return ResponseEntity.ok(ApiResponse.ok("User registered in SQL database successfully", response, "TRC-SIGNUP-OK"));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(@RequestBody AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Invalid email or password", "TRC-AUTH-ERR"));
        }

        UserEntity user = userOpt.get();
        String role = user.getRole();
        List<String> permissions = getPermissionsForRole(role);
        String token = jwtUtil.generateToken(email, role, permissions);
        AuthResponse response = new AuthResponse(token, email, user.getName(), role, permissions);

        return ResponseEntity.ok(ApiResponse.ok("Sign in successful", response, "TRC-AUTH-OK"));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserEntity>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("All registered SQL users retrieved", userRepository.findAll(), "TRC-USERS"));
    }

    private List<String> getPermissionsForRole(String role) {
        return "ADMIN".equals(role)
                ? List.of("packages:read", "packages:write", "bookings:all", "payments:settle", "system:manage")
                : "AGENT".equals(role)
                ? List.of("packages:read", "bookings:manage", "payments:view")
                : "DEVOPS".equals(role)
                ? List.of("system:telemetry", "eureka:orchestrate", "gateway:reconfig")
                : List.of("packages:read", "bookings:self", "payments:pay");
    }
}
