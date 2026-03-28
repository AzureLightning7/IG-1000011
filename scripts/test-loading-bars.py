from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # Navigate to the app
    page.goto('http://localhost:5175')
    page.wait_for_load_state('networkidle')
    
    # Take initial screenshot
    page.screenshot(path='initial.png', full_page=True)
    print('Initial page loaded')
    
    # Find and click the generate button
    try:
        # Wait for the generate button to be visible
        page.wait_for_selector('button', timeout=10000)
        generate_button = page.locator('button').filter(has_text='Generate My DormVibe')
        generate_button.click()
        print('Generate button clicked')
        
        # Wait for loading screen to appear
        page.wait_for_selector('.text-3xl', timeout=10000)
        print('Loading screen appeared')
        
        # Take screenshot of loading screen
        page.screenshot(path='loading-screen.png', full_page=True)
        
        # Monitor the loading bars
        for i in range(60):  # Wait up to 60 seconds
            time.sleep(1)
            
            # Take screenshot at each step
            page.screenshot(path=f'loading-step-{i}.png', full_page=True)
            
            # Check if results page has loaded
            if page.url.endswith('/results'):
                print('Results page loaded')
                break
                
        # Take final screenshot
        page.screenshot(path='final.png', full_page=True)
        
    except Exception as e:
        print(f'Error: {e}')
        page.screenshot(path='error.png', full_page=True)
    finally:
        browser.close()

print('Test completed')