package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.UsersEntity;
import com.example.nghenhac.Repository.UsersRepository;
import com.example.nghenhac.component.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService  implements IUserService{
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private  UserDetails userDetails;
    @Override
    public UsersEntity createUser(UsersEntity usersEntity) {
        String email = usersEntity.getEmail();
        if (usersRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email has been created");
        }
        usersEntity.setPassword(passwordEncoder.encode(usersEntity.getPassword()));
        return usersRepository.save(usersEntity);
    }

    @Override
    public String login(String email, String password) {
        UsersEntity optionalUsersEntity= usersRepository.findByEmail(email);
        if (optionalUsersEntity == null) { throw new DataIntegrityViolationException("Khong dung email");
    }
        if (!passwordEncoder.matches(password,optionalUsersEntity.getPassword())) {
            throw new BadCredentialsException("Wrong username/password");}
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
            authenticationManager.authenticate(authenticationToken);
            return jwtTokenUtil.generateToken(optionalUsersEntity);
        }
    public UsersEntity getUserDetailsfromJWT(String token) throws  Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new Exception("Token is expired");
        }
        String email=jwtTokenUtil.extractEmail(token);
        UsersEntity usersEntity= usersRepository.findByEmail(email);
        if ((usersEntity==null)) {
            throw new Exception("User not found");
        } else {
         return usersEntity;
        }

    }

}

