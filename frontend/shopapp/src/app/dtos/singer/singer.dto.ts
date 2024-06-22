export interface SingerDTO {
    id?: string; // Thay đổi kiểu dữ liệu id sang string
    name: string;
    imageUrl: string; 
    tracks: TrackDTO[]; // Thêm field tracks
    showTracks: boolean;

}

export interface TrackDTO { // Khai báo TrackDTO
    id?: string;
    image:string;
    title: string;
    duration: number;
    genre: string;
    fileUrl: string;
    selectedSinger:string;
}