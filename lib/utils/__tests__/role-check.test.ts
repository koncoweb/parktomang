import {
  hasPermission,
  canAccessAllData,
  isOwner,
  isAdmin,
  isSales,
} from '../role-check';

describe('role-check', () => {
  describe('hasPermission', () => {
    it('harus mengembalikan false jika userRole null', () => {
      expect(hasPermission(null, 'sales')).toBe(false);
    });

    it('harus mengembalikan false jika userRole undefined', () => {
      expect(hasPermission(undefined, 'sales')).toBe(false);
    });

    it('harus mengembalikan true jika owner meminta akses sales', () => {
      expect(hasPermission('owner', 'sales')).toBe(true);
    });

    it('harus mengembalikan true jika owner meminta akses admin', () => {
      expect(hasPermission('owner', 'admin')).toBe(true);
    });

    it('harus mengembalikan true jika owner meminta akses owner', () => {
      expect(hasPermission('owner', 'owner')).toBe(true);
    });

    it('harus mengembalikan true jika admin meminta akses sales', () => {
      expect(hasPermission('admin', 'sales')).toBe(true);
    });

    it('harus mengembalikan true jika admin meminta akses admin', () => {
      expect(hasPermission('admin', 'admin')).toBe(true);
    });

    it('harus mengembalikan false jika admin meminta akses owner', () => {
      expect(hasPermission('admin', 'owner')).toBe(false);
    });

    it('harus mengembalikan true jika sales meminta akses sales', () => {
      expect(hasPermission('sales', 'sales')).toBe(true);
    });

    it('harus mengembalikan false jika sales meminta akses admin', () => {
      expect(hasPermission('sales', 'admin')).toBe(false);
    });

    it('harus mengembalikan false jika sales meminta akses owner', () => {
      expect(hasPermission('sales', 'owner')).toBe(false);
    });
  });

  describe('canAccessAllData', () => {
    it('harus mengembalikan true untuk owner', () => {
      expect(canAccessAllData('owner')).toBe(true);
    });

    it('harus mengembalikan true untuk admin', () => {
      expect(canAccessAllData('admin')).toBe(true);
    });

    it('harus mengembalikan false untuk sales', () => {
      expect(canAccessAllData('sales')).toBe(false);
    });

    it('harus mengembalikan false untuk null', () => {
      expect(canAccessAllData(null)).toBe(false);
    });

    it('harus mengembalikan false untuk undefined', () => {
      expect(canAccessAllData(undefined)).toBe(false);
    });
  });

  describe('isOwner', () => {
    it('harus mengembalikan true untuk owner', () => {
      expect(isOwner('owner')).toBe(true);
    });

    it('harus mengembalikan false untuk admin', () => {
      expect(isOwner('admin')).toBe(false);
    });

    it('harus mengembalikan false untuk sales', () => {
      expect(isOwner('sales')).toBe(false);
    });

    it('harus mengembalikan false untuk null', () => {
      expect(isOwner(null)).toBe(false);
    });

    it('harus mengembalikan false untuk undefined', () => {
      expect(isOwner(undefined)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('harus mengembalikan true untuk admin', () => {
      expect(isAdmin('admin')).toBe(true);
    });

    it('harus mengembalikan false untuk owner', () => {
      expect(isAdmin('owner')).toBe(false);
    });

    it('harus mengembalikan false untuk sales', () => {
      expect(isAdmin('sales')).toBe(false);
    });

    it('harus mengembalikan false untuk null', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('harus mengembalikan false untuk undefined', () => {
      expect(isAdmin(undefined)).toBe(false);
    });
  });

  describe('isSales', () => {
    it('harus mengembalikan true untuk sales', () => {
      expect(isSales('sales')).toBe(true);
    });

    it('harus mengembalikan false untuk owner', () => {
      expect(isSales('owner')).toBe(false);
    });

    it('harus mengembalikan false untuk admin', () => {
      expect(isSales('admin')).toBe(false);
    });

    it('harus mengembalikan false untuk null', () => {
      expect(isSales(null)).toBe(false);
    });

    it('harus mengembalikan false untuk undefined', () => {
      expect(isSales(undefined)).toBe(false);
    });
  });
});

