import { z } from "zod";

const Metadata = z.preprocess(
  (val, ctx) => {
    if (val === null || typeof val !== "object" || !("map" in val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Literal 'map' key not found in metadata",
      });
      return z.NEVER;
    }

    return val.map;
  },
  z.record(z.string(), z.string().or(z.number())),
);

const Item = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), value: z.string() }),
  z.object({ type: z.literal("ingredient"), index: z.number() }),
  z.object({ type: z.literal("cookware"), index: z.number() }),
  z.object({ type: z.literal("timer"), index: z.number() }),
  z.object({ type: z.literal("inlineQuantity"), index: z.number() }),
]);

const Step = z.object({
  items: z.array(Item),
  number: z.number(),
});

const Content = z.discriminatedUnion("type", [
  z.object({ type: z.literal("step"), value: Step }),
  z.object({ type: z.literal("text"), value: z.string() }),
]);

const Section = z.object({
  name: z.string().or(z.null()),
  content: z.array(Content),
});

const Number = z.discriminatedUnion("type", [
  z.object({ type: z.literal("regular"), value: z.number() }),
  z.object({
    type: z.literal("fraction"),
    value: z.object({
      whole: z.number(),
      num: z.number(),
      den: z.number(),
      err: z.number(),
    }),
  }),
]);

const Value = z.discriminatedUnion("type", [
  z.object({ type: z.literal("number"), value: Number }),
  z.object({
    type: z.literal("range"),
    value: z.object({ start: Number, end: Number }),
  }),
  z.object({ type: z.literal("text"), value: z.string() }),
]);

const ScalableValue = z.discriminatedUnion("type", [
  z.object({ type: z.literal("fixed"), value: Value }),
  z.object({ type: z.literal("linear"), value: Value }),
]);

const ScalableQuantity = z.object({
  value: ScalableValue,
  unit: z.string().nullable(),
});

const ScaledQuantity = z.object({
  value: Value,
  unit: z.string().nullable(),
});

const Quantity = ScalableQuantity.or(ScaledQuantity);

const RecipeReference = z.object({
  name: z.string(),
  components: z.array(z.string()),
});

const IngredientReferenceTarget = z.enum(["ingredient", "step", "section"]);

const IngredientRelation = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("definition"),
    referenced_from: z.array(z.number()),
    defined_in_step: z.boolean(),
    reference_target: z.nullable(IngredientReferenceTarget),
  }),
  z.object({
    type: z.literal("reference"),
    references_to: z.number(),
    reference_target: z.nullable(IngredientReferenceTarget),
  }),
]);

const Modifiers = z.preprocess(
  (val) => (val === "" ? null : val),
  z.nullable(z.enum(["RECIPE", "REF", "HIDDEN", "OPT", "NEW"])),
);

export const Ingredient = z.object({
  name: z.string(),
  alias: z.string().nullable(),
  quantity: Quantity.nullable(),
  note: z.string().nullable(),
  reference: RecipeReference.optional(),
  relation: IngredientRelation,
  modifiers: Modifiers,
});

const ComponentRelation = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("definition"),
    referenced_from: z.array(z.number()),
    defined_in_step: z.boolean(),
  }),
  z.object({ type: z.literal("reference"), references_to: z.number() }),
]);

const Cookware = z.object({
  name: z.string(),
  alias: z.string().nullable(),
  quantity: Quantity.nullable(),
  note: z.string().nullable(),
  relation: ComponentRelation,
  modifiers: Modifiers,
});

const Timer = z.object({
  name: z.string().nullable(),
  quantity: Quantity,
});

const ScaleOutcome = z.enum(["Scaled", "Fixed", "NoQuantity"]);

const ScaleTarget = z.object({
  factor: z.number(),
});

const Scaled = z.discriminatedUnion("type", [
  z.object({ type: z.literal("DefaultScaling") }),
  z.object({
    type: z.literal("Scaled"),
    target: ScaleTarget,
    ingredients: z.array(ScaleOutcome),
    cookware: z.array(ScaleOutcome),
    timers: z.array(ScaleOutcome),
  }),
]);

export const Recipe = z.object({
  name: z.string(),
  metadata: Metadata,
  sections: z.array(Section),
  ingredients: z.array(Ingredient),
  cookware: z.array(Cookware),
  timers: z.array(Timer),
  inline_quantities: z.array(ScaledQuantity),
  data: Scaled,
});
