import { Component, input, output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CocktailModel } from '../../models/cocktail.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-cocktail',
  imports: [TagModule, TitleCasePipe, ButtonModule],
  templateUrl: './cocktail.html',
  styles: ``,
})
export class Cocktail {
  cocktail = input<CocktailModel | undefined>()
  saved = input<boolean>(false)
  onOpen = output<void>()
  onSave = output<void>()
}
