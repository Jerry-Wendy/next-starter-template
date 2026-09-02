import Link from "next/link";

const contacts = [
  {
    name: "Sample Contact",
    business: "Cypress Knoll Golf Club",
    role: "Manager",
    phone: "",
    email: "",
  },
];

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
            <p className="mt-1 text-sm text-slate-500">
              People connected to prospects and customers
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Contacts</h2>
            <p className="text-sm text-slate-500">
              {contacts.length} contact currently listed
            </p>
          </div>

          <Link href="/contacts/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            + Add Contact
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contacts.map((contact) => (
                <tr key={`${contact.name}-${contact.business}`}>
                  <td className="px-5 py-4 font-semibold">{contact.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {contact.business}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {contact.role}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {contact.phone || "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {contact.email || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
