-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.6.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for hotellink
CREATE DATABASE IF NOT EXISTS `hotellink` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `hotellink`;

ALTER DATABASE hotelbooking
    CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- Dumping structure for table hotellink.amenities
CREATE TABLE IF NOT EXISTS `amenities` (
                                           `amenity_id` varchar(255) NOT NULL,
                                           `icon` varchar(255) DEFAULT NULL,
                                           `name` varchar(255) DEFAULT NULL,
                                           `amenity_type_id` varchar(255) DEFAULT NULL,
                                           PRIMARY KEY (`amenity_id`),
                                           KEY `FKqqvmkaprw77ebicrtbdrfyird` (`amenity_type_id`),
                                           CONSTRAINT `FKqqvmkaprw77ebicrtbdrfyird` FOREIGN KEY (`amenity_type_id`) REFERENCES `amenity_types` (`amenity_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.amenities: ~20 rows (approximately)
INSERT INTO `amenities` (`amenity_id`, `icon`, `name`, `amenity_type_id`) VALUES
                                                                              ('AM1', 'tv', 'TV màn hình phẳng', 'AT1'),
                                                                              ('AM10', 'shield', 'Két an toàn', 'AT5'),
                                                                              ('AM11', 'utensils', 'Bàn ăn / Bếp nhỏ', 'AT5'),
                                                                              ('AM12', 'hang', 'Móc quần áo', 'AT5'),
                                                                              ('AM13', 'frigde', 'Tủ lạnh', 'AT5'),
                                                                              ('AM14', 'shirt', 'Tủ quần áo lớn', 'AT5'),
                                                                              ('AM15', 'table', 'Bàn làm việc', 'AT5'),
                                                                              ('AM16', 'balcony', 'Ban công', 'AT6'),
                                                                              ('AM17', 'martini', 'Mini bar cao cấp', 'AT7'),
                                                                              ('AM18', 'mute', 'Phòng cách âm', 'AT7'),
                                                                              ('AM19', 'martini', 'Minibar', 'AT7'),
                                                                              ('AM2', 'wifi', 'Wifi miễn phí', 'AT2'),
                                                                              ('AM20', 'bell', 'Dịch vụ phòng 24/7', 'AT7'),
                                                                              ('AM3', 'phone', 'Điện thoại', 'AT2'),
                                                                              ('AM4', 'hair-dryer', 'Máy sấy tóc', 'AT3'),
                                                                              ('AM5', 'snowflake', 'Điều hòa', 'AT3'),
                                                                              ('AM6', 'jacuzzi', 'Bồn tắm jacuzzi', 'AT4'),
                                                                              ('AM7', 'shower', 'Phòng tắm vòi sen', 'AT4'),
                                                                              ('AM8', 'bath-tub', 'Bồn tắm', 'AT4'),
                                                                              ('AM9', 'sofa', 'Sofa thư giãn', 'AT5');

-- Dumping structure for table hotellink.amenity_details
CREATE TABLE IF NOT EXISTS `amenity_details` (
                                                 `amenity_id` varchar(255) NOT NULL,
                                                 `room_type_id` varchar(255) NOT NULL,
                                                 PRIMARY KEY (`amenity_id`,`room_type_id`),
                                                 KEY `FKtlmv1folofo1af35fwh4vdof4` (`room_type_id`),
                                                 CONSTRAINT `FK90w3d9g9fiw83wsw4h92xii28` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`amenity_id`),
                                                 CONSTRAINT `FKtlmv1folofo1af35fwh4vdof4` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.amenity_details: ~131 rows (approximately)
INSERT INTO `amenity_details` (`amenity_id`, `room_type_id`) VALUES
                                                                 ('AM1', 'RT1'),
                                                                 ('AM10', 'RT1'),
                                                                 ('AM12', 'RT1'),
                                                                 ('AM18', 'RT1'),
                                                                 ('AM2', 'RT1'),
                                                                 ('AM20', 'RT1'),
                                                                 ('AM3', 'RT1'),
                                                                 ('AM4', 'RT1'),
                                                                 ('AM5', 'RT1'),
                                                                 ('AM7', 'RT1'),
                                                                 ('AM1', 'RT2'),
                                                                 ('AM10', 'RT2'),
                                                                 ('AM12', 'RT2'),
                                                                 ('AM18', 'RT2'),
                                                                 ('AM2', 'RT2'),
                                                                 ('AM20', 'RT2'),
                                                                 ('AM3', 'RT2'),
                                                                 ('AM4', 'RT2'),
                                                                 ('AM5', 'RT2'),
                                                                 ('AM7', 'RT2'),
                                                                 ('AM1', 'RT3'),
                                                                 ('AM10', 'RT3'),
                                                                 ('AM12', 'RT3'),
                                                                 ('AM13', 'RT3'),
                                                                 ('AM14', 'RT3'),
                                                                 ('AM15', 'RT3'),
                                                                 ('AM18', 'RT3'),
                                                                 ('AM2', 'RT3'),
                                                                 ('AM20', 'RT3'),
                                                                 ('AM3', 'RT3'),
                                                                 ('AM4', 'RT3'),
                                                                 ('AM5', 'RT3'),
                                                                 ('AM6', 'RT3'),
                                                                 ('AM7', 'RT3'),
                                                                 ('AM8', 'RT3'),
                                                                 ('AM1', 'RT4'),
                                                                 ('AM10', 'RT4'),
                                                                 ('AM12', 'RT4'),
                                                                 ('AM13', 'RT4'),
                                                                 ('AM14', 'RT4'),
                                                                 ('AM15', 'RT4'),
                                                                 ('AM18', 'RT4'),
                                                                 ('AM2', 'RT4'),
                                                                 ('AM20', 'RT4'),
                                                                 ('AM3', 'RT4'),
                                                                 ('AM4', 'RT4'),
                                                                 ('AM5', 'RT4'),
                                                                 ('AM6', 'RT4'),
                                                                 ('AM7', 'RT4'),
                                                                 ('AM8', 'RT4'),
                                                                 ('AM1', 'RT5'),
                                                                 ('AM10', 'RT5'),
                                                                 ('AM12', 'RT5'),
                                                                 ('AM13', 'RT5'),
                                                                 ('AM14', 'RT5'),
                                                                 ('AM15', 'RT5'),
                                                                 ('AM18', 'RT5'),
                                                                 ('AM2', 'RT5'),
                                                                 ('AM20', 'RT5'),
                                                                 ('AM3', 'RT5'),
                                                                 ('AM4', 'RT5'),
                                                                 ('AM5', 'RT5'),
                                                                 ('AM6', 'RT5'),
                                                                 ('AM7', 'RT5'),
                                                                 ('AM8', 'RT5'),
                                                                 ('AM1', 'RT6'),
                                                                 ('AM10', 'RT6'),
                                                                 ('AM11', 'RT6'),
                                                                 ('AM12', 'RT6'),
                                                                 ('AM13', 'RT6'),
                                                                 ('AM14', 'RT6'),
                                                                 ('AM15', 'RT6'),
                                                                 ('AM16', 'RT6'),
                                                                 ('AM17', 'RT6'),
                                                                 ('AM18', 'RT6'),
                                                                 ('AM19', 'RT6'),
                                                                 ('AM2', 'RT6'),
                                                                 ('AM20', 'RT6'),
                                                                 ('AM3', 'RT6'),
                                                                 ('AM4', 'RT6'),
                                                                 ('AM5', 'RT6'),
                                                                 ('AM6', 'RT6'),
                                                                 ('AM7', 'RT6'),
                                                                 ('AM8', 'RT6'),
                                                                 ('AM9', 'RT6'),
                                                                 ('AM1', 'RT7'),
                                                                 ('AM10', 'RT7'),
                                                                 ('AM11', 'RT7'),
                                                                 ('AM12', 'RT7'),
                                                                 ('AM13', 'RT7'),
                                                                 ('AM14', 'RT7'),
                                                                 ('AM15', 'RT7'),
                                                                 ('AM16', 'RT7'),
                                                                 ('AM17', 'RT7'),
                                                                 ('AM18', 'RT7'),
                                                                 ('AM19', 'RT7'),
                                                                 ('AM2', 'RT7'),
                                                                 ('AM20', 'RT7'),
                                                                 ('AM3', 'RT7'),
                                                                 ('AM4', 'RT7'),
                                                                 ('AM5', 'RT7'),
                                                                 ('AM6', 'RT7'),
                                                                 ('AM7', 'RT7'),
                                                                 ('AM8', 'RT7'),
                                                                 ('AM9', 'RT7'),
                                                                 ('AM1', 'RT8'),
                                                                 ('AM10', 'RT8'),
                                                                 ('AM12', 'RT8'),
                                                                 ('AM13', 'RT8'),
                                                                 ('AM14', 'RT8'),
                                                                 ('AM18', 'RT8'),
                                                                 ('AM2', 'RT8'),
                                                                 ('AM20', 'RT8'),
                                                                 ('AM3', 'RT8'),
                                                                 ('AM4', 'RT8'),
                                                                 ('AM5', 'RT8'),
                                                                 ('AM6', 'RT8'),
                                                                 ('AM7', 'RT8'),
                                                                 ('AM8', 'RT8'),
                                                                 ('AM1', 'RT9'),
                                                                 ('AM10', 'RT9'),
                                                                 ('AM12', 'RT9'),
                                                                 ('AM13', 'RT9'),
                                                                 ('AM14', 'RT9'),
                                                                 ('AM18', 'RT9'),
                                                                 ('AM2', 'RT9'),
                                                                 ('AM20', 'RT9'),
                                                                 ('AM3', 'RT9'),
                                                                 ('AM4', 'RT9'),
                                                                 ('AM5', 'RT9'),
                                                                 ('AM7', 'RT9');

-- Dumping structure for table hotellink.amenity_types
CREATE TABLE IF NOT EXISTS `amenity_types` (
                                               `amenity_type_id` varchar(255) NOT NULL,
                                               `name` varchar(255) DEFAULT NULL,
                                               PRIMARY KEY (`amenity_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.amenity_types: ~7 rows (approximately)
INSERT INTO `amenity_types` (`amenity_type_id`, `name`) VALUES
                                                            ('AT1', 'Hình ảnh/âm thanh'),
                                                            ('AT2', 'Mạng internet và điện thoại'),
                                                            ('AT3', 'Đồ điện tử'),
                                                            ('AT4', 'Nhà tắm'),
                                                            ('AT5', 'Đồ nội thất'),
                                                            ('AT6', 'Khu vực ngoài trời và khung cảnh cửa sổ'),
                                                            ('AT7', 'Khác');

-- Dumping structure for table hotellink.beds
CREATE TABLE IF NOT EXISTS `beds` (
                                      `bed_id` varchar(255) NOT NULL,
                                      `description` varchar(255) DEFAULT NULL,
                                      `name` varchar(255) DEFAULT NULL,
                                      PRIMARY KEY (`bed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.beds: ~4 rows (approximately)
INSERT INTO `beds` (`bed_id`, `description`, `name`) VALUES
                                                         ('BE1', 'Giường đơn dành cho 1 khách', 'Single'),
                                                         ('BE2', 'Giường đôi dành cho 2 khách', 'Double'),
                                                         ('BE3', 'Giường đôi lớn, thoải mái cho 2 khách', 'Queen'),
                                                         ('BE4', 'Giường siêu lớn, cao cấp cho khách sang trọng', 'King');

-- Dumping structure for table hotellink.bed_details
CREATE TABLE IF NOT EXISTS `bed_details` (
                                             `bed_quantity` int(11) NOT NULL CHECK (`bed_quantity` >= 1),
                                             `bed_id` varchar(255) NOT NULL,
                                             `room_type_id` varchar(255) NOT NULL,
                                             PRIMARY KEY (`bed_id`,`room_type_id`),
                                             KEY `FK4328qeyplnm8ja63pyny4eww8` (`room_type_id`),
                                             CONSTRAINT `FK4328qeyplnm8ja63pyny4eww8` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`),
                                             CONSTRAINT `FKycy8dmku8oyuf4j2p748mom1` FOREIGN KEY (`bed_id`) REFERENCES `beds` (`bed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.bed_details: ~10 rows (approximately)
INSERT INTO `bed_details` (`bed_quantity`, `bed_id`, `room_type_id`) VALUES
                                                                         (2, 'BE1', 'RT2'),
                                                                         (2, 'BE1', 'RT4'),
                                                                         (1, 'BE1', 'RT5'),
                                                                         (1, 'BE2', 'RT1'),
                                                                         (1, 'BE2', 'RT3'),
                                                                         (1, 'BE2', 'RT5'),
                                                                         (2, 'BE2', 'RT8'),
                                                                         (3, 'BE2', 'RT9'),
                                                                         (1, 'BE3', 'RT6'),
                                                                         (1, 'BE4', 'RT7');

-- Dumping structure for table hotellink.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
                                          `booking_id` varchar(255) NOT NULL,
                                          `booking_source` enum('FRONT_DESK','ONLINE','PHONE') DEFAULT NULL,
                                          `booking_status` enum('CANCELLED','CHECKED_IN','COMPLETED','CONFIRMED','NO_SHOW','PENDING') DEFAULT NULL,
                                          `check_in` datetime(6) DEFAULT NULL,
                                          `check_out` datetime(6) DEFAULT NULL,
                                          `contact_email` varchar(255) DEFAULT NULL,
                                          `contact_name` varchar(255) DEFAULT NULL,
                                          `contact_phone` varchar(255) NOT NULL,
                                          `created_at` datetime(6) DEFAULT NULL,
                                          `extra_services` double NOT NULL,
                                          `first_time_discount` double NOT NULL,
                                          `full_name` varchar(255) NOT NULL,
                                          `nights` int(11) NOT NULL CHECK (`nights` >= 1),
                                          `notes` varchar(500) DEFAULT NULL,
                                          `paid` bit(1) NOT NULL,
                                          `point_discount` double NOT NULL,
                                          `room_price` double NOT NULL,
                                          `total` double NOT NULL,
                                          `total_payment` double NOT NULL,
                                          `updated_at` datetime(6) DEFAULT NULL,
                                          `vat_fee` double NOT NULL,
                                          `created_by` varchar(255) DEFAULT NULL,
                                          `customer_id` varchar(255) DEFAULT NULL,
                                          `room_id` varchar(255) DEFAULT NULL,
                                          `updated_by` varchar(255) DEFAULT NULL,
                                          PRIMARY KEY (`booking_id`),
                                          KEY `FK4lsaxxymtu2xxvqp0mg2tqqya` (`created_by`),
                                          KEY `FKbvfibgflhsb0g2hnjauiv5khs` (`customer_id`),
                                          KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`),
                                          KEY `FK4rwqlw5c58h0970nxu1bhxfop` (`updated_by`),
                                          CONSTRAINT `FK4lsaxxymtu2xxvqp0mg2tqqya` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
                                          CONSTRAINT `FK4rwqlw5c58h0970nxu1bhxfop` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`),
                                          CONSTRAINT `FKbvfibgflhsb0g2hnjauiv5khs` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`),
                                          CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.bookings: ~0 rows (approximately)

-- Dumping structure for table hotellink.booking_services
CREATE TABLE IF NOT EXISTS `booking_services` (
                                                  `price` double NOT NULL,
                                                  `quantity` int(11) NOT NULL CHECK (`quantity` >= 1),
                                                  `used_at` datetime(6) DEFAULT NULL,
                                                  `booking_id` varchar(255) NOT NULL,
                                                  `service_id` varchar(255) NOT NULL,
                                                  PRIMARY KEY (`booking_id`,`service_id`),
                                                  KEY `FKhhofk6n050slfqp0v6e65axk3` (`service_id`),
                                                  CONSTRAINT `FK1etky587qu1tqlr3t1r7w59gx` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
                                                  CONSTRAINT `FKhhofk6n050slfqp0v6e65axk3` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.booking_services: ~0 rows (approximately)

-- Dumping structure for table hotellink.customers
CREATE TABLE IF NOT EXISTS `customers` (
                                           `points` int(11) NOT NULL,
                                           `user_id` varchar(255) NOT NULL,
                                           PRIMARY KEY (`user_id`),
                                           CONSTRAINT `FKqfnj00cyt44wtrpjlslrqks62` FOREIGN KEY (`user_id`) REFERENCES `persons` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.customers: ~0 rows (approximately)

-- Dumping structure for table hotellink.persons
CREATE TABLE IF NOT EXISTS `persons` (
                                         `user_id` varchar(255) NOT NULL,
                                         `full_name` varchar(255) NOT NULL,
                                         `phone` varchar(255) NOT NULL,
                                         PRIMARY KEY (`user_id`),
                                         UNIQUE KEY `UKjffg8yqa27hkgfnkdimfv4i4m` (`phone`),
                                         CONSTRAINT `FKrp309masjisdm7mmqon63obpv` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.persons: ~0 rows (approximately)

-- Dumping structure for table hotellink.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
                                         `review_id` varchar(255) NOT NULL,
                                         `cleanliness_score` int(11) NOT NULL CHECK (`cleanliness_score` <= 10 and `cleanliness_score` >= 1),
                                         `comments` varchar(255) NOT NULL,
                                         `created_at` datetime(6) DEFAULT NULL,
                                         `facilities_score` int(11) NOT NULL CHECK (`facilities_score` <= 10 and `facilities_score` >= 1),
                                         `service_score` int(11) NOT NULL CHECK (`service_score` <= 10 and `service_score` >= 1),
                                         `status` bit(1) NOT NULL,
                                         `updated_at` datetime(6) DEFAULT NULL,
                                         `booking_id` varchar(255) DEFAULT NULL,
                                         `customer_id` varchar(255) DEFAULT NULL,
                                         PRIMARY KEY (`review_id`),
                                         UNIQUE KEY `UK3p9j9vyr1qofbcxju65es206r` (`booking_id`),
                                         KEY `FK4sm0k8kw740iyuex3vwwv1etu` (`customer_id`),
                                         CONSTRAINT `FK28an517hrxtt2bsg93uefugrm` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
                                         CONSTRAINT `FK4sm0k8kw740iyuex3vwwv1etu` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.reviews: ~0 rows (approximately)

-- Dumping structure for table hotellink.rooms
CREATE TABLE IF NOT EXISTS `rooms` (
                                       `room_id` varchar(255) NOT NULL,
                                       `created_at` datetime(6) DEFAULT NULL,
                                       `floor` varchar(255) NOT NULL,
                                       `room_number` varchar(255) NOT NULL,
                                       `room_status` enum('AVAILABLE','CLEANING','MAINTENANCE','OCCUPIED') DEFAULT NULL,
                                       `status` bit(1) NOT NULL,
                                       `updated_at` datetime(6) DEFAULT NULL,
                                       `room_type_id` varchar(255) DEFAULT NULL,
                                       PRIMARY KEY (`room_id`),
                                       KEY `FKh9m2n1paq5hmd3u0klfl7wsfv` (`room_type_id`),
                                       CONSTRAINT `FKh9m2n1paq5hmd3u0klfl7wsfv` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.rooms: ~42 rows (approximately)
INSERT INTO `rooms` (`room_id`, `created_at`, `floor`, `room_number`, `room_status`, `status`, `updated_at`, `room_type_id`) VALUES
                                                                                                                                 ('RM1', '2025-12-12 21:30:00.000000', 'Tầng 1', '101', 'AVAILABLE', b'1', NULL, 'RT1'),
                                                                                                                                 ('RM10', '2025-12-12 21:30:00.000000', 'Tầng 2', '204', 'AVAILABLE', b'1', NULL, 'RT2'),
                                                                                                                                 ('RM11', '2025-12-12 21:30:00.000000', 'Tầng 2', '205', 'AVAILABLE', b'1', NULL, 'RT2'),
                                                                                                                                 ('RM12', '2025-12-12 21:30:00.000000', 'Tầng 2', '206', 'AVAILABLE', b'1', NULL, 'RT2'),
                                                                                                                                 ('RM13', '2025-12-12 21:30:00.000000', 'Tầng 3', '301', 'AVAILABLE', b'1', NULL, 'RT3'),
                                                                                                                                 ('RM14', '2025-12-12 21:30:00.000000', 'Tầng 3', '302', 'AVAILABLE', b'1', NULL, 'RT3'),
                                                                                                                                 ('RM15', '2025-12-12 21:30:00.000000', 'Tầng 3', '303', 'AVAILABLE', b'1', NULL, 'RT3'),
                                                                                                                                 ('RM16', '2025-12-12 21:30:00.000000', 'Tầng 3', '304', 'AVAILABLE', b'1', NULL, 'RT3'),
                                                                                                                                 ('RM17', '2025-12-12 21:30:00.000000', 'Tầng 3', '305', 'AVAILABLE', b'1', NULL, 'RT3'),
                                                                                                                                 ('RM18', '2025-12-12 21:30:00.000000', 'Tầng 3', '306', 'AVAILABLE', b'1', NULL, 'RT3'),
                                                                                                                                 ('RM19', '2025-12-12 21:30:00.000000', 'Tầng 4', '401', 'AVAILABLE', b'1', NULL, 'RT4'),
                                                                                                                                 ('RM2', '2025-12-12 21:30:00.000000', 'Tầng 1', '102', 'AVAILABLE', b'1', NULL, 'RT1'),
                                                                                                                                 ('RM20', '2025-12-12 21:30:00.000000', 'Tầng 4', '402', 'AVAILABLE', b'1', NULL, 'RT4'),
                                                                                                                                 ('RM21', '2025-12-12 21:30:00.000000', 'Tầng 4', '403', 'AVAILABLE', b'1', NULL, 'RT4'),
                                                                                                                                 ('RM22', '2025-12-12 21:30:00.000000', 'Tầng 4', '404', 'AVAILABLE', b'1', NULL, 'RT4'),
                                                                                                                                 ('RM23', '2025-12-12 21:30:00.000000', 'Tầng 4', '405', 'AVAILABLE', b'1', NULL, 'RT4'),
                                                                                                                                 ('RM24', '2025-12-12 21:30:00.000000', 'Tầng 4', '406', 'AVAILABLE', b'1', NULL, 'RT4'),
                                                                                                                                 ('RM25', '2025-12-12 21:30:00.000000', 'Tầng 5', '501', 'AVAILABLE', b'1', NULL, 'RT5'),
                                                                                                                                 ('RM26', '2025-12-12 21:30:00.000000', 'Tầng 5', '502', 'AVAILABLE', b'1', NULL, 'RT5'),
                                                                                                                                 ('RM27', '2025-12-12 21:30:00.000000', 'Tầng 5', '503', 'AVAILABLE', b'1', NULL, 'RT5'),
                                                                                                                                 ('RM28', '2025-12-12 21:30:00.000000', 'Tầng 5', '504', 'AVAILABLE', b'1', NULL, 'RT5'),
                                                                                                                                 ('RM29', '2025-12-12 21:30:00.000000', 'Tầng 5', '505', 'AVAILABLE', b'1', NULL, 'RT5'),
                                                                                                                                 ('RM3', '2025-12-12 21:30:00.000000', 'Tầng 1', '103', 'AVAILABLE', b'1', NULL, 'RT1'),
                                                                                                                                 ('RM30', '2025-12-12 21:30:00.000000', 'Tầng 5', '506', 'AVAILABLE', b'1', NULL, 'RT5'),
                                                                                                                                 ('RM31', '2025-12-12 21:30:00.000000', 'Tầng 6', '601', 'AVAILABLE', b'1', NULL, 'RT8'),
                                                                                                                                 ('RM32', '2025-12-12 21:30:00.000000', 'Tầng 6', '602', 'AVAILABLE', b'1', NULL, 'RT8'),
                                                                                                                                 ('RM33', '2025-12-12 21:30:00.000000', 'Tầng 6', '603', 'AVAILABLE', b'1', NULL, 'RT8'),
                                                                                                                                 ('RM34', '2025-12-12 21:30:00.000000', 'Tầng 6', '604', 'AVAILABLE', b'1', NULL, 'RT9'),
                                                                                                                                 ('RM35', '2025-12-12 21:30:00.000000', 'Tầng 6', '605', 'AVAILABLE', b'1', NULL, 'RT9'),
                                                                                                                                 ('RM36', '2025-12-12 21:30:00.000000', 'Tầng 6', '606', 'AVAILABLE', b'1', NULL, 'RT9'),
                                                                                                                                 ('RM37', '2025-12-12 21:30:00.000000', 'Tầng 7', '701', 'AVAILABLE', b'1', NULL, 'RT6'),
                                                                                                                                 ('RM38', '2025-12-12 21:30:00.000000', 'Tầng 7', '702', 'AVAILABLE', b'1', NULL, 'RT6'),
                                                                                                                                 ('RM39', '2025-12-12 21:30:00.000000', 'Tầng 7', '703', 'AVAILABLE', b'1', NULL, 'RT6'),
                                                                                                                                 ('RM4', '2025-12-12 21:30:00.000000', 'Tầng 1', '104', 'AVAILABLE', b'1', NULL, 'RT1'),
                                                                                                                                 ('RM40', '2025-12-12 21:30:00.000000', 'Tầng 7', '704', 'AVAILABLE', b'1', NULL, 'RT7'),
                                                                                                                                 ('RM41', '2025-12-12 21:30:00.000000', 'Tầng 7', '705', 'AVAILABLE', b'1', NULL, 'RT7'),
                                                                                                                                 ('RM42', '2025-12-12 21:30:00.000000', 'Tầng 7', '706', 'AVAILABLE', b'1', NULL, 'RT7'),
                                                                                                                                 ('RM5', '2025-12-12 21:30:00.000000', 'Tầng 1', '105', 'AVAILABLE', b'1', NULL, 'RT1'),
                                                                                                                                 ('RM6', '2025-12-12 21:30:00.000000', 'Tầng 1', '106', 'AVAILABLE', b'1', NULL, 'RT1'),
                                                                                                                                 ('RM7', '2025-12-12 21:30:00.000000', 'Tầng 2', '201', 'AVAILABLE', b'1', NULL, 'RT2'),
                                                                                                                                 ('RM8', '2025-12-12 21:30:00.000000', 'Tầng 2', '202', 'AVAILABLE', b'1', NULL, 'RT2'),
                                                                                                                                 ('RM9', '2025-12-12 21:30:00.000000', 'Tầng 2', '203', 'AVAILABLE', b'1', NULL, 'RT2');

-- Dumping structure for table hotellink.room_types
CREATE TABLE IF NOT EXISTS `room_types` (
                                            `room_type_id` varchar(255) NOT NULL,
                                            `area` double NOT NULL,
                                            `created_at` datetime(6) DEFAULT NULL,
                                            `description` varchar(1000) NOT NULL,
                                            `guest_capacity` int(11) NOT NULL CHECK (`guest_capacity` >= 1 and `guest_capacity` <= 10),
                                            `name` varchar(255) NOT NULL,
                                            `price` double NOT NULL,
                                            `status` bit(1) NOT NULL,
                                            `updated_at` datetime(6) DEFAULT NULL,
                                            PRIMARY KEY (`room_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.room_types: ~9 rows (approximately)
INSERT INTO `room_types` (`room_type_id`, `area`, `created_at`, `description`, `guest_capacity`, `name`, `price`, `status`, `updated_at`) VALUES
                                                                                                                                              ('RT1', 25, '2025-12-12 21:30:00.000000', 'Là sự giao thoa tinh tế giữa vẻ đẹp cổ điển và tiện nghi hiện đại, HotelLink Standard Double mở ra không gian nghỉ dưỡng sang trọng và ấm cúng. Nội thất cao cấp được bố trí khéo léo, ánh sáng chan hòa, dễ chịu, mang đến cảm giác thư thái cùng những trải nghiệm trọn vẹn cho những chuyến công tác hay hành trình khám phá Sài Gòn sôi động.', 2, 'HotelLink Standard Double', 600000, b'1', NULL),
                                                                                                                                              ('RT2', 25, '2025-12-12 21:30:00.000000', 'Hơn cả một chốn dừng chân, HotelLink Standard Twin là nơi lý tưởng để chia sẻ những khoảnh khắc đáng nhớ bên bạn bè và gia đình. Căn phòng có không gian thoáng đãng, thiết kế tinh tế, nội thất sang trọng và tiện nghi cao cấp. Từng chi tiết đều được chăm chút tỉ mỉ, để mỗi giây phút lưu lại nơi đây đều trở thành một kỷ niệm đẹp.', 2, 'HotelLink Standard Twin', 600000, b'1', NULL),
                                                                                                                                              ('RT3', 40, '2025-12-12 21:30:00.000000', 'Sang trọng và thanh lịch, HotelLink Deluxe Double là nơi lý tưởng để tận hưởng trọn vẹn sự riêng tư cùng những trải nghiệm đáng nhớ. Căn phòng gây ấn tượng với không gian rộng thoáng, thiết kế sang trọng, gam màu trang nhã và khung cửa lớn đón lấy ánh nắng Phương Nam để cùng ghi dấu những khoảnh khắc đặc biệt bên những người thân yêu.', 2, 'HotelLink Deluxe Double', 850000, b'1', NULL),
                                                                                                                                              ('RT4', 40, '2025-12-12 21:30:00.000000', 'Hòa quyện hoàn hảo giữa vẻ đẹp cổ điển và hơi thở đương đại, HotelLink Deluxe Twin mang đến cảm giác thư thái ngay từ ánh nhìn đầu tiên. Với nội thất cao cấp cùng tầm nhìn khoáng đạt hướng thành phố, căn phòng mở ra không gian sang trọng và thi vị để cùng người thân tận hưởng những khoảnh khắc thanh bình giữa lòng thành phố.', 2, 'HotelLink Deluxe Twin', 850000, b'1', NULL),
                                                                                                                                              ('RT5', 45, '2025-12-12 21:30:00.000000', 'Mang đậm dấu ấn thanh lịch của HotelLink, phòng HotelLink Deluxe Triple là không gian tiện nghi để thư giãn bên gia đình và bạn bè. Căn phòng có gam màu trầm ấm, nội thất được bài trí tinh tế, khung cửa thoáng đón ánh sáng tự nhiên, lý tưởng cho những chuyến công tác cần sự thoải mái lẫn kỳ nghỉ thư thái giữa lòng thành phố.', 4, 'HotelLink Deluxe Triple', 1100000, b'1', NULL),
                                                                                                                                              ('RT6', 60, '2025-12-12 21:30:00.000000', 'Phòng HotelLink Suite Queen mang đậm tinh thần duy mỹ của HotelLink. Nét cổ điển tinh tế được thổi hồn bằng hơi thở đương đại qua từng chi tiết nội thất và tiện nghi cao cấp. Không gian sang trọng nhưng ấm cúng với tầm nhìn rộng mở, mang đến cảm giác thư thái tuyệt đối và những trải nghiệm nghỉ dưỡng khó quên giữa lòng Sài Gòn năng động.', 3, 'HotelLink Suite Queen', 1800000, b'1', NULL),
                                                                                                                                              ('RT7', 70, '2025-12-12 21:30:00.000000', 'Phòng HotelLink Suite King mang hơi thở cổ điển châu Âu, với nội thất tinh tuyển và tiện nghi cao cấp. Mỗi góc nhỏ đều được sắp đặt tinh tế để ghi dấu những khoảnh khắc đặc biệt. Với tầm nhìn hướng thành phố, HotelLink Suite King là chốn dừng chân vương giả cho những ai trân quý sự riêng tư, thư thái ngắm nhìn Sài Gòn không ngừng chuyển mình bên ngoài khung cửa.', 3, 'HotelLink Suite King', 2100000, b'1', NULL),
                                                                                                                                              ('RT8', 75, '2025-12-12 21:30:00.000000', 'Được thiết kế dành riêng cho những kỳ nghỉ sum vầy, HotelLink Family 2 Double mang đến không gian rộng rãi và tiện nghi cho cả gia đình. Căn phòng sở hữu hai giường đôi êm ái, nội thất sang trọng và bố cục hài hòa, tạo nên cảm giác ấm cúng nhưng vẫn đầy tinh tế. Ánh sáng tự nhiên cùng không gian thoáng đãng giúp mỗi khoảnh khắc quây quần nơi đây trở nên trọn vẹn và đáng nhớ.', 5, 'HotelLink Family 2 Double', 2000000, b'1', NULL),
                                                                                                                                              ('RT9', 80, '2025-12-12 21:30:00.000000', 'Với không gian rộng mở và thiết kế linh hoạt, HotelLink Family 3 Double là lựa chọn lý tưởng cho đại gia đình hoặc nhóm bạn đông người. Ba giường đôi được bố trí khéo léo trong không gian sang trọng, đảm bảo sự riêng tư nhưng vẫn giữ trọn cảm giác gắn kết. Nội thất cao cấp, ánh sáng chan hòa cùng phong cách thiết kế tinh tế mang đến trải nghiệm nghỉ dưỡng thoải mái và đẳng cấp giữa lòng thành phố.', 7, 'HotelLink Family 3 Double', 2300000, b'1', NULL);

-- Dumping structure for table hotellink.room_type_pictures
CREATE TABLE IF NOT EXISTS `room_type_pictures` (
                                                    `room_type_id` varchar(255) NOT NULL,
                                                    `picture_url` varchar(255) DEFAULT NULL,
                                                    UNIQUE KEY `UK8i1icr2ldh3xqo2n023xsr9pr` (`picture_url`),
                                                    KEY `FKoxlnjswi1aytvoe3bvvuxlbs1` (`room_type_id`),
                                                    CONSTRAINT `FKoxlnjswi1aytvoe3bvvuxlbs1` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.room_type_pictures: ~43 rows (approximately)
INSERT INTO `room_type_pictures` (`room_type_id`, `picture_url`) VALUES
                                                                     ('RT1', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941023/StandardDouble-1_ayarmi.jpg'),
                                                                     ('RT1', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941023/StandardDouble-2_gygcmg.jpg'),
                                                                     ('RT1', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941023/StandardDouble-3_zuz1dg.jpg'),
                                                                     ('RT1', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941023/StandardDouble-4_ysbkok.jpg'),
                                                                     ('RT1', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941024/StandardDouble-5_xjb2qy.jpg'),
                                                                     ('RT1', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941024/StandardDouble-7_sgyqdh.jpg'),
                                                                     ('RT2', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941381/StandardTwin-1_yhmgvh.jpg'),
                                                                     ('RT2', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941382/StandardTwin-2_g2jy0a.jpg'),
                                                                     ('RT2', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941381/StandardTwin-3_cdavwt.jpg'),
                                                                     ('RT2', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941382/StandardTwin-4_dndlei.jpg'),
                                                                     ('RT2', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941592/DeluxeDouble-1_wjwpkz.jpg'),
                                                                     ('RT3', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941592/DeluxeDouble-2_iwp2qy.jpg'),
                                                                     ('RT3', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941593/DeluxeDouble-3_kwgqmu.jpg'),
                                                                     ('RT3', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941593/DeluxeDouble-4_y3wcuq.jpg'),
                                                                     ('RT3', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941593/DeluxeDouble-5_owctxv.jpg'),
                                                                     ('RT3', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941594/DeluxeDouble-6_ugwmhk.jpg'),
                                                                     ('RT4', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941868/DeluxeTwin-1_fftp3t.jpg'),
                                                                     ('RT4', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941869/DeluxeTwin-2_ycdi8u.jpg'),
                                                                     ('RT4', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941870/DeluxeTwin-3_lsppf4.jpg'),
                                                                     ('RT4', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765941869/DeluxeTwin-4_mzv6bd.jpg'),
                                                                     ('RT5', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942017/DeluxeTriple-1_sg4vcf.jpg'),
                                                                     ('RT5', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942023/DeluxeTriple-2_pjfnbl.jpg'),
                                                                     ('RT5', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942024/DeluxeTriple-3_gwizpn.jpg'),
                                                                     ('RT5', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942027/DeluxeTriple-4_fwv9qp.jpg'),
                                                                     ('RT6', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942598/SuiteQueen-1_ecsijy.jpg'),
                                                                     ('RT6', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942508/SuiteQueen-2_izf1lf.jpg'),
                                                                     ('RT6', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942507/SuiteQueen-3_jn2haf.jpg'),
                                                                     ('RT6', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942596/SuiteQueen-4_yt1bfh.jpg'),
                                                                     ('RT6', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942600/SuiteQueen-5_bhrezt.jpg'),
                                                                     ('RT7', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942840/SuiteKing-1_pfwour.jpg'),
                                                                     ('RT7', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942861/SuiteKing-2_wwuouh.jpg'),
                                                                     ('RT7', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942861/SuiteKing-3_cqq7es.jpg'),
                                                                     ('RT7', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942863/SuiteKing-4_dowuc5.jpg'),
                                                                     ('RT7', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942864/SuiteKing-5_ipc3h8.jpg'),
                                                                     ('RT7', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765942867/SuiteKing-6_akwghl.jpg'),
                                                                     ('RT8', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943205/Family2Double-1_lel0wr.jpg'),
                                                                     ('RT8', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943211/Family2Double-2_czy0pj.jpg'),
                                                                     ('RT8', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943226/Family2Double-3_ehxide.jpg'),
                                                                     ('RT8', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943458/Family2Double-4_hegicv.jpg'),
                                                                     ('RT9', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943551/Family3Doubble_ciapa8_ncno4q.jpg'),
                                                                     ('RT9', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943560/p3-6_pmdy4j_nmvkww.jpg'),
                                                                     ('RT9', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943562/p3-7_ih6l4y_wcjzpo.jpg'),
                                                                     ('RT9', 'https://res.cloudinary.com/dcwauocnz/image/upload/v1765943563/p3-19_tdmch1_gv3srx.jpg');

-- Dumping structure for table hotellink.services
CREATE TABLE IF NOT EXISTS `services` (
                                          `service_id` varchar(255) NOT NULL,
                                          `name` varchar(255) NOT NULL,
                                          `service_type` enum('DRINK','FOOD','OTHER','TIME_BASED') DEFAULT NULL,
                                          `status` bit(1) NOT NULL,
                                          `unit_price` double NOT NULL,
                                          PRIMARY KEY (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.services: ~12 rows (approximately)
INSERT INTO `services` (`service_id`, `name`, `service_type`, `status`, `unit_price`) VALUES
                                                                                          ('SV1', 'Bánh ngọt', 'FOOD', b'1', 30000),
                                                                                          ('SV10', 'CheckOut trễ hơn 30 phút', 'TIME_BASED', b'1', 200000),
                                                                                          ('SV11', 'Trang Trí Phòng Lãng Mạn', 'OTHER', b'1', 300000),
                                                                                          ('SV12', 'Khác', 'OTHER', b'1', 200000),
                                                                                          ('SV2', 'Snack', 'FOOD', b'1', 20000),
                                                                                          ('SV3', 'Socola', 'FOOD', b'1', 35000),
                                                                                          ('SV4', 'Kẹo', 'FOOD', b'1', 15000),
                                                                                          ('SV5', 'Nước Suối', 'DRINK', b'1', 15000),
                                                                                          ('SV6', 'Nước Ngọt', 'DRINK', b'1', 20000),
                                                                                          ('SV7', 'Bia', 'DRINK', b'1', 30000),
                                                                                          ('SV8', 'Nước Trái Cây', 'DRINK', b'1', 30000),
                                                                                          ('SV9', 'CheckIn sớm hơn 30 phút', 'TIME_BASED', b'1', 200000);

-- Dumping structure for table hotellink.staffs
CREATE TABLE IF NOT EXISTS `staffs` (
                                        `date_of_birth` date DEFAULT NULL,
                                        `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
                                        `user_id` varchar(255) NOT NULL,
                                        PRIMARY KEY (`user_id`),
                                        CONSTRAINT `FKqcf5oyocd82uqx16vdbe65hs5` FOREIGN KEY (`user_id`) REFERENCES `persons` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.staffs: ~0 rows (approximately)

-- Dumping structure for table hotellink.users
CREATE TABLE IF NOT EXISTS `users` (
                                       `user_id` varchar(255) NOT NULL,
                                       `created_at` datetime(6) DEFAULT NULL,
                                       `email` varchar(255) DEFAULT NULL,
                                       `password` varchar(255) NOT NULL,
                                       `role` enum('ADMIN','MEMBER','STAFF') DEFAULT NULL,
                                       `status` bit(1) NOT NULL,
                                       `updated_at` datetime(6) DEFAULT NULL,
                                       PRIMARY KEY (`user_id`),
                                       UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table hotellink.users: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
