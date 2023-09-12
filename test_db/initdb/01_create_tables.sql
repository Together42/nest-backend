-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (x86_64)
--
-- Host: 13.209.51.117    Database: together42
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_info`
--

DROP TABLE IF EXISTS `attendance_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `eventId` int NOT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=516 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `id` int NOT NULL AUTO_INCREMENT,
  `writerId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `contents` text NOT NULL,
  `eventId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `board_attend_members`
--

DROP TABLE IF EXISTS `board_attend_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board_attend_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `boardId` int NOT NULL,
  `intraId` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `board_idx` (`boardId`),
  CONSTRAINT `boardId` FOREIGN KEY (`boardId`) REFERENCES `board` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=601 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `board_comment`
--

DROP TABLE IF EXISTS `board_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `boardId` int NOT NULL,
  `parentComment` int DEFAULT NULL,
  `comments` text,
  `writerId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `boardId_idx` (`boardId`),
  CONSTRAINT `boardId_idx` FOREIGN KEY (`boardId`) REFERENCES `board` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_info`
--

DROP TABLE IF EXISTS `event_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdId` int NOT NULL,
  `isMatching` tinyint DEFAULT '0',
  `categoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `holiday_info`
--

DROP TABLE IF EXISTS `holiday_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `month` int NOT NULL,
  `day` int NOT NULL,
  `info` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `image_info`
--

DROP TABLE IF EXISTS `image_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `boardNum` int NOT NULL,
  `filePath` text NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `fileType` varchar(20) NOT NULL,
  `fileSize` int NOT NULL,
  `fileKey` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `boardId_idx` (`boardNum`),
  CONSTRAINT `boardNum` FOREIGN KEY (`boardNum`) REFERENCES `board` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=286 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rotation`
--

DROP TABLE IF EXISTS `rotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rotation` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `intraId` varchar(45) NOT NULL,
  `attendLimit` text,
  `month` int unsigned NOT NULL,
  `year` int unsigned NOT NULL,
  `attendDate` text,
  `isSet` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=429 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `intraId` varchar(50) NOT NULL,
  `password` varchar(128) NOT NULL,
  `email` varchar(50) NOT NULL,
  `profile` varchar(128) DEFAULT NULL,
  `isAdmin` tinyint DEFAULT '0',
  `slackId` varchar(50) DEFAULT NULL,
  `canAttend` int DEFAULT '0',
  PRIMARY KEY (`id`,`intraId`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `login` (`intraId`),
  UNIQUE KEY `email` (`email`),
  KEY `intraId_idx` (`intraId`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-12 22:42:52
