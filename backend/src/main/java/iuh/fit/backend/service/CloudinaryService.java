package iuh.fit.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            Map<?, ?> uploadResult = null;
            if (fileName != null) {
                uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        Map.of(
                                "folder", "hotel-link",
                                "public_id", fileName,
                                "resource_type", "image",
                                "overwrite", true
                        )
                );
            }

            return uploadResult != null ? uploadResult.get("secure_url").toString() : null;
        } catch (IOException e) {
            throw new RuntimeException("Tải ảnh lên cloudinary thất bại: " + file.getOriginalFilename(), e);
        }
    }

    public void deleteByUrl(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);

            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.emptyMap()
            );

        } catch (Exception e) {
            throw new RuntimeException("Xóa ảnh từ Cloudinary thất bại: " + imageUrl, e);
        }
    }

    private String extractPublicId(String url) {
        // DeluxeDouble-6_ugwmhk.jpg
        String filename = url.substring(url.lastIndexOf("/") + 1);

        // DeluxeDouble-6_ugwmhk
        return filename.substring(0, filename.lastIndexOf("."));
    }
}