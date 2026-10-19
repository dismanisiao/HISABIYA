
---

## Part 1: Data Model Mapping

For the transaction *"Sold 2 cartons of Coke to Ram Stores for Rs 3,000 cash"*, the core entities and relationships are structured as follows:

* **Customer:** Represents the buyer (`Ram Stores`). Contains details like name, contact info, billing address, and current balance.
* **Product:** Represents the item being sold (`Coke`, typically tracked per unit/carton). Contains SKU, category, and default pricing.
* **Sale (Invoice/Order):** The high-level transaction record linking the customer, date, total amount (`Rs 3,000`), and payment status (`Paid`).
* **SaleItem:** Line-item detail associated with the Sale. Records that 2 cartons of Coke were sold at a specific unit price.
* **InventoryMovement:** Tracks the physical stock change—specifically, a stock outflow of 2 cartons reducing the Coke inventory level.
* **JournalEntry:** The double-entry bookkeeping record for the financial transaction.
* **JournalLine:** The individual debit and credit lines belonging to the Journal Entry (e.g., debiting Cash, crediting Sales Revenue).
* **Account:** The Chart of Accounts categories affected (e.g., *Cash-in-Hand* asset account, *Sales Revenue* income account).

---

## Part 2: New Sale Screen Sketch

### **Screen Layout & UI Components**

```text
+-------------------------------------------------------------------+
|  New Sale                                                         |
+-------------------------------------------------------------------+
|  Customer: [ Ram Stores                v ]  [ + New Customer ]    |
|  Date:     [ 2026-10-19 10:03 AM       ]    Payment: [ Cash v ]   |
+-------------------------------------------------------------------+
|  ITEMS                                                            |
|  +-------------------------------------------------------------+  |
|  | Product      | Qty | Unit   | Price    | Disc. | Total    |    |
|  +--------------+-----+--------+----------+-------+----------+    |
|  | 1. Coke      | [2] | Carton | [1500.00]| [0.00]| 3,000.00 |    |
|  +--------------+-----+--------+----------+-------+----------+    |
|  | + Add Product                                                  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
|  SUMMARY                                                          |
|  Subtotal:                                            Rs 3,000.00 |
|  Discount:                                            Rs    0.00  |
|  -------------------------------------------------------------    |
|  TOTAL DUE:                                           Rs 3,000.00 |
+-------------------------------------------------------------------+
|                          [ Cancel ]      [ Complete Sale ]        |
+-------------------------------------------------------------------+

```

### **Field Breakdown**

* **Customer:** Dropdown selector to choose an existing customer (`Ram Stores`) or quick-add a new one.
* **Products Table:**
* **Product:** Search/select field for inventory items (`Coke`).
* **Quantity:** Numeric stepper/input (`2`).
* **Unit:** Dropdown or fixed unit type (`Carton`).
* **Price:** Unit selling price (`Rs 1,500.00` per carton).
* **Discount:** Optional item-level or bill-level discount (`Rs 0.00`).
* **Total:** Computed automatically (`Qty x Price - Discount`).


* **Payment Method:** Selects how the customer is paying (`Cash`, `Bank Transfer`, `Credit`). Here, set to **Cash**.
* **Action Buttons:** Cancel or **[Complete Sale]**.

---

## Part 3: Behind the UI — What Happens After Pressing [Complete Sale]

When the user clicks **[Complete Sale]**, the frontend triggers an API request that executes a transaction safely within the backend (typically wrapped in a database transaction to ensure atomicity).

Here is the sequence of events behind the scenes:

### 1. Validation & Payload Generation

* The system validates that required fields are present (Customer selected, at least one product with valid quantity, stock is available).
* A payload is sent to the server containing the sale details, items, payment method, and total amount.

### 2. Database Operations (Atomic Transaction)

* **Create Sale & SaleItem Records:**
* Inserts a new record into the `Sale` table (Customer: Ram Stores, Total: Rs 3,000, Status: Completed, Payment: Cash).
* Inserts a record into the `SaleItem` table linked to the Sale ID (Product: Coke, Quantity: 2 cartons, Unit Price: Rs 1,500).


* **Update Inventory (`InventoryMovement`):**
* Reduces the stock level of Coke in the inventory by 2 cartons.
* Creates an `InventoryMovement` log entry marking a *Stock Out* due to a sale.


* **Generate Accounting Entries (`JournalEntry` & `JournalLine`):**
* Creates a `JournalEntry` for the financial transaction.
* Creates two `JournalLine` entries linked to the Chart of Accounts:
1. **Debit:** Cash Account (Asset increases by Rs 3,000)
2. **Credit:** Sales Revenue Account (Income increases by Rs 3,000)





### 3. Post-Processing & UI Response

* **Receipt Generation:** Formats data to optionally trigger a cash receipt or invoice printout.
* **UI Feedback:** Clears the form or redirects the user to the sales history / receipt view with a success notification (*"Sale completed successfully!"*).