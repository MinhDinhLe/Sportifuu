package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.SingerEntity;
import com.example.nghenhac.Model.TracksEntity;
import com.example.nghenhac.Repository.SingerRepository;
import com.example.nghenhac.Repository.TracksRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
@Service
public class SingerService implements ISingerService {
    private final TracksRepository tracksRepository;
    private final SingerRepository singerRepository;
    @Autowired
    public SingerService(SingerRepository singerRepository, TracksRepository tracksRepository) {
        this.singerRepository = singerRepository;
        this.tracksRepository = tracksRepository;
    }

    @Override
    public List<SingerDTO> getAllSingersWithTracks(SingerRepository singerRepository) {
        List<SingerEntity> singers = singerRepository.findAll();
        return singers.stream()
                .map(this::mapToSingerResponseDTO)
                .collect(Collectors.toList());
    }
    @Override
    public SingerDTO mapToSingerResponseDTO(SingerEntity singer) {
        SingerDTO dto=new SingerDTO();
        dto.setId(singer.getId().toString());
        dto.setName(singer.getName());
        dto.setImageUrl(singer.getImageUrl());
        List<TrackDTO> trackDTOs = singer.getTrackIds() != null ?
                singer.getTrackIds().stream()
                        .map(trackId -> tracksRepository.findById(trackId.toString()) // Trả về Optional<TracksEntity>
                                .orElse(null)) // Gọi orElse(null) trên Optional
                        .filter(Objects::nonNull)
                        .map(this::mapToTrackDTO)
                        .collect(Collectors.toList()) :
                new ArrayList<>();
        dto.setTracks(trackDTOs);
        return dto;
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
    public SingerEntity addSinger(SingerDTO singerDTO) {
        if (singerRepository.existsByName(singerDTO.getName())) {
            throw new RuntimeException( "Tên ca sĩ đã tồn tại.");
        }
        SingerEntity singer = new SingerEntity();
        singer.setName(singerDTO.getName());
        singer.setImageUrl(singerDTO.getImageUrl());
        return singerRepository.save(singer);
    }

    @Override
    public SingerDTO getDetailsSinger(String name) {
        SingerEntity singer=singerRepository.findByName(name);
        return mapToSingerResponseDTO(singer);
    }
}
