import {
  formatDate,
  formatDateTime,
  formatMonthYear,
  getMonthName,
  getCurrentMonthYear,
  formatCurrency,
} from '../date-utils';

describe('date-utils', () => {
  describe('formatDate', () => {
    it('harus memformat Date object dengan benar', () => {
      const date = new Date(2024, 0, 15); // 15 Januari 2024
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('Januari');
      expect(result).toContain('15');
    });

    it('harus memformat string date dengan benar', () => {
      const dateString = '2024-03-20';
      const result = formatDate(dateString);
      expect(result).toContain('2024');
      expect(result).toContain('Maret');
      expect(result).toContain('20');
    });

    it('harus menggunakan locale Indonesia', () => {
      const date = new Date(2024, 11, 25); // 25 Desember 2024
      const result = formatDate(date);
      expect(result).toContain('Desember');
    });
  });

  describe('formatDateTime', () => {
    it('harus memformat Date object dengan waktu', () => {
      const date = new Date(2024, 0, 15, 14, 30); // 15 Januari 2024, 14:30
      const result = formatDateTime(date);
      expect(result).toContain('2024');
      expect(result).toContain('Januari');
      expect(result).toContain('15');
      expect(result).toContain('14');
      expect(result).toContain('30');
    });

    it('harus memformat string date dengan waktu', () => {
      const dateString = '2024-03-20T10:15:00';
      const result = formatDateTime(dateString);
      expect(result).toContain('2024');
      expect(result).toContain('Maret');
      expect(result).toContain('20');
    });
  });

  describe('formatMonthYear', () => {
    it('harus memformat bulan dan tahun dengan benar', () => {
      const result = formatMonthYear(1, 2024);
      expect(result).toContain('Januari');
      expect(result).toContain('2024');
    });

    it('harus memformat bulan Desember dengan benar', () => {
      const result = formatMonthYear(12, 2024);
      expect(result).toContain('Desember');
      expect(result).toContain('2024');
    });

    it('harus memformat bulan tengah tahun dengan benar', () => {
      const result = formatMonthYear(6, 2024);
      expect(result).toContain('Juni');
      expect(result).toContain('2024');
    });
  });

  describe('getMonthName', () => {
    it('harus mengembalikan nama bulan Januari untuk bulan 1', () => {
      const result = getMonthName(1);
      expect(result).toBe('Januari');
    });

    it('harus mengembalikan nama bulan Desember untuk bulan 12', () => {
      const result = getMonthName(12);
      expect(result).toBe('Desember');
    });

    it('harus mengembalikan nama bulan yang benar untuk semua bulan', () => {
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      
      months.forEach((monthName, index) => {
        expect(getMonthName(index + 1)).toBe(monthName);
      });
    });
  });

  describe('getCurrentMonthYear', () => {
    it('harus mengembalikan bulan dan tahun saat ini', () => {
      const now = new Date();
      const result = getCurrentMonthYear();
      
      expect(result.month).toBe(now.getMonth() + 1);
      expect(result.year).toBe(now.getFullYear());
    });

    it('harus mengembalikan object dengan property month dan year', () => {
      const result = getCurrentMonthYear();
      
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('year');
      expect(typeof result.month).toBe('number');
      expect(typeof result.year).toBe('number');
    });
  });

  describe('formatCurrency', () => {
    it('harus memformat angka dengan format Rupiah', () => {
      const result = formatCurrency(1000000);
      expect(result).toContain('Rp');
      expect(result).toContain('1.000.000');
    });

    it('harus memformat angka kecil dengan benar', () => {
      const result = formatCurrency(50000);
      expect(result).toContain('Rp');
      expect(result).toContain('50.000');
    });

    it('harus memformat angka besar dengan benar', () => {
      const result = formatCurrency(1000000000);
      expect(result).toContain('Rp');
      expect(result).toContain('1.000.000.000');
    });

    it('harus memformat angka dengan desimal menjadi tanpa desimal', () => {
      const result = formatCurrency(100000.5);
      expect(result).toContain('Rp');
      expect(result).toContain('100.000');
    });

    it('harus memformat angka 0 dengan benar', () => {
      const result = formatCurrency(0);
      expect(result).toContain('Rp');
      expect(result).toContain('0');
    });
  });
});

