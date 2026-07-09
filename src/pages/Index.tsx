import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const RSVP_URL = 'https://functions.poehali.dev/82989529-ae01-4bdb-b2c8-431c5db4d7f3';

const HERO_IMG = 'https://cdn.poehali.dev/projects/b0e4e9d1-980a-4683-8052-6fe3c101c3e2/files/ff358d91-d553-4def-8aaa-16de7fd01915.jpg';
const FLOWERS_IMG = 'https://cdn.poehali.dev/projects/b0e4e9d1-980a-4683-8052-6fe3c101c3e2/files/399727cf-9233-403f-9787-3475cf0560b3.jpg';
const VENUE_IMG = 'https://cdn.poehali.dev/projects/b0e4e9d1-980a-4683-8052-6fe3c101c3e2/files/23a375b3-d64b-40de-9fda-0cc300b529bc.jpg';

const schedule = [
  { time: '14:40', title: 'Церемония бракосочетания', icon: 'Heart', desc: 'Дворец бракосочетаний г. Томска, Проспект Ленина, 83' },
  { time: '18:00', title: 'Сбор гостей', icon: 'Users', desc: 'Празднование свадьбы в «Да Винчи», банкетный зал, ул. Кулёва, 24' },
  { time: '00:00', title: 'Завершение мероприятия', icon: 'Sparkles', desc: 'Спасибо, что были с нами в этот день!' },
];

const gallery = [HERO_IMG, FLOWERS_IMG, VENUE_IMG];

const Index = () => {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const [form, setForm] = useState({ name: '', guests: 1, menu_notes: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch(RSVP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
      setForm({ name: '', guests: 1, menu_notes: '' });
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(12_40%_18%/0.55)] via-[hsl(12_40%_18%/0.35)] to-[hsl(12_78%_30%/0.7)]" />
        <div className="relative z-10 px-6">
          <p className="animate-fade-in font-script text-3xl text-white/90 md:text-4xl">
            Мы женимся!
          </p>
          <h1 className="mt-4 animate-fade-up font-display text-6xl font-500 leading-none text-white md:text-8xl lg:text-9xl">Павел  &  Юлия</h1>
          <div className="mx-auto mt-8 flex max-w-md animate-fade-up items-center justify-center gap-4 text-white/90" style={{ animationDelay: '0.2s' }}>
            <span className="h-px flex-1 bg-white/40" />
            <span className="font-body text-lg tracking-[0.3em] uppercase md:text-xl">18 сентября 2026</span>
            <span className="h-px flex-1 bg-white/40" />
          </div>
          <p className="mt-4 animate-fade-up font-body text-white/80" style={{ animationDelay: '0.3s' }}>Да Винчи
Банкетный зал, ​Улица Кулёва, 24</p>
          <Button
            size="lg"
            className="mt-10 animate-fade-up rounded-full px-10 py-6 text-base shadow-xl"
            style={{ animationDelay: '0.4s' }}
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Подтвердить присутствие
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-float text-white/70">
          <Icon name="ChevronDown" size={32} />
        </div>
      </section>

      {/* О ПАРЕ */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p ref={addReveal} className="reveal font-script text-3xl text-primary">Наша история</p>
        <h2 ref={addReveal} className="reveal mt-2 font-display text-5xl text-foreground md:text-6xl">
          Как всё началось
        </h2>
        <p ref={addReveal} className="reveal mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground text-balance">Два года назад мы случайно оказались рядом возле маленького ресторанчика. Несколько слов разговора , переписка, встреча, свидание — и с тех пор мы не расстаёмся. Через путешествия, мечты и тысячи общих моментов мы пришли к самому важному дню. И хотим встретить его рядом с вами.</p>
        <div ref={addReveal} className="reveal mt-10 flex items-center justify-center gap-3 text-primary">
          <Icon name="Heart" size={20} />
          <span className="font-script text-2xl">Павел & Юлия</span>
          <Icon name="Heart" size={20} />
        </div>
      </section>

      {/* РАСПИСАНИЕ */}
      <section className="relative bg-secondary py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p ref={addReveal} className="reveal font-script text-3xl text-primary">Программа дня</p>
            <h2 ref={addReveal} className="reveal mt-2 font-display text-5xl text-foreground md:text-6xl">
              Расписание свадьбы
            </h2>
          </div>
          <div className="relative mt-16">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-primary/30 md:left-1/2" />
            <div className="space-y-10">
              {schedule.map((item, i) => (
                <div
                  key={item.time}
                  ref={addReveal}
                  className={`reveal relative flex items-start gap-6 md:w-1/2 ${
                    i % 2 ? 'md:ml-auto md:flex-row md:pl-12' : 'md:flex-row-reverse md:pr-12 md:text-right'
                  }`}
                >
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Icon name={item.icon} size={24} />
                  </div>
                  <div className="flex-1 rounded-2xl bg-card p-5 shadow-sm">
                    <p className="font-display text-3xl text-primary">{item.time}</p>
                    <h3 className="mt-1 font-body text-lg font-600 text-foreground">{item.title}</h3>
                    <p className="mt-1 font-body text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p ref={addReveal} className="reveal font-script text-3xl text-primary">Наши моменты</p>
        <h2 ref={addReveal} className="reveal mt-2 font-display text-5xl text-foreground md:text-6xl">
          Галерея
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {gallery.map((src, i) => (
            <div
              key={i}
              ref={addReveal}
              className={`reveal group overflow-hidden rounded-3xl shadow-md ${i === 0 ? 'md:row-span-2 md:h-full' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <img
                src={src}
                alt={`Фото ${i + 1}`}
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110 md:h-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${FLOWERS_IMG})` }} />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 mx-auto max-w-xl px-6 text-center text-primary-foreground">
          <p ref={addReveal} className="reveal font-script text-3xl">Будем рады видеть вас</p>
          <h2 ref={addReveal} className="reveal mt-2 font-display text-5xl md:text-6xl">
            Подтвердите присутствие
          </h2>
          <p ref={addReveal} className="reveal mt-4 font-body text-primary-foreground/80">
            Пожалуйста, ответьте до 1 августа 2026 года
          </p>
          {status === 'done' ? (
            <div ref={addReveal} className="reveal mt-10 rounded-3xl bg-card/95 p-10 text-center shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon name="Check" size={32} />
              </div>
              <h3 className="mt-6 font-display text-3xl text-foreground">Спасибо!</h3>
              <p className="mt-2 font-body text-muted-foreground">
                Ваш ответ сохранён. Будем очень рады видеть вас на нашем празднике!
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => setStatus('idle')}
              >
                Отправить ещё один ответ
              </Button>
            </div>
          ) : (
            <form
              ref={addReveal}
              className="reveal mt-10 space-y-4 rounded-3xl bg-card/95 p-8 text-left shadow-2xl"
              onSubmit={submitRsvp}
            >
              <div>
                <label className="mb-1 block font-body text-sm font-500 text-foreground">Ваше имя</label>
                <Input
                  placeholder="Имя и фамилия"
                  className="bg-background"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-sm font-500 text-foreground">Количество гостей</label>
                <Input
                  type="number"
                  min={1}
                  className="bg-background"
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: Math.max(1, Number(e.target.value)) })}
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-sm font-500 text-foreground">Пожелания по меню</label>
                <Textarea
                  placeholder="Аллергии, предпочтения..."
                  className="bg-background"
                  rows={3}
                  value={form.menu_notes}
                  onChange={(e) => setForm({ ...form, menu_notes: e.target.value })}
                />
              </div>
              {status === 'error' && (
                <p className="font-body text-sm text-destructive">
                  Не удалось отправить. Проверьте имя и попробуйте ещё раз.
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full py-6 text-base"
                disabled={status === 'loading'}
              >
                <Icon name={status === 'loading' ? 'Loader2' : 'Send'} size={18} className={`mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
                {status === 'loading' ? 'Отправляем...' : 'Отправить ответ'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ФУТЕР */}
      <footer className="bg-foreground py-16 text-center text-background">
        <Icon name="Heart" size={28} className="mx-auto text-primary" />
        <h3 className="mt-4 font-display text-4xl">Павел & Юлия</h3>
        <p className="mt-2 font-script text-2xl text-background/70">До встречи на празднике!</p>
        <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 text-background/60">
          <Icon name="MapPin" size={16} />
          <span className="font-body text-sm">«Да Винчи», ул. Кулёва, 24</span>
        </div>
        <Link
          to="/guests"
          className="mt-8 inline-flex items-center gap-2 font-body text-xs text-background/40 transition-colors hover:text-background/80"
        >
          <Icon name="ClipboardList" size={14} />
          Список гостей
        </Link>
      </footer>
    </div>
  );
};

export default Index;