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


ALTER TABLE `Cities` ADD `City_Description` TEXT NULL AFTER `City_Name`, ADD `City_CoverPage_Name` VARCHAR(500) NULL AFTER `City_Description`, ADD `City_Featured_Image_Web` VARCHAR(500) NULL AFTER `City_CoverPage_Name`;
ALTER TABLE `Cities` ADD `City_Permalink` VARCHAR(255) NULL AFTER `City_Featured_Image_Web`;

ALTER TABLE `rider` ADD `phone_code` VARCHAR(10) NULL AFTER `mobile_number`;

ALTER TABLE `Trips_Categories` ADD `Category_Permalink` VARCHAR(255) NULL AFTER `Category_Description`, ADD `Category_Featured_Image_Web` VARCHAR(255) NULL AFTER `Category_Permalink`, ADD `Category_CoverPage_Name` VARCHAR(255) NULL AFTER `Category_Featured_Image_Web`;

ALTER TABLE `Trips` ADD `Trip_Duration` VARCHAR(255) NULL AFTER `Trip_Creation_Date`, ADD `Trip_MoveTime` VARCHAR(255) NULL AFTER `Trip_Duration`;

ALTER TABLE `Trips` ADD `Trip_Permalink` VARCHAR(255) NULL AFTER `Trip_Description`;

ALTER TABLE `Trips_Reservations` ADD `Reservation_Hotel_Name` VARCHAR(255) NULL AFTER `Reservation_PickupDate`, ADD `Reservation_Room_Number` VARCHAR(255) NULL AFTER `Reservation_Hotel_Name`;

ALTER TABLE `Trips` ADD `Trip_OneLineDescription` VARCHAR(255) NULL AFTER `Trip_Description`;

CREATE TABLE `taxi`.`Trips_Additional_Images` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Trip_Attachment_FilePath` VARCHAR(255) NOT NULL , 
	`Trip_Attachment_Trip_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`Trip_Attachment_Trip_ID`))
ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Complain_Department` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`ComplainDepartment_Name` VARCHAR(255) NOT NULL , 
	`ComplainDepartment_Describtion` TEXT NULL , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Complain_Status` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`ComplainStatus_Name` VARCHAR(255) NOT NULL , 
	`ComplainStatus_Describtion` TEXT NULL , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Complain_CloseType` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`ComplainCloseType_Name` VARCHAR(255) NOT NULL , 
	`ComplainCloseType_Describtion` TEXT NULL , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Complain` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Complain_Title` VARCHAR(500) NOT NULL , 
	`Complain_Date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
	`Complain_Close_Date` TIMESTAMP NULL , 
	`Complain_Reservation_ID` INT NOT NULL , 
	`Complain_Travel_ID` INT NOT NULL , 
	`Complain_CloseType_ID` INT NOT NULL , 
	`Complain_ComplainDepartment_ID` INT NOT NULL , 
	`Complain_Status_ID` INT NOT NULL , 
	`Complain_Rider_ID` INT NOT NULL , 
	`Complain_Driver_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`Complain_Driver_ID`), 
	INDEX (`Complain_Rider_ID`), 
	INDEX (`Complain_Status_ID`), 
	INDEX (`Complain_ComplainDepartment_ID`), 
	INDEX (`Complain_CloseType_ID`), 
	INDEX (`Complain_Travel_ID`), 
	INDEX (`Complain_Reservation_ID`)) 
ENGINE = InnoDB;

CREATE TABLE `taxi`.`Complain_Arguments` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`ComplainArgument_Date` TIMESTAMP NOT NULL , 
	`ComplainArgument_Details` TEXT NOT NULL , 
	`ComplainArgument_IssuedBy_Type` INT NOT NULL , 
	`ComplainArgument_Operator_ID` INT NOT NULL , 
	`ComplainArgument_Complain_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`ComplainArgument_Operator_ID`), 
	INDEX (`ComplainArgument_Complain_ID`)) 
ENGINE = InnoDB;

CREATE TABLE `taxi`.`Complain_Arguments_Attachment` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Complain_ArgumentTitle` VARCHAR(500) NOT NULL , 
	`ComplainArgumentAttachment_filename` VARCHAR(255) NOT NULL , 
	`ComplainArgument_ID` INT NOT NULL , PRIMARY KEY (`id`), 
	INDEX (`ComplainArgument_ID`)) 
ENGINE = InnoDB;

ALTER TABLE `Trips` ADD `Trip_Video` VARCHAR(500) NULL AFTER `Trip_Docs_Details`;

ALTER TABLE `Trips_Supplier_Trips` 
	ADD `Supplier_Trip_InfantCost` INT NULL AFTER `Supplier_Trip_ChildAddedFee`, 
	ADD `Supplier_Trip_InfantAddedFee` INT NULL AFTER `Supplier_Trip_InfantCost`;

ALTER TABLE `Trips_Reservations` 
ADD `Reservation_InfantCost` INT NULL AFTER `Reservation_ChildAddedFee`, 
ADD `Reservation_InfantAddedFee` INT NULL AFTER `Reservation_InfantCost`, 
ADD `Reservation_InfantCount` INT NULL AFTER `Reservation_InfantAddedFee`;



CREATE TABLE `taxi`.`Trips_Categories_Lang` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`CategoryLang_Name` VARCHAR(255) NOT NULL , 
	`CategoryLang_Description` TEXT NULL , 
	`CityLang_Language_ID` INT NOT NULL , 
	`CategoryLang_Category_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`CityLang_Language_ID`), 
	INDEX (`CategoryLang_Category_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Tags_Lang` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`TagLang_Name` VARCHAR(255) NOT NULL , 
	`TagLang_Language_ID` INT NOT NULL , 
	`TagLang_Tag_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`TagLang_Language_ID`), 
	INDEX (`TagLang_Tag_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Cities_Lang` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`CityLang_Name` VARCHAR(255) NOT NULL , 
	`CityLang_Slogan` VARCHAR(255) NOT NULL , 
	`CityLang_Description` TEXT NULL , 
	`CityLang_Permalink` VARCHAR(255) NULL , 
	`CityLang_Language_ID` INT NOT NULL , 
	`CityLang_City_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`CityLang_City_ID`), 
	INDEX (`CityLang_Language_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`Trips_Lang` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`TripLang_Name` VARCHAR(255) NOT NULL , 
	`TripLang_Description` TEXT NULL , 
	`TripLang_Prerequisite_Details` TEXT NULL , 
	`TripLang_Duration` VARCHAR(255) NULL , 
	`TripLang_Docs_Details` TEXT NULL , 
	`TripLang_Language_ID` INT NOT NULL , 
	`TripLang_Trip_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`TripLang_Language_ID`), 
	INDEX (`TripLang_Trip_ID`)) 
ENGINE = InnoDB

CREATE TABLE `taxi`.`LUT_Payment_Methods_Lang` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`PaymentMethodLang_Name` VARCHAR(255) NOT NULL , 
	`PaymentMethodLang_Describtion` TEXT NULL , 
	`PaymentMethodLang_Language_ID` INT NOT NULL , 
	`PaymentMethodLang_PaymentMethod_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`PaymentMethodLang_PaymentMethod_ID`), 
	INDEX (`PaymentMethodLang_Language_ID`)) 
ENGINE = InnoDB;


CREATE TABLE `taxi`.`LUT_Reservation_Status_Lang` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`StatusLang_Name` VARCHAR(255) NOT NULL , 
	`StatusLang_Describtion` TEXT NULL , 
	`StatusLang_Language_ID` INT NOT NULL , 
	`StatusLang_Status_ID` INT NOT NULL , 
	PRIMARY KEY (`id`), 
	INDEX (`StatusLang_Language_ID`), 
	INDEX (`StatusLang_Status_ID`)) 
ENGINE = InnoDB;


ALTER TABLE `Complain` CHANGE `Complain_Driver_ID` `Complain_Driver_ID` INT(11) NOT NULL DEFAULT '0';


ALTER TABLE `Complain` CHANGE `Complain_Driver_ID` `Complain_Driver_ID` INT(11) NULL;


ALTER TABLE `Cities`
  DROP `City_Description`,
  DROP `City_Permalink`,
  DROP `City_Slogan`,
  DROP `City`;

  ALTER TABLE `LUT_Payment_Methods`
  DROP `PaymentMethod_Describtion`;

  ALTER TABLE `LUT_Reservation_Status`
  DROP `Status_Describtion`;

 ALTER TABLE `Trips_Categories`
  DROP `Category_Description`,
  DROP `Category_Permalink`;


  ALTER TABLE `Trips_Categories_Lang` ADD `CategoryLang_Permalink` VARCHAR( 255) NULL AFTER `CategoryLang_Description`;

  ALTER TABLE `Trips`
  DROP `Trip_Description`,
  DROP `Trip_OneLineDescription`,
  DROP `Trip_Permalink`,
  DROP `Trip_Prerequisite_Details`,
  DROP `Trip_Duration`,
  DROP `Trip_Docs_Details`;

  ALTER TABLE `Trips_Lang` ADD `TripLang_OneLineDescription` VARCHAR(255) NULL AFTER `TripLang_Description`;

  ALTER TABLE `Trips_Lang` ADD `TripLang_Permalink` VARCHAR(255) NULL AFTER `TripLang_OneLineDescription`;

  ALTER TABLE `Cities_Lang` ADD UNIQUE(`CityLang_Permalink`);
  ALTER TABLE `Trips_Lang` ADD UNIQUE(`TripLang_Permalink`);
  ALTER TABLE `Trips_Categories_Lang` ADD UNIQUE(`CategoryLang_Permalink`);

ALTER TABLE `Trips` ADD `Trip_CoverPage_Name` VARCHAR(500) NULL AFTER `Trip_OnTripIsFeatured_Image_Name`;

ALTER TABLE `Trips_Reservations` 
	ADD `Reservation_CollectorLocation` VARCHAR(500) NULL AFTER `Reservation_Room_Number`, 
	ADD `Reservation_Collector_Hotel_Name` VARCHAR(500) NULL AFTER `Reservation_CollectorLocation`, 
	ADD `Reservation_Collector_Room_Number` VARCHAR(255) NULL AFTER `Reservation_Collector_Hotel_Name`;

ALTER TABLE `Trips_Suppliers` ADD `Supplier_ Trip_City_ID` VARCHAR(500) NULL AFTER `Supplier_City_ID`;

ALTER TABLE `Trips_Supplier_Users` CHANGE `Trips_Supplier_User_EmoloyeeName` `Trips_Supplier_User_EmoloyeeName` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'Admin';

ALTER TABLE `rider` ADD `nationality_code` VARCHAR(100) NULL AFTER `last_name`;

ALTER TABLE `Trips_Supplier_Trips` CHANGE `Supplier_Trip_InfantCost` `Supplier_Trip_InfantCost` DECIMAL(15,4 ) NULL DEFAULT NULL, CHANGE `Supplier_Trip_InfantAddedFee` `Supplier_Trip_InfantAddedFee` DECIMAL(15,4 ) NULL DEFAULT NULL;

ALTER TABLE `Complain` CHANGE `Complain_Reservation_ID` `Complain_Reservation_ID` INT(11) NULL;

CREATE TABLE `taxi`.`Trip_Sub_Suppliers` (
 `id` INT NOT NULL AUTO_INCREMENT , 
 `Supplier_ID` INT NOT NULL , 
 `User_ID` INT NOT NULL , 
 `User_Device_ID` VARCHAR(255) NOT NULL , 
 PRIMARY KEY (`id`)) 
ENGINE = InnoDB;


ALTER TABLE `Trip_Sub_Suppliers` ADD INDEX( `Supplier_ID`, `User_ID`);

ALTER TABLE `Trip_Sub_Suppliers` CHANGE `User_Device_ID` `notification_supplier_id` VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

CREATE TABLE `taxi`.`LUT_Notification_Types` ( `id` INT NOT NULL AUTO_INCREMENT , `LUT_Notification_Types_Name` VARCHAR(255) NOT NULL , `LUT_Notification_Types_Desc` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE `taxi`.`Trip_Rider_Notifications` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Trip_Rider_Notifications_Title` VARCHAR(255) NOT NULL , 
	`Trip_Rider_Notifications_Body` TEXT NOT NULL , 
	`Trip_Rider_Notifications_Action ID` INT NOT NULL , 
	`Trip_Rider_Notifications_Date` DATE NOT NULL , 
	`Trip_Rider_Notifications_Type_ID` INT NOT NULL , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB;

CREATE TABLE `taxi`.`Trip_Supplier_Notifications` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`Trip_Supplier_Notifications_Title` VARCHAR(255) NOT NULL , 
	`Trip_Supplier_Notifications_Body` TEXT NOT NULL , 
	`Trip_Supplier_Notifications_Action ID` INT NOT NULL , 
	`Trip_Supplier_Notifications_Date` DATE NOT NULL , 
	`Trip_Supplier_Notifications_Type_ID` INT NOT NULL , 
	PRIMARY KEY (`id`)) 
ENGINE = InnoDB;

ALTER TABLE `rider` ADD `rider_Language_ID` INT NULL DEFAULT '1' AFTER `notification_player_id`;

ALTER TABLE `Trip_Rider_Notifications` CHANGE `Trip_Rider_Notifications_Date` `Trip_Rider_Notifications_Date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `Trip_Rider_Notifications` CHANGE `Trip_Rider_Notifications_Action ID` `Trip_Rider_Notifications_ActionID` INT(11) NOT NULL;

ALTER TABLE `Trip_Rider_Notifications` ADD INDEX( `Trip_Rider_Notifications_ActionID`);

ALTER TABLE `Trip_Rider_Notifications` ADD INDEX( `Trip_Rider_Notifications_Type_ID`);

ALTER TABLE `Trip_Rider_Notifications` ADD `Trip_Rider_Notifications_RiderID` INT NOT NULL AFTER `Trip_Rider_Notifications_Type_ID`, ADD INDEX (`Trip_Rider_Notifications_RiderID`);

ALTER TABLE `Trip_Supplier_Notifications` ADD `Trip_Supplier_Notifications_Supplier_ID` INT NOT NULL AFTER `Trip_Supplier_Notifications_Type_ID`;

ALTER TABLE `Trip_Supplier_Notifications` CHANGE `Trip_Supplier_Notifications_Date` `Trip_Supplier_Notifications_Date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;