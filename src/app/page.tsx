import { Ul } from "@/components/typography";
import { getRecipes } from "@/lib/recipes";
import Link from "next/link";

export default async function RecipeList() {
  const recipes = await getRecipes();

  return (
    <Ul>
      {recipes
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((recipe) => (
          <li key={recipe.slug}>
            <Link
              href={recipe.slug}
              className="hover:underline active:underline"
            >
              {recipe.name}
            </Link>
          </li>
        ))}
    </Ul>
  );
}
