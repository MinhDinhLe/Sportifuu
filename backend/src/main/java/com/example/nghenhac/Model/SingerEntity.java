package com.example.nghenhac.Model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Singer")
public class SingerEntity {
    @Id
    private ObjectId id;
    private String name;

    public SingerEntity() {

    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    private String imageUrl;
    @Field("track_ids")
    private List<ObjectId> trackIds=new ArrayList<>();

    public SingerEntity(ObjectId id, String name, String imageUrl, List<ObjectId> trackIds) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.trackIds = trackIds;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ObjectId> getTrackIds() {
        return trackIds;
    }

    public void setTrackIds(List<ObjectId> trackIds) {
        this.trackIds = trackIds;
    }

}
