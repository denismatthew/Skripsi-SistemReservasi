-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2025 at 03:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `UserID`) VALUES
('ADM-6vgemZ', 'USER-k3Zi8eTh');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `BookingID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL,
  `StaffID` varchar(100) DEFAULT NULL,
  `BookingType` enum('Servis','TestDrive') NOT NULL,
  `BookingDate` date NOT NULL,
  `BookingTime` varchar(10) NOT NULL,
  `Status` enum('Completed','Pending','Cancelled','InProgress') DEFAULT 'Pending',
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`BookingID`, `UserID`, `StaffID`, `BookingType`, `BookingDate`, `BookingTime`, `Status`, `Created_At`, `Updated_At`) VALUES
('-TW7fqQAm7', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2025-12-18', '11:30', 'Completed', '2025-12-10 01:56:20', '2025-12-10 01:58:11'),
('2l9Zratinp', 'USER-Tfic4U6q2Fzs72uD', 'STF-6WH6K8', 'TestDrive', '2026-02-07', '13:30', 'Cancelled', '2025-11-18 11:22:16', '2025-11-19 19:57:33'),
('4_SOXdf13r', 'USER-Tfic4U6q2Fzs72uD', 'STF-6WH6K8', 'TestDrive', '2026-02-07', '13:30', 'Cancelled', '2025-11-18 11:22:17', '2025-11-19 19:57:40'),
('663dr0hK7m', 'USER-Tfic4U6q2Fzs72uD', NULL, 'Servis', '2025-12-25', '08:30', 'Cancelled', '2025-12-01 14:30:01', '2025-12-01 14:30:44'),
('bxOZE8C88O', 'USER-Tfic4U6q2Fzs72uD', NULL, 'TestDrive', '2026-01-10', '13:00', 'Cancelled', '2025-11-19 20:20:53', '2025-11-19 20:21:07'),
('DG8Cj-ApYp', 'USER-Tfic4U6q2Fzs72uD', NULL, 'TestDrive', '2025-12-11', '10:30', 'Cancelled', '2025-12-01 14:31:03', '2025-12-01 14:31:24'),
('EvXgYQ1IZ7', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2025-12-12', '14:30', 'InProgress', '2025-11-20 11:45:23', '2025-11-20 11:50:28'),
('eywgIKGxCa', 'USER-Tfic4U6q2Fzs72uD', 'STF-6WH6K8', 'TestDrive', '2026-02-07', '13:30', 'Completed', '2025-11-18 11:22:10', '2025-11-19 19:58:25'),
('jX6jDgBx5O', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2025-12-12', '12:30', 'Cancelled', '2025-11-18 09:45:15', '2025-11-19 19:58:32'),
('Rnq1k3-fBL', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2026-09-24', '15:30', 'Completed', '2025-11-18 09:47:10', '2025-11-19 19:58:38'),
('rxZgyz3FSf', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2026-02-05', '11:30', 'Cancelled', '2025-11-18 09:46:05', '2025-11-19 19:58:44'),
('tAY4EYXKDr', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2025-12-12', '08:00', 'Completed', '2025-11-20 15:46:53', '2025-11-20 15:48:52'),
('v7D8TaYPbm', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2025-12-12', '12:00', 'Completed', '2025-11-20 09:43:49', '2025-11-20 09:47:17'),
('XgjM-bYly6', 'USER-Tfic4U6q2Fzs72uD', NULL, 'Servis', '2025-12-12', '13:30', 'Cancelled', '2025-11-19 20:08:47', '2025-11-19 20:20:31'),
('xuXLaCPbiS', 'USER-Tfic4U6q2Fzs72uD', 'STF-6WH6K8', 'TestDrive', '2026-11-11', '08:30', 'Completed', '2025-11-18 11:27:30', '2025-11-19 19:58:57'),
('Y31aVbW18R', 'USER-Tfic4U6q2Fzs72uD', 'STF-6WH6K8', 'TestDrive', '2025-12-12', '12:30', 'Completed', '2025-11-18 11:34:00', '2025-11-19 19:59:04'),
('yrvjWZZWhZ', 'USER-Tfic4U6q2Fzs72uD', 'STF-h3ODkr', 'Servis', '2025-12-12', '13:00', 'Completed', '2025-11-20 15:54:45', '2025-11-20 15:57:55'),
('zfkB87F9T3', 'USER-Tfic4U6q2Fzs72uD', 'STF-6WH6K8', 'TestDrive', '2026-01-01', '13:00', 'Cancelled', '2025-11-20 15:55:11', '2025-11-20 15:58:33');

-- --------------------------------------------------------

--
-- Table structure for table `booking_service`
--

CREATE TABLE `booking_service` (
  `BookingService_ID` varchar(100) NOT NULL,
  `BookingID` varchar(100) NOT NULL,
  `Model_Kendaraan` varchar(100) DEFAULT NULL,
  `No_Polisi` varchar(20) DEFAULT NULL,
  `Kilometer` int(11) DEFAULT NULL,
  `Keluhan` text DEFAULT NULL,
  `Total_cost` decimal(12,2) DEFAULT 0.00,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_service`
--

INSERT INTO `booking_service` (`BookingService_ID`, `BookingID`, `Model_Kendaraan`, `No_Polisi`, `Kilometer`, `Keluhan`, `Total_cost`, `Created_At`, `Updated_At`) VALUES
('-cnIlod3-4', 'v7D8TaYPbm', 'Mitsubishi DESTINATOR', 'B1234', 50000, 'rusak', 200000.00, '2025-11-20 09:43:49', '2025-11-20 09:47:17'),
('7zq7BwLRCE', 'tAY4EYXKDr', 'Mitsubishi Pajero Sport', 'B1235', 120000, 'Mobil mengeluarkan suara yang kencang', 152000.00, '2025-11-20 15:46:53', '2025-11-20 15:48:53'),
('84lbqS09za', 'Rnq1k3-fBL', 'Mitsubishi Xpander', 'B1234', 50000, 'Kendaraan suka mengeluarkan suara kencang aneh', 350000.00, '2025-11-18 09:47:10', '2025-11-18 11:18:29'),
('8N1R-RvqTw', 'EvXgYQ1IZ7', 'Mitsubishi XForce', 'b1234', 12000, 'pengecekan', 0.00, '2025-11-20 11:45:23', '2025-11-20 11:45:23'),
('Bsy0rJMWUH', 'jX6jDgBx5O', 'Mitsubishi DESTINATOR', 'B1234', 50000, 'ingin melakukan tune oil', 0.00, '2025-11-18 09:45:15', '2025-11-18 09:45:15'),
('ct9hUnXHHN', 'rxZgyz3FSf', 'Mitsubishi XForce', 'B1234', 50000, 'kendaraan sering mogok', 0.00, '2025-11-18 09:46:05', '2025-11-18 09:46:05'),
('IJGqtRvDSR', 'yrvjWZZWhZ', 'Mitsubishi Xpander', 'B0987', 50000, 'ingin mengganti oli', 350000.00, '2025-11-20 15:54:45', '2025-11-20 15:57:55'),
('kS3LRhabx_', '663dr0hK7m', 'Mitsubishi Mirage', 'B1234', 50000, 'check up rutin', 0.00, '2025-12-01 14:30:01', '2025-12-01 14:30:01'),
('MQnytmJsOZ', 'XgjM-bYly6', 'Mitsubishi DESTINATOR', 'B2344', 120000, 'Rusak', 0.00, '2025-11-19 20:08:47', '2025-11-19 20:08:47'),
('NFqXVPMLat', '-TW7fqQAm7', 'Mitsubishi Mirage', 'B9273', 50, 'ban mobil diperbaiki', 152000.00, '2025-12-10 01:56:20', '2025-12-10 01:58:11');

-- --------------------------------------------------------

--
-- Table structure for table `booking_service_detail`
--

CREATE TABLE `booking_service_detail` (
  `ServiceDetail_ID` varchar(100) NOT NULL,
  `BookingService_ID` varchar(100) NOT NULL,
  `Service_ID` varchar(100) NOT NULL,
  `SubtotalPrice` decimal(12,2) DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_service_detail`
--

INSERT INTO `booking_service_detail` (`ServiceDetail_ID`, `BookingService_ID`, `Service_ID`, `SubtotalPrice`, `Created_At`, `Updated_At`) VALUES
('-YZhI36Qcg', 'NFqXVPMLat', 'SERV-Jm7B84L2', 150000.00, '2025-12-10 01:58:00', '2025-12-10 01:58:00'),
('32SlN7-dJK', '8N1R-RvqTw', 'SERV-00s5i0tJ', 200000.00, '2025-12-01 14:46:31', '2025-12-01 14:46:31'),
('4zg5UKzycW', '84lbqS09za', 'SERV-00s5i0tJ', 200000.00, '2025-11-18 11:18:19', '2025-11-18 11:18:19'),
('5v-9_sH8f5', '-cnIlod3-4', 'SERV-00s5i0tJ', 200000.00, '2025-11-20 09:46:50', '2025-11-20 09:46:50'),
('6-0lVbNwwN', '7zq7BwLRCE', 'SERV-wIFussmq', 2000.00, '2025-11-20 15:48:19', '2025-11-20 15:48:19'),
('A5NgfO9NJ6', '7zq7BwLRCE', 'SERV-Jm7B84L2', 150000.00, '2025-11-20 15:48:26', '2025-11-20 15:48:26'),
('cVYgZjje9F', 'IJGqtRvDSR', 'SERV-00s5i0tJ', 200000.00, '2025-11-20 15:57:33', '2025-11-20 15:57:33'),
('N3SdO1zRzB', '84lbqS09za', 'SERV-Jm7B84L2', 150000.00, '2025-11-18 11:18:25', '2025-11-18 11:18:25'),
('olN0FnoYIE', 'NFqXVPMLat', 'SERV-wIFussmq', 2000.00, '2025-12-10 01:57:54', '2025-12-10 01:57:54'),
('_bvPejcs_P', 'IJGqtRvDSR', 'SERV-Jm7B84L2', 150000.00, '2025-11-20 15:57:28', '2025-11-20 15:57:28'),
('_NWTfTct6I', '8N1R-RvqTw', 'SERV-vIaWDnC_', 1000000.00, '2025-12-01 14:46:04', '2025-12-01 14:46:04');

-- --------------------------------------------------------

--
-- Table structure for table `booking_test_drive`
--

CREATE TABLE `booking_test_drive` (
  `BookingTestDrive_ID` varchar(100) NOT NULL,
  `BookingID` varchar(100) NOT NULL,
  `TestDrive_ID` varchar(100) NOT NULL,
  `Catatan` text DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_test_drive`
--

INSERT INTO `booking_test_drive` (`BookingTestDrive_ID`, `BookingID`, `TestDrive_ID`, `Catatan`, `Created_At`, `Updated_At`) VALUES
('0gLH884xVS', 'eywgIKGxCa', 'TDRV-66wt-4Zf', '', '2025-11-18 11:22:10', '2025-11-18 11:22:10'),
('dvB1VKs-Ko', '2l9Zratinp', 'TDRV-66wt-4Zf', '', '2025-11-18 11:22:16', '2025-11-18 11:22:16'),
('fsdp3MasPz', 'Y31aVbW18R', 'TDRV-66wt-4Zf', 'qweqw', '2025-11-18 11:34:00', '2025-11-18 11:34:00'),
('O3EhYuChVf', 'DG8Cj-ApYp', 'TDRV-66wt-4Zf', '', '2025-12-01 14:31:03', '2025-12-01 14:31:03'),
('uBq00nX5Fg', '4_SOXdf13r', 'TDRV-66wt-4Zf', '', '2025-11-18 11:22:17', '2025-11-18 11:22:17'),
('W3zVKgY5Bx', 'zfkB87F9T3', 'TDRV-66wt-4Zf', '', '2025-11-20 15:55:11', '2025-11-20 15:55:11'),
('y2NkLEJ9AI', 'xuXLaCPbiS', 'TDRV-66wt-4Zf', '', '2025-11-18 11:27:30', '2025-11-18 11:27:30'),
('YazV-zq_nu', 'bxOZE8C88O', 'TDRV-66wt-4Zf', '', '2025-11-19 20:20:53', '2025-11-19 20:20:53');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CustomerID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CustomerID`, `UserID`) VALUES
('CUST-gvWkYu_hpVhfCDGl', 'USER-Tfic4U6q2Fzs72uD');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `Service_ID` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Price` decimal(12,2) DEFAULT NULL,
  `Is_Active` enum('Yes','No') DEFAULT 'Yes',
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`Service_ID`, `Name`, `Description`, `Price`, `Is_Active`, `Created_At`, `Updated_At`) VALUES
('SERV-00s5i0tJ', 'Tune Oil', 'Tuning Oil', 200000.00, 'Yes', '2025-11-18 10:21:21', '2025-11-18 10:21:21'),
('SERV-Jm7B84L2', 'Ganti Oli', 'Mengganti dengan oli kualitas bagus', 150000.00, 'Yes', '2025-11-18 10:20:07', '2025-11-18 10:20:56'),
('SERV-vIaWDnC_', 'Ganti kaca', 'kaca yang bagus', 100000.00, 'Yes', '2025-11-20 15:49:42', '2025-12-09 17:17:32'),
('SERV-wIFussmq', 'Tambal', 'tambal ban kendaraan', 2000.00, 'Yes', '2025-11-20 09:47:55', '2025-12-09 15:06:56');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `StaffID` varchar(100) NOT NULL,
  `StaffRole` varchar(100) DEFAULT NULL,
  `UserID` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `StaffRole`, `UserID`) VALUES
('STF-6WH6K8', 'Sales', 'USER-Oama2aoK'),
('STF-h3ODkr', 'Technician', 'USER-ffVp8A5g');

-- --------------------------------------------------------

--
-- Table structure for table `test_drive`
--

CREATE TABLE `test_drive` (
  `TestDrive_ID` varchar(100) NOT NULL,
  `VehicleModel` varchar(100) NOT NULL,
  `PoliceNo` varchar(20) DEFAULT NULL,
  `isAvailable` enum('Yes','No') DEFAULT 'Yes',
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_drive`
--

INSERT INTO `test_drive` (`TestDrive_ID`, `VehicleModel`, `PoliceNo`, `isAvailable`, `Created_At`, `Updated_At`) VALUES
('TDRV-66wt-4Zf', 'Mitsubishi Pajero Sport', 'B1234', 'Yes', '2025-11-18 10:31:02', '2025-12-09 15:08:08'),
('TDRV-oeLGFg_p', 'Mitsubishi XPander Cross', 'B9521', 'Yes', '2025-12-09 15:08:42', '2025-12-09 15:08:42'),
('TDRV-wqrwhLfi', 'Mitsubishi DESTINATOR', 'B0852', 'Yes', '2025-12-09 15:07:56', '2025-12-09 15:07:56'),
('TDRV-xvGePIuO', 'Mitsubishi XForce', 'B3425', 'Yes', '2025-12-09 15:08:23', '2025-12-09 15:08:23');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('customer','admin','staff') NOT NULL,
  `PhoneNo` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Name`, `Email`, `Password`, `Role`, `PhoneNo`, `Address`, `Created_At`, `Updated_At`) VALUES
('USER-ffVp8A5g', 'denis', 'denis@staff.dipo.co', '$2b$10$K1T9xznwxyHPyELZwY3K8OJ8iGMFLusIixw6WmB3y38y8gz/ur8x6', 'staff', '081231231245', 'Jl. Melati no 1', '2025-11-18 10:33:27', '2025-11-18 10:33:27'),
('USER-k3Zi8eTh', 'denis', 'denis@admin.dipo.co', '$2b$10$7SWVg8RSgz7BWaEG0Mht6.wU11VZ98FQoG4LnrDmXycIvjIFnfIgu', 'admin', '081234567890', 'Jl. Melati No.2', '2025-11-18 10:13:39', '2025-11-18 10:38:43'),
('USER-Oama2aoK', 'Matthew', 'matthew@staff.dipo.co', '$2b$10$4KPbPDZkdZQ84p.pjVHzNuDMJDksHCICRbOuWsvjRNDYIY966YGjK', 'staff', '081234567890', 'Jl. Melati no 2', '2025-11-18 10:37:11', '2025-11-18 10:38:21'),
('USER-Tfic4U6q2Fzs72uD', 'denis', 'denis@gmail.com', '$2b$10$EF2KNviO1tHfFIbm25TrHuS4t.al2PcsfiD134YnFZbRf4s5yZlhC', 'customer', '081231231245', 'Jl. Melati no 1', '2025-11-18 09:39:25', '2025-11-18 09:39:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`BookingID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `StaffID` (`StaffID`);

--
-- Indexes for table `booking_service`
--
ALTER TABLE `booking_service`
  ADD PRIMARY KEY (`BookingService_ID`),
  ADD KEY `BookingID` (`BookingID`);

--
-- Indexes for table `booking_service_detail`
--
ALTER TABLE `booking_service_detail`
  ADD PRIMARY KEY (`ServiceDetail_ID`),
  ADD KEY `BookingService_ID` (`BookingService_ID`),
  ADD KEY `Service_ID` (`Service_ID`);

--
-- Indexes for table `booking_test_drive`
--
ALTER TABLE `booking_test_drive`
  ADD PRIMARY KEY (`BookingTestDrive_ID`),
  ADD KEY `BookingID` (`BookingID`),
  ADD KEY `TestDrive_ID` (`TestDrive_ID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CustomerID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`Service_ID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `test_drive`
--
ALTER TABLE `test_drive`
  ADD PRIMARY KEY (`TestDrive_ID`),
  ADD UNIQUE KEY `PoliceNo` (`PoliceNo`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE SET NULL;

--
-- Constraints for table `booking_service`
--
ALTER TABLE `booking_service`
  ADD CONSTRAINT `booking_service_ibfk_1` FOREIGN KEY (`BookingID`) REFERENCES `booking` (`BookingID`) ON DELETE CASCADE;

--
-- Constraints for table `booking_service_detail`
--
ALTER TABLE `booking_service_detail`
  ADD CONSTRAINT `booking_service_detail_ibfk_1` FOREIGN KEY (`BookingService_ID`) REFERENCES `booking_service` (`BookingService_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_service_detail_ibfk_2` FOREIGN KEY (`Service_ID`) REFERENCES `service` (`Service_ID`) ON DELETE CASCADE;

--
-- Constraints for table `booking_test_drive`
--
ALTER TABLE `booking_test_drive`
  ADD CONSTRAINT `booking_test_drive_ibfk_1` FOREIGN KEY (`BookingID`) REFERENCES `booking` (`BookingID`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_test_drive_ibfk_2` FOREIGN KEY (`TestDrive_ID`) REFERENCES `test_drive` (`TestDrive_ID`) ON DELETE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
