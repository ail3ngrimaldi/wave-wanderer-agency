-- Add start_date and end_date columns to packages table
ALTER TABLE public.packages ADD COLUMN start_date date;
ALTER TABLE public.packages ADD COLUMN end_date date;

-- Update the packages_public view to include the new columns
DROP VIEW IF EXISTS public.packages_public;

CREATE VIEW public.packages_public WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  destination,
  departure_city,
  country,
  nights,
  includes_flight,
  includes_hotel,
  includes_transfer,
  hotel_name,
  price,
  currency,
  price_note,
  disclaimer,
  image_url,
  payment_link,
  start_date,
  end_date,
  created_at,
  expires_at
FROM public.packages
WHERE expires_at > now();

GRANT SELECT ON public.packages_public TO anon, authenticated;