import { promises as fs } from "fs";
import path from "path";

type Recipe = {
  content: string;
  slug: string;
};

const RECIPES_PATH = "recipes";

export async function getRecipes(): Promise<Recipe[]> {
  const filenames = await fs.readdir(RECIPES_PATH);
  const recipes: Recipe[] = [];

  await Promise.all(
    filenames.map(async (filename) => {
      const recipePath = path.join(RECIPES_PATH, filename);
      const recipe = await fs.readFile(recipePath);
      const slug = recipePath
        .replace(new RegExp(`^${RECIPES_PATH}/`), "")
        .replace(/\.cook$/, "");

      recipes.push({
        content: recipe.toString(),
        slug,
      });
    }),
  );

  return recipes;
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  const recipes = await getRecipes();
  return recipes.find((recipe) => recipe.slug === slug);
}
