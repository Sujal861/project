import os
from supabase import create_client, Client

# Get Supabase credentials from environment variables
supabase_url = os.getenv('SUPABASE_URL')
supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')

if not supabase_url or not supabase_anon_key:
    raise ValueError('Missing Supabase environment variables')

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_anon_key) 