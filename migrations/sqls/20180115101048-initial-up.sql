-- MySQL dump 10.13  Distrib 5.7.20, for macos10.12 (x86_64)
--
-- Host: localhost    Database: taxi
-- ------------------------------------------------------
-- Server version	5.7.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `media_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_media_id_fk` (`media_id`),
  CONSTRAINT `car_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complaint` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `travel_id` int(11) DEFAULT NULL,
  `complaint_type_id` int(11) DEFAULT NULL,
  `requested_by` enum('driver','rider') NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `is_reviewed` tinyint(1) NOT NULL DEFAULT '0',
  `inscription_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `review_timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_travel_id` (`travel_id`),
  KEY `complaint_complaint_type_id_fk` (`complaint_type_id`),
  CONSTRAINT `complaint_complaint_type_id_fk` FOREIGN KEY (`complaint_type_id`) REFERENCES `complaint_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `complaint_ibfk_1` FOREIGN KEY (`travel_id`) REFERENCES `travel` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaint`
--

LOCK TABLES `complaint` WRITE;
/*!40000 ALTER TABLE `complaint` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaint_type`
--

DROP TABLE IF EXISTS `complaint_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complaint_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `importance` enum('low','medium','high') DEFAULT NULL,
  `sender_type` enum('driver','rider') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL DEFAULT '',
  `last_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL DEFAULT '',
  `certificate_number` varchar(50) DEFAULT NULL,
  `mobile_number` bigint(15) DEFAULT NULL,
  `email` varchar(70) DEFAULT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `car_id` int(11) DEFAULT NULL,
  `car_color` varchar(50) DEFAULT NULL,
  `car_production_year` smallint(6) DEFAULT NULL,
  `car_plate` varchar(10) DEFAULT NULL,
  `car_media_id` int(11) DEFAULT NULL,
  `status` enum('offline','online','in service','disabled','enabled','blocked') NOT NULL DEFAULT 'disabled',
  `rating` smallint(6) DEFAULT NULL,
  `review_count` smallint(6) NOT NULL DEFAULT '0',
  `media_id` int(11) DEFAULT NULL,
  `gender` enum('unknown','male','female') NOT NULL DEFAULT 'unknown',
  `registration_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account_number` varchar(50) DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `info_changed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_car_id` (`car_id`),
  KEY `driver_media_id_fk_1` (`media_id`),
  KEY `car_media_id` (`car_media_id`),
  CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `car` (`id`),
  CONSTRAINT `driver_ibfk_2` FOREIGN KEY (`car_media_id`) REFERENCES `media` (`id`),
  CONSTRAINT `driver_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `driver_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driver_service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_id` (`driver_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `driver_service_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`),
  CONSTRAINT `driver_service_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `driver_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `driver_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_id` int(11) DEFAULT NULL,
  `operator_id` int(11) NOT NULL,
  `transaction_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `transaction_type` enum('in-app','cash','bank','gift') DEFAULT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `document_number` varchar(50) DEFAULT NULL,
  `details` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_id` (`driver_id`),
  KEY `operator_id` (`operator_id`),
  CONSTRAINT `driver_transaction_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`),
  CONSTRAINT `driver_transaction_ibfk_2` FOREIGN KEY (`operator_id`) REFERENCES `operator` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `type` enum('car','service','driver image','driver header','operator image','rider image') DEFAULT NULL,
  `privacy_level` enum('low','medium','high') NOT NULL DEFAULT 'low',
  `path_type` enum('relative','absolute') NOT NULL DEFAULT 'relative',
  `base64` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `operator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `media_id` int(11) DEFAULT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `mobile_number` bigint(11) DEFAULT NULL,
  `phone_number` bigint(11) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `permission_base_definations` set('view','update','delete') DEFAULT 'view',
  `permission_users` set('view','update','delete') DEFAULT NULL,
  `permission_drivers` set('view','update','delete') DEFAULT 'view,update,delete',
  `permission_riders` set('view','update','delete') DEFAULT 'view,update,delete',
  `permission_travels` set('view','update','delete','details') DEFAULT 'view,update,delete,details',
  `permission_complaints` set('view','update','delete') NOT NULL DEFAULT 'view,update,delete',
  `permission_call_requests` set('view','update','delete') DEFAULT 'view,update,delete',
  `permission_payment_requests` set('view','update','delete') NOT NULL DEFAULT 'view,update,delete',
  `permission_library` set('view-low','view-medium','view-high','update','delete') DEFAULT NULL,
  `status` enum('enabled','disabled','updated') NOT NULL DEFAULT 'enabled',
  PRIMARY KEY (`id`),
  UNIQUE KEY `operator_user_name_uindex` (`user_name`),
  KEY `media_id` (`media_id`),
  CONSTRAINT `operator_ibfk_1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator`
--

LOCK TABLES `operator` WRITE;
/*!40000 ALTER TABLE `operator` DISABLE KEYS */;
INSERT INTO `operator` VALUES (1,'John','Doe',NULL,'admin','admin',NULL,NULL,NULL,'view',NULL,'view,update,delete','view,update,delete','view,update,delete,details','view,update,delete','view,update,delete','view,update,delete',NULL,'enabled');
/*!40000 ALTER TABLE `operator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator_reminder`
--

DROP TABLE IF EXISTS `operator_reminder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_reminder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operator_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `due` date DEFAULT NULL,
  `importance` enum('low','medium','high') DEFAULT 'medium',
  PRIMARY KEY (`id`),
  KEY `fk_operator` (`operator_id`),
  CONSTRAINT `operator_reminder_ibfk_1` FOREIGN KEY (`operator_id`) REFERENCES `operator` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `operator_todo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator_todo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `operator_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_operator` (`operator_id`),
  CONSTRAINT `operator_todo_ibfk_1` FOREIGN KEY (`operator_id`) REFERENCES `operator` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator_todo`
--

LOCK TABLES `operator_todo` WRITE;
/*!40000 ALTER TABLE `operator_todo` DISABLE KEYS */;
/*!40000 ALTER TABLE `operator_todo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_request`
--

DROP TABLE IF EXISTS `payment_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_request` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fK_driver` int(11) DEFAULT NULL,
  `request_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_timestamp` timestamp NULL DEFAULT NULL,
  `amount` float(10,2) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `status` enum('pending','paid','account_number_invalid') DEFAULT 'pending',
  `comment` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fK_driver` (`fK_driver`),
  CONSTRAINT `payment_request_ibfk_1` FOREIGN KEY (`fK_driver`) REFERENCES `driver` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_request`
--

LOCK TABLES `payment_request` WRITE;
/*!40000 ALTER TABLE `payment_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider`
--

DROP TABLE IF EXISTS `rider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rider` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `mobile_number` bigint(10) DEFAULT NULL,
  `status` enum('enabled','blocked') NOT NULL DEFAULT 'enabled',
  `password` varchar(20) DEFAULT NULL,
  `registeration_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `birth_timestamp` timestamp NULL DEFAULT NULL,
  `media_id` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `gender` enum('unknown','male','female') NOT NULL DEFAULT 'unknown',
  `referrer_id` int(11) DEFAULT NULL,
  `balance` decimal(15,2) DEFAULT '0.00',
  `address` varchar(250) DEFAULT NULL,
  `info_changed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `referrer_id` (`referrer_id`),
  KEY `rider_media_id_fk` (`media_id`),
  CONSTRAINT `rider_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `rider` (`id`),
  CONSTRAINT `rider_ibfk_2` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`),
  CONSTRAINT `rider_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `rider_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rider_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rider_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `location` point DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rider_id` (`rider_id`),
  CONSTRAINT `rider_address_ibfk_1` FOREIGN KEY (`rider_id`) REFERENCES `rider` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `rider_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rider_transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rider_id` int(11) DEFAULT NULL,
  `operator_id` int(11) NOT NULL,
  `transction_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `transaction_type` enum('in-app','cash','bank','gift') DEFAULT NULL,
  `amount` float NOT NULL DEFAULT '0',
  `document_number` varchar(50) DEFAULT NULL,
  `details` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rider_id` (`rider_id`),
  KEY `operator_id` (`operator_id`),
  CONSTRAINT `rider_transaction_ibfk_1` FOREIGN KEY (`rider_id`) REFERENCES `rider` (`id`),
  CONSTRAINT `rider_transaction_ibfk_2` FOREIGN KEY (`operator_id`) REFERENCES `operator` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_category_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `media_id` int(11) DEFAULT NULL,
  `base_fare` float(10,2) NOT NULL DEFAULT '0.00',
  `per_hundred_meters` float(10,2) NOT NULL DEFAULT '0.00',
  `per_minute_wait` float(10,2) NOT NULL DEFAULT '0.00',
  `per_minute_passed` float(10,2) DEFAULT '0.00',
  `available_time_from` time NOT NULL DEFAULT '00:00:00',
  `available_time_to` time NOT NULL DEFAULT '23:59:59',
  PRIMARY KEY (`id`),
  KEY `service_category_id` (`service_category_id`),
  CONSTRAINT `service_ibfk_1` FOREIGN KEY (`service_category_id`) REFERENCES `service_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `service_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_id` int(11) DEFAULT NULL,
  `rider_id` int(11) DEFAULT NULL,
  `status` enum('requested','not found','no close found','found','driver accepted','rider accepted','driver canceled','rider canceled','travel started','travel finished credit','travel finished cash') DEFAULT 'requested',
  `pickup_address` varchar(200) NOT NULL,
  `destination_address` varchar(200) NOT NULL,
  `pickup_point` point DEFAULT NULL,
  `destination_point` point DEFAULT NULL,
  `distance_best` int(11) NOT NULL,
  `duration_best` int(11) NOT NULL,
  `cost_best` float(10,2) DEFAULT NULL,
  `duration_real` int(11) DEFAULT '0',
  `distance_real` int(11) DEFAULT '0',
  `request_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cost` float DEFAULT '0',
  `rating` int(11) DEFAULT NULL,
  `start_timestamp` timestamp NULL DEFAULT NULL,
  `finish_timestamp` timestamp NULL DEFAULT NULL,
  `log` varchar(10000) DEFAULT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_DRIVER_ID` (`driver_id`),
  KEY `FK_CUSTOMER_ID` (`rider_id`),
  CONSTRAINT `travel_driver_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `travel_rider_id_fk` FOREIGN KEY (`rider_id`) REFERENCES `rider` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `travel_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `travel_review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` smallint(6) DEFAULT NULL,
  `review` varchar(250) DEFAULT NULL,
  `review_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `travel_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `travel_id` (`travel_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `travel_review_ibfk_1` FOREIGN KEY (`travel_id`) REFERENCES `travel` (`id`),
  CONSTRAINT `travel_review_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_review`
--

LOCK TABLES `travel_review` WRITE;
/*!40000 ALTER TABLE `travel_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_review` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- DROP TABLE IF EXISTS `Trips`;


-- CREATE TABLE `Trips` (
--  `Trip_ID` INT NOT NULL AUTO_INCREMENT , 
--  `Trip_Name` VARCHAR(500) NOT NULL , 
--  `Trip_Description` TEXT NULL , 
--  `Trip_Prerequisite_Details` TEXT NULL , 
--  `Trip_Creation_Date` TIMESTAMP NOT NULL , 
--  `Trip_Docs_Is_Required` BOOLEAN NOT NULL , 
--  `Trip_Docs_Details` TEXT NULL , 
--  `Trip_Thumbnail_Image_Name` VARCHAR(500) NULL , 
--  `Trip_OnTripIsFeatured_Image_Name` VARCHAR(500) NULL , 
--  `Trip_PaymentShouldBeInAdvance` BOOLEAN NOT NULL , 
--  `Trip_PaymentCanBeInCashOnSupplier` BOOLEAN NOT NULL , 
--  `Trip_PaymentCanBeInCreditCard` BOOLEAN NOT NULL , 
--  `Trip_Is_Active` BOOLEAN NOT NULL , 
--  `Trip_City_ID` INT NOT NULL , 
-- PRIMARY KEY (`Trip_ID`)) ENGINE = InnoDB;



-- Dump completed on 2018-02-24 21:07:24
