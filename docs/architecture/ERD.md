┌─────────────────┐
│    SUPPLIERS    │
├─────────────────┤
│ id          PK  │
│ name            │
│ phone           │
└────────┬────────┘
         │
         │ 1
         │
         │
         │ many
         ▼
┌─────────────────┐
│    PURCHASES    │
├─────────────────┤
│ id          PK  │
│ supplier_id FK  │
│ date            │
│ total           │
└────────┬────────┘
         │
         │ 1
         │
         │ many
         ▼
┌──────────────────┐
│ PURCHASE_ITEMS   │
├──────────────────┤
│ id           PK  │
│ purchase_id  FK  │
│ product_id   FK  │
│ quantity         │
│ unit_price       │
└────────┬─────────┘
         │
         │ many
         │
         │ 1
         ▼
┌─────────────────┐
│    PRODUCTS     │
├─────────────────┤
│ id          PK  │
│ name            │
│ sku             │
└─────────────────┘