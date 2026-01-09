# Supabase Setup Instructions

To switch the Smart Park Companion to use Supabase for Database and Authentication, follow these steps:

## Step 1: Create Supabase Project
1.  Go to [database.new](https://database.new) and create a new project.
2.  Set the Name (e.g., `SmartPark`) and Password (save this password!).
3.  Wait for the database to provision.

## Step 2: Run SQL Schema
1.  Go to the **SQL Editor** in the left sidebar.
2.  Click **New Query**.
3.  Copy the contents of the `supabase_schema.sql` file (located in the root of this project) and paste it into the editor.
4.  Click **Run**.
    *   *This creates tables for Parks, Slots, Bookings, and sets up Profile management linked to Auth.*

## Step 3: Get API Keys
go to **Project Settings** (Cog icon) -> **API**.

I need the following keys to configure your environment:

1.  **Project URL** (`SUPABASE_URL`):
    *   Looks like: `https://xyzproject.supabase.co`
2.  **anon public key** (`SUPABASE_ANON_KEY`):
    *   Used for the Frontend.
3.  **Connection String** (URI):
    *   Go to **Project Settings** -> **Database** -> **Connection string** -> **URI**.
    *   Copy the string. It looks like: `postgresql://postgres.[ref]:[password]@aws-0-region.pooler.supabase.com:6543/postgres`
    *   *Note: You will need to replace `[password]` with the password you set in Step 1.*

## Step 4: Share Keys
Please reply with the keys in the following format (or a `.env` file content):

```
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
DATABASE_URL=postgresql://...
```

Once you provide these, I will:
1.  Update the **Frontend** to use Supabase Auth (Login/Signup).
2.  Update the **Backend** to connect to Supabase PostgreSQL.
