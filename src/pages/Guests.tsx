import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const RSVP_URL = 'https://functions.poehali.dev/82989529-ae01-4bdb-b2c8-431c5db4d7f3';

interface Guest {
  id: number;
  name: string;
  guests: number;
  menu_notes: string;
  created_at: string;
}

const Guests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(RSVP_URL);
      const data = await res.json();
      setGuests(data.guests || []);
      setTotal(data.total_people || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fmtDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>
          <span className="font-script text-2xl text-primary">Артём & Мария</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl text-foreground">Список гостей</h1>
            <p className="mt-2 font-body text-muted-foreground">Ответы, полученные через форму на сайте</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={load} disabled={loading}>
            <Icon name={loading ? 'Loader2' : 'RefreshCw'} size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-secondary p-6">
            <p className="font-body text-sm text-muted-foreground">Подтвердили ответ</p>
            <p className="mt-1 font-display text-4xl text-foreground">{guests.length}</p>
          </div>
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="font-body text-sm opacity-80">Придёт человек</p>
            <p className="mt-1 font-display text-4xl">{total}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {loading && guests.length === 0 && (
            <p className="py-12 text-center font-body text-muted-foreground">Загружаем список...</p>
          )}
          {!loading && guests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <Icon name="Inbox" size={40} className="mx-auto text-muted-foreground/50" />
              <p className="mt-4 font-body text-muted-foreground">Пока никто не подтвердил присутствие</p>
            </div>
          )}
          {guests.map((g) => (
            <div key={g.id} className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg text-primary">
                {g.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-body text-lg font-600 text-foreground">{g.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-xs text-primary">
                    <Icon name="Users" size={12} />
                    {g.guests} чел.
                  </span>
                </div>
                {g.menu_notes && (
                  <p className="mt-1 font-body text-sm text-muted-foreground">
                    <Icon name="UtensilsCrossed" size={13} className="mr-1 inline" />
                    {g.menu_notes}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-body text-xs text-muted-foreground/70">{fmtDate(g.created_at)}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Guests;
