import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { CocktailService } from '../../services/cocktail.service';
import { Cocktail } from '../../common/cocktail/cocktail';
import { Router, RouterLink } from '@angular/router';
import { IngredientModel } from '../../models/ingredient.model';

@Component({
    selector: 'app-my-bar',
    standalone: true,
    imports: [FormsModule, MultiSelectModule, Cocktail, TabsModule, ButtonModule, RouterLink],
    templateUrl: './my-bar.html',
})
export class MyBar {
    private cocktailService = inject(CocktailService);
    private router = inject(Router);

    ingredients = this.cocktailService.allIngredients;
    selectedIngredients = signal<string[]>([]);
    saved = this.cocktailService.savedCocktails;

    savedCocktailsList = computed(() => {
        const savedIds = this.saved();
        if (savedIds.size === 0) return [];
        return this.cocktailService.cocktails().filter(c => savedIds.has(c.id));
    });

    matches = computed(() => {
        const selected = new Set(this.selectedIngredients().map(i => i.toLowerCase()));
        if (selected.size === 0) return [];

        return this.cocktailService.cocktails().map(cocktail => {
            const cocktailIngs = cocktail.ingredients.map(ing =>
                ing.name.toLowerCase()
            );

            const missing = cocktailIngs.filter(ing => !selected.has(ing));

            return {
                ...cocktail,
                missingCount: missing.length,
                missingIngredients: missing
            };
        }).sort((a, b) => a.missingCount - b.missingCount);
    });

    goToDetails(id: string) {
        this.router.navigate(['browse', id]);
    }

    save(id: string) {
        this.cocktailService.toggleSaveCocktail(id);
    }
}
