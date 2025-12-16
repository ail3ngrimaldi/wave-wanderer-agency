-- Fix the security definer view issue by setting it to SECURITY INVOKER
ALTER VIEW public.packages_public SET (security_invoker = true);