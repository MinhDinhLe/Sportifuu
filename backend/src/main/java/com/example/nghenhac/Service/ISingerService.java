package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.SingerEntity;
import com.example.nghenhac.Model.TracksEntity;
import com.example.nghenhac.Repository.SingerRepository;
import com.example.nghenhac.Repository.TracksRepository;

import java.util.List;

public interface ISingerService {
    List<SingerDTO> getAllSingersWithTracks(SingerRepository singerRepository);
    SingerDTO mapToSingerResponseDTO(SingerEntity singer);
    TrackDTO mapToTrackDTO(TracksEntity track);

    SingerEntity addSinger(SingerDTO singerDTO);
    SingerDTO getDetailsSinger(String name);
}
