import { Component, inject, signal, computed } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { CocktailService } from '../../services/cocktail.service';
import { MessageService } from 'primeng/api';
import { TitleCasePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { IngredientModel } from '../../models/ingredient.model';

@Component({
  selector: 'app-details',
  imports: [TagModule, TitleCasePipe, DialogModule, ButtonModule],
  templateUrl: './details.html',
  styles: ``,
})
export class Details {

  activatedRoute = inject(ActivatedRoute)
  id = signal(this.activatedRoute.snapshot.paramMap.get('id'))

  public cocktailService = inject(CocktailService)
  cocktail = computed(() => this.cocktailService.getCocktail(this.id() || ''))
  saved = this.cocktailService.savedCocktails

  private messageService = inject(MessageService)

  calculate = signal({
    visible: false,
    count: 1
  })

  openCalculateDialog() {
    this.calculate.update(calc => ({ ...calc, visible: true }))
  }

  async sharePage() {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
      this.messageService.add({
        severity: 'success',
        summary: 'Link Copied',
        detail: 'The link has been copied to your clipboard.',
      })
    }
  }

  toggleSaved() {
    this.cocktailService.toggleSaveCocktail(this.cocktail().id)
  }

  incrementCount() {
    this.calculate.update(calc => ({ ...calc, count: calc.count + 1 }))
  }

  decrementCount() {
    this.calculate.update(calc => ({ ...calc, count: calc.count > 1 ? calc.count - 1 : 1 }))
  }
}
