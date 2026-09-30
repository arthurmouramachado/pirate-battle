import {
  expect,
  test,
} from "@playwright/test";

test(
  "shows empty ranking",
  async ({
    page,
  }) => {
    await page.addInitScript(
      () => {
        localStorage.clear();
      },
    );

    await page.goto("/");

    await page
      .getByRole(
        "button",
        {
          name:
            "Ranking",
        },
      )
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Ranking",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        /No scores yet/i,
      ),
    ).toBeVisible();
  },
);