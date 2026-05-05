package com.example.tours.config;

import org.filestack.Client;
import org.filestack.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class FilestackConfig {

    @Value("${filestack.api-key}")
    private String apiKey;

    @Bean
    public Client filestackClient() {
        Config config = new Config(apiKey);
        return new Client(config);
    }
}
