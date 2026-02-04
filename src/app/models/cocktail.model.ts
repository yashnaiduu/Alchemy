import { IngredientModel } from "./ingredient.model";

export interface CocktailModel {
    id: string,
    title: string,
    description: string,
    base: string,
    ingredients: IngredientModel[],
    garnish: string,
    steps: string[],
    img: string,
    glass: string
}
