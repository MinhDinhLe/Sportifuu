package com.example.nghenhac.Repository;

import com.example.nghenhac.Model.TracksEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TracksRepository  extends MongoRepository<TracksEntity, ObjectId> {
 Optional<TracksEntity> findById(String id);
 boolean existsByTitle(String name);

    TracksEntity findByTitle(String name);

}
