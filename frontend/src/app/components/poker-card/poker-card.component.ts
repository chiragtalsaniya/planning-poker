import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PokerCardConfig {
  type: 'waiting' | 'voted' | 'open' | 'selectable' | 'selected' | 'stat';
  value?: string | number;
  badge?: string;
  size?: 'normal' | 'small';
  clickable?: boolean;
  ariaLabel?: string;
  suit?: string;
  cornerValue?: string | number;
  disabled?: boolean;
  animationDelay?: number;
}

@Component({
  selector: 'app-poker-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poker-card.component.html'
})
export class PokerCardComponent {
  @Input() config!: PokerCardConfig;
  @Output() cardClick = new EventEmitter<void>();

  getCardClasses(): string {
    if (this.config.type === 'selected') {
      const classes = [];
      if (this.config.clickable && !this.config.disabled) {
        classes.push('group', 'cursor-pointer', 'hover:scale-105', 'hover:shadow-2xl');
      }
      if (this.config.disabled) {
        classes.push('opacity-50', 'cursor-not-allowed');
      }
      return classes.join(' ');
    }
    
    const classes = [`poker-card-${this.config.type}`];
    
    if (this.config.type === 'voted') {
      classes[0] = 'poker-card-closed';
    }
    
    if (this.config.clickable && !this.config.disabled) {
      classes.push('group', 'cursor-pointer', 'hover:scale-105', 'hover:shadow-2xl');
    }
    
    if (this.config.disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
    }
    
    return classes.join(' ');
  }

  getCenterValue(): string {
    const val = String(this.config.value || '');
    if (val === 'Coffee') {
      return this.config.type === 'selected' ? 'C' : '☕';
    }
    if (this.config.type === 'waiting') return '⏳';
    return val || '-';
  }

  getCornerValue(): string {
    const cornerVal = this.config.cornerValue || this.config.value;
    const val = String(cornerVal || '');
    if (val === 'Coffee') {
      return this.config.type === 'selected' ? 'C' : '☕';
    }
    return val;
  }

  showSuit(): boolean {
    const val = String(this.config.value || '');
    return val !== 'Coffee' && val !== '?' && val !== '';
  }

  onClick(): void {
    if (this.config.clickable && !this.config.disabled) {
      this.cardClick.emit();
    }
  }
}