# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 9 (Angular CLI 9.1, TypeScript 3.8, RxJS 6, Bootstrap 4) front end for a car-rental "Car System". It is a pure client: all data comes from a separate Java/Spring-style backend expected at `http://localhost:8080`, which is not part of this repo. Without that backend running, nearly every page shows an `alert()` error.

## Commands

Node 14 is required (Angular 9 fails on Node 17+ with `ERR_OSSL_EVP_UNSUPPORTED`). It's pinned with Volta (`"volta": { "node": "14.17.6" }` in `package.json`), so `node`/`npm` switch to 14 automatically inside this folder while the machine default can be newer.

- `npm start` — runs `log-server.js --serve`: the log server on port 4300 plus `ng serve` on http://localhost:4200. The proxy (`proxy.conf.json`) forwards `/__log` to the log server; its `/api` entry is unused because services call `http://localhost:8080` directly.
- `npm run start:app-only` — dev server without the log server; `npm run log-server` — log server only
- `npm run build` — build to `dist/` (`ng build --prod` for production)
- `npm test` — Karma + Jasmine unit tests in Chrome (watch mode); `npm run test:ci` runs them once, headless
- Single spec: temporarily change `describe`/`it` to `fdescribe`/`fit`, or narrow the `require.context` regex in `src/test.ts`. Component specs create the component through `setUpComponent()` (`src/app/testing/component-test.ts`), which provides HttpClient (testing backend), the router, forms and the shared pipes/validators; new components should use it too. Services, guards, interceptors, pipes and validators have real unit tests.
- `npm run lint` — TSLint (`tslint.json`, codelyzer)
- `npm run e2e` — Protractor (`e2e/`, the CLI stub)
- Playwright tests are in `e2e-playwright/`, a separate npm project on Node 18+ (Playwright no longer runs on Node 14); see its README. With `npm start` running, run `npm test` there (`test:mocked` is Chrome with no backend; `test:browsers` runs it in Firefox and WebKit, `test:mobile` runs the phone checks, `test:tools` tests `log-server.js` without a browser, `test:quality` runs axe and screenshot comparisons, `test:prod` runs against `ng build --prod` output; `test:real` uses the backend on :8080). Mocked tests fake the backend with `MockBackend` (`backend.get(path, json(...))`), and any call they didn't mock fails the test. Import `test`/`expect` from `support/fixtures.ts`.

## Architecture

**Single module.** Everything is declared in `src/app/app.module.ts`; routes live in `src/app/app-routing.module.ts`. New components must be added to both. The bootstrap component is `LayoutComponent` (not `AppComponent`), which hosts the header and `<router-outlet>`.

**Three areas under `src/app/components/`:**
- Public pages — `home`, `cars` (plus one component per brand: `audi`, `bmw`, … each routed at `/<brand>`), `car-search`, `login`, `signup`, `about`, `page404`.
- `admin/` — routed under `/admin`, guarded by `AdminGuardService` (`canActivate`). One component per backend operation (add/update/view/delete client or car, view receipts, return car, filtered listings).
- `client/` — routed under `/client`, guarded by `ClientGuardService` the same way.
- `AdminComponent` and `ClientComponent` are dashboards: `SideMenuComponent` (`components/side-menu/`) on the left, the child route's page on the right (an overview box shows when no child is open). The menu comes from each component's `sections` array (`{ title, items: [{ label, link, danger? }] }`); to add an operation, add its route and one menu item. Collapsed sections are remembered in localStorage.

**List → detail via child routes.** List pages (admin View All Cars / Clients / Receipts, client View Cars / My Cars / My Receipts) link each row to a child route (`car-details/:id`, `client-details/:id`, `receipt-details/:id`, `details/:id`, `details-receipt/:id`), rendered into a nested `<router-outlet>` in the list's template. `DetailsComponent` is shared by View Cars and My Cars, and Receipts By Client links into All Receipts' `receipt-details/:id`. Detail components re-fetch the whole list and `find()` by `+snapshot.params.id` rather than calling a single-item endpoint, and show `Messages.wrongCarId()` etc. for an unknown id.

**Lookup pages show the result themselves.** The id/number lookups (view/update/delete client, view client by identity number, view/update/delete/return car, view car by number, view client car by number) call a single-item endpoint and show the result in their own table or form, staying on their own URL. They have no child routes and no `<router-outlet>`.

**Services (`src/app/services/`)**, all `providedIn: 'root'`:
- `UrlsService` — backend base URLs: `environment.apiBaseUrl` (the backend address, in `src/environments/`) plus the `ApiPaths` (`/admin/`, `/client/`, `/car/`, `/carSystem/login/`, `/carSystem/signUp/`) from `constants/api-endpoints.ts`.
- `AdminService`, `ClientService`, `CarService`, `SignupService` — thin `HttpClient` wrappers; endpoint names come from `AdminApi` / `ClientApi` / `CarApi` in `constants/api-endpoints.ts` (they must match the backend controllers). The auth token is put **in the URL path** (`<base>/<operation>/<token>/<id>`) using `loginService.token`, with `withCredentials: true`.
- `LoginService` — the real auth state. `login()` POSTs credentials as query params and gets the token back as a text body. Users sign in with their nickname (`?nickname=&password=&type=`). A wrong nickname or password gets a 401 whose text body the sign-in page shows as is (it doesn't say which of the two was wrong). Token, role flags and the signed-in nickname are stored in `sessionStorage`, so closing the tab or browser signs out while a reload does not (`token`, `userAdmin`, `userClient`, `userName`; the nickname feeds the dashboards' "Hi, <nickname>!"); the guards check `getAdminUser()` / `getClientUser()`, and `isLoggedIn` (used by the header) is a getter over those flags. Sign-out buttons call `confirmAndSignOut()`, which navigates to `/home` before clearing state, so the admin/client page is gone before its token is (`sessionExpired()` and Delete Account do the same).
- Sign In type: only the admin account (`environment.adminUserName`, matching the backend's `carsystem.admin.username`) can choose ADMIN or CLIENT; any other nickname is locked to CLIENT. The guards redirect with `/login?as=client` or `?as=admin`, and `as=client` locks the type to CLIENT even for `admin`.
- Backend sessions live in the backend's memory and expire after 30 idle minutes (`carsystem.session.timeout-minutes`) or on a backend restart. `SessionExpiredInterceptorService` turns a 401 on an admin/client URL into `loginService.sessionExpired()` (alert, go to `/login`, clear state) and swallows the error so pages don't alert twice; a 401 from sign-in is left alone.
- `AuthService` and `TokenInterceptorService` — what is left of an older token flow: `AuthService.getToken()` only. The interceptor still adds an `Authorization: Bearer <authToken>, <loginToken>` header to every request.
- `ItemsService` — loose shared `any` state (`car`, `client`, `cars`, …); currently unused.

**Models** (`src/app/models/`) are plain classes/enums: `Car`, `Client`, `ClientReceipt`, `User`, the string enums `CarType`, `CarColor` and `ClientType` (ADMIN/CLIENT) with `CAR_TYPES` / `CAR_COLORS` lists for dropdowns (`*ngFor`), and `ResponseCodes` (HTTP status enum used in response handling). `Client.password` is write-only: the backend stores a BCrypt hash and never returns it, so no page shows passwords, and Update Client sends it only when a new one is typed.

**Constants** (`src/app/constants/`) — no hard-coded routes, storage keys or titles in components:
- `app-routes.ts` — `RoutePaths` (URL segments; `app-routing.module.ts` is built from them), `AppRoutes` (absolute links for `router.navigate()`, menus and templates), `ID_PARAM`, `brandLink()`, and `LOGIN_AS_PARAM` / `LoginAs` for `/login?as=…`. Detail links are arrays: `[AppRoutes.ADMIN_VIEW_ALL_CARS, RoutePaths.CAR_DETAILS, id]`.
- `storage-keys.ts` — `StorageKeys` for every localStorage key.
- `page-titles.ts` — `PageTitles` and `brandTitle()` for `Title.setTitle()`.
- Templates get them through a component field (`public readonly routes = AppRoutes;`, `paths = RoutePaths`, `clientType = ClientType`).
- Settings that differ per deployment (backend address, admin username, logging) live in `src/environments/environment*.ts`, Angular's properties files.

**Pipes** (`src/app/pipes/`) handle client-side text/date filtering of list tables, bound to a `listFilter` field on list components.

## Conventions seen in the code

- Forms are template-driven (`FormsModule`, `#f="ngForm"` with `@ViewChild('f')`), not reactive forms.
- Validation (`src/app/validation/`): the values live in `ValidationRules` (`validation/rules.ts`) and are bound on the inputs and in the feedback texts through a `rules` field: `[pattern]="rules.NICKNAME.pattern" [minlength]="rules.NICKNAME.minLength"`, `{{ rules.BALANCE.max }}`; only `required` stays a plain attribute. `RangeValidatorDirective` enforces `min`/`max` on number and date inputs (Angular 9 doesn't) and writes them back as attributes for the browser's spinner/date picker, `appMatches="otherField"` checks confirm fields, and `ValidationFeedbackDirective` adds Bootstrap `is-invalid` to touched fields and `is-valid` to typed-in (dirty) or submitted fields in any `form.needs-validation`, which shows the sibling `.invalid-feedback`/`.valid-feedback` text. No feedback line may appear between a click's mouse-down and mouse-up: the blur comes from the mouse-down on a button, the new line pushes the button down before the mouse-up, and the click is lost. So "Looks good!" never appears on blur alone, and an error caused by a mouse-press blur is held back until the click is over (document mouse listeners in the directive); a Tab-away shows it at once. Submit buttons guard themselves: `(click)="formInfo.valid ? save() : formInfo.form.markAllAsTouched()"`; id lookups in edit forms check only the id (`#idInfo="ngModel"`). Keep the patterns in sync with the backend's `Car`/`Client` annotations and `Constants`. A client has `firstName`, `lastName` (`rules.PERSON_NAME`, which may repeat between clients) and a unique `nickname` (`rules.NICKNAME`), the login; only the backend can check uniqueness, and its message is shown in the alert. `PERSON_NAME.pattern` is a RegExp with the `u` flag (for `\p{L}`, any letter), so it carries its own `^`/`$`; Angular's `pattern` accepts a RegExp as is.
- Sanitization (`validation/sanitize.ts`): services send bodies through `trimFields()` (trims strings except `password`) and wrap user-typed values that go into URLs with `urlPart()`. Never build HTML from strings (`innerHTML`); use text and DOM nodes. Alerts show the backend's validation message via `serverErrorMessage(err)`.
- Each component sets the browser tab title via `Title.setTitle()` in `ngOnInit`, and "back" buttons navigate explicitly with `router.navigate([...])`.
- Logging goes through `LoggerService`, never `console.*`. Classes declare `private log = this.logger.for('ClassName');` and call `this.log.debug|info|error(message, ...data)`. Use `debug` for fetches, `info` for completed user actions (add/update/delete, login/logout) and `error` for failures, passing the `err` object. Entries are batched to `logs/app.log` by `log-server.js`; password/token fields and the token in URLs are masked. Settings (`logLevel`, `logServerUrl`, `logToConsole`) live in `src/environments/`.
- `HttpLoggingInterceptorService` logs every HTTP call at `debug`, and `LoggingErrorHandlerService` logs uncaught errors.
- Load errors and empty results are shown in the page, not with `alert()`: each component has a `message` field shown by `<app-page-message [text]="message">` (`[light]="true"` inside the white modal forms), set with `loadErrorMessage(err, Messages.wrongClientId(id))` and the `Messages` texts from `constants/messages.ts`. The backend answers 400 for an unknown id and `200 []` for an empty list, so the two are told apart. Results of actions (add/update/delete/rent/return), sign-in, sign-up and session expiry still use `alert()`.
- Imports use absolute `src/app/...` paths.
- Classes, methods and non-obvious fields carry a one-line `/** ... */` comment above them saying what they do (e.g. where `cancel()` navigates). Obvious members (`private log`, DI constructors, plain model ids) are left uncommented. `//` is used for section headers and notes inside method bodies.
- Brand images are in `src/assets/images/CARS/<BRAND>.jpg` (upper-case brand names matching `CarType`).
