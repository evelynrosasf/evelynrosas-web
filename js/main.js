// Evelyn Rosas — interacciones del sitio
const EMAIL = 'hello@evelynrosas.me';

/* Menú */
(() => {
  const btn = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => set(menu.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
})();

/* Preguntas frecuentes: una abierta a la vez */
(() => {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      items.forEach((other) => {
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').hidden = true;
        other.querySelector('.sign').textContent = '+';
      });
      if (!open) {
        q.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-a').hidden = false;
        item.querySelector('.sign').textContent = '−';
      }
    });
  });
})();

/* Calendario de la Brand Therapy Call
   Mientras no haya un sistema de reservas (Calendly, Cal.com…), "Confirmar reserva"
   abre un correo con la fecha y la hora elegidas. */
(() => {
  const root = document.getElementById('cal');
  if (!root) return;
  const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const DAYS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const TIMES = ['17:00','18:00','19:00','20:00'];
  const MAX_MONTHS = 2; // cuántos meses hacia adelante se pueden ver
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const avail = (d) => d >= today && d.getDay() !== 0; // sin domingos

  const firstAvail = (m) => {
    const base = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const n = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= n; d++) if (avail(new Date(base.getFullYear(), base.getMonth(), d))) return d;
    return null;
  };
  const st = { m: 0, day: firstAvail(0), time: 1 };

  const $ = (s) => root.querySelector(s);
  function render() {
    const base = new Date(today.getFullYear(), today.getMonth() + st.m, 1);
    const y = base.getFullYear(), mo = base.getMonth();
    $('.cal-month').textContent = cap(MONTHS[mo]) + ' ' + y;
    $('.cal-prev').disabled = st.m <= 0;
    $('.cal-next').disabled = st.m >= MAX_MONTHS;

    const grid = $('.cal-days');
    grid.innerHTML = '';
    const offset = (base.getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-cell' }));
    const total = new Date(y, mo + 1, 0).getDate();
    for (let d = 1; d <= total; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = d;
      const ok = avail(new Date(y, mo, d));
      b.className = 'cal-day' + (ok ? (d === st.day ? ' sel' : '') : ' off');
      if (ok) { b.addEventListener('click', () => { st.day = d; render(); }); b.setAttribute('aria-pressed', String(d === st.day)); }
      else b.disabled = true;
      cell.appendChild(b);
      grid.appendChild(cell);
    }

    const times = $('.cal-times');
    times.innerHTML = '';
    TIMES.forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal-time' + (i === st.time ? ' sel' : '');
      b.textContent = t;
      b.setAttribute('aria-pressed', String(i === st.time));
      b.addEventListener('click', () => { st.time = i; render(); });
      times.appendChild(b);
    });

    const sel = st.day ? new Date(y, mo, st.day) : null;
    $('.cal-sel').textContent = sel ? cap(DAYS[sel.getDay()]) + ' ' + st.day + ' de ' + MONTHS[mo] : 'Elige un día';
    const subject = 'Reserva · Brand Therapy Call';
    const body = sel
      ? `Hola Evelyn,\n\nMe gustaría reservar una Brand Therapy Call el ${DAYS[sel.getDay()]} ${st.day} de ${MONTHS[mo]} de ${y} a las ${TIMES[st.time]} (hora de Madrid).\n\nMi nombre:\nMi marca:\n`
      : '';
    $('.cal-confirm').href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  $('.cal-prev').addEventListener('click', () => { if (st.m > 0) { st.m--; st.day = firstAvail(st.m); render(); } });
  $('.cal-next').addEventListener('click', () => { if (st.m < MAX_MONTHS) { st.m++; st.day = firstAvail(st.m); render(); } });
  render();
})();

/* Formulario de contacto
   Si el formulario tiene data-endpoint (por ejemplo, la URL de Formspree), se envía ahí.
   Si no, abre un correo ya redactado con lo que la persona escribió. */
(() => {
  const form = document.getElementById('contacto-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const endpoint = form.dataset.endpoint;
    const ok = form.querySelector('.form-ok');
    if (endpoint) {
      try {
        const r = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error();
        form.reset();
        ok.textContent = '¡Gracias! Recibí tu mensaje y te respondo pronto.';
      } catch {
        ok.textContent = `No se pudo enviar. Escríbeme directamente a ${EMAIL}.`;
      }
      ok.hidden = false;
      return;
    }
    const lines = [
      `Nombre: ${data.get('nombre') || ''}`,
      `Correo: ${data.get('email') || ''}`,
      `Marca: ${data.get('marca') || ''}`,
      `Instagram / web: ${data.get('enlace') || ''}`,
      `Tipo de negocio: ${data.get('tipo') || ''}`,
      `Me interesa: ${data.getAll('interes').join(', ')}`,
      '',
      data.get('mensaje') || '',
    ];
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Nuevo mensaje desde la web')}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
})();
