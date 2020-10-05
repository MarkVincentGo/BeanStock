CREATE TABLE company (
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  pe_ratio FLOAT,
  ten_year_price FLOAT NOT NULL,
  growth_rate_wsj FLOAT NOT NULL,
  growth_rate_yahoo FLOAT NOT NULL,
  ttm_eps FLOAT NOT NULL,
  future_pe_ratio_calculated FLOAT,
  future_pe_ratio_analyst FLOAT,
  website VARCHAR(255),
  sp_500 BOOLEAN NOT NULL,
  dow_jones BOOLEAN NOT NULL,
  nasdaq_composite BOOLEAN NOT NULL,
  russell_2000 BOOLEAN NOT NULL
);