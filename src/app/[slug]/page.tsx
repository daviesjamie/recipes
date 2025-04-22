import IngredientList from "@/components/ingredient-list";
import { H1 } from "@/components/typography";
import { getRecipe, getRecipes } from "@/lib/recipes";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    return notFound();
  }

  return {
    title: recipe.name,
  };
}

export default async function Recipe({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    return notFound();
  }

  return (
    <article>
      <H1>{recipe.name}</H1>
      <IngredientList ingredients={recipe.ingredients} />
      <pre>{JSON.stringify(recipe, null, 2)}</pre>
    </article>
  );
}
