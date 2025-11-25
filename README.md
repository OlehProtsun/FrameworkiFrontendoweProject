# Frontend Laboratory App

This project is a modern **Next.js** application built as part of a university laboratory course.  
It demonstrates integration of:

- Next.js App Router
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS with a custom, minimalistic UI inspired by Preline UI
- End-to-end tests with Playwright
- Deployments to Firebase Hosting and Vercel

---

## Features

### 🔐 Authentication & User Management

- Email + password registration and login (Firebase Authentication)
- Email verification flow with a dedicated `/user/verify` page
- Protected routes using a custom `AuthContext` and `(protected)` layout
- User profile page with:
  - Display name
  - Email (read-only)
  - Avatar URL (`photoURL`)
  - Address fields stored in Firestore (`city`, `street`, `zipCode`)
- Change password form
- Sign out page / button

### 🧩 Wordsearch Game

A configurable **wordsearch (wykreślanka)** component integrated with Firestore:

- Renders an `n x n` grid filled with letters
- Words can appear horizontally, vertically and diagonally
- Tracks:
  - **found words**
  - **remaining words**
- Correct selections are locked and highlighted on the board
- Incorrect selections are cleared automatically
- When all words are found, a success badge is shown and the user can restart
- Board appearance settings stored in Firestore:
  - Line color
  - Line width
  - Font family
  - Theme-like styling (dark, gradients, etc.)

Each user’s game configuration and progress can be stored in Firestore in a `wordsearchGames` collection.

### 🎨 UI / UX

- Next.js App Router architecture (`app/` directory)
- Global layout with:
  - Sidebar navigation (public + protected sections)
  - Top auth bar with compact user info (avatar, name, email)
  - Gradient background, soft shadows and modern card layout
- Preline-style Tailwind design:
  - Rounded 2xl/3xl components
  - Gradient buttons
  - Subtle borders and glassmorphism accents
- SVG icons only (no icon fonts)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (React)
- **Styling:** Tailwind CSS (Preline-inspired components)
- **Auth & Data:** Firebase Authentication, Firebase Firestore
- **State / Context:** React Context (`AuthContext`)
- **Testing:** Playwright (E2E tests for navigation and auth flow)
- **Deployment:** Firebase Hosting, Vercel

---

## Project Structure (simplified)

```text
app/
  (public)/
    user/
      signin/
      register/
      verify/
  (protected)/
    user/
      profile/
      changepassword/
      signout/
  wordsearch/
  lib/
    firebase.js
    AuthContext.js
  components/
    HeaderAuthBar.jsx
    SidebarNav.jsx
  not-found.js
  layout.js
  page.js        # home page
.env             # environment variables (not committed)
next.config.mjs
package.json
tailwind.config.js
```

---

## Getting Started (Local Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env` file** in the project root and add your Firebase config:

   ```env
   NEXT_PUBLIC_API_KEY="..."
   NEXT_PUBLIC_AUTH_DOMAIN="..."
   NEXT_PUBLIC_PROJECT_ID="..."
   NEXT_PUBLIC_STORAGE_BUCKET="..."
   NEXT_PUBLIC_MESSAGING_SENDER_ID="..."
   NEXT_PUBLIC_APP_ID="..."
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

4. **Production build**

   ```bash
   npm run build
   npm start
   ```

---

## Testing (Playwright)

The project includes basic end-to-end tests for navigation and authentication.

```bash
# Install Playwright (once)
npx playwright install

# Run all tests
npx playwright test

# View HTML test report
npx playwright show-report
```

Example tests:

- navigation to the sign-in page from the home view
- logging in with a valid user and redirect to the profile page
- redirecting unauthenticated users from protected routes to the login form

---

## Deployment

### Firebase Hosting (experimental webframeworks)

1. Log in to Firebase CLI:

   ```bash
   firebase login
   ```

2. Enable webframeworks:

   ```bash
   firebase experiments:enable webframeworks
   ```

3. Initialize hosting (select existing project, Next.js detection = Yes):

   ```bash
   firebase init hosting
   ```

4. Build and deploy:

   ```bash
   npm run build
   firebase deploy
   ```

   At the end you will get a **Hosting URL** such as:

   ```text
   https://your-project-id.web.app
   ```

### Vercel

1. Push the project to a GitHub repository.
2. Create a Vercel account (GitHub login).
3. **Import Project** from the GitHub repo.
4. Framework preset: **Next.js**.
5. In **Settings → Environment Variables** import or add all `NEXT_PUBLIC_...` keys from `.env`.
6. Trigger **Redeploy** from the Deployments tab.
7. Visit the assigned domain, for example:

   ```text
   https://your-project-name.vercel.app
   ```

---

## Links

- **Live app:** https://frameworki-frontendowe-project.vercel.app/
- **Firebase Hosting:** https://frameworkifrontendowe25-26.web.app/
- **Vercel deployment:** https://frameworki-frontendowe-project.vercel.app/
- **Repository:** https://github.com/OlehProtsun/FrameworkiFrontendoweProject.git
