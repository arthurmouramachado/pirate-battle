import {
  expect,
  test,
} from "@playwright/test";

test(
  "shows empty match history",
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
            "Match History",
        },
      )
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Match History",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        "No matches played yet.",
      ),
    ).toBeVisible();
  },
);