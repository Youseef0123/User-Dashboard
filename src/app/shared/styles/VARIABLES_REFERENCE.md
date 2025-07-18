# SASS Variables Reference

## مرجع سريع للمتغيرات المتاحة في المشروع

### الألوان (Colors)
```scss
$Main_Color_White: #faf7fa;
$Secound_Color_Red: #EB737A;
$Secound_Red: #F2E8E8;
$Text_Color: #944F54;
$Black_Color: #1C0D0F;
```

### الخطوط (Typography)
```scss
$font-family-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
$font-size-base: 16px;
$font-size-sm: 14px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;
$line-height-base: 1.5;
```

### المسافات (Spacing)
```scss
$spacer: 1rem;
$spacers: (
  0: 0,
  1: 0.25rem,    // 4px
  2: 0.5rem,     // 8px
  3: 1rem,       // 16px
  4: 1.5rem,     // 24px
  5: 3rem        // 48px
);
```

### نقاط التوقف (Breakpoints)
```scss
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### الحدود والأطراف (Border Radius)
```scss
$border-width: 1px;
$border-radius: 0.375rem;      // 6px
$border-radius-sm: 0.25rem;    // 4px
$border-radius-lg: 0.5rem;     // 8px
$border-radius-xl: 1rem;       // 16px
$border-radius-xxl: 1.5rem;    // 24px
```

### الظلال (Shadows)
```scss
$box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
$box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
$box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
$box-shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.1);
```

### التحولات (Transitions)
```scss
$transition-base: all 0.2s ease-in-out;
$transition-fade: opacity 0.15s linear;
$transition-transform: transform 0.2s ease-in-out;
```

## كيفية الاستخدام

### في أي component SCSS:
```scss
@import '../../../shared/styles/index';

.my-component {
  background-color: $Main_Color_White;
  color: $Text_Color;
  padding: map-get($spacers, 3);
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow;
  transition: $transition-base;
}
```

### استخدام المسافات:
```scss
.element {
  margin-top: map-get($spacers, 2);    // 8px
  padding: map-get($spacers, 4);       // 24px
}
```

### استخدام نقاط التوقف:
```scss
.responsive-element {
  @include media-up(md) {
    // يطبق على الشاشات أكبر من 768px
  }
  
  @include media-down(sm) {
    // يطبق على الشاشات أصغر من 576px
  }
}
```

## ⚠️ نصائح مهمة:

1. **دائماً تأكد من استيراد الملف**: `@import '../../../shared/styles/index';`
2. **تحقق من وجود المتغير**: قبل استخدام متغير جديد، تأكد من وجوده في `_variables.scss`
3. **استخدم map-get للمسافات**: `map-get($spacers, 3)` بدلاً من `$spacer * 3`
4. **اتبع نفس نمط التسمية**: استخدم نفس تسمية المتغيرات الموجودة

## 🚨 أخطاء شائعة:
- `Undefined variable` → تأكد من وجود المتغير في `_variables.scss`
- `map-get` errors → تأكد من استخدام الـ map الصحيح
- Import errors → تحقق من مسار الـ import
