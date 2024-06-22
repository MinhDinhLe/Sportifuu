package com.example.nghenhac.Repository;

import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.UsersEntity;
import com.mongodb.lang.NonNullApi;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UsersRepository extends MongoRepository<UsersEntity, ObjectId> {
    UsersEntity findByEmail(String email);
    List<UsersEntity> findAll();

    boolean existsByEmail(String email);

}
