import { prospects } from "./data/demo";
export default function Home() {
  const stats = [
    { label: "Follow-ups Due", value: "0", note: "Nothing overdue" },
    { label: "Upcoming Visits", value: "0", note: "Plan your first visit" },
    { label: "Active Prospects", value: "2", note: "Initial test prospects" },
    { label: "Open Quotes", value: "0", note: "No open quotes" },
    { label: "Revenue", value: "$0", note: "Outreach attributed" },
    { label: "Marketing ROI", value: "—", note: "Waiting for first results" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Lillian Harper CRM
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Business Development & Relationship Marketing
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
            CRM 1.0
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>

          <nav className="space-y-1">
            {[
              "Dashboard",
              "Prospects",
              "Contacts",
              "Visit Planner",
              "Visit Log",
              "Samples",
              "Follow-Ups",
              "Opportunities",
              "Orders",
              "Products",
              "ROI",
            ].map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  index === 0
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Tuesday, September 1, 2026
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              Good afternoon
            </h2>
            <p className="mt-2 text-slate-500">
              Less data entry. More relationship building.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Priority Prospects</h3>
                  <p className="text-sm text-slate-500">
                    Businesses ready for outreach
                  </p>
                </div>

                <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  + Add Prospect
                </button>
              </div>

              <div className="space-y-3">
                {prospects.map((prospect) => (
                  <div
                    key={prospect.name}
                    className="rounded-xl border p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{prospect.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {prospect.industry}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                        {prospect.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <span className="text-xs text-slate-400">Next step</span>
                      <span className="text-sm font-medium">{prospect.next}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Today</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your relationship marketing checklist
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Review follow-ups due",
                  "Plan upcoming visits",
                  "Choose prospect-specific samples",
                  "Record completed visits",
                  "Update quotes and opportunities",
                ].map((task) => (
                  <div
                    key={task}
                    className="flex items-center gap-3 rounded-xl border p-4"
                  >
                    <div className="h-5 w-5 rounded border-2 border-slate-300" />
                    <span className="text-sm font-medium">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <p className="text-sm font-semibold text-slate-300">
              LILLIAN HARPER WORKFLOW
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              Prospect → Plan Visit → Choose Samples → Engrave → Present →
              Record Visit → Follow Up → Quote → Order → Revenue → ROI
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
