# Baby Bodega — Guía de puesta en marcha (sin conocimientos técnicos)

Sigue estos pasos EN ORDEN. No necesitas instalar nada en tu computadora ni usar la
terminal — todo se hace desde el navegador (Supabase y Netlify) y la aplicación se
publica directamente desde el ZIP.

---

## PASO 1 — Crear tu proyecto en Supabase

1. Entra a https://supabase.com y crea una cuenta (o inicia sesión).
2. Crea un nuevo proyecto. Ponle el nombre que quieras, por ejemplo "baby-bodega".
3. Espera un par de minutos a que Supabase termine de preparar el proyecto.

---

## PASO 2 — Crear la base de datos con UN SOLO script

1. Dentro de tu proyecto de Supabase, ve al menú izquierdo → **SQL Editor**.
2. Haz clic en **New query**.
3. Abre el archivo `sql/schema.sql` que viene dentro de este ZIP, copia TODO su
   contenido, y pégalo en el editor de Supabase.
4. Haz clic en **Run** (o el botón ▶).
5. Si todo salió bien, verás un mensaje de éxito. Esto crea automáticamente todas
   las tablas, las reglas de seguridad, y ya deja cargadas tus 3 marcas
   (Bebesit, Joie, Infanti) y tus 5 categorías.

No necesitas entender el contenido del script ni tocar el Table Editor — solo
copiar, pegar y darle "Run" una sola vez.

---

## PASO 3 — Crear la carpeta (bucket) para las fotos de productos

1. En el menú izquierdo de Supabase, ve a **Storage**.
2. Haz clic en **New bucket**.
3. Nombre exacto del bucket: `product-images`
4. Actívalo como **Public bucket** (para que las fotos se vean en la página).
5. Guarda.

(Las políticas de quién puede subir/borrar fotos ya quedaron configuradas por el
script del Paso 2, apenas creas el bucket con ese nombre exacto empiezan a
aplicarse solas.)

---

## PASO 4 — Crear tu usuario administrador

1. En el menú izquierdo de Supabase, ve a **Authentication → Users**.
2. Haz clic en **Add user** → **Create new user**.
3. Escribe el correo y la contraseña que tú quieras usar para entrar al panel.
4. Marca la opción de "Auto Confirm User" si aparece (para no tener que
   confirmar el correo).
5. Guarda. Esto crea tu usuario, pero por seguridad, todo usuario nuevo entra
   automáticamente con permisos básicos ("client"). Vamos a convertirlo en
   administrador en el siguiente paso.

### Convertir ese usuario en administrador

1. Vuelve a **SQL Editor → New query**.
2. Pega esto, reemplazando el correo por el que usaste en el paso anterior:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'TU-CORREO-AQUI@ejemplo.com');
```

3. Presiona **Run**. Listo — ese usuario ya puede entrar al panel como
   administrador.

Este es el ÚNICO usuario que necesitas crear manualmente en Supabase. Cualquier
otro usuario (vendedores, empleados) lo puedes crear después directamente desde
dentro del panel de la aplicación, en **Admin → Usuarios**, sin volver a entrar
a Supabase.

---

## PASO 5 — Conectar la aplicación con tu proyecto de Supabase

1. En Supabase, ve a **Project Settings → API**.
2. Copia el valor de **Project URL**.
3. Copia el valor de **anon public** (también llamado Publishable key).
4. Dentro del ZIP, busca el archivo `.env.example`, y crea una copia llamada
   exactamente `.env` (mismo contenido, solo cambia el nombre del archivo).
5. Ábrelo y complétalo así:

```
VITE_SUPABASE_URL=el-project-url-que-copiaste
VITE_SUPABASE_ANON_KEY=la-anon-key-que-copiaste
```

6. Guarda el archivo.

(Si prefieres no editar el archivo `.env` a mano, en el Paso 6 también puedes
configurar estas dos variables directamente en Netlify — igual de válido.)

---

## PASO 6 — Publicar en Netlify

1. Entra a https://netlify.com y crea una cuenta (o inicia sesión).
2. Sube el proyecto (arrastra la carpeta del ZIP ya descomprimido, o conéctalo
   a un repositorio de GitHub si prefieres esa opción).
3. Cuando Netlify te pida la configuración de build, usa:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   (Esto ya viene preconfigurado en el archivo `netlify.toml` incluido, así que
   normalmente Netlify lo detecta solo.)
4. Antes de publicar, ve a **Site configuration → Environment variables** y
   agrega las mismas dos variables del Paso 5:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Haz clic en **Deploy**. En unos minutos tu sitio estará publicado con una
   URL de Netlify (puedes cambiarla o conectar tu propio dominio después desde
   **Domain settings**).

---

## PASO 7 — Entrar al panel de administración

1. Abre tu sitio publicado y ve a `/login` (ejemplo: `tusitio.netlify.app/login`).
2. Ingresa con el correo y contraseña que creaste en el Paso 4.
3. Desde ahí ya puedes: crear productos, subir fotos, crear categorías y
   marcas nuevas, cambiar el número de WhatsApp, y crear más usuarios
   (empleados) sin volver a tocar Supabase.

---

## RESUMEN RÁPIDO (checklist)

**En Supabase:**
- [ ] Crear proyecto
- [ ] Pegar y ejecutar `sql/schema.sql` en el SQL Editor
- [ ] Crear el bucket `product-images` como público
- [ ] Crear tu usuario en Authentication → Users
- [ ] Ejecutar el UPDATE para convertirlo en `admin`
- [ ] Copiar Project URL y anon key desde Project Settings → API

**En Netlify:**
- [ ] Subir el proyecto (ZIP descomprimido o repositorio)
- [ ] Agregar las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy
- [ ] Entrar a `/login` con tu usuario admin y empezar a cargar productos

---

## Notas técnicas (por si las necesitas más adelante)

- No se usa `service_role`, Edge Functions ni servidores adicionales — todo
  corre con la clave pública (anon key) y las reglas de seguridad (RLS)
  definidas en `sql/schema.sql`.
- Los nuevos usuarios se crean desde el panel usando un segundo cliente de
  Supabase sin sesión persistente, para que no interfiera con la sesión del
  administrador (ver `src/lib/supabaseClient.ts`).
- Si Supabase tiene activada la confirmación de correo por defecto, los
  usuarios nuevos creados desde el panel deberán confirmar su correo antes de
  poder iniciar sesión. Si prefieres que puedan entrar de inmediato, ve a
  **Authentication → Providers → Email** y desactiva "Confirm email".
