-- Adminer 5.2.1 MySQL 8.0.31 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `astromen_nestjs_test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `astromen_nestjs_test`;

CREATE TABLE `astroman` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `last_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  `DOB` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

CREATE TABLE `skill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

CREATE TABLE `astroman_has_skill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `astroman_id` int NOT NULL,
  `skill_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `astroman_id` (`astroman_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `astroman_has_skill_ibfk_1` FOREIGN KEY (`astroman_id`) REFERENCES `astroman` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `astroman_has_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

CREATE TABLE `crud_logger_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(48) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `crud_logger_table` (`id`, `name`) VALUES
(1,	'astroman'),
(2,	'skill');

CREATE TABLE `crud_logger` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `crud` enum('c','r','u','d') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `table_id` int unsigned NOT NULL,
  `item_id` int unsigned NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `crud` (`crud`),
  KEY `table_id` (`table_id`),
  KEY `table_id_item_id` (`table_id`,`item_id`),
  CONSTRAINT `crud_logger_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `crud_logger_table` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 2026-01-12 19:12:04 UTC
