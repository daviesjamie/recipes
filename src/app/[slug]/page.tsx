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
    title: recipe.slug,
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
      <h1>{recipe.slug}</h1>
      <pre>{recipe.content}</pre>
    </article>
  );
}
