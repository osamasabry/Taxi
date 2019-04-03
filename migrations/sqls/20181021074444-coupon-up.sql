CREATE table coupon (
  id                      int          AUTO_INCREMENT PRIMARY KEY,
  title                   nvarchar(100),
  description             nvarchar(300),
  code                    nvarchar(20) UNIQUE NOT NULL,
  many_users_can_use      int          DEFAULT 0 NOT NULL,
  many_times_user_can_use int          DEFAULT 1 NOT NULL,
  minimum_cost float(10,2) DEFAULT 0 NOT NULL,
  maximum_cost float(10,2) DEFAULT 0 NOT NULL,
  start_at                timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  expiration_at           timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  discount_percent        tinyint      DEFAULT 0 NOT NULL,
  discount_flat           float(10, 2) DEFAULT 0 NOT NULL,
  credit_gift float(10,2) DEFAULT 0 NOT NULL,
  is_enabled              boolean      default 1 NOT NULL,
  is_first_travel_only    boolean      default 0 NOT NULL
);

CREATE TABLE coupon_service (
  id         int AUTO_INCREMENT PRIMARY KEY,
  coupon_id  int,
  service_id int,
  FOREIGN KEY (coupon_id) REFERENCES coupon (id),
  FOREIGN KEY (service_id) REFERENCES service (id)
);

CREATE TABLE rider_coupon (
  id         int     auto_increment primary key,
  rider_id   int,
  coupon_id  int,
  times_used tinyint default 0 NOT NULL,
  FOREIGN KEY (rider_id) REFERENCES rider (id),
  FOREIGN KEY (coupon_id) REFERENCES coupon (id)
);

ALTER TABLE travel
  ADD COLUMN rider_coupon_id int,
  ADD FOREIGN KEY (rider_coupon_id) REFERENCES rider_coupon (id),
  ADD COLUMN cost_after_coupon float(10, 2);
