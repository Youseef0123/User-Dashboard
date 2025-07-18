# تعليمات استخدام ng-select للـ Country Field

## التثبيت

أولاً، قم بتثبيت ng-select:

```bash
npm install @ng-select/ng-select
```

## التعديل على الكومبوننت

### 1. إضافة الـ import في component.ts:

```typescript
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
```

### 2. تحديث HTML للـ country field:

استبدل الـ select العادي بـ:

```html
<div class="form-group country-group">
  <label for="country" class="form-label">الدولة *</label>
  <ng-select 
    formControlName="country"
    [items]="countries"
    bindLabel="name"
    bindValue="id"
    placeholder="اختر الدولة"
    [clearable]="false"
    [searchable]="true"
    [class.is-invalid]="isFieldInvalid('country')"
    class="custom-ng-select">
    
    <ng-option *ngFor="let country of countries" [value]="country.id">
      <span class="country-option">
        <span class="flag">{{ country.flag }}</span>
        <span class="name">{{ country.name }}</span>
        <span class="code">({{ country.code }})</span>
      </span>
    </ng-option>
  </ng-select>
  
  <div class="invalid-feedback" *ngIf="isFieldInvalid('country')">
    {{ getErrorMessage('country') }}
  </div>
</div>
```

## إضافة Styles للـ ng-select

أضف هذه الـ styles في ملف SCSS:

```scss
// ng-select custom styles
.custom-ng-select {
  .ng-select.ng-select-single .ng-select-container {
    height: 48px;
    border: 2px solid lighten($Text_Color, 50%);
    border-radius: $border-radius;
    
    &:hover {
      border-color: lighten($Text_Color, 30%);
    }
    
    &.ng-select-focused {
      border-color: $Secound_Color_Red;
      box-shadow: 0 0 0 3px rgba(235, 115, 122, 0.1);
    }
  }
  
  .ng-select.ng-select-single .ng-select-container .ng-value-container {
    padding-left: 16px;
    padding-right: 16px;
    
    .ng-placeholder {
      color: lighten($Text_Color, 40%);
      font-size: $font-size-sm;
    }
    
    .ng-value {
      color: $Text_Color;
      font-size: $font-size-base;
    }
  }
  
  .ng-select .ng-arrow-wrapper {
    .ng-arrow {
      border-color: lighten($Text_Color, 30%) transparent transparent;
    }
  }
  
  &.is-invalid {
    .ng-select.ng-select-single .ng-select-container {
      border-color: #dc3545;
      
      &.ng-select-focused {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
      }
    }
  }
}

// Country option styling
.country-option {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .flag {
    font-size: 16px;
  }
  
  .name {
    flex-grow: 1;
    color: $Text_Color;
  }
  
  .code {
    color: lighten($Text_Color, 20%);
    font-size: $font-size-sm;
  }
}

// Dropdown panel styling
.ng-dropdown-panel {
  background: $Main_Color_White;
  border: 1px solid lighten($Text_Color, 50%);
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  
  .ng-option {
    padding: 8px 16px;
    
    &.ng-option-highlighted {
      background-color: $Secound_Red;
      color: $Text_Color;
    }
    
    &.ng-option-selected {
      background-color: $Secound_Color_Red;
      color: white;
    }
  }
}
```

## الميزات المتاحة مع ng-select

1. **البحث**: المستخدم يمكنه البحث في الدول
2. **Custom Templates**: يمكن تخصيص شكل كل option
3. **Virtual Scrolling**: للقوائم الطويلة
4. **Multi-select**: إذا كنت تحتاج لاختيار عدة دول
5. **Loading State**: أثناء تحميل البيانات من API

## مثال متقدم مع تحميل البيانات من API

```typescript
// في component.ts
countries$ = this.countriesService.getCountries();
isLoadingCountries = false;

loadCountries() {
  this.isLoadingCountries = true;
  this.countriesService.getCountries().subscribe({
    next: (countries) => {
      this.countries = countries;
      this.isLoadingCountries = false;
    },
    error: () => {
      this.isLoadingCountries = false;
    }
  });
}
```

```html
<!-- في HTML -->
<ng-select 
  formControlName="country"
  [items]="countries"
  [loading]="isLoadingCountries"
  loadingText="جاري التحميل..."
  notFoundText="لم يتم العثور على دول">
</ng-select>
```

هذا سيعطيك control كامل على الـ country selector مع تجربة مستخدم ممتازة!
