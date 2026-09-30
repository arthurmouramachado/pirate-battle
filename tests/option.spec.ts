import {
  expect,
  test,
} from "@playwright/test";

test(
  "saves game settings",
  async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole(
        "button",
        {
          name:
            "Options",
        },
      )
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Options",
        },
      ),
    ).toBeVisible();

    await page
      .getByRole(
        "combobox",
      )
      .first()
      .selectOption(
        "60",
      );

    await page
      .getByRole(
        "button",
        {
          name:
            "Save Settings",
        },
      )
      .click();

    await expect(
      page.getByText(
        "Settings saved successfully.",
      ),
    ).toBeVisible();
  },
);