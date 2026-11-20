# Playwright end-to-end tests

Browser tests for the Car System Angular app. They live in their own folder, with their own
`package.json`, because Playwright needs Node 18+ while the Angular 9 app needs Node 14. (The app's unit
tests are separate: `npm run test:ci` in the project root, Karma on Node 14.)

## Running

1. Start the app as usual in the project root (Node 14): `npm start` → http://localhost:4200
2. In this folder, on Node 18+ (`nvm use 24`; the running dev server keeps going):

   ```
   npm install                # first time only
   npm run install-browser    # first time only: downloads Chromium, Firefox and WebKit
   npm test                   # every project (about 15 minutes)
   npm run test:mocked        # Chrome, no backend needed (about 2 minutes)
   npm run test:browsers      # the mocked tests in Firefox and WebKit
   npm run test:mobile        # phone checks on a Pixel 7 and an iPhone 14
   npm run test:quality       # accessibility (axe) and visual regression
   npm run test:tools         # log-server.js on its own (no browser, about a second)
   npm run test:prod          # the mocked tests against the production build (see below)
   npm run test:real          # needs the Spring backend on :8080
   npm run test:ui            # Playwright UI mode: pick, watch and debug tests
   npm run report             # open the HTML report of the last run
   ```

Failed tests keep a screenshot, a video and a trace in `test-results/`
(`npx playwright show-trace <path>/trace.zip`). No test writes to `logs/app.log`: an automatic fixture
answers the app's `/__log` batches inside the browser.

## Projects

- **mocked** (`tests/mocked/`, Chrome): the backend is faked with `page.route()`. It works like Mockito: a
  test says what each endpoint answers, then checks what the app sent:

  ```ts
  backend.get(`/admin/viewAllCars/${TOKEN}`, json(CARS));      // when(...).thenReturn(...)
  backend.post('/carSystem/login/', fail(401, 'Wrong nickname or password'));
  expect(backend.callsTo('POST', '/carSystem/login/')[0].query.get('type')).toBe('CLIENT');  // verify(...)
  ```

  A call that no test mocked gets a 501 and fails the test, so new backend calls can't slip by unnoticed.
  The session-watcher tests use Playwright's fake clock (`page.clock`) to skip the one-minute interval.
- **firefox**, **webkit**: the same mocked tests in Firefox and WebKit (Safari's engine). Playwright's
  WebKit on Windows has no date picker (a date field acts as text) and lays out a Bootstrap feedback line
  only on the next repaint, so tests check the `is-invalid` class rather than whether that line is on screen.
- **mobile-chrome**, **mobile-safari** (`tests/mobile/`): phone checks, mocked: the collapsed navbar, the
  menu stacked above the content with every item tappable, no sideways scrolling.
- **quality** (`tests/quality/`, Chrome): accessibility scans with axe (WCAG 2.1 A/AA) of 19 pages, and
  screenshot comparisons of 8 pages. Colour contrast is a known issue in four areas (header links, the
  dashboard menu, detail links in admin tables, Bootstrap's coloured buttons), kept as `test.fail` tests;
  everything else must pass. After an intended visual change, refresh the baselines with
  `npm run update-screenshots` and review the new images in `tests/quality/visual.spec.ts-snapshots/`.
  The baselines are Chrome-on-Windows images.
- **tools** (`tests/tools/`, no browser): `log-server.js` run from a temporary copy on a free port.
- **prod-build**: the mocked suite (minus the specs that read logs, which production doesn't send) plus
  `tests/prod/` against the production build, served on :4400 by `support/serve-dist.js`. The project
  exists only when `dist/CarSystemAngular` does: build it first with `ng build --prod` in the project root
  (Node 14), and rebuild after changing the app.
- **real-backend** (`tests/real/`): against the real backend and databases. The smoke tests sign up a
  throw-away client (`e2e_<random>`), use it and delete it. `admin-flows.spec.ts` runs the car and client
  lifecycles and a full rental through the UI, creating and deleting its own data; it and the admin smoke
  test need `E2E_ADMIN_PASSWORD` and are skipped without it.

## Layout

| Path | What |
| --- | --- |
| `support/mock-backend.ts` | The fake backend (`MockBackend`) and reply helpers `json`, `text`, `fail`, `unreachable` |
| `support/fixtures.ts` | `test` with the `backend`, `dialogs` and `signIn(role)` fixtures; import `test`/`expect` from here |
| `support/dialogs.ts` | Records `alert()`/`confirm()` and answers OK; `dismissNext()` answers Cancel |
| `support/test-data.ts` | Sample cars, clients and receipts, the mocked token |
| `support/real-api.ts` | Direct backend calls for setting up and cleaning up real-backend tests |
| `support/serve-dist.js` | Static server for the production build |
| `pages/` | Page objects: `LoginPage`, `SignupPage`, `Header`, `Dashboard`, `AdminForms` (the admin's add/lookup forms) |

## Settings (environment variables)

| Variable | Default |
| --- | --- |
| `E2E_BASE_URL` | `http://localhost:4200` |
| `E2E_API_BASE_URL` | `http://localhost:8080` (must match `apiBaseUrl` in `src/environments`) |
| `E2E_ADMIN_NICKNAME` | `admin` |
| `E2E_ADMIN_PASSWORD` | not set, so the real-backend admin tests are skipped |

## Regression tests worth knowing

The "first click on a freshly opened form" tests (`login.spec.ts`, `form-buttons.spec.ts`) guard a
fixed bug: the mouse-down on a button blurred the empty autofocused field, its error line appeared and
pushed the buttons 23–42px down (a button is 38px tall), and the click was lost on 11 of 14 forms.
`ValidationFeedbackDirective` now holds such an error back until the click is over.

`phone.spec.ts` "every menu item can be tapped" guards another fixed bug: on phones the long admin menu ran
past its 50vh box and the overview covered several items (fixed with `overflow-y: auto` on the sidebar).

`remaining-ui.spec.ts` "opening a details page logs no uncaught error" guards a third: the client's car
details page read `car.amount` before the car had loaded, which threw every time it opened.
