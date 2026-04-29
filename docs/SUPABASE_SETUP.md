# BookDesk Supabase setup

## 1. Crear proyecto

1. Entrar a Supabase.
2. Crear un proyecto nuevo.
3. Guardar la contraseña de base de datos en un lugar seguro.
4. Esperar a que el proyecto termine de inicializar.

## 2. Crear tablas

1. Ir a **SQL Editor**.
2. Abrir `docs/supabase-schema.sql`.
3. Copiar todo el contenido.
4. Ejecutarlo en Supabase.

Esto crea:

- `profiles`
- `resources`
- `reservations`
- Row Level Security
- Policies basicas
- Trigger para crear perfiles automaticamente al registrar usuarios
- Seed inicial de espacios BookDesk

## 3. Configurar Auth

Para probar local rapido:

1. Ir a **Authentication > Providers > Email**.
2. Activar Email provider.
3. Para desarrollo, desactivar **Confirm email** si queres que el login funcione inmediatamente despues del registro.

Si dejas confirmacion por email activa, el usuario debera confirmar su email antes de poder entrar.

## 4. Conseguir variables publicas

Ir a **Project Settings > API** y copiar:

- `Project URL`
- `anon public key`

Crear `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 5. Usuarios demo opcionales

Si queres mantener usuarios demo en Supabase:

1. Ir a **Authentication > Users**.
2. Crear:
   - `valentina@bookdesk.co` / `1234`
   - `admin@bookdesk.co` / `admin`
3. En **Table Editor > profiles**, cambiar el campo `role` del admin a `admin`.

## 6. Reiniciar frontend

Despues de crear `.env.local`, reiniciar Vite:

```bash
npm run dev
```

Sin `.env.local`, BookDesk sigue usando los datos mock locales.
