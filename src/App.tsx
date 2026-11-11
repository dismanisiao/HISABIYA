
import { useMemo, useState } from "react";
import "./App.css";

type Page =
  | "Home"
  | "Transactions"
  | "Accounts"
  | "Inventory"
  | "Contacts"
  | "Reports"
  | "NFRS"
  | "Settings";

const navigation = [
  { name: "Transactions", icon: "transactions" },
  { name: "Accounts", icon: "accounts" },
  { name: "Inventory", icon: "inventory" },
  { name: "Contacts", icon: "contacts" },
  { name: "Reports", icon: "reports" },
  { name: "NFRS", icon: "nfrs" },
] as const;

const commands = [
  { title: "Create sales invoice", detail: "Start a customer invoice", category: "Sales", page: "Transactions" },
  { title: "View sales transactions", detail: "Browse your transactions", category: "Sales", page: "Transactions" },
  { title: "Check unpaid invoices", detail: "Review outstanding invoices", category: "Sales", page: "Transactions" },
  { title: "Record purchase from supplier", detail: "Create a purchase bill", category: "Purchases", page: "Transactions" },
  { title: "Show chart of accounts", detail: "View ledger accounts", category: "Accounts", page: "Accounts" },
  { title: "Create journal entry", detail: "Record a debit and credit", category: "Accounts", page: "Transactions" },
  { title: "Check inventory stock", detail: "View available products", category: "Inventory", page: "Inventory" },
  { title: "Add new product", detail: "Create an inventory item", category: "Inventory", page: "Inventory" },
  { title: "Show trial balance", detail: "Open financial reports", category: "Reports", page: "Reports" },
  { title: "Show income statement", detail: "View profit and loss", category: "Reports", page: "Reports" },
  { title: "Show balance sheet", detail: "View financial position", category: "Reports", page: "Reports" },
  { title: "Show NFRS statements", detail: "Open Nepal reporting views", category: "NFRS", page: "NFRS" },
  { title: "View customers and suppliers", detail: "Open contact directory", category: "Contacts", page: "Contacts" },
];

function NavigationIcon({ name }: { name: (typeof navigation)[number]["icon"] }) {
  const paths = {
    transactions: "M4 5h16M4 10h16M4 15h10M4 20h7",
    accounts: "M4 5h16v14H4zM8 9h8M8 13h5",
    inventory: "m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10",
    contacts: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
    reports: "M5 19V9M12 19V5M19 19v-7",
    nfrs: "M6 3h9l3 3v15H6zM9 11h6M9 15h6M9 7h3",
  } as const;

  return (
    <svg
      aria-hidden="true"
      className="shortcut-icon-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function App() {
  const [page, setPage] = useState<Page>("Home");
  const [prompt, setPrompt] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [promptResult, setPromptResult] = useState("");
  const [businessName, setBusinessName] = useState("Kathmandu Mini Mart");

  const matches = useMemo(() => {
    const query = prompt.trim().toLowerCase();
    if (!query) return [];
    const words = query.split(/\s+/).filter(Boolean);
    return commands
      .map((item) => {
        const haystack = `${item.title} ${item.detail} ${item.category}`.toLowerCase();
        return {
          ...item,
          score: words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [prompt]);

  function navigate(next: Page) {
    setPage(next);
    setSuggestionsOpen(false);
    setPromptResult("");
  }

  function executeCommand(command: (typeof commands)[number]) {
    navigate(command.page as Page);

    setPrompt("");
    setSuggestionsOpen(false);
  }

  function submitPrompt() {
    if (!prompt.trim()) return;
    const exact = commands.find(
      (item) => item.title.toLowerCase() === prompt.trim().toLowerCase()
    );
    if (exact) {
      executeCommand(exact);
      return;
    }
    setSuggestionsOpen(false);
    setPromptResult("Choose a suggested action to open a workspace area.");
  }

  function renderHome() {
    return (
      <div className="workspace-home">
        <header className="workspace-top">
          <div>
            <div className="eyebrow">YOUR WORKSPACE</div>
            <h1>Good evening, welcome to Hisabiya.</h1>
            <p>Your business, organized in one place.</p>
          </div>
        </header>

        <div className="shortcut-row">
          {navigation.map((item) => (
            <button
              className="shortcut"
              key={item.name}
              onClick={() => navigate(item.name)}
            >
              <span className="shortcut-icon">
                <NavigationIcon name={item.icon} />
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <section className="composer-section">
          <div className="composer-label">✧ Ask Hisabiya</div>
          <div className="chat-composer">
            <textarea
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                setSuggestionsOpen(true);
                setPromptResult("");
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSuggestionsOpen(false);
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (suggestionsOpen && matches.length > 0) {
                    executeCommand(matches[0]);
                  } else {
                    submitPrompt();
                  }
                }
              }}
              placeholder="Ask anything about your business..."
              rows={2}
            />

            <div className="composer-footer">
              <span>Your AI accounting workspace</span>
              <button className="send-btn" onClick={submitPrompt} aria-label="Submit command">
                ↑
              </button>
            </div>

            {suggestionsOpen && matches.length > 0 && (
              <div className="suggestions">
                <div className="suggestions-label">SUGGESTED ACTIONS</div>
                {matches.map((item) => (
                  <button key={item.title} onClick={() => executeCommand(item)}>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span className="suggestion-tag">{item.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {promptResult && <div className="demo-notice">{promptResult}</div>}
          <div className="prompt-chips">
            {["Record a sale", "Check inventory", "Monthly profit"].map((item) => (
              <button key={item} onClick={() => setPrompt(item)}>{item}</button>
            ))}
          </div>
        </section>

        {/* Business Overview */}
        <section className="hisabiya-overview">
          <div className="hisabiya-overview-header">
            <div>
              <h2>Business overview</h2>
              <p>Your business at a glance</p>
            </div>

            <span className="hisabiya-period">
              This month
            </span>
          </div>

          <div className="hisabiya-overview-grid">
            {[
              {
                title: "Sales",
                icon: "↗",
                description: "Total revenue",
              },
              {
                title: "Expenses",
                icon: "↘",
                description: "Business spending",
              },
              {
                title: "Inventory value",
                icon: "▣",
                description: "Current stock value",
              },
              {
                title: "Receivables",
                icon: "◎",
                description: "Customer balances",
              },
            ].map((item) => (
              <div className="hisabiya-overview-card" key={item.title}>
                <div className="hisabiya-card-top">
                  <span>{item.title}</span>
                  <span className="hisabiya-card-icon">
                    {item.icon}
                  </span>
                </div>

                <div className="hisabiya-card-middle">
                  <strong>—</strong>
                  <p>{item.description} · No records yet</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function renderPage() {
    if (page === "Home") return renderHome();

    return (
      <div className="content-page">
        <button className="back-btn" onClick={() => navigate("Home")}>
          ← Back to workspace
        </button>
        <h1>{page === "NFRS" ? "NFRS Statements" : page}</h1>
        <p className="page-description">A clean workspace for your {page.toLowerCase()} data.</p>

        {page !== "Settings" && (
          <section className="page-empty">
            <strong>No {page.toLowerCase()} yet</strong>
            <p>This area is ready for the interface. Data entry will be added later.</p>
          </section>
        )}

        {page === "Settings" && (
          <div className="settings-form">
            <label>Business name</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <label>Currency</label>
            <input value="NPR — Nepalese Rupee" readOnly />
            <label>Application</label>
            <input value="HISABIYA Workspace" readOnly />
            <p>These settings are temporary and reset when the app reloads.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-titlebar">
        <span>▦ Hisabiya — {businessName || "My Business"}</span>
        <span>Accounting & Inventory · Workspace</span>
      </div>

      <main className="app-main">{renderPage()}</main>

      <footer className="app-statusbar">
        <span>● Local workspace</span>
        <span>NPR · HISABIYA</span>
      </footer>

    </div>
  );
}

export default App;
