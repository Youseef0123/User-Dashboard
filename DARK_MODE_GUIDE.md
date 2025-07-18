# Dark Mode Implementation Guide

## ما تم تنفيذه:

### 1. ThemeService
- خدمة مركزية لإدارة الثيم
- حفظ التفضيل في localStorage
- BehaviorSubject للتحديث المباشر
- دوال: `toggleTheme()`, `setTheme()`, `isDark`, `theme$`

### 2. CSS Variables System
- متغيرات مركزية في `_theme.scss`
- دعم light/dark themes
- استخدام `--theme-*` variables
- كلاسات `.light-theme` و `.dark-theme`

### 3. Components Integration
- **NavbarComponent**: يستخدم ThemeService
- **HomeComponent**: يستخدم theme classes
- **ThemeToggleComponent**: زر التبديل بين الثيمات

### 4. Theme Application
- الثيم يُطبق على `document.documentElement`
- كلاسات: `.light-theme` أو `.dark-theme`
- Home component يستخدم `[ngClass]="theme"`

## كيفية الاستخدام:

### 1. تشغيل الثيم:
```typescript
// في أي component
constructor(private themeService: ThemeService) {}

// تغيير الثيم
this.themeService.setTheme('dark');
this.themeService.toggleTheme();

// مراقبة التغيير
this.themeService.theme$.subscribe(theme => {
  console.log('Current theme:', theme);
});
```

### 2. في HTML:
```html
<!-- تطبيق الثيم على container -->
<div class="container" [ngClass]="theme">
  <!-- المحتوى -->
</div>

<!-- أو استخدام theme-toggle -->
<app-theme-toggle></app-theme-toggle>
```

### 3. في SCSS:
```scss
// استخدام متغيرات الثيم
.my-component {
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border-color);
}

// أو استخدام mixins
.my-card {
  @include theme-card('medium');
}
```

## المتغيرات المتاحة:

### الألوان الأساسية:
- `--theme-bg-primary`
- `--theme-bg-secondary`
- `--theme-text-primary`
- `--theme-text-secondary`
- `--theme-border-color`
- `--theme-accent-primary`

### ألوان الحالة:
- `--theme-success`
- `--theme-error`
- `--theme-warning`
- `--theme-info`

### الظلال:
- `--theme-shadow-sm`
- `--theme-shadow`
- `--theme-shadow-lg`

## الاختبار:

1. شغل التطبيق
2. اضغط على زر التبديل في النافبار
3. تأكد من تغيير الألوان
4. افتح الصفحة في tab جديد - يجب أن يحتفظ بالثيم
5. تحقق من localStorage أن المفتاح `theme` يحفظ القيمة

## الملفات المهمة:

- `src/app/services/theme.service.ts` - الخدمة الرئيسية
- `src/app/shared/styles/_theme.scss` - متغيرات الثيم
- `src/app/components/theme-toggle/theme-toggle.component.ts` - زر التبديل
- `src/app/components/home/home.component.html` - مثال على التطبيق

الآن يمكنك تشغيل التطبيق واختبار Dark Mode!
