import type { Ingredient } from "@/lib/schema";
import type { z } from "zod";

export default function IngredientList(props: {
  ingredients: z.infer<typeof Ingredient>[];
}) {
  const visibleIngredients = props.ingredients.filter(
    (ingredient) =>
      ingredient.modifiers !== "REF" && ingredient.modifiers !== "HIDDEN",
  );

  return (
    <dl className="mb-8">
      {visibleIngredients.map((ingredient) => (
        <dt key={ingredient.name}>
          <b>{ingredient.name}</b>
        </dt>
      ))}
    </dl>
  );
}
