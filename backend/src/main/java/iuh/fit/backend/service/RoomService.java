package iuh.fit.backend.service;

import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import iuh.fit.backend.dto.APIResponse;
import iuh.fit.backend.dto.RoomUpdateRequest;
import iuh.fit.backend.entity.Room;
import iuh.fit.backend.entity.RoomType;
import iuh.fit.backend.repository.RoomRepo;
import iuh.fit.backend.repository.RoomTypeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepo roomRepo;
    private final RoomTypeRepo roomTypeRepo;

    public List<Room> getAvailableRoomByRoomType(String roomTypeId, LocalDateTime checkIn, LocalDateTime checkOut) {
        return roomRepo.findAvailableRooms(roomTypeId, checkIn, checkOut);
    }

    public APIResponse<Page<Room>> searchAdvance(
            String roomNumber,
            String floor,
            String roomTypeName,
            Boolean status,
            int page,
            int size
    ) {
        Page<Room> result = roomRepo.searchAdvance(roomNumber, floor, roomTypeName, status,  PageRequest.of(page, size, Sort.by("roomNumber").ascending()));

        return new APIResponse<>(true, HTTPResponse.SC_OK, "Lấy danh sách phòng thành công", result);
    }

    public APIResponse<Room> updateRoom(String roomId, RoomUpdateRequest request) {
        APIResponse<Room> response = new APIResponse<>();
        response.setSuccess(false);
        response.setData(null);

        Optional<Room> roomOpt = roomRepo.findById(roomId);
        if (roomOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Phòng không tồn tại");
            return response;
        }

        Room existedRoom = roomRepo.findByRoomNumber(request.getRoomNumber());
        if (existedRoom != null && !existedRoom.getId().equals(roomId)) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Số phòng đã tồn tại");
            return response;
        }

        Room room = roomOpt.get();
        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());

        Optional<RoomType> roomTypeOpt = roomTypeRepo.findById(request.getRoomTypeId());
        if (roomTypeOpt.isEmpty()) {
            response.setStatus(HTTPResponse.SC_BAD_REQUEST);
            response.setMessage("Loại phòng không tồn tại");
            return response;
        }

        room.setRoomType(roomTypeOpt.get());
        room.setUpdatedAt(LocalDateTime.now());

        Room savedRoom = roomRepo.save(room);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật phòng thành công");
        response.setData(savedRoom);

        return response;
    }

    public APIResponse<Room> updateStatus(String roomId, Boolean status) {
        APIResponse<Room> response = new APIResponse<>();

        Optional<Room> roomOpt = roomRepo.findById(roomId);
        if (roomOpt.isEmpty()) {
            response.setSuccess(false);
            response.setStatus(HTTPResponse.SC_NOT_FOUND);
            response.setMessage("Phòng không tồn tại");
            return response;
        }

        Room room = roomOpt.get();
        room.setStatus(status);
        room.setUpdatedAt(LocalDateTime.now());

        Room savedRoom = roomRepo.save(room);

        response.setSuccess(true);
        response.setStatus(HTTPResponse.SC_OK);
        response.setMessage("Cập nhật trạng thái phòng thành công");
        response.setData(savedRoom);

        return response;
    }

}
