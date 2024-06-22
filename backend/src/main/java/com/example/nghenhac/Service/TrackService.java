package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.SingerEntity;
import com.example.nghenhac.Model.TracksEntity;
import com.example.nghenhac.Repository.SingerRepository;
import com.example.nghenhac.Repository.TracksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackService implements ITrackService {
    private final TracksRepository tracksRepository;
    private final SingerRepository singerRepository;
    @Override
    public TracksEntity addTrack(TrackDTO trackDTO) {
        if (tracksRepository.existsByTitle(trackDTO.getTitle())){
            throw new RuntimeException( "Tên ca sĩ đã tồn tại.");
        }
        TracksEntity tracks=new TracksEntity();
        tracks.setTitle(trackDTO.getTitle());
        tracks.setDuration(trackDTO.getDuration());
        tracks.setGenre(trackDTO.getGenre());
        tracks.setFileUrl(trackDTO.getFileUrl());
        tracks.setImage(trackDTO.getImage());
        tracksRepository.save(tracks);
        SingerEntity singer = singerRepository.findByName(trackDTO.getSelectedSinger());
        if (singer!=null) {
            singer.getTrackIds().add(tracks.getId());
            singerRepository.save(singer);
        }
        return tracks;
        }

    @Override
    public List<TrackDTO> getAllTrack() {
        List<TracksEntity> tracks = tracksRepository.findAll();
        return tracks.stream()
                .map(this::mapToTrackDTO)
                .collect(Collectors.toList());
    }
    @Override
    public TrackDTO mapToTrackDTO(TracksEntity track) {
        TrackDTO dto = new TrackDTO();
        dto.setId(track.getId().toString());
        dto.setTitle(track.getTitle());
        dto.setDuration(track.getDuration());
        dto.setGenre(track.getGenre());
        dto.setFileUrl(track.getFileUrl());
        dto.setImage(track.getImage());
        return dto;
    }

    @Override
    public TrackDTO getDetailsTrack(String name) {
            TracksEntity track=tracksRepository.findByTitle(name);
            return mapToTrackDTO(track);
        }

}
