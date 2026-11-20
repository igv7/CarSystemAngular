import { test, expect } from '../../support/fixtures';
import { json } from '../../support/mock-backend';
import { CLIENT } from '../../support/test-data';
import { SignupPage } from '../../pages/signup-page';

const SIGNUP = '/carSystem/signUp/';
const NEW_CLIENT = { ...CLIENT, id: undefined, password: 'secret1' };

test.describe('Sign Up', () => {
  let signup: SignupPage;

  test.beforeEach(async ({ page }) => {
    signup = new SignupPage(page);
    await signup.goto();
  });

  test('a valid form creates the account and opens Sign In', async ({ page, backend, dialogs }) => {
    backend.post(SIGNUP, call => json({ ...call.body, id: 42, password: undefined }));

    await signup.fill(NEW_CLIENT);
    await signup.submit.click();

    await dialogs.expectShown(`Client ${CLIENT.nickname} has been succesfully added!`);
    await expect(page).toHaveURL(/\/login$/);

    const [call] = backend.callsTo('POST', SIGNUP);
    expect(call.body).toMatchObject({
      firstName: CLIENT.firstName,
      lastName: CLIENT.lastName,
      nickname: CLIENT.nickname,
      clientID: CLIENT.clientID,
      birthday: CLIENT.birthday,
      email: CLIENT.email,
      phoneNumber: CLIENT.phoneNumber,
      password: 'secret1',
      balance: 100,
    });
  });

  test('a backend validation error is shown in the alert', async ({ page, backend, dialogs }) => {
    backend.post(SIGNUP, json({ message: 'Nickname john_s is already taken' }, 409));

    await signup.fill(NEW_CLIENT);
    await signup.submit.click();

    await dialogs.expectShown('Nickname john_s is already taken');
    await expect(page).toHaveURL(/\/signup$/);
  });

  test('field rules: identity number, phone, balance and password confirmation', async ({ page, backend }) => {
    await signup.fill({ ...NEW_CLIENT, clientID: '12345', phoneNumber: '0501234567', balance: 500 }, 'different');
    await signup.submit.click();

    for (const field of [signup.clientID, signup.phone, signup.balance, signup.confirmPassword]) {
      await expect(field).toHaveClass(/is-invalid/);
    }
    await expect(signup.errorFor(signup.confirmPassword)).toContainText('Passwords do not match!');
    await expect(signup.errorFor(signup.balance)).toContainText('between 0 and 100');
    // Valid fields are not flagged.
    await expect(signup.firstName).not.toHaveClass(/is-invalid/);
    expect(backend.callsTo('POST', SIGNUP)).toHaveLength(0);
  });

  test('names accept letters of any language, but not digits', async ({ page, backend }) => {
    await signup.firstName.fill('Игорь');
    await signup.lastName.fill('O\'Brien-Lévy');
    await signup.nickname.fill('x1');
    await signup.submit.click();

    await expect(signup.firstName).not.toHaveClass(/is-invalid/);
    await expect(signup.lastName).not.toHaveClass(/is-invalid/);
    await expect(signup.nickname).toHaveClass(/is-invalid/); // too short

    await signup.firstName.fill('John2');
    await expect(signup.firstName).toHaveClass(/is-invalid/);
  });
});
