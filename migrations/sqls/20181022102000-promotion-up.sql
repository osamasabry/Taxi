CREATE TABLE promotion (
  id                   INT PRIMARY KEY AUTO_INCREMENT,
  title                NVARCHAR(100),
  description          NVARCHAR(500),
  media_id             INT,
  start_timestamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  expiration_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (media_id) REFERENCES media (id)
);

ALTER TABLE media
  MODIFY type enum ('car', 'service', 'driver image', 'driver header', 'operator image', 'rider image', 'promotion');