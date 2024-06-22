package com.example.nghenhac.DTO;

import lombok.Data;

import java.util.List;

@Data
public class SingerDTO {
    private String id;
    private String name;
    private String imageUrl;
    private List<TrackDTO> tracks;
}
