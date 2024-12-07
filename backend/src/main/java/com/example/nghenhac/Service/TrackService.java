package com.example.nghenhac.Service;

import com.example.nghenhac.DTO.SingerDTO;
import com.example.nghenhac.DTO.TrackDTO;
import com.example.nghenhac.Model.SingerEntity;
import com.example.nghenhac.Model.TracksEntity;
import com.example.nghenhac.Repository.SingerRepository;
import com.example.nghenhac.Repository.TracksRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
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
        if (tracksRepository.existsByTitle(trackDTO.getTitle())) {
            throw new RuntimeException("Bài hát đã tồn tại.");
        }
        
        TracksEntity tracks = new TracksEntity();
        tracks.setTitle(trackDTO.getTitle());
        tracks.setDuration(trackDTO.getDuration());
        tracks.setGenre(trackDTO.getGenre());
        tracks.setFileUrl(trackDTO.getFileUrl());
        tracks.setImage(trackDTO.getImage());
        
        // Lưu bài hát vào database
        tracksRepository.save(tracks);
        
        // Kiểm tra và lưu ca s�
        SingerEntity singer = singerRepository.findByName(trackDTO.getSelectedSinger());
        if (singer == null) {
            // Nếu ca sĩ không tồn tại, tạo mới
            singer = new SingerEntity();
            singer.setName(trackDTO.getSelectedSinger());
            singer.setImageUrl(trackDTO.getImage()); // Giả sử bạn có ảnh ca sĩ
            singerRepository.save(singer);
        }
        
        // Thêm ID bài hát vào danh sách bài hát của ca sĩ
        singer.getTrackIds().add(tracks.getId());
        singerRepository.save(singer);
        
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

    @Override
    public void saveMusicData(String title, String artist, String imageUrl, String genre) {
        SingerEntity singer = singerRepository.findByName(artist);
        ObjectId singerId;
        if (singer == null) {
            singer = new SingerEntity(null, artist, imageUrl, null);
            singer = singerRepository.save(singer);
            singerId = singer.getId();
        } else {
            singerId = singer.getId();
        }

        // Kiểm tra xem bài hát đã tồn tại chưa
        TracksEntity track = tracksRepository.findByTitle(title);
        if (track == null) {
            // Gán giá trị mặc định hoặc null cho các trường không có trong response của Shazam
            track = new TracksEntity(null, title, 0, null, genre, imageUrl);
            tracksRepository.save(track);
        }
    }
    }

