
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
  { name: "Transactions", icon: "▤" },
  { name: "Accounts", icon: "▦" },
  { name: "Inventory", icon: "◫" },
  { name: "Contacts", icon: "♧" },
  { name: "Reports", icon: "▣" },
  { name: "NFRS", icon: "◈" },
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
              <span className="shortcut-icon">{item.icon}</span>
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
              rows={1}
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

        <section className="overview-section">
          <h2>Business overview</h2>
          <div className="overview-grid">
            {["Sales", "Expenses", "Inventory value", "Receivables"].map((item) => (
              <div className="overview-card" key={item}>
                <span>{item}</span>
                <strong>—</strong>
                <small>No records yet</small>
              </div>
            ))}
          </div>
          <div className="activity-panel">
            <h2>▣ &nbsp; Recent activity</h2>
            <div className="activity-empty">
              <span className="activity-icon">▱</span>
              <p>Your recent activity will appear here.</p>
            </div>
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
