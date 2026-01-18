package com.fitness.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        System.out.println("✅ LOADING GATEWAY ROUTES FROM JAVA CONFIG"); // Check console for this

        return builder.routes()
                // Route 1: Activity Service
                .route("activity-service", r -> r.path("/api/activities/**")
                        .uri("lb://activity-service")) // Ensure this matches Eureka lowercase

                // Route 2: User Service
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://user-service"))

                // Route 3: AI Service
                .route("ai-service", r -> r.path("/api/recommendations/**")
                        .uri("lb://ai-service"))

                .build();
    }
}