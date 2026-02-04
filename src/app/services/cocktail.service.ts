import { Injectable, signal, computed } from '@angular/core';
import cocktails from '../../../public/data/cocktails.json';
import { CocktailModel } from '../models/cocktail.model';
import { IngredientModel } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class CocktailService {
  private readonly cocktailsData = signal<CocktailModel[]>([...cocktails] as CocktailModel[]);

  cocktails = this.cocktailsData.asReadonly();

  uniqueSpirits = computed(() => {
    const spirits = this.cocktailsData().map(x => x.base).filter(x => !!x);
    return [...new Set(spirits)].sort();
  });

  allIngredients = computed(() => {
    const all = new Set<string>();
    this.cocktailsData().forEach(cocktail => {
      cocktail.ingredients.forEach(ing => {
        all.add(ing.name);
      });
    });
    return [...all].sort();
  });

  private savedCocktailsData = signal<Set<string>>(this.loadSavedCocktails());

  savedCocktails = computed(() => this.savedCocktailsData());

  private loadSavedCocktails(): Set<string> {
    const str = localStorage.getItem('saved_cocktails') || "[]"
    const ar = JSON.parse(str)
    return new Set(ar)
  }

  getCocktail(id: string): CocktailModel {
    return this.cocktailsData().find(x => x.id == id)!
  }

  toggleSaveCocktail(id: string) {
    const saved = new Set(this.savedCocktailsData())
    if (saved.has(id)) {
      saved.delete(id)
    } else {
      saved.add(id)
    }
    localStorage.setItem('saved_cocktails', JSON.stringify([...saved]))
    this.savedCocktailsData.set(saved)
  }

  formatIngredient(ing: IngredientModel): string {
    if (!ing.amount && !ing.unit) return ing.name;
    const amountStr = ing.amount > 0 ? ing.amount.toString() : '';
    const unitStr = ing.unit ? ` ${ing.unit}` : '';
    return `${amountStr}${unitStr} ${ing.name}`.trim();
  }


}
