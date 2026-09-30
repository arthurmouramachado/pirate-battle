import {
  expect,
  test,
} from "@playwright/test";

test.beforeEach(
  async ({
    page,
  }) => {
    await page.addInitScript(
      () => {
        localStorage.clear();
      },
    );
  },
);

test(
  "opens the main menu",
  async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Pirate Battle",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "button",
        {
          name:
            "Play",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "button",
        {
          name:
            "Options",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "button",
        {
          name:
            "Ranking",
        },
      ),
    ).toBeVisible();
  },
);