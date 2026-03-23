# Bug Solutions & Patterns

This file documents known bugs and their solutions for the Castfor Weather App.

---

## Known Issues & Solutions

### 1. `@radix-ui/react-sheet` does not exist on npm
**Problem**: This package is not published on npm.  
**Solution**: Use `@radix-ui/react-dialog` (which Shadcn's Sheet component is built on). The Sheet component in `components/ui/sheet.tsx` correctly imports from `@radix-ui/react-dialog`.

### 2. Leaflet "window is not defined" SSR Error
**Problem**: Leaflet accesses the `window` object during import, which fails in SSR.  
**Solution**: Use `next/dynamic` with `ssr: false` for the `WeatherMap` component. Also, dynamically import `leaflet` inside a `useEffect` in the component.

### 3. Leaflet default marker icons broken by webpack
**Problem**: Leaflet uses `_getIconUrl` internally which webpack breaks.  
**Solution**: In the map component, use double cast to delete the property safely:
```typescript
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
```
Then merge new icon options pointing to CDN URLs.

### 6. ESLint error: rule `@typescript-eslint/no-explicit-any` not found
**Problem**: Using `// eslint-disable-next-line @typescript-eslint/no-explicit-any` when the `@typescript-eslint` ESLint plugin isn't configured causes a build error.  
**Solution**: Remove the comment (the rule isn't enabled) and use a proper TypeScript type cast instead of `any`.

### 7. Zod `.optional().default(X)` types resolve to `T | undefined` in strict TypeScript
**Problem**: `z.number().optional().default(0)` sometimes infers output as `number | undefined` instead of `number`.  
**Solution**: Use `z.number().default(0)` (without `.optional()`) OR add a `?? fallback` at the usage site.

### 4. Next.js project creation fails with spaces/capitals in directory name
**Problem**: `create-next-app` uses the directory name as the npm package name, which must be URL-friendly (no spaces, no capitals).  
**Solution**: Manually create `package.json` with a valid `name` field (e.g., `castfor-weather`) and run `npm install`.

### 5. CSS @import order in PostCSS
**Problem**: `@import` statements must appear before `@tailwind` directives in CSS files.  
**Solution**: Import third-party CSS (e.g., Leaflet) at the top of a CSS file, before any `@tailwind` directives. For node_modules CSS, prefer importing directly in client components using ES imports.

### 8. Page looks unstyled (default browser fonts, blue underlined links, no Tailwind layout)
**Problem**: HTML renders but Tailwind utilities and global theme CSS never apply—often the compiled CSS chunk failed to load or PostCSS did not run on `app/globals.css`.  
**Checks**:
1. **Import**: `app/layout.tsx` must import `./globals.css` once (root layout only). This project already does.
2. **PostCSS**: Use a single `postcss.config.js` with `tailwindcss` and `autoprefixer`. Avoid keeping both `postcss.config.js` and `postcss.config.mjs` (duplicate configs confuse tooling). Prefer explicit `require('tailwindcss')` / `require('autoprefixer')` in the plugins array if plugin name resolution fails (e.g. unusual paths).
3. **Browser**: In DevTools → Network, confirm `_next/static/css/...` returns **200** (not 404/blocked). Ad blockers or wrong dev URL/port can make it look like “CSS not imported.”
4. **Project path**: A folder name with **spaces** (e.g. `Weather for ai`) can occasionally break asset paths or tooling; if issues persist after a clean `.next` + reinstall, try cloning to a path without spaces.

---

## Patterns & Conventions

### Weather Data Flow
1. Server Component calls `lib/weather/get-*.ts` helpers
2. Helpers call `lib/api/weather-client.ts` with typed fetch + Zod validation
3. Validated data is passed as props to presentational components

### Error Handling Pattern
```typescript
try {
  return await fetchXxx(location);
} catch (err) {
  logError('context-name', err, { location: location.city });
  throw err; // re-throw for Next.js error boundary
}
```

### Adding a New Weather Metric
1. Add field to the relevant Zod schema in `lib/validation/weather.ts`
2. Add field to the TypeScript interface in `types/weather.ts`  
3. Map it in `lib/api/weather-client.ts`
4. Display it using `MetricBadge` in the appropriate component
