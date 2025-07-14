-- Add additional fields for the dashboard
CREATE TABLE IF NOT EXISTS public.user_patrimony (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assets_detail JSONB DEFAULT '[]'::jsonb, -- [{type:"Livret A", amount:1234}]
  debts JSONB DEFAULT '[]'::jsonb, -- [{type:"Crédit immo", balance: 50000}]
  cashflow JSONB DEFAULT '{}'::jsonb, -- {revenusMensuels: x, depenses: y}
  tolerance INTEGER DEFAULT 10, -- tolerance to losses in %
  horizon INTEGER DEFAULT 10, -- investment horizon in years
  max_loss INTEGER DEFAULT 5, -- maximum acceptable loss in %
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_patrimony ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own patrimony data" 
ON public.user_patrimony 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own patrimony data" 
ON public.user_patrimony 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own patrimony data" 
ON public.user_patrimony 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own patrimony data" 
ON public.user_patrimony 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_patrimony_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_patrimony_updated_at
BEFORE UPDATE ON public.user_patrimony
FOR EACH ROW
EXECUTE FUNCTION public.update_user_patrimony_updated_at();