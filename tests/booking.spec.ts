import { test, expect } from '@playwright/test'

const email = process.env.TEST_EMAIL!
const password = process.env.TEST_PASSWORD!

test('user can login', async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Email').fill(email)
    await page.getByPlaceholder('Password').fill(password)
    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page.getByText(`Logged in as ${email}`)).toBeVisible()
})


test('user can book and cancel a slot', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('Email').fill(email)
  await page.getByPlaceholder('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page.getByText(`Logged in as ${email}`)).toBeVisible()

  await page.getByLabel('Date').fill('2026-10-20')
  await expect(page.getByText('Loading…')).not.toBeVisible() 
  await page.getByRole('button', { name: '10:00' }).click()
  await expect(page.getByText('Time: 10:00')).toBeVisible() 
  await page.getByLabel('Name').fill('Playwright Test')
  await page.getByLabel('Email').fill(email)
  await expect(page.getByRole('button', { name: 'Book' })).toBeEnabled() 
  await page.getByRole('button', { name: 'Book' }).click()

  const row = page.getByRole('listitem').filter({ hasText: 'Playwright Test' })
  await expect(row).toBeVisible()

  await row.getByRole('button', { name: 'Cancel' }).click()
  await expect(row).not.toBeVisible()
})