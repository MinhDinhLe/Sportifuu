package com.example.nghenhac.Repository;

import com.example.nghenhac.Model.SingerEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SingerRepository extends MongoRepository<SingerEntity, ObjectId> {
    List<SingerEntity> findAll();

    boolean existsByName(String name);
    SingerEntity findByName(String name);
}
