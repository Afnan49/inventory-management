import { Component, inject, OnInit, HostListener, signal } from '@angular/core';
import { Column, Product } from '../../model/inventory';
import { InventoryService } from '../../services/inventory.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Router } from '@angular/router';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { Action } from '../../../shared/model/dropdown';
import { ACTIONS, COLUMNS } from '../../constants/inventory.constants';
import { ActionEnum } from '../../enum/action.enums';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  imports: [TableComponent, DropdownComponent],
})
export class InventoryListComponent implements OnInit {
  products = signal<Product[]>([]);
  inventoryService = inject(InventoryService);
  activeDropdownId = signal<string | null>(null);
  router = inject(Router);

  columns: Column[] = COLUMNS;
  actions: Action[] = ACTIONS;
  getProducts() {
    this.inventoryService.getProducts().subscribe((res: Product[]) => {
      this.products.set(res);
    });
  }

  constructor() {}

  ngOnInit() {
    this.getProducts();
  }
  onShowDropdown(event: Event, productId: string) {
    event.stopPropagation();
    this.activeDropdownId.set(
      this.activeDropdownId() === productId ? null : productId
    );
  }
  @HostListener('document:click')
  onDocumentClick() {
    this.activeDropdownId.set(null);
  }
  onActionClicked(optionsButtonId: string) {
    const menuActions: any = {
      [ActionEnum.EDIT]: (id?: string) => {
        console.log('Edit logic here');
        console.log(id);
      },
      [ActionEnum.VIEW]: (id?: string) => {
        this.router.navigate(['/inventory/details', id]);
      },
      [ActionEnum.ADD]: (id?: string) => {
        console.log('Add logic here');
        console.log(id);
      },
      [ActionEnum.DELETE]: (id?: string) => {
        console.log('Delete logic here');
        console.log(id);
      },
    };
    Object.keys(menuActions).forEach((key) => {
      if (key === optionsButtonId) {
        return menuActions[key](this.activeDropdownId());
      }
    });
  }
}
