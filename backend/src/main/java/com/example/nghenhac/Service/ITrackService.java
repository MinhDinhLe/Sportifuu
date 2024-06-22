package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.SingerEntity;
import com.example.nghenhac.Model.TracksEntity;

import java.util.List;

public interface ITrackService {
    TracksEntity addTrack(TrackDTO trackDTO);

    List<TrackDTO> getAllTrack();

    TrackDTO mapToTrackDTO(TracksEntity track);
     TrackDTO getDetailsTrack(String name) ;
}
