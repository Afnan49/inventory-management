import { Component, inject, OnInit, HostListener, signal } from '@angular/core';
import { Product } from '../../model/inventory';
import { InventoryService } from '../../services/inventory.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Router } from '@angular/router';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { Action, Button, Column } from '../../../shared/model/dropdown';
import { ACTIONS, COLUMNS } from '../../constants/inventory.constants';
import { ActionEnum } from '../../enum/action.enums';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SearchinputComponent } from '../../../shared/components/searchinput/searchinput.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  standalone: true,
  imports: [
    TableComponent,
    DropdownComponent,
    ButtonComponent,
    SearchinputComponent,
    FilterComponent,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
})
export class InventoryListComponent implements OnInit {
  // ===< properties >===
  products = signal<Product[]>([]);
  allProducts: Product[] = [];
  inventoryService = inject(InventoryService);
  activeDropdownId = signal<string | null>(null);
  router = inject(Router);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  columns: Column[] = COLUMNS;
  actions: Action[] = ACTIONS;
  buttonConfig: Button = {
    id: 'add',
    label: 'Add new product',
    icon: 'pi pi-plus',
    class:
      'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 px-10 py-4 !text-lg',
  };
  // ===< get products >===
  getProducts() {
    this.inventoryService.getProducts().subscribe((res: Product[]) => {
      this.allProducts = res;
      this.products.set(res);
    });
  }

  constructor() {}

  // ===< on init >===
  ngOnInit() {
    this.getProducts();
  }
  // ===< on show dropdown >===
  onShowDropdown(event: Event, productId: string) {
    event.stopPropagation();
    this.activeDropdownId.set(
      this.activeDropdownId() === productId ? null : productId
    );
  }
  // ===< on document click >===
  @HostListener('document:click')
  onDocumentClick() {
    this.activeDropdownId.set(null);
  }
  // ===< on action clicked >===
  onActionClicked(optionsButtonId: string) {
    const menuActions: any = {
      [ActionEnum.EDIT]: (id: string) => {
        this.router.navigate(['/inventory/edit', id]);
      },
      [ActionEnum.VIEW]: (id: string) => {
        this.router.navigate(['/inventory/details', id]);
      },
      [ActionEnum.DELETE]: (id: string) => {
        const product = this.allProducts.find((p) => p.id === id);
        this.confirmationService.confirm({
          message: `Are you sure you want to delete ${product?.name}?`,
          header: 'Delete Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.inventoryService.deleteProduct(id).subscribe((res) => {
              this.getProducts();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product deleted successfully',
              });
            });
          },
        });
      },
    };
    Object.keys(menuActions).forEach((key) => {
      if (key === optionsButtonId) {
        return menuActions[key](this.activeDropdownId());
      }
    });
  }
  // ===< on button click >===
  onButtonClick(id: string) {
    if (id === 'add') {
      console.log('add');
      this.router.navigate(['/inventory/add']);
    }
  }
  // ===< on search >===
  onSearch(search: string) {
    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      this.products.set(
        this.allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      this.products.set([...this.allProducts]);
    }
  }
  // ===< on filter >===
  onFilter(filter: string) {
    if (filter === 'low') {
      this.products.set(
        this.allProducts.filter((product) => product.stock < 30)
      );
    } else if (filter === 'in') {
      this.products.set(
        this.allProducts.filter((product) => product.stock >= 30)
      );
    } else if (filter === 'all') {
      this.products.set([...this.allProducts]);
    }
  }
}
