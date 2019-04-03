ALTER TABLE operator ADD permission_car set('view', 'update', 'delete') DEFAULT 'view,update,delete' NULL;
ALTER TABLE operator ADD permission_service set('view', 'update', 'delete') DEFAULT 'view,update,delete' NULL;
ALTER TABLE operator CHANGE permission_payment_requests permission_payment_request set('view', 'update', 'delete') NULL DEFAULT 'view,update,delete';
ALTER TABLE operator CHANGE permission_call_requests permission_call_request set('view', 'update', 'delete') DEFAULT 'view,update,delete';
ALTER TABLE operator CHANGE permission_complaints permission_complaint set('view', 'update', 'delete') NULL DEFAULT 'view,update,delete';
ALTER TABLE operator CHANGE permission_travels permission_travel set('view', 'update', 'delete', 'details') DEFAULT 'view,update,delete,details';
ALTER TABLE operator CHANGE permission_riders permission_rider set('view', 'update', 'delete') DEFAULT 'view,update,delete';
ALTER TABLE operator CHANGE permission_drivers permission_driver set('view', 'update', 'delete') DEFAULT 'view,update,delete';
ALTER TABLE operator CHANGE permission_users permission_user set('view', 'update', 'delete') DEFAULT 'view';
