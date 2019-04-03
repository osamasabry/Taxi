alter table rider_transaction modify transaction_type enum('in-app', 'cash', 'bank', 'gift', 'stripe', 'web', 'commission', 'travel', 'braintree') null;

alter table driver_transaction modify transaction_type enum('in-app', 'cash', 'bank', 'gift', 'stripe', 'web', 'commission', 'travel', 'braintree') null;

