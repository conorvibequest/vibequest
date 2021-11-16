import { Injectable } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';

@Injectable({
    providedIn: 'root'
})

export class KeyboardHelper {
    constructor() {

    }

 closeKeyboard()
  {
    Keyboard.hide();
  }

 
}