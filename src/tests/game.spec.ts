import {
  expect,
  test,
} from "@playwright/test";

test(
  "finishes a game when time reaches zero",
  async ({
    page,
  }) => {
    await page.addInitScript(
      () => {
        localStorage.setItem(
          "pirate-battle-settings",

          JSON.stringify({
            sessionDuration:
              1,

            volume:
              0.8,

            difficulty:
              "normal",
          }),
        );
      },
    );

    await page.goto("/");

    await page
      .getByRole(
        "button",
        {
          name:
            "Play",
        },
      )
      .click();

    await expect(
      page.locator(
        '[data-testid="game-canvas"]',
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Time Up!",
        },
      ),
    ).toBeVisible({
      timeout:
        5000,
    });

    await expect(
      page.getByText(
        "Final Score",
      ),
    ).toBeVisible();
  },
);