package com.fitness.activityservice.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Override
    protected String getDatabaseName() {
        return "fitnessactivity"; // <--- FORCING THE NAME HERE
    }

    @Override
    public MongoClient mongoClient() {
        // Explicitly connecting to your local URL
        return MongoClients.create("mongodb://localhost:27017");
    }
}
