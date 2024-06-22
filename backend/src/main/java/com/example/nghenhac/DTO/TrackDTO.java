package com.example.nghenhac.DTO;

import lombok.Data;

@Data
public class TrackDTO {
    private String id;
    private String title;
    private int duration;
    private String genre;
    private String fileUrl;
    private String selectedSinger;
    private String image;
}
