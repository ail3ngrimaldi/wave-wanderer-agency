-- Update view to include payment_link (needed for booking) but still exclude created_by
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
  created_at,
  expires_at
FROM public.packages
WHERE expires_at > now();

GRANT SELECT ON public.packages_public TO anon, authenticated;