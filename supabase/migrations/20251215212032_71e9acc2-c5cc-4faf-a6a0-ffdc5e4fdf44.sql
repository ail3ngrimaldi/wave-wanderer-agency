-- Create packages table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  nights INTEGER NOT NULL DEFAULT 1,
  includes_flight BOOLEAN NOT NULL DEFAULT false,
  includes_hotel BOOLEAN NOT NULL DEFAULT false,
  includes_transfer BOOLEAN NOT NULL DEFAULT false,
  hotel_name TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  price_note TEXT,
  disclaimer TEXT,
  payment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Public can view non-expired packages
CREATE POLICY "Anyone can view active packages"
ON public.packages
FOR SELECT
USING (expires_at > now());

-- Only admins can create packages
CREATE POLICY "Admins can create packages"
ON public.packages
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update packages
CREATE POLICY "Admins can update packages"
ON public.packages
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete packages
CREATE POLICY "Admins can delete packages"
ON public.packages
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Enable pg_cron extension for scheduled deletion
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Create function to delete expired packages
CREATE OR REPLACE FUNCTION public.delete_expired_packages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.packages WHERE expires_at < now();
END;
$$;

-- Schedule daily cleanup at midnight UTC
SELECT cron.schedule(
  'delete-expired-packages',
  '0 0 * * *',
  'SELECT public.delete_expired_packages()'
);