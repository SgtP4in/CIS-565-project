import { test, expect, type Page } from '@playwright/test';

const BLUESKY_WEB_URL = "https://bsky.app/"; // TODO: We should build a local version of bluesky. This way changes in the wroking repo can be tested
const BSKY_HANDLE = "CIS565TestGroup"; // TODO: Make these secret in GitHub
const GOOD_HANDLE = "12345--AFbth-wSDFe"

const DID_NOT_MEET_REQUIREMENT_D_VALUE = "M4.293 4.293a1 1 0 0 1 1.414 0L12 10.586l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L10.586 12 4.293 5.707a1 1 0 0 1 0-1.414Z"

test.beforeEach(async ({ page }) => {
    await page.goto(BLUESKY_WEB_URL);
    await page.getByRole('button', {name: 'Create Account'}).click(); // Click Sign in button
});

test('Register With No Credentials', async ({ page }) => {
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    await expect(page.getByText('Please enter your email.')).toHaveText('Please enter your email.'); // Find the error message and then assert on it
})

test('Register With Only Email (valid)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    await expect(page.getByText('Please choose your password.')).toHaveText('Please choose your password.'); // Find the error message and then assert on it
})

test('Register With Only Email (invalid)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test'); // Fill the email field
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    await expect(page.getByText('Your email appears to be invalid.')).toHaveText('Your email appears to be invalid.'); // Find the error message and then assert on it
})

test('Register With Valid Email, Short Password)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('123456'); // Fill the password with 7 characters (minimum is 8)
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    await expect(page.getByText('Your password must be at least 8 characters long.')).toHaveText('Your password must be at least 8 characters long.'); // Find the error message and then assert on it
})

test('Register With Valid Email, Good Password)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('123456'); // Fill the password with 7 characters (minimum is 8)
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    await expect(page.getByText('Your password must be at least 8 characters long.')).toHaveText('Your password must be at least 8 characters long.'); // Find the error message and then assert on it
})

test('Register With Birth Date Under 13 Years)', async ({ page }) => {
    const today = new Date();
    await page.getByTestId('date').click(); // Click the birth date input field
    await page.getByTestId('date').type(today.toLocaleDateString('en-us')); // Type the date into the field (fill did not work here to sdoing a keyboard input instead)
    await expect(page.getByText('You must be 13 years of age or older to sign up.')).toHaveText('You must be 13 years of age or older to sign up.'); // Find the error message and then assert on it
})

test('Register Step 1 Valid)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    const Placeholder = await page.locator("input.css-11aywtz").getAttribute("placeholder"); // Locator is placed on the input box for the handle
    await expect(Placeholder).toEqual("Type your desired username"); // Find the text dispalyed for step 2
})

test('Register Step 1 Valid, Step 2 No Value)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to trigger an attempt at registering
    const NextButton = await page.getByRole('button', {name: 'Next'})// Click the next button to trigger an attempt at registering
    await expect(NextButton).not.toBeEnabled(); // Find Next button should not be enabled without inputting text
})

test('Register Step 1 Valid, Step 2 Handle Already Taken)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to complete step 1
    await page.locator("input.css-11aywtz").fill(BSKY_HANDLE); // Locator is placed on the input box for the handle
    await page.getByRole('button', {name: 'Next'}).click(); // Click the next button to trigger an attempt at completeing step 2
    await expect(page.getByText('That handle is already taken.')).toHaveText('That handle is already taken.'); // Find the error message and then assert on it
})

test('Register Step 1 Valid, Step 2 Handle Less Than 3 Characters)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to complete step 1
    await page.locator("input.css-11aywtz").fill("12"); // Locator is placed on the input box for the handle
    const dAttributeValue = await page.locator('path').nth(2).getAttribute("d") // This locator points to the SVG object for "At least 3 characters" requirement
    await expect(dAttributeValue).toEqual(DID_NOT_MEET_REQUIREMENT_D_VALUE); // Find the error message and then assert on it
    const NextButton = await page.getByRole('button', {name: 'Next'})// Click the next button to trigger an attempt at registering
    await expect(NextButton).not.toBeEnabled(); // Find Next button should not be enabled without correct handle size
})

test('Register Step 1 Valid, Step 2 Handle Has Space)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to complete step 1
    await page.locator("input.css-11aywtz").fill("1234 "); // Locator is placed on the input box for the handle
    const dAttributeValue = await page.locator('path').nth(1).getAttribute("d") // This locator points to the SVG object for "Only contains letters, numbers, and hyphens" requirement
    await expect(dAttributeValue).toEqual(DID_NOT_MEET_REQUIREMENT_D_VALUE); // Find the error message and then assert on it
    const NextButton = await page.getByRole('button', {name: 'Next'})// Click the next button to trigger an attempt at registering
    await expect(NextButton).not.toBeEnabled(); // Find Next button should not be enabled without correct handle types
})

test('Register Step 1 Valid, Step 2 Handle Over 18 Characters)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to complete step 1
    await page.locator("input.css-11aywtz").fill("aaaaaaaaaaaaaaaaaaa"); // Locator is placed on the input box for the handle
    const dAttributeValue = await page.locator('path').nth(2).getAttribute("d") // This locator points to the SVG object for "No longer than 18 characters" requirement
    await expect(dAttributeValue).toEqual(DID_NOT_MEET_REQUIREMENT_D_VALUE); // Find the error message and then assert on it
    const NextButton = await page.getByRole('button', {name: 'Next'})// Click the next button to trigger an attempt at registering
    await expect(NextButton).not.toBeEnabled(); // Find Next button should not be enabled without correct handle size
})

test('Register Step 1 Valid, Step 2 Good Handle)', async ({ page }) => {
    await page.getByTestId('emailInput').click(); // Click the email input field
    await page.getByTestId('emailInput').fill('test@gmail.com'); // Fill the email field
    await page.getByTestId('passwordInput').click(); // Click the password input field
    await page.getByTestId('passwordInput').fill('12345678'); // Fill the password with 8 characters
    await page.getByRole('button', {name: 'Next'}).click() // Click the next button to complete step 1
    await page.locator("input.css-11aywtz").fill(GOOD_HANDLE); // Locator is placed on the input box for the handle
    await page.getByRole('button', {name: 'Next'}).click(); // Click the next button to trigger an attempt at registering
    await expect(page.getByText("Complete the challenge")).toHaveText("Complete the challenge"); // Find Next button should not be enabled without correct handle size
})