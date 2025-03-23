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


// Cancel post without typing any text
test('Cancel Post without typing any text', {tag: '@post'}, async ({ page }) => {

    // Click on the create new post fab button
    await page.getByTestId('customFeedPage').getByTestId('composeFAB').click();

    // Click on the cancel button within the create new post popup box
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Assertion
    // Verify that home screen is displayed by checking for Discovery & Following tabs
    const discoveryTab = await page.getByTestId('homeScreenFeedTabs-Discover');
    await expect(discoveryTab).toBeVisible();

    const followingTab = await page.getByTestId('homeScreenFeedTabs-Following');
    await expect(followingTab).toBeVisible();

});

// Cancel post during its creation
test('Cancel Post during its creation', {tag: '@post'}, async ({ page }) => {

    // Click on the create new post fab button
    await page.getByTestId('customFeedPage').getByTestId('composeFAB').click();

    // Click in post paragraph field
    await page.getByRole('paragraph').click();

    // Type post message
    await page.getByRole('textbox', { name: 'Rich-Text Editor' }).fill('My first BlueSky post');

    // Click on the cancel button within the create new post popup box
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.waitForTimeout(3000);

    // Verify discard button is visible
    await page.getByTestId('confirmBtn').click();

    // Verify that home screen is displayed by checking for Discovery & Following tabs
    const discoveryTab = await page.getByTestId('homeScreenFeedTabs-Discover');
    await expect(discoveryTab).toBeVisible();

    const followingTab = await page.getByTestId('homeScreenFeedTabs-Following');
    await expect(followingTab).toBeVisible();

});
