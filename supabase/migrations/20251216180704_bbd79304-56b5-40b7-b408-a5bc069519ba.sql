-- Fix #2: Create a secure view for public package access (excluding sensitive columns)
CREATE VIEW public.packages_public AS
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
  created_at,
  expires_at
FROM public.packages
WHERE expires_at > now();

-- Grant access to the view
GRANT SELECT ON public.packages_public TO anon, authenticated;

-- Fix #3: Add explicit deny policy for unauthenticated users on user_roles
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);