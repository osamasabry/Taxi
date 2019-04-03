ALTER TABLE payment_request CHANGE fK_driver driver_id int(11);
ALTER TABLE payment_request MODIFY comment varchar(255);
ALTER TABLE rider_transaction MODIFY transaction_type ENUM('in-app', 'cash', 'bank', 'gift', 'stripe', 'web','commission','travel');
ALTER TABLE driver_transaction MODIFY transaction_type ENUM('in-app', 'cash', 'bank', 'gift', 'stripe', 'web','commission','travel');
ALTER TABLE rider_transaction MODIFY operator_id INT(11);
ALTER TABLE driver_transaction MODIFY operator_id INT(11);