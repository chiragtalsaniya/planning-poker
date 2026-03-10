import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Fixed Header -->
      <header class="bg-gradient-to-r from-primary to-red-700 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <img src="assets/logo.svg" alt="Planning Poker Logo" class="w-10 h-10" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">Planning Poker</h1>
                <p class="text-xs text-red-100">Agile Estimation Tool</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex-1 pt-20 pb-20">
        <router-outlet></router-outlet>
      </div>

      <!-- Fixed Footer -->
      <footer class="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div class="flex flex-col md:flex-row items-center justify-between gap-2">
            <p class="text-sm text-gray-300">
              © 2026 Planning Poker. Developed by Chirag Talsaniya.
            </p>
            <div class="flex items-center gap-4">
              <a routerLink="/privacy-policy" class="text-xs text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a routerLink="/contact" class="text-xs text-gray-400 hover:text-white transition">Contact</a>
              <p class="text-xs text-gray-400">
                Made with ❤️ for better sprint planning
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  title = 'planning-poker';
}
