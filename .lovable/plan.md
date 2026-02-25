

## Login Page Implementation Plan

### Overview
Create a login page matching the reference design: split layout with an illustration panel on the left and a login form on the right, using the current teal (HUE 174) color palette instead of the blue shown in the reference.

### Design (from reference image)
- **Left panel**: Teal gradient background with the uploaded illustration image, tagline "Automatize suas conversas" and subtitle
- **Right panel**: White background with ZapProBR logo, welcome text, email/password form, "Lembrar-me" checkbox, "Esqueceu a senha?" link, and "Entrar" button in teal

### Files to Create
1. **`src/assets/login-illustration.png`** - Copy the uploaded illustration image
2. **`src/pages/Login.tsx`** - The login page component with:
   - Split layout (left illustration panel + right form panel)
   - Left side: teal gradient background, illustration image, tagline text
   - Right side: ZapProBR logo (from `src/assets/logo.png`), "Bem-Vindo de volta" heading, email input, password input, "Lembrar-me" checkbox, "Esqueceu a senha?" link, "Entrar" button
   - Local auth state management (no Supabase yet) - stores `isAuthenticated` in React state/localStorage
   - On successful login, redirects to `/conversas`
   - Responsive: stacks vertically on mobile

### Files to Modify
3. **`src/App.tsx`** - Add auth gating:
   - Add `/login` route pointing to `Login` page
   - Wrap all existing routes with an auth check (simple localStorage-based)
   - If not authenticated, redirect to `/login`
   - Create a simple `ProtectedRoute` wrapper component inline

### Technical Details
- **Auth mechanism**: Simple local state using `localStorage.getItem("zapprobr_auth")`. No backend integration yet.
- **Default credentials**: Any non-empty email + password (mock login). Show toast on success/error.
- **Form validation**: Check for non-empty email format and password minimum length using basic validation.
- **Color adaptation**: Replace the blue tones from the reference with the system's teal palette (`hsl(174, 65%, 35%)` for primary, gradient from `--whatsapp` to `--whatsapp-dark`).
- **Components used**: Existing `Input`, `Button`, `Checkbox`, `Label` from `src/components/ui/`.

### User Flow
1. User opens any URL -> redirected to `/login` if not authenticated
2. Enters email + password -> clicks "Entrar"
3. Toast "Login realizado com sucesso" -> redirected to `/conversas`
4. Auth persists in localStorage until user logs out

