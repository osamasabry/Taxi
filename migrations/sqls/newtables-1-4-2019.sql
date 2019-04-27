CREATE TABLE `taxi`.`Trips` (
 `id` INT NOT NULL AUTO_INCREMENT , 
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
 `id` INT NOT NULL AUTO_INCREMENT , 
 `Supplier_Name` VARCHAR(255) NOT NULL , 
 `Supplier_Address` VARCHAR(500) NULL , 
 `Supplier_Contacts` JSON NULL , 
 `Supplier_Is_Active` BOOLEAN NOT NULL , 
 `Supplier_Rating` DECIMAL(4,2) NULL , 
 `Supplier_Class_ID` INT NULL , 
 `Supplier_City_ID` INT NOT NULL , 
 PRIMARY KEY (`Supplier_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Supplier_Trips` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Supplier_Trip_Cost` DECIMAL(15,4) NOT NULL , 
	`Supplier_Trip_Added_Fee` DECIMAL(15,4) NOT NULL , 
	`Supplier_Trip_AvailableSeats` INT NOT NULL , 
	`Supplier_Trip_AddToSupplierDate` TIMESTAMP NOT NULL , 
	`Supplier_Trip_Supplier_ID` INT NOT NULL , 
	`Supplier_Trip_Trip_ID` INT NOT NULL , 
PRIMARY KEY (`Supplier_Trip_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Busy` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Trips_Busy_Date` TIMESTAMP NOT NULL , 
	`Trips_Busy_Count` INT NOT NULL , 
	`Trips_Busy_Reservation_ID` INT NOT NULL , 
	`Trips_Busy_Supplier_Trip_ID` INT NOT NULL , 
PRIMARY KEY (`Trips_Busy_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Classes` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Class_Name` VARCHAR(255) NOT NULL , 
	`Class_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Class_ID`)) ENGINE = InnoDB;

CREATE TABLE `taxi`.`Countries` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Country_Name` VARCHAR(255) NOT NULL , 
	`Country_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Country_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Cities` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`City_Name` VARCHAR(255) NOT NULL , 
	`City_Slogan` VARCHAR(255)  NULL , 
	`City_Icon_Image_Name` VARCHAR(500)  NULL , 
	`City_Featrured_Image_Name` VARCHAR(500)  NULL , 
	`City_Is_Active` BOOLEAN NOT NULL , 
	`City_Country_ID` INT NOT NULL , 
PRIMARY KEY (`City_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Categories` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
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
	`id` INT NOT NULL AUTO_INCREMENT ,
 	`Tag_Name` VARCHAR(500) NOT NULL ,
  	`Tag_Is_Active` BOOLEAN NOT NULL , 
PRIMARY KEY (`Tag_ID`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trip_Trips_Tags` ( 
	`Trips_Tags_Tag_ID` INT NOT NULL , 
	`Trips_Trip_ID` INT NOT NULL ) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Review` ( 
	`id` INT NOT NULL AUTO_INCREMENT ,
	`Trips_Review_Date` TIMESTAMP NOT NULL , 
	`Trips_Review_Stars` INT NOT NULL , 
	`Trips_Review_Details` TEXT NOT NULL , 
	`Trips_Review_Reservation_ID` INT NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Reservation_Attachments` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Attachment_FilePath` VARCHAR(500) NOT NULL , 
	`Attachment_Reservation_ID` INT NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Payment_Methods` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`PaymentMethod_Name` VARCHAR(255) NOT NULL , 
	`PaymentMethod_Describtion` TEXT NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Reservation_Status` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Status_Name` VARCHAR(255) NOT NULL , 
	`Status_Describtion` TEXT NOT NULL , 
	`Status_isActive` BOOLEAN NOT NULL DEFAULT TRUE , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Reservations` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Reservation_Date` TIMESTAMP NOT NULL , 
	`Reservation_AdultCost` DECIMAL(15,4) NOT NULL , 
	`Reservation_AdultAddedFee` DECIMAL(15,4) NOT NULL , 
	`Reservation_ChildCost` DECIMAL(15,4) NOT NULL , 
	`Reservation_ChildAddedFee` DECIMAL(15,4) NOT NULL , 
	`Reservation_AdultCount` INT NOT NULL , 
	`Reservation_ChildCount` INT NOT NULL , 
	`Reservation_TotalFees` DECIMAL(15,4) NOT NULL , 
	`Reservation_PickupLocation` VARCHAR(500) NOT NULL , 
	`Reservation_PickupDate` TIMESTAMP  NULL , 
	`Reservation_PaymentMethod_ID` INT NOT NULL , 
	`Reservation_PaymentDetails` TEXT NOT NULL , 
	`Reservation_StatusNote` TEXT NOT NULL , 
	`Reservation_Status_ID` INT NOT NULL , 
	`Reservation_Supplier_Trip_ID` INT NOT NULL , 
	`Reservation_Rider_ID` INT NOT NULL , 
PRIMARY KEY (`id`)) ENGINE = InnoDB;


ALTER TABLE `Trips_Supplier_Trips` CHANGE `Supplier_Trip_Cost` `Supplier_Trip_AdultCost` DECIMAL(15,4) NOT NULL;

ALTER TABLE `Trips_Supplier_Trips` CHANGE `Supplier_Trip_Added_Fee` `Supplier_Trip_AdultAddedFee` DECIMAL(15,4) NOT NULL;

ALTER TABLE `Trips_Supplier_Trips` 
ADD `Supplier_Trip_ChildCost` DECIMAL(15,4) NOT NULL 
AFTER `Supplier_Trip_AdultAddedFee`,
 ADD `Supplier_Trip_ChildAddedFee` DECIMAL(15,4) NOT NULL 
 AFTER `Supplier_Trip_ChildCost`;



 ALTER TABLE `Trips` ADD `Trip_Is_Featured` BOOLEAN NOT NULL DEFAULT FALSE AFTER `Trip_City_ID`;


 CREATE TABLE `taxi`.`Trips_Supplier_Calendar` ( 
 	`Supplier_Trip_Calendar_ID` INT NOT NULL , 
 	`Supplier_Trip_Calendar_Date` TIMESTAMP NOT NULL , 
 	`Supplier_Trip_Calendar_MaxReservations` INT NOT NULL , 
 	`Supplier_Trip_Calendar_Supplier_Trip_ID` INT NOT NULL , 
 	PRIMARY KEY (`Supplier_Trip_Calendar_ID`), 
 	INDEX (`Supplier_Trip_Calendar_Supplier_Trip_ID`)) 
ENGINE = InnoDB;


ALTER TABLE `Trips_Suppliers` ADD `Supplier_Email` VARCHAR(255) NOT NULL AFTER `Supplier_Name`, ADD UNIQUE (`Supplier_Email`);

CREATE TABLE `taxi`.`Trips_Supplier_Users` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Trips_Supplier_User_Email` VARCHAR(255) NOT NULL , 
	`Trips_Supplier_User_Password` VARCHAR(255) NOT NULL , 
	`Trips_Supplier_User_FullName` VARCHAR(255) NOT NULL , 
	`Trips_Supplier_User_Permissions` JSON NULL , 
	`Trips_Supplier_User_IsActive` BOOLEAN NOT NULL DEFAULT TRUE , 
	`Trips_Supplier_User_Supplier_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), INDEX (`Trips_Supplier_User_Supplier_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Reservation_Financials_ActionTypes` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`ActionType_Name` VARCHAR(255) NOT NULL , 
	`ActionType_Describtion` TEXT NULL , 
	`ActionType_isActive` BOOLEAN NOT NULL DEFAULT TRUE , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB


CREATE TABLE `taxi`.`LUT_Supplier_Withdraw_Request_Status` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Withdraw_Request_Status_Name` VARCHAR(255) NOT NULL , 
	`Withdraw_Request_Status_Describtion` TEXT NOT NULL , 
	`Withdraw_Request_Status_isActive` BOOLEAN NOT NULL DEFAULT TRUE , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Reservation_Supplier_Financials` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Reservation_Supplier_Financials_ActionID` INT NOT NULL , 
	`Reservation_Supplier_Financials_ActionDate` TIMESTAMP NOT NULL , 
	`Reservation_Supplier_Financials_Amount` DECIMAL(15,4) NOT NULL , 
	`Reservation_Supplier_Financials_ActionDetails` TEXT NULL , 
	`Reservation_Supplier_Financials_ActionNote` TEXT NULL , 
	`Reservation_Supplier_Financials_Status` BOOLEAN NOT NULL DEFAULT FALSE , 
	`Reservation_Supplier_Financials_ActionType_ID` INT NOT NULL , 
	`Reservation_Supplier_Financials_Supplier_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`Reservation_Supplier_Financials_ActionID`), 
	INDEX (`Reservation_Supplier_Financials_ActionType_ID`), 
	INDEX (`Reservation_Supplier_Financials_Supplier_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Supplier_Withdraw` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Withdraw_Date` TIMESTAMP NOT NULL , 
	`Withdraw_Amount` DECIMAL(15,4) NOT NULL , 
	`Withdraw_Withdraw_Request_ID` INT NOT NULL , 
	`Withdraw_Supplier_ID` INT NOT NULL , 
	`Withdraw_By_Employee_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`Withdraw_Withdraw_Request_ID`), 
	INDEX (`Withdraw_Supplier_ID`), 
	INDEX (`Withdraw_By_Employee_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Supplier_Withdraw_Requests` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Withdraw_Request_Date` TIMESTAMP NOT NULL , 
	`Withdraw_Request_Amount` DECIMAL(15,4) NOT NULL , 
	`Withdraw_Request_Status_ID` INT NOT NULL , 
	`Withdraw_Supplier_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`Withdraw_Request_Status_ID`), 
	INDEX (`Withdraw_Supplier_ID`)) 
ENGINE = InnoDB;


ALTER TABLE `Trips_Supplier_Users` CHANGE 
`Trips_Supplier_User_Permissions` 
`Trips_Supplier_User_Permissions` 
TEXT NULL DEFAULT NULL;


ALTER TABLE `Trips_Supplier_Users` ADD 
`Trips_Supplier_User_IsOwner` BOOLEAN NOT NULL DEFAULT FALSE AFTER 
`Trips_Supplier_User_Supplier_ID`;



ALTER TABLE `Countries` ADD `Country_PhoneCode` VARCHAR(255) NULL AFTER `Country_Name`;



ALTER TABLE `Countries` ADD `Country_AppUsed_Currency_ID` INT NULL AFTER `Country_PhoneCode`, ADD INDEX (`Country_AppUsed_Currency_ID`);