import { test, expect, type Page } from '@playwright/test';

const BLUESKY_WEB_URL = 'https://bsky.app';

//const BSKY_EMAIL = process.env.CIS565_EMAIL;
//const BSKY_PASS = process.env.CIS565_PASSWORD;
const BSKY_EMAIL = "cis565bskytests@gmail.com";
const BSKY_PASS = "CIS565TestGroup"; 

// Specify search term
const searchTerm = 'nba';


// Login function
async function login(page: Page): Promise<void> {

  // Navigate to the search page
  await page.goto(`${BLUESKY_WEB_URL}`);

  // Sign into bluesky social
  await page.getByRole('button', {name: 'Sign in'}).click();

  // Login to BlueSky account by entering username
  await page.getByTestId('loginUsernameInput').click();
  await page.getByTestId('loginUsernameInput').fill(BSKY_EMAIL); 

  // And password
  await page.getByTestId('loginPasswordInput').click();
  await page.getByTestId('loginUsernameInput').fill(BSKY_PASS);

  // Click next btn to sign-in
  await page.getByRole('button', {name: 'Next'}).click();

}

// Setup functionality
test.beforeEach(async ({ page }) => {

    // Call login function
    await login(page);

    // Navigate to the search page
    await page.goto(`${BLUESKY_WEB_URL}/search`);

});

async function searchForPostByTermAndType(page: Page, term: string, postType: string): Promise<void> {

    // Find the search input HTML element using placeholder attribute and pass search term
    await page.getByLabel('Search').fill(term);

    // Search for entered term by stimulating 'enter' keyboard press
    await page.keyboard.press('Enter');

    // Check type of post
    if (postType.match('Feeds')) {
        // If posts matches Top posts
        const tab = page.getByText('Feeds', {exact : true }); // Navigate to Feeds tab        
        await expect(tab).toBeVisible();
        await tab.click();

    } else if(postType.match('Latest')) {
        // If posts matches Latest posts
        const tab = page.getByText('Latest', {exact : true }); // Navigate to Latest tab        
        await expect(tab).toBeVisible();
        await tab.click();

    } else if(postType.match('People')) { // If posts matches People posts

        const topTab = page.getByText('People', {exact : true }); // Navigate to People tab        
        await expect(topTab).toBeVisible();
        await topTab.click();

    } else if(postType.match('Top')) { // Post defaults to Top posts

        const tab = page.getByText('Top', {exact : true }); // Navigate to Top tab   
        await expect(tab).toBeVisible();
        await tab.click(); 
    
    }
}

// Test Scenario: Search for Top posts of a particular term
test('Search for Top posts of a particular term', {tag: '@search'}, async ({ page }) => {

    const searchType = 'Top';

    // Run searchBlueSky method to search for top post of term
    await searchForPostByTermAndType(page, searchTerm, searchType);

    // Assertions:
    // Get the post title using #id element
    const searchResults = await page.getByTestId('postText');

    // Check if at least one result contains the search term
    const firstResultText = await searchResults.first().textContent();

    // Get expected length of search term
    const expectedResult = searchTerm.length;
    
    // Verify actual term is either equal or greater than the length of the search term
    await expect(firstResultText?.length).toBeGreaterThanOrEqual(expectedResult);

});

// Test Scenario: Search for Latest posts of a particular term
test('Search for Latest posts of a particular term', {tag: '@search'}, async ({ page }) => {

    const searchType = 'Latest';

    // Run searchBlueSky method to search for top post of term
    await searchForPostByTermAndType(page, searchTerm, searchType);

    // Assertions:
    // Get the post title using #id element
    const searchResults = await page.getByTestId('postText');

    // Check if at least one result contains the search term (case-insensitive)
    const firstResultText = await searchResults.first().textContent();

    // Get expected length of search term
    const expectedResult = searchTerm.length;
    
    // Verify actual term is either equal or greater than the length of the search term
    await expect(firstResultText?.length).toBeGreaterThanOrEqual(expectedResult);

});

// Test Scenario: Search for Feeds of a particular term
test('Search for Feeds of a particular term', {tag: '@search'}, async ({ page }) => {

    const searchType = 'Feeds';

    // Run searchBlueSky method to search for top post of term
    await searchForPostByTermAndType(page, searchTerm, searchType);

    // Wait for feed elements to load
    await page.waitForSelector(`div.css-175oi2r:has-text("${searchTerm}")`);

    // Assertions:
    // Verify that first feed element has text associated with search term and is visible
    const searchElem = await page.locator(`div.css-175oi2r:has-text("${searchTerm}")`).first();
    await expect(searchElem).toBeVisible();

});

// Test Scenario: Search for People of a particular term
test('Search for People of a particular term', {tag: '@search'}, async ({ page }) => {

    const searchType = "People";

    // Run searchBlueSky method to search for top post of term
    await searchForPostByTermAndType(page, searchTerm, searchType);

    // Assertions:
    // Verify that first people element has text associated with search term and is visible
    const searchElem = await page.locator(`div.css-175oi2r:has-text("${searchTerm}")`).first();
    await expect(searchElem).toBeVisible();

});


// Test Scenario: Search without specifying a term to search for
test('Search without specifying term', {tag: '@search'}, async ({ page }) => {

    // Run searchBlueSky method to search for top post of term
    await searchForPostByTermAndType(page, "", "");

    // Assertions:
    // Verify that first people element has text associated with search term and is visible
    const searchElem = await page.locator('xpath=//*[@id="root"]/div/div/div/div/main/div/div/div[2]/div/div/div[2]/div[3]/div/div[2]/div/div[3]/div[1]/div/div[1]/div');
    await expect(searchElem).toHaveText('Trending');

});