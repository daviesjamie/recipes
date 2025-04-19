import { promises as fs } from "fs";
import { promisify } from "util";
import { exec } from "child_process";
import { RecipeSchema, type Recipe } from "./schema";

type RecipeWithSlug = Recipe & {
  slug: string;
};

const pexec = promisify(exec);

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

export async function getRecipe(recipePath: string): Promise<RecipeWithSlug> {
  const output = await pexec(`chef recipe ${recipePath} --format json`);
  const recipe = RecipeSchema.parse(JSON.parse(output.stdout.trim()));
  const slug = calculateSlug(recipePath);

  return {
    ...recipe,
    slug,
  };
}

export async function getRecipes(): Promise<RecipeWithSlug[]> {
  const recipePaths = await getRecipePaths();
  const recipes: RecipeWithSlug[] = [];

  await Promise.all(
    recipePaths.map(async (recipePath) => {
      const recipe = await getRecipe(recipePath);
      recipes.push(recipe);
    }),
  );

  return recipes;
}
