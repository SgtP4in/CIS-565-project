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

// Create Post using one character
test('Create Post using one character', {tag: '@post'}, async ({ page }) => {

    // Navigate to profile (click on profile nav link)
    await page.getByRole('link', { name: 'Profile', exact: true }).click();

    // Get the number of posts
    const post = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div[2]/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div[3]/div/div').innerHTML();
    
    // Split off the first element of variable
    let postNum: number = parseInt(post.split("")[0]);

    // Click on the create new post fab button
    await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div[2]/div/div/div[2]/div/div[2]/button').click();

    // Click in post paragraph field
    await page.getByRole('paragraph').click();

    // Type post message with one character
    await page.getByRole('textbox', { name: 'Rich-Text Editor' }).fill('1');

    // Click on the post button to create new post
    await page.getByTestId('composerPublishBtn').click();

    // Initiate a page reload to show upated post numbers
    await page.reload();

    // Navigate to profile (click on profile nav link)
    await page.getByRole('link', { name: 'Profile', exact: true }).click();

    // Get the number of posts
    const postChk2 = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div[3]/div/div').innerHTML();

    // Split off the first element of variable
    let actualNum: number = parseInt(postChk2.split("")[0]);

    // Assertions
    let expectedPosts = postNum +=1;

    // Expected post number to have incremented
    await expect(actualNum).toEqual(expectedPosts);

    // Retrieve post text msg
    const returnMsg = await page.getByTestId('postText').first().textContent();

    // Expected length of post toBe 1
    await expect(returnMsg?.length).toBe(1);

});


// Create Post using 300 character
test('Create Post using 300 characters', {tag: '@post'}, async ({ page }) => {

    // Navigate to profile (click on profile nav link)
    await page.getByRole('link', { name: 'Profile', exact: true }).click();

    // Get the number of posts
    const post = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div[2]/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div[3]/div/div').innerHTML();
    
    // Split off the first element of variable
    let postNum: number = parseInt(post.split("")[0]);

    // Click on the create new post fab button
    await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div[2]/div/div/div[2]/div/div[2]/button').click();

    // Click in post paragraph field
    await page.getByRole('paragraph').click();

    // Type post message with one character
    await page.getByRole('textbox', { name: 'Rich-Text Editor' }).fill('Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam himenaeos nascetur elit molestie semper. Sagittis ad senectus mauris; facilisi maximus a. Ex lectus ad tempor placerat egestas faucibus, a quam tincidunt. Parturient sagittis curae dignissim, tortor nam molestie ullamcorper mattis interdums.');

    // Click on the post button to create new post
    await page.getByTestId('composerPublishBtn').click();

    // Initiate a page reload to show upated post numbers
    await page.reload();

    await page.waitForTimeout(5000);

    // Navigate to profile (click on profile nav link)
    await page.getByRole('link', { name: 'Profile', exact: true }).click();

    // Get the number of posts
    const postChk2 = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div[3]/div/div').innerHTML();

    // Split off the first element of variable
    let actualNum: number = parseInt(postChk2.split("")[0]);

    // Assertions
    let expectedPosts = postNum +=1;

    // Expected post number to have incremented
    await expect(actualNum).toEqual(expectedPosts);

    // Retrieve post text msg
    const returnMsg = await page.getByTestId('postText').first().textContent();

    // Expected length of post toBe 300
    await expect(returnMsg?.length).toBe(300);

});