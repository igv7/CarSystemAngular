import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

/** One link in the side menu. */
export interface MenuItem {
  label: string;
  /** Route the link opens, e.g. "/admin/add-car". */
  link: string;
  /** Shown in red, for operations that delete or return something. */
  danger?: boolean;
}

/** A titled, collapsible group of menu links. */
export interface MenuSection {
  title: string;
  items: MenuItem[];
}

/**
 * Dashboard-style navigation for the admin and client pages: an overview link, collapsible sections of
 * operations, and a Sign Out button. The page that is open is highlighted.
 */
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  /** Label and route of the top link that opens the page's overview. */
  @Input() homeLabel = 'Overview';
  @Input() homeLink: string;

  @Input() sections: MenuSection[] = [];

  /** localStorage key under which collapsed sections are remembered for this menu. */
  @Input() storageKey: string;

  /** Emitted when the Sign Out button is clicked. */
  @Output() signOut = new EventEmitter<void>();

  /** Titles of the sections the user has collapsed. */
  private collapsed = new Set<string>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      this.collapsed = new Set<string>(Array.isArray(saved) ? saved : []);
    } catch (e) {
      this.collapsed = new Set<string>();
    }
  }

  /** A section is shown collapsed only if the user collapsed it and the open page isn't inside it. */
  public isCollapsed(section: MenuSection): boolean {
    return this.collapsed.has(section.title) && !this.containsActivePage(section);
  }

  /** Expands or collapses a section and remembers the choice. */
  public toggle(section: MenuSection): void {
    if (this.isCollapsed(section)) {
      this.collapsed.delete(section.title);
    } else {
      this.collapsed.add(section.title);
    }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.collapsed)));
    } catch (e) {
      // Storage unavailable (e.g. private mode); the choice just isn't remembered.
    }
  }

  private containsActivePage(section: MenuSection): boolean {
    return section.items.some(item => this.router.isActive(item.link, false));
  }
}
