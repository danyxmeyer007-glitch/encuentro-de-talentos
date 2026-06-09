create schema if not exists private;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    alter function public.rls_auto_enable() set schema private;
  end if;
end $$;

alter role authenticator set pgrst.db_schemas = 'public, graphql_public';

notify pgrst, 'reload config';
notify pgrst, 'reload schema';
