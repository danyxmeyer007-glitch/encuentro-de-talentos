# Supabase Setup

Project ref:

```bash
oimpfvezzytizpvgzuae
```

Run these commands after installing the Supabase CLI:

```bash
supabase login
supabase link --project-ref oimpfvezzytizpvgzuae
supabase db push
```

The schema lives in:

```bash
supabase/migrations/001_initial_competition_schema.sql
```

Do not commit `.env.local` or database passwords.
