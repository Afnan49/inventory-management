import { Component, input, OnInit, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { Column } from '../../../inventory/model/inventory';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [TableModule, DatePipe, CommonModule],
})
export class TableComponent implements OnInit {
  columns = input<Column[]>();
  config = input<any>();
  defaultAction = input<TemplateRef<any>>();
  constructor() {}

  ngOnInit() {}
}
