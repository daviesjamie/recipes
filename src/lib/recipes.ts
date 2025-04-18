import { promises as fs } from "fs";
import { promisify } from "util";
import { exec } from "child_process";

const pexec = promisify(exec);

type Recipe = {
  content: string;
  slug: string;
};

const RECIPES_BASE_PATH = "recipes";

async function getRecipePaths(): Promise<string[]> {
  const filenames = await fs.readdir(RECIPES_BASE_PATH);
  return filenames.map((filename) => `${RECIPES_BASE_PATH}/${filename}`);
}

function calculateSlug(path: string): string {
  return path
    .replace(new RegExp(`^${RECIPES_BASE_PATH}/`), "")
    .replace(/\.cook$/, "");
}

export async function getRecipe(
  recipePath: string,
): Promise<Recipe | undefined> {
  const jsonOutput = await pexec(`chef recipe ${recipePath} --format json`);
  return {
    content: jsonOutput.stdout.trim(),
    slug: calculateSlug(recipePath),
  };
}

export async function getRecipes(): Promise<Recipe[]> {
  const recipePaths = await getRecipePaths();
  const recipes: Recipe[] = [];

  await Promise.all(
    recipePaths.map(async (recipePath) => {
      const recipe = await getRecipe(recipePath);
      if (recipe) {
        recipes.push(recipe);
      }
    }),
  );

  return recipes;
}
