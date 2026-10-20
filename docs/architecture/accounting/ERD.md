    OWNER {
        int owner_id PK
        string name
    }
    CAPITAL_CONTRIBUTION {
        int contribution_id PK
        int owner_id FK
        decimal amount
        date contribution_date
        string method
    }
    SUPPLIER {
        int supplier_id PK
        string name
        string phone
    }
    CUSTOMER {
        int customer_id PK
        string name
        string phone
    }
    PRODUCT {
        int product_id PK
        string name
        string sku
        decimal purchase_cost
        decimal selling_price
        boolean active
    }
    UNIT {
        int unit_id PK
        string unit_name
    }
    PRODUCT_UNIT {
        int product_unit_id PK
        int product_id FK
        int unit_id FK
        decimal base_unit_factor
    }
    PURCHASE {
        int purchase_id PK
        int supplier_id FK
        date purchase_date
        decimal total_amount
        string status
    }
    PURCHASE_ITEM {
        int purchase_item_id PK
        int purchase_id FK
        int product_id FK
        int unit_id FK
        decimal quantity
        decimal unit_cost
        decimal line_total
    }
    SUPPLIER_PAYMENT {
        int supplier_payment_id PK
        int purchase_id FK
        decimal amount
        date payment_date
        string method
    }
    SALE {
        int sale_id PK
        int customer_id FK
        date sale_date
        decimal total_amount
        string status
    }
    SALE_ITEM {
        int sale_item_id PK
        int sale_id FK
        int product_id FK
        int unit_id FK
        decimal quantity
        decimal unit_price
        decimal line_total
    }
    CUSTOMER_PAYMENT {
        int customer_payment_id PK
        int sale_id FK
        decimal amount
        date payment_date
        string method
    }
    PURCHASE_RETURN {
        int purchase_return_id PK
        int purchase_id FK
        date return_date
        string reason
    }
    PURCHASE_RETURN_ITEM {
        int purchase_return_item_id PK
        int purchase_return_id FK
        int product_id FK
        int unit_id FK
        decimal quantity
        decimal unit_cost
    }
    SALES_RETURN {
        int sales_return_id PK
        int sale_id FK
        date return_date
        string reason
    }
    SALES_RETURN_ITEM {
        int sales_return_item_id PK
        int sales_return_id FK
        int product_id FK
        int unit_id FK
        decimal quantity
        decimal unit_price
    }
    STOCK_MOVEMENT {
        int movement_id PK
        int product_id FK
        int unit_id FK
        date movement_date
        string movement_type
        decimal quantity
        string reference_type
        int reference_id
    }
    STOCK_ADJUSTMENT {
        int adjustment_id PK
        int product_id FK
        int unit_id FK
        date adjustment_date
        decimal quantity
        string reason
    }