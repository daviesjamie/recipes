import { getRecipes } from "@/lib/recipes";
import Link from "next/link";

export default async function RecipeList() {
  const recipes = await getRecipes();

  return (
    <ul>
      {recipes
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((recipe) => (
          <li
            key={recipe.slug}
            className="pl-6 text-sm before:absolute before:-ml-6 before:content-['•']"
          >
            <Link
              href={recipe.slug}
              className="font-semibold hover:underline active:underline"
            >
              {recipe.name}
            </Link>
          </li>
        ))}
    </ul>
  );
}
