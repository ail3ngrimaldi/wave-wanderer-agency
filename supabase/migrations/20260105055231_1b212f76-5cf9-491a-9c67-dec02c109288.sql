DROP VIEW IF EXISTS packages_public;

CREATE VIEW packages_public AS 
SELECT 
  id,
  slug,
  title,
  description,
  image_url,
  destination,
  country,
  departure_city,
  nights,
  includes_flight,
  includes_hotel,
  includes_transfer,
  hotel_name,
  accommodation_type,
  room_type,
  meal_plan,
  media_urls,
  airline,
  departure_airport,
  arrival_airport,
  outbound_departure_time,
  outbound_arrival_time,
  return_departure_time,
  return_arrival_time,
  price,
  currency,
  price_note,
  disclaimer,
  payment_link,
  start_date,
  end_date,
  created_at,
  expires_at
FROM packages 
WHERE expires_at > now();