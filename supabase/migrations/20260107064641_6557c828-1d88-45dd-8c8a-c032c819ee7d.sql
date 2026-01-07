-- Create cases table to track user service requests
CREATE TABLE public.cases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    platform VARCHAR(100) NOT NULL,
    service VARCHAR(100) NOT NULL,
    tier VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_payment',
    payment_proof_url TEXT,
    authorization_code VARCHAR(8),
    code_verified BOOLEAN DEFAULT FALSE,
    admin_whatsapp_number VARCHAR(50) DEFAULT '+1234567890',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Create policy for reading cases by token (public access with token)
CREATE POLICY "Anyone can read cases by token"
ON public.cases
FOR SELECT
USING (true);

-- Create policy for inserting cases (public)
CREATE POLICY "Anyone can create cases"
ON public.cases
FOR INSERT
WITH CHECK (true);

-- Create policy for updating cases (public for now - will be token-validated in code)
CREATE POLICY "Anyone can update cases"
ON public.cases
FOR UPDATE
USING (true);

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true);

-- Storage policy for uploading payment proofs
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

-- Storage policy for reading payment proofs
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();