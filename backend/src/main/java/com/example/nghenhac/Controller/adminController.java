package com.example.nghenhac.Controller;

import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.SingerEntity;
import com.example.nghenhac.Model.TracksEntity;
import com.example.nghenhac.Model.UsersEntity;
import com.example.nghenhac.Repository.SingerRepository;
import com.example.nghenhac.Repository.TracksRepository;
import com.example.nghenhac.Repository.UsersRepository;
import com.example.nghenhac.Service.ISingerService;
import com.example.nghenhac.Service.ITrackService;
import com.example.nghenhac.Service.TrackService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.Console;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class adminController {
    @Autowired
    private final ISingerService iSingerService;
    @Autowired
    private final SingerRepository singerRepository;
    @Autowired
    private final UsersRepository usersRepository;
    @Autowired
    private final ITrackService iTrackService;
    @Autowired
    private final TracksRepository tracksRepository;

    @GetMapping("/admin/getuser")
    public ResponseEntity<List<UsersEntity>> getAllUsers() throws JsonProcessingException {
        List<UsersEntity> users = usersRepository.findAll();
//        String jsonResponse = new ObjectMapper().writeValueAsString(users); // Chuyển list users sang JSON string
//        System.out.println("Response before sending: " + jsonResponse); // Log JSON response
        return ResponseEntity.ok(users);
    }
    @GetMapping("/admin/getsinger")
    public ResponseEntity<List<SingerDTO>> getSingers() throws JsonProcessingException {

        List<SingerDTO> singer= iSingerService.getAllSingersWithTracks(singerRepository);

        String jsonResponse = new ObjectMapper().writeValueAsString(singer); // Chuyển list users sang JSON string
        System.out.println("Response before sending: " + jsonResponse); // Log JSON response
        return ResponseEntity.ok(singer);
    }
    @PostMapping("admin/addsinger")
    public ResponseEntity<SingerEntity> addSinger(@RequestBody SingerDTO singerDTO) {
        SingerEntity savedSinger = iSingerService.addSinger(singerDTO);
        return new ResponseEntity<>(savedSinger, HttpStatus.CREATED);
    }
    @PostMapping("admin/addtrack")
    public ResponseEntity<TracksEntity> addTrack(@RequestBody TrackDTO trackDTO) {
        TracksEntity savedTrack = iTrackService.addTrack(trackDTO);
        return new ResponseEntity<>(savedTrack,HttpStatus.CREATED);
    }
    @GetMapping("/admin/getsong")
    public ResponseEntity<List<TrackDTO>> getSong() throws JsonProcessingException {

        List<TrackDTO> tracks= iTrackService.getAllTrack();

        String jsonResponse = new ObjectMapper().writeValueAsString(tracks); // Chuyển list users sang JSON string
        System.out.println("Response before sending: " + jsonResponse); // Log JSON response
        return ResponseEntity.ok(tracks);
    }
    @PostMapping("admin/deletesong")
    public ResponseEntity<TracksEntity> addTrack(@RequestBody String title) {
        TracksEntity savedTrack = tracksRepository.findByTitle(title);
        if (savedTrack!=null) {
            tracksRepository.delete(savedTrack);
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
