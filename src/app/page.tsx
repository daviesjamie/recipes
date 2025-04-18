import { getRecipes } from "@/lib/recipes";
import Link from "next/link";

export default async function RecipeList() {
  const recipes = await getRecipes();

  return (
    <main>
      <h1>Recipes</h1>
      <ul>
        {recipes
          .sort((a, b) => a.slug.localeCompare(b.slug))
          .map((recipe) => (
            <li key={recipe.slug}>
              <Link href={recipe.slug}>{recipe.slug}</Link>
            </li>
          ))}
      </ul>
    </main>
  );
}
