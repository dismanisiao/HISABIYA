| Entity | What does it represent? | What information should it store? | What other entities does it reference? |
|---|---|---|---|
| **Supplier** | A person/company the business buys products from. | `id`, `name`, `phone`, `email`, `address`, `taxNumber`, `notes` | Purchases reference a Supplier |
| **Product** | An item the business buys, stores, and/or sells. | `id`, `name`, `sku`, `description`, `unit`, `costPrice`, `sellingPrice`, `reorderLevel`, `isActive` | Referenced by PurchaseItem and InventoryMovement |
| **Purchase** | One purchase transaction/invoice from a supplier. | `id`, `invoiceNumber`, `purchaseDate`, `dueDate`, `status`, `subtotal`, `discount`, `tax`, `totalAmount`, `notes` | `supplierId` → Supplier; has many PurchaseItems; eventually associated with accounting records |
| **PurchaseItem** | One line/item inside a Purchase. Example: “12 eggs @ Rs. 15”. | `id`, `quantity`, `unitPrice`, `discount`, `tax`, `lineTotal` | `purchaseId` → Purchase; `productId` → Product |
| **InventoryMovement** | A record explaining why stock increased or decreased. It forms the inventory audit trail. | `id`, `movementType` (`PURCHASE`, `SALE`, `ADJUSTMENT`, etc.), `quantity`, `movementDate`, `referenceType`, `referenceId`, `notes` | `productId` → Product; may reference the transaction that caused it, such as Purchase/PurchaseItem |
| **JournalEntry** | One complete accounting event recorded using double-entry bookkeeping. | `id`, `entryNumber`, `date`, `description`, `referenceType`, `referenceId`, `status` (`DRAFT`, `POSTED`, etc.) | Has many JournalLines; may be linked to a Purchase, Sale, Payment, etc. |
| **JournalLine** | One debit or credit line within a JournalEntry. | `id`, `debitAmount`, `creditAmount`, `description` | `journalEntryId` → JournalEntry; `accountId` → Account |
| **Account** | One account in the Chart of Accounts, such as Cash, Inventory, Accounts Payable, Sales Revenue, etc. | `id`, `code`, `name`, `type` (`ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE`), `description`, `isActive` | Referenced by JournalLine; optionally references another Account for parent/child hierarchy |

---

## Part 1: Entity Breakdown

### 1. Supplier

* **What it represents:** The vendor, manufacturer, or wholesale company from whom goods or services are purchased.
* **What information it should store:** Supplier ID, Company Name, Contact Person, Phone Number, Email, Billing/Shipping Address, Tax Identification Number, Payment Terms, and Current Balance (Accounts Payable).
* **What other entities it references:** None (it is a primary reference entity).

### 2. Product

* **What it represents:** An individual item or stock keeping unit (SKU) available for purchase and inventory tracking.
* **What information it should store:** Product ID, SKU/Barcode, Name, Description, Category, Unit of Measurement (e.g., carton, piece, kg), Default Cost Price, Selling Price, and Current Stock Level.
* **What other entities it references:** None (though it links to category or asset accounts in advanced setups).

### 3. Purchase (Purchase Order / Bill)

* **What it represents:** The high-level procurement transaction recording an order or receipt of goods from a supplier.
* **What information it should store:** Purchase ID, Purchase/Invoice Number, Purchase Date, Status (Draft, Received, Billed, Paid), Total Amount, Payment Method, and Due Date.
* **What other entities it references:** **Supplier**

### 4. PurchaseItem

* **What it represents:** An individual line item within a purchase transaction, detailing a specific product, quantity, and cost.
* **What information it should store:** PurchaseItemID, Purchase ID, Product ID, Quantity, Unit, Unit Cost, Tax/Discount, and Line Total.
* **What other entities it references:** **Purchase**, **Product**

### 5. InventoryMovement

* **What it represents:** The audit trail and tracking of physical stock changes (inflows/outflows) affecting warehouse inventory levels.
* **What information it should store:** Movement ID, Date, Movement Type (e.g., *Stock In - Purchase*), Quantity changed, Unit Cost, Reference Type (e.g., Purchase), and Reference ID.
* **What other entities it references:** **Product**, **Purchase** (via reference link)

### 6. JournalEntry

* **What it represents:** The high-level double-entry bookkeeping header that captures the financial impact of the purchase.
* **What information it should store:** JournalEntryID, Date, Narration/Description, Source Reference (e.g., Purchase ID), and Status (Draft, Posted).
* **What other entities it references:** **Purchase** (optional direct link)

### 7. JournalLine

* **What it represents:** An individual debit or credit line belonging to a journal entry, linking the transaction to specific financial accounts.
* **What information it should store:** JournalLineID, JournalEntryID, AccountID, Debit Amount, Credit Amount, and Line Description.
* **What other entities it references:** **JournalEntry**, **Account**

### 8. Account

* **What it represents:** An entry in the Chart of Accounts used to classify financial transactions (e.g., Inventory Asset, Accounts Payable, Cash).
* **What information it should store:** Account ID, Account Code/Number, Account Name, Account Type (Asset, Liability, Equity, Income, Expense), and Current Balance.
* **What other entities it references:** None (root financial entity).

---

## Part 2: Entity Relationships Diagram

The structural relationships between these entities can be visualized as follows:

```text
  [ Supplier ] 
       | 
       | (1 : N)
       v
  [ Purchase ] <----------------------------------+
       |                                          |
       | (1 : N)                                  | (Reference)
       v                                          |
  [ PurchaseItem ] --(N : 1)-- [ Product ]        |
       |                          |               |
       | (Triggers)               | (1 : N)       |
       v                          v               v
  [ InventoryMovement ]     [ JournalEntry ] --(1 : N)-- [ JournalLine ]
                                                          |
                                                          | (N : 1)
                                                          v
                                                      [ Account ]

```

### Relationship Summary:

* **Supplier to Purchase:** One-to-Many (One supplier can have multiple purchases over time).
* **Purchase to PurchaseItem:** One-to-Many (One purchase invoice contains multiple line items).
* **Product to PurchaseItem:** One-to-Many (A product can appear across multiple purchase items).
* **Product to InventoryMovement:** One-to-Many (A product experiences multiple stock inflows/outflows).
* **Purchase to InventoryMovement:** One-to-Many (A purchase generates stock inflows for the items bought).
* **JournalEntry to JournalLine:** One-to-Many (One journal entry consists of at least two balancing lines—e.g., debit inventory, credit accounts payable).
* **Account to JournalLine:** One-to-Many (An account is referenced across many journal lines).