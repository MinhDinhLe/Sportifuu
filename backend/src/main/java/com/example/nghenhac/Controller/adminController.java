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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import java.io.*;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.Map;

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
    @Value("${shazam.api.url}")
    private String shazamApiUrl;

    @Value("${shazam.api.key}")
    private String apiKey;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Add ObjectMapper for JSON parsing
    @Autowired
    private MongoTemplate mongoTemplate; // Tiêm MongoTemplate
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
        try {
            TracksEntity savedTrack = iTrackService.addTrack(trackDTO);
            return new ResponseEntity<>(savedTrack, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // Tr� về 409 nếu bài hát đã tồn tại
        }
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
    @PostMapping("/admin/recognizeSong")
    public ResponseEntity<?> recognizeSong(@RequestParam("file") MultipartFile file) {
        try {
            File tempDir = new File("C:\\temp\\audiorecognition");
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }
            File[] files = tempDir.listFiles();
            if (files != null) {
                for (File fileToDelete : files) {
                    fileToDelete.delete();
                }
            }

            // Lưu file gốc
            File originalFile = new File(tempDir, "original_" + System.currentTimeMillis() + ".wav");
            try (FileOutputStream fos = new FileOutputStream(originalFile)) {
                fos.write(file.getBytes());
            }

            // Chuyển đổi sang WAV mono 44.1kHz
            File monoWavFile = new File(tempDir, "mono.wav");
            convertToMonoWav(originalFile, monoWavFile);

            // Chuyển đổi WAV mono sang RAW
            File rawFile = new File(tempDir, "converted.raw");
            convertWavToRaw(monoWavFile, rawFile);

            // Đọc file RAW và encode base64
            byte[] rawBytes = Files.readAllBytes(rawFile.toPath());
            String base64Audio = Base64.getEncoder().encodeToString(rawBytes);

            // Gọi Shazam API
            RestTemplate restTemplate = new RestTemplate();
            String shazamApiUrl = "https://shazam.p.rapidapi.com/songs/detect";

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", "shazam.p.rapidapi.com");
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> requestEntity = new HttpEntity<>(base64Audio, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    shazamApiUrl,
                    requestEntity,
                    String.class
            );

            String shazamResponse = response.getBody();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(shazamResponse);

            if (rootNode.has("track")) {
                JsonNode trackNode = rootNode.path("track");
                String title = trackNode.path("title").asText();
                String artistName = trackNode.path("subtitle").asText();
                String imageUrl = trackNode.path("images").path("coverart").asText();
                String genre = trackNode.path("genres").path("primary").asText();
                // Add other fields as needed from the Shazam response

                // Create a TrackDTO object from the Shazam data
                TrackDTO trackDTO = new TrackDTO();
                trackDTO.setTitle(title);
                trackDTO.setSelectedSinger(artistName); // Assuming your DTO has this field
                trackDTO.setImage(imageUrl);
                trackDTO.setGenre(genre);
                // Set other fields in trackDTO


                try {
                    // Call the addTrack service method
                    TracksEntity savedTrack = iTrackService.addTrack(trackDTO); // Call your service method
                    return ResponseEntity.ok(savedTrack.getId());
                } catch (RuntimeException e) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // Handle exceptions appropriately
                }

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài hát trong phản hồi Shazam.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error recognizing song: " + e.getMessage());
        }
    }

    private void convertToMonoWav(File inputFile, File outputFile) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg",
                "-i", inputFile.getAbsolutePath(),
                "-acodec", "pcm_s16le",  // 16-bit PCM
                "-ar", "44100",          // 44.1kHz sample rate
                "-ac", "1",              // Mono (1 channel)
                "-af", "aresample=44100", // Resampling to ensure 44.1kHz
                outputFile.getAbsolutePath()
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IOException("FFmpeg conversion failed with exit code " + exitCode);
        }
    }

    private void convertWavToRaw(File wavFile, File rawFile) throws IOException {
        try (FileInputStream fis = new FileInputStream(wavFile);
             FileOutputStream fos = new FileOutputStream(rawFile)) {

            // Bỏ qua WAV header (44 bytes)
            byte[] header = new byte[44];
            fis.read(header);

            // Đọc dữ liệu âm thanh theo từng block
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                // Xử lý dữ liệu âm thanh nếu cần
                fos.write(buffer, 0, bytesRead);
            }
        }
    }

}
