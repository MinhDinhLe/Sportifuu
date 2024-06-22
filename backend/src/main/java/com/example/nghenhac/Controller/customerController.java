package com.example.nghenhac.Controller;

import ch.qos.logback.core.model.Model;
import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.UsersEntity;
import com.example.nghenhac.Repository.UsersRepository;
import com.example.nghenhac.Service.ISingerService;
import com.example.nghenhac.Service.ITrackService;
import com.example.nghenhac.Service.IUserService;
import com.example.nghenhac.component.JwtTokenUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.example.nghenhac.DTO.UserDTO;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class customerController<T> {
    private final IUserService iUserService;
    private final UsersRepository usersRepository;
    private final JwtTokenUtil jwtTokenUtil;
    @Autowired
    private final ISingerService iSingerService;
    private final ITrackService iTrackService;
    @RequestMapping("/login")
    public String login() {
        return "login";
    }
//    @RequestMapping("/register")
//    public String register() {
//        return "register";
//    }
    @PostMapping("/api/adduser")
    public ResponseEntity<?> registerAPI(@RequestBody UsersEntity userEntity, Model model) {
        iUserService.createUser(userEntity);
        return ResponseEntity.ok("Dang Ky Thanh Cong");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsersEntity usersEntity,Model model) {
        String token=iUserService.login(usersEntity.getEmail(),usersEntity.getPassword());
        return ResponseEntity.ok(new TokenResponse(token));
    }
    static class TokenResponse {
        public String token;
        public TokenResponse(String token) {
            this.token = token;
        }
    }
    @PostMapping("/getauth")
    public ResponseEntity<?> getUserfromJWT(@RequestHeader("Authorization") String token) {
        try {
            String extractedToken=token.substring(7);
            UsersEntity usersEntity=iUserService.getUserDetailsfromJWT(extractedToken);
            return ResponseEntity.ok(usersEntity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/editUser")
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String authHeader, @RequestBody UserDTO user)
    {

        try {  String extractedToken=authHeader.substring(7);
            UsersEntity usersEntity=iUserService.getUserDetailsfromJWT(extractedToken);
            usersEntity.setName(user.getName());
            usersEntity.setEmail(user.getEmail());
            usersEntity.setPhone(user.getPhone());
            usersRepository.save(usersEntity);
            String token=jwtTokenUtil.generateToken(usersEntity);
            return ResponseEntity.ok(new TokenResponse(token));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/admin/getdetailsinger")
    public ResponseEntity<SingerDTO> getDetailSingers(@RequestBody String name) throws JsonProcessingException {
        SingerDTO singer= iSingerService.getDetailsSinger(name);
        String jsonResponse = new ObjectMapper().writeValueAsString(singer); // Chuyển list users sang JSON string
        System.out.println("Response before sending: " + jsonResponse); // Log JSON response
        return ResponseEntity.ok(singer);
    }
    @PostMapping("/admin/getdetailTrack")
    public ResponseEntity<TrackDTO> getDetailTrack(@RequestBody String title) throws JsonProcessingException {
        TrackDTO track= iTrackService.getDetailsTrack(title);
        String jsonResponse = new ObjectMapper().writeValueAsString(track); // Chuyển list users sang JSON string
        System.out.println("Response before sending: " + jsonResponse); // Log JSON response
        return ResponseEntity.ok(track);
    }
}
