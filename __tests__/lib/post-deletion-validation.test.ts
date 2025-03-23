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

// getDate function
async function getDate() {

  // Get current date
  const currentDate = new Date();

  // Extract month, day and year from currentDate obj
  const monthIndex = currentDate.getMonth();
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Months of the year array list
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Assign month name based on current month index
  const monthOfYr = monthNames[monthIndex];

  // Format the date in mm dd, yyyy format
  const formatDate = `${monthOfYr} ${day}, ${year}`

  // Return currentDate
  return formatDate;

}

// Setup functionality
test.beforeEach(async ({ page }) => {

    // Call login function
    await login(page);

});

// Delete last created Post
test('Delete Last Created Post', {tag: '@post'}, async ({ page }) => {

    // Get current date
    const currentDate = new Date();

    // Extract month, day and year from currentDate obj
    const monthIndex = currentDate.getMonth();
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Months of the year array list
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    // Assign month name based on current month index
    const monthOfYr = monthNames[monthIndex];

    // Format the date in mm dd, yyyy format
    const formatDate = `${monthOfYr} ${day}, ${year}`;

    // Navigate to Profile
    await page.getByRole('link', { name: 'Profile', exact: true }).click();

    // Get the number of posts
    const post = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div[2]/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div[3]/div/div').innerHTML();
    
    // Split off the first element of variable
    let postNum: number = parseInt(post.split("")[0]);

    // Select Post tab
    await page.getByTestId('profilePager-Posts').click();

    // Wait for 5 secs for page elems to full load
    await page.waitForTimeout(5000);

    // Select ellipses for post based on current date
    await page.getByRole('link', { name: `cis565testgroup.bsky.social\'s avatar View profileView profile · ${formatDate}` }).first().getByTestId('postDropdownBtn').click();

    // Click delete this post
    await page.getByTestId('postDropdownDeleteBtn').click();

    // Confirm post deletion
    await page.getByRole('button', { name: 'Delete' }).click();

    // Wait for 5 secs for page elems to full load
    await page.waitForTimeout(5000);

    // Initiate a page reload to show upated post numbers
    await page.reload();

    // Navigate to profile (click on profile nav link)
    await page.getByRole('link', { name: 'Profile', exact: true }).click();

    // Get the number of posts
    const postChk2 = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div/div/div/div[2]/div/div[1]/div[1]/div/div[2]/div[3]/div/div').innerHTML();

    // Split off the first element of variable
    let actualNum: number = parseInt(postChk2.split("")[0]);
 
    // Assertions
    let expectedPosts = postNum -=1;

    // Expected posts number to have decremented as latest post was deleted
    await expect(actualNum).toEqual(expectedPosts);    


});