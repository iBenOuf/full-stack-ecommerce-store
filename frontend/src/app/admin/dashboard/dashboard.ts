import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import {
  IReportResponse,
  IRecentOrder,
  ILowStockProduct,
  ITopProduct,
  ICategoryStat,
  ISalesTrend,
} from '../../core/models/report.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(
    private _reportService: ReportService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef
  ) {}

  reportData: IReportResponse['data'] | null = null;
  isLoading = true;
  dateRange = '30';

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - parseInt(this.dateRange));

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    this._reportService.getDashboardReport(startDate, endDate).subscribe({
      next: (res) => {
        this.reportData = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this._toastService.error('Failed to load dashboard report');
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  onRangeChange() {
    this.loadReport();
  }

  getCustomerName(order: IRecentOrder): string {
    if (!order.user) return 'Guest';
    return `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || order.user.email;
  }

  /** Returns a percentage (0–100) for the bar chart, capped at 100 */
  getTrendBarHeight(dailySales: number): number {
    if (!this.reportData?.salesTrends?.length) return 0;
    const max = Math.max(...this.reportData.salesTrends.map((t) => t.dailySales));
    return max > 0 ? Math.min((dailySales / max) * 100, 100) : 0;
  }
}
