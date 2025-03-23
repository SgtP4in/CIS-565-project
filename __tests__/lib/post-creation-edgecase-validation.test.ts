import { test, expect, type Page } from '@playwright/test';

const BLUESKY_WEB_URL = 'https://bsky.app';

//const BSKY_EMAIL = process.env.CIS565_EMAIL;
//const BSKY_PASS = process.env.CIS565_PASSWORD;
const BSKY_EMAIL = "cis565bskytests@gmail.com";
const BSKY_PASS = "CIS565TestGroup"; 


// Login function
async function login(page: Page): Promise<void> {

  // Navigate to the search page
  await page.goto(`${BLUESKY_WEB_URL}`);

  // Click the sign-in button
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Click on username field
  await page.getByTestId('loginUsernameInput').click();

  // Enter username
  await page.getByTestId('loginUsernameInput').fill(`${BSKY_EMAIL}`);

  // Click on password field
  await page.getByTestId('loginPasswordInput').click();

  // Enter pswd
  await page.getByTestId('loginPasswordInput').fill(`${BSKY_PASS}`);

  // Click on next button to sign-in
  await page.getByTestId('loginNextButton').click();

}

// Setup functionality
test.beforeEach(async ({ page }) => {

    // Call login function
    await login(page);

});

// Create Post using less than 0 characters
test('Create Post using less than 0 characters', {tag: '@post'}, async ({ page }) => {

    // Click on the create new post fab button
    await page.getByTestId('customFeedPage').getByTestId('composeFAB').click();

    // Click in post paragraph field
    await page.getByRole('paragraph').click();

    // Assertions
    // Verify post button is disabled due to min no.of characters not met
    const postBtn = await page.getByTestId('composerPublishBtn');
    await expect(postBtn).toHaveAttribute('disabled','');

});

// Create Post using greater than 300 characters
test('Create Post using greater than 300 characters', {tag: '@post'}, async ({ page }) => {

    // Click on the create new post fab button
    await page.getByTestId('customFeedPage').getByTestId('composeFAB').click();

    // Click in post paragraph field
    await page.getByRole('paragraph').click();

    // Type post message with 388 characters
    await page.getByRole('textbox', { name: 'Rich-Text Editor' }).fill('Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam himenaeos nascetur elit molestie semper. Sagittis ad senectus mauris; facilisi maximus a. Ex lectus ad tempor placerat egestas faucibus, a quam tincidunt. Parturient sagittis curae dignissim, tortor nam molestie ullamcorper mattis interdum. Hi');

    // Assertions
    // Verify post button is disabled due to max no.of characters exceeded
    const postBtn = await page.getByTestId('composerPublishBtn');
    await expect(postBtn).toHaveAttribute('disabled','');

});
