package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.UsersEntity;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

public interface IUserService {
    UsersEntity createUser(UsersEntity usersEntity);
    String  login(String email, String password);
    UsersEntity getUserDetailsfromJWT(@RequestHeader("Authorization") String token) throws  Exception;
}
