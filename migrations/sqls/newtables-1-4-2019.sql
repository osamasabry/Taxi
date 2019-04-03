CREATE TABLE `taxi`.`Trips` (
 `Trip_ID` INT NOT NULL AUTO_INCREMENT , 
 `Trip_Name` VARCHAR(500) NOT NULL , 
 `Trip_Description` TEXT NULL , 
 `Trip_Prerequisite_Details` TEXT NULL , 
 `Trip_Creation_Date` TIMESTAMP NOT NULL , 
 `Trip_Docs_Is_Required` BOOLEAN NOT NULL , 
 `Trip_Docs_Details` TEXT NULL , 
 `Trip_Thumbnail_Image_Name` VARCHAR(500) NULL , 
 `Trip_OnTripIsFeatured_Image_Name` VARCHAR(500) NULL , 
 `Trip_PaymentShouldBeInAdvance` BOOLEAN NOT NULL , 
 `Trip_PaymentCanBeInCashOnSupplier` BOOLEAN NOT NULL , 
 `Trip_PaymentCanBeInCreditCard` BOOLEAN NOT NULL , 
 `Trip_Is_Active` BOOLEAN NOT NULL , 
 `Trip_City_ID` INT NOT NULL , 
PRIMARY KEY (`Trip_ID`)) ENGINE = InnoDB;



CREATE TABLE `taxi`.`Trips_Suppliers` (
 `Supplier_ID` INT NOT NULL AUTO_INCREMENT , 
 `Supplier_Name` VARCHAR(255) NOT NULL , 
 `Supplier_Address` VARCHAR(500) NULL , 
 `Supplier_Contacts` JSON NULL , 
 `Supplier_Is_Active` BOOLEAN NOT NULL , 
 `Supplier_Rating` DECIMAL(4,2) NULL , 
 `Supplier_Class_ID` INT NULL , 
 `Supplier_City_ID` INT NOT NULL , 
 PRIMARY KEY (`Supplier_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Supplier_Trips` ( 
	`Supplier_Trip_ID` INT NOT NULL AUTO_INCREMENT , 
	`Supplier_Trip_Cost` DECIMAL(15,4) NOT NULL , 
	`Supplier_Trip_Added_Fee` DECIMAL(15,4) NOT NULL , 
	`Supplier_Trip_AvailableSeats` INT NOT NULL , 
	`Supplier_Trip_AddToSupplierDate` TIMESTAMP NOT NULL , 
	`Supplier_Trip_Supplier_ID` INT NOT NULL , 
	`Supplier_Trip_Trip_ID` INT NOT NULL , 
PRIMARY KEY (`Supplier_Trip_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Busy` ( 
	`Trips_Busy_ID` INT NOT NULL AUTO_INCREMENT , 
	`Trips_Busy_Date` TIMESTAMP NOT NULL , 
	`Trips_Busy_Count` INT NOT NULL , 
	`Trips_Busy_Reservation_ID` INT NOT NULL , 
	`Trips_Busy_Supplier_Trip_ID` INT NOT NULL , 
PRIMARY KEY (`Trips_Busy_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Classes` ( 
	`Class_ID` INT NOT NULL AUTO_INCREMENT , 
	`Class_Name` VARCHAR(255) NOT NULL , 
	`Class_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Class_ID`)) ENGINE = InnoDB;

CREATE TABLE `taxi`.`Trip_Rates` ( 
	`Rate_ID` INT NOT NULL AUTO_INCREMENT , 
	`Rate_Value` INT NOT NULL , 
	`Rate_Trip_ID` INT NOT NULL , 
	`Rate_Rider_ID` INT NOT NULL , 
PRIMARY KEY (`Rate_ID`)) ENGINE = InnoDB;

CREATE TABLE `taxi`.`Countries` ( 
	`Country_ID` INT NOT NULL AUTO_INCREMENT , 
	`Country_Name` VARCHAR(255) NOT NULL , 
	`Country_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Country_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Cities` ( 
	`City_ID` INT NOT NULL AUTO_INCREMENT , 
	`City_Name` VARCHAR(255) NOT NULL , 
	`City_Slogan` VARCHAR(255)  NULL , 
	`City_Icon_Image_Name` VARCHAR(500)  NULL , 
	`City_Featrured_Image_Name` VARCHAR(500)  NULL , 
	`City_Is_Active` BOOLEAN NOT NULL , 
	`City_Country_ID` INT NOT NULL , 
PRIMARY KEY (`City_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Categories` ( 
	`Category_ID` INT NOT NULL AUTO_INCREMENT , 
	`Category_Name` VARCHAR(255) NOT NULL , 
	`Category_Description` TEXT  NULL , 
	`Category_Icon_Image_Name` VARCHAR(500)  NULL , 
	`Category_Featrured_Image_Name` VARCHAR(500)  NULL , 
	`Category_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Category_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trip_Trips_Categories` ( 
	`Trips_Trip_ID` INT NOT NULL ,
 	`Trips_Categories_Category_ID` INT NOT NULL ) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Tags` ( 
	`Tag_ID` INT NOT NULL AUTO_INCREMENT ,
 	`Tag_Name` VARCHAR(500) NOT NULL ,
  	`Tag_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Tag_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trip_Trips_Tags` ( 
	`Trips_Tags_Tag_ID` INT NOT NULL , 
	`Trips_Trip_ID` INT NOT NULL ) 
ENGINE = InnoDB;