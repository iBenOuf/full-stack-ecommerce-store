import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { ToastService } from '../../core/services/toast.service';
import {
  IReportResponse,
  ITopProduct,
  ICategoryStat,
  ISalesTrend,
} from '../../core/models/report.model';

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './sales-reports.html',
  styleUrl: './sales-reports.css',
})
export class SalesReports implements OnInit {
  constructor(
    private _reportService: ReportService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  reportData: IReportResponse['data'] | null = null;
  isLoading = true;

  rangePreset = 'custom';
  startDate = '';
  endDate = '';

  ngOnInit() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    this.startDate = this.toDateString(start);
    this.endDate = this.toDateString(end);
    this.loadReport();
  }

  onPresetChange() {
    const today = new Date();
    const start = new Date();

    switch (this.rangePreset) {
      case '7':
        start.setDate(today.getDate() - 7);
        break;
      case '30':
        start.setDate(today.getDate() - 30);
        break;
      case '90':
        start.setDate(today.getDate() - 90);
        break;
      case '365':
        start.setDate(today.getDate() - 365);
        break;
      default:
        return;
    }

    this.startDate = this.toDateString(start);
    this.endDate = this.toDateString(today);
    this.loadReport();
  }

  loadReport() {
    if (!this.startDate || !this.endDate) return;

    this.isLoading = true;
    this._reportService.getDashboardReport(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.reportData = res.data;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this._toastService.error('Failed to load sales report');
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  /** Average order value */
  getAOV(): number {
    if (!this.reportData || this.reportData.summary.totalOrders === 0) return 0;
    return this.reportData.summary.totalSales / this.reportData.summary.totalOrders;
  }

  /** Average items per order */
  getAvgItems(): number {
    if (!this.reportData || this.reportData.summary.totalOrders === 0) return 0;
    return this.reportData.summary.totalItemsSold / this.reportData.summary.totalOrders;
  }

  /** Bar height percentage for trend chart */
  getTrendBarHeight(dailySales: number): number {
    if (!this.reportData?.salesTrends?.length) return 0;
    const max = Math.max(...this.reportData.salesTrends.map((t) => t.dailySales));
    return max > 0 ? Math.min((dailySales / max) * 100, 100) : 0;
  }

  /** Total revenue across all categories */
  getCategoryTotalRevenue(): number {
    if (!this.reportData?.categoryDistribution?.length) return 0;
    return this.reportData.categoryDistribution.reduce((sum, c) => sum + c.revenue, 0);
  }

  /** Revenue share percentage for a category */
  getCategoryShare(cat: ICategoryStat): number {
    const total = this.getCategoryTotalRevenue();
    return total > 0 ? (cat.revenue / total) * 100 : 0;
  }

  private toDateString(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
