package com.whispersofus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WhispersBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WhispersBackendApplication.class, args);
        System.out.println("💖 Whispers of Us Backend is running!");
    }
} 