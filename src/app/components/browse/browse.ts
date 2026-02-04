import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, ActivatedRoute } from '@angular/router';
import { Cocktail } from '../../common/cocktail/cocktail';
import { CocktailService } from '../../services/cocktail.service';

@Component({
  selector: 'app-browse',
  imports: [InputTextModule, Cocktail, ButtonModule, FormsModule, CommonModule],
  templateUrl: './browse.html',
  styles: ``,
})
export class Browse {
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  browse = computed(() => this.activatedRoute.snapshot.url[0]?.path === 'browse')

  private cocktailService = inject(CocktailService);
  saved = this.cocktailService.savedCocktails;
  spirits = this.cocktailService.uniqueSpirits;

  searchValue = signal<string>('');
  selectedSpirit = signal<string>('All');

  private baseCocktails = computed(() => {
    const saved = this.saved();
    return this.browse()
      ? this.cocktailService.cocktails()
      : this.cocktailService.cocktails().filter(x => saved.has(x.id));
  });

  cocktails = computed(() => {
    const search = this.searchValue().toLowerCase();
    const spirit = this.selectedSpirit();
    let filtered = this.baseCocktails();

    if (spirit !== 'All') {
      filtered = filtered.filter(x => x.base === spirit);
    }

    if (search) {
      filtered = filtered.filter(x =>
        x.title.toLowerCase().includes(search) ||
        x.ingredients.some(ing => ing.name.toLowerCase().includes(search))
      );
    }

    return filtered;
  });

  onSearch(event: any) {
    this.searchValue.set(event.target.value);
  }

  goToDetails(id: string) {
    this.router.navigate(['browse', id])
  }

  save(id: string) {
    this.cocktailService.toggleSaveCocktail(id)
  }

}
