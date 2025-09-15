from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173")

    # Wait for the buttons to be visible
    page.wait_for_selector("text=BEGIN WEAVING")

    # 1. Click "Inspect Pattern" and take a screenshot
    page.click("text=INSPECT PATTERN")
    page.screenshot(path="jules-scratch/verification/01-inspect.png")

    # 2. Click "Unravel" and take a screenshot
    page.click("text=UNRAVEL")
    page.screenshot(path="jules-scratch/verification/02-unravel.png")

    # 3. Click "Inspect Pattern" again to zoom out and take a screenshot
    page.click("text=INSPECT PATTERN")
    page.screenshot(path="jules-scratch/verification/03-zoom-out.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
