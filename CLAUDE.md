# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 9 (Angular CLI 9.1, TypeScript 3.8, RxJS 6, Bootstrap 4) front end for a car-rental "Car System". It is a pure client: all data comes from a separate Java/Spring-style backend expected at `http://localhost:8080`, which is not part of this repo. Without that backend running, nearly every page shows an `alert()` error.

## Commands

- `npm start` — dev server on http://localhost:4200 (runs `ng serve --proxy-config proxy.conf.json`; the proxy forwards `/api` to `localhost:8080`, but services currently call `http://localhost:8080` directly, so the proxy is effectively unused)
- `npm run build` — build to `dist/` (`ng build --prod` for production)
- `npm test` — Karma + Jasmine unit tests in Chrome (watch mode)
- Single spec: temporarily change `describe`/`it` to `fdescribe`/`fit`, or narrow the `require.context` regex in `src/test.ts`. Most `*.spec.ts` files are unmodified CLI stubs and many will fail on missing providers.
- `npm run lint` — TSLint (`tslint.json`, codelyzer)
- `npm run e2e` — Protractor (`e2e/`)

## Architecture

**Single module.** Everything is declared in `src/app/app.module.ts`; routes live in `src/app/app-routing.module.ts`. New components must be added to both. The bootstrap component is `LayoutComponent` (not `AppComponent`), which hosts the header and `<router-outlet>`.

**Three areas under `src/app/components/`:**
- Public pages — `home`, `cars` (plus one component per brand: `audi`, `bmw`, … each routed at `/<brand>`), `car-search`, `login`, `signup`, `about`, `page404`.
- `admin/` — routed under `/admin`, guarded by `AdminGuardService` (`canActivate`) and `ExitAdminGuardService` (`canDeactivate`, which calls the component's own `canDeactivate()` to show a confirm dialog). One component per backend operation (add/update/view/delete client or car, view receipts, return car, filtered listings).
- `client/` — routed under `/client`, guarded by `ClientGuardService` / `ExitClientGuardService` the same way.

**List → detail via child routes.** List/lookup pages have a child route such as `car-id/:id`, `car-details/:id`, `client-id/:id` or `details/:id`, rendered into a nested `<router-outlet>` in the parent template. Several detail components are shared between parents (e.g. `CarIdComponent` under update-car, view-car, delete-car, return-car). Detail components typically re-fetch the whole list and `find()` by `+snapshot.params.id` rather than calling a single-item endpoint.

**Services (`src/app/services/`)**, all `providedIn: 'root'`:
- `UrlsService` — hard-coded backend base URLs (`/admin/`, `/client/`, `/car/`, `/carSystem/login/`, `/carSystem/signUp/`). Change backend addresses here.
- `AdminService`, `ClientService`, `CarService`, `SignupService` — thin `HttpClient` wrappers. The auth token is put **in the URL path** (`<base>/<operation>/<token>/<id>`) using `loginService.token`, with `withCredentials: true`.
- `LoginService` — the real auth state. `login()` POSTs credentials as query params and gets the token back as a text body. Token and role flags are stored in `localStorage` (`token`, `userAdmin`, `userClient`); the guards check `getAdminUser()` / `getClientUser()`.
- `AuthService` and `TokenInterceptorService` — an older, mostly unused token flow (posts to `localhost:4200`). The interceptor still adds an `Authorization: Bearer <authToken>, <loginToken>` header to every request.
- `ItemsService` — loose shared `any` state (`car`, `client`, `cars`, …) used to pass objects between components.

**Models** (`src/app/models/`) are plain classes/enums: `Car`, `Client`, `ClientReceipt`, `CarType`, `CarColor`, `ClientType`, `User`, and `ResponseCodes` (HTTP status enum used in response handling).

**Pipes** (`src/app/pipes/`) handle client-side text/date filtering of list tables, bound to a `listFilter` field on list components.

## Conventions seen in the code

- Forms are template-driven (`FormsModule`, `#f="ngForm"` with `@ViewChild('f')`), not reactive forms.
- Each component sets the browser tab title via `Title.setTitle()` in `ngOnInit`, and "back" buttons navigate explicitly with `router.navigate([...])`.
- Errors are reported with `console.log` plus `alert()`.
- Imports use absolute `src/app/...` paths.
- Brand images are in `src/assets/images/CARS/<BRAND>.jpg` (upper-case brand names matching `CarType`).
