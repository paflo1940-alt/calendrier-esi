import { useEffect, useMemo, useState } from 'react'

const UE_LIST = [
  '3ALG3A','3DEV3A','3EXP2A','5ANA1D','5DEV5DR',
  '5DON4D','5GES3D','5SEC1A','5WEB4D'
]

const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi']
const SLOTS = ['08:15','10:30','13:45','16:00']

const DEFAULT_EVENTS = [
  {id:'don-lu-am',day:0,start:'08:15',end:'10:15',ue:'5DON4D',type:'',group:'E122',teacher:'SDR',room:'504'},
  {id:'ana-lu',day:0,start:'10:30',end:'12:30',ue:'5ANA1D',type:'T',group:'E122',teacher:'CLG',room:'003'},
  {id:'web-lu',day:0,start:'13:45',end:'15:45',ue:'5WEB4D',type:'',group:'E122',teacher:'TNI',room:'405'},
  {id:'don-lu-pm',day:0,start:'16:00',end:'18:00',ue:'5DON4D',type:'T',group:'E122',teacher:'SDR',room:'003'},

  {id:'alg-ma',day:1,start:'10:30',end:'12:30',ue:'3ALG3A',type:'',group:'C222',teacher:'MSA',room:'101'},
  {id:'dev5-ma',day:1,start:'16:00',end:'18:00',ue:'5DEV5DR',type:'',group:'E221',teacher:'NRI',room:'405'},

  {id:'exp-me',day:2,start:'08:15',end:'10:15',ue:'3EXP2A',type:'',group:'C122',teacher:'MBA',room:'304'},
  {id:'dev3-me',day:2,start:'10:30',end:'12:30',ue:'3DEV3A',type:'',group:'C122',teacher:'MSA',room:'403'},
  {id:'sec-me',day:2,start:'16:00',end:'18:00',ue:'5SEC1A',type:'T',group:'E122',teacher:'ABS',room:'004'},

  {id:'ges-je',day:3,start:'08:15',end:'10:15',ue:'5GES3D',type:'ORG',group:'E111',teacher:'BCH',room:'105'},
  {id:'ana-je',day:3,start:'10:30',end:'12:30',ue:'5ANA1D',type:'L',group:'E122',teacher:'CLG',room:'201'},
  {id:'sec-je',day:3,start:'13:45',end:'15:45',ue:'5SEC1A',type:'L',group:'E122',teacher:'TNI',room:'202'},
  {id:'dev5-je',day:3,start:'16:00',end:'18:00',ue:'5DEV5DR',type:'',group:'E221',teacher:'NRI',room:'203'},

  {id:'ges-ve',day:4,start:'08:15',end:'10:15',ue:'5GES3D',type:'DRT',group:'E111',teacher:'VRU',room:'003'},
  {id:'dev3-ve',day:4,start:'10:30',end:'12:30',ue:'3DEV3A',type:'',group:'C122',teacher:'MSA',room:'404'},
  {id:'web-ve',day:4,start:'13:45',end:'15:45',ue:'5WEB4D',type:'',group:'E122',teacher:'TNI',room:'304'},
  {id:'exp-ve',day:4,start:'16:00',end:'18:00',ue:'3EXP2A',type:'',group:'C122',teacher:'MBA',room:'003'},
]

const STORAGE_KEY = 'esiScheduleReactViteV1'

const emptyEvent = {
  id: '',
  day: 0,
  start: '08:15',
  end: '10:15',
  ue: '3ALG3A',
  type: '',
  group: '',
  teacher: '',
  room: '',
}

function App() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS
  })
  const [filter, setFilter] = useState('ALL')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyEvent)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const hours = useMemo(() => {
    return events.reduce((sum, e) => {
      const [sh, sm] = e.start.split(':').map(Number)
      const [eh, em] = e.end.split(':').map(Number)
      return sum + ((eh * 60 + em) - (sh * 60 + sm)) / 60
    }, 0)
  }, [events])

  const visible = (event) => filter === 'ALL' || event.ue === filter

  const openNew = () => {
    setEditing('new')
    setForm({...emptyEvent, id: `custom-${Date.now()}`})
  }

  const openEdit = (event) => {
    setEditing(event.id)
    setForm({...event})
  }

  const saveEvent = (e) => {
    e.preventDefault()
    if (editing === 'new') {
      setEvents(prev => [...prev, form])
    } else {
      setEvents(prev => prev.map(x => x.id === editing ? form : x))
    }
    setEditing(null)
  }

  const deleteEvent = () => {
    if (!editing || editing === 'new') return
    if (!confirm('Supprimer ce cours ?')) return
    setEvents(prev => prev.filter(x => x.id !== editing))
    setEditing(null)
  }

  const reset = () => {
    if (!confirm("Revenir à l'emploi du temps d'origine ?")) return
    setEvents(DEFAULT_EVENTS)
    setFilter('ALL')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">HE2B ESI • PAE 2026–2027</p>
          <h1>Mon emploi du temps</h1>
          <p className="subtitle">
            9 UE • 6ETE1A exclue • responsive • modifiable • sauvegarde locale
          </p>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => window.print()}>Imprimer / PDF</button>
          <button className="btn" onClick={reset}>Réinitialiser</button>
          <button className="btn primary" onClick={openNew}>+ Ajouter un cours</button>
        </div>
      </header>

      <section className="summary">
        <Stat value={events.length} label="séances / semaine" />
        <Stat value={`${Number.isInteger(hours) ? hours : hours.toFixed(1)} h`} label="cours affichés" />
        <Stat value="9" label="UE" />
        <Stat value="5" label="jours" />
      </section>

      <div className="filters">
        {['ALL', ...UE_LIST].map(ue => (
          <button
            key={ue}
            className={`chip ${filter === ue ? 'active' : ''}`}
            onClick={() => setFilter(ue)}
          >
            {ue === 'ALL' ? 'Toutes les UE' : ue}
          </button>
        ))}
      </div>

      <section className="calendar-shell">
        <div className="week-head">
          <div className="corner" />
          {DAYS.map((day, i) => (
            <div className="day-head" key={day}>
              <div className="day-name">{day}</div>
              <div className="day-date">{14 + i} sept.</div>
            </div>
          ))}
        </div>

        <div className="week-grid">
          <div className="time-col">
            {['08:15','10:30','13:45','16:00','18:00'].map(t => (
              <div className="time-label" key={t}>{t}</div>
            ))}
          </div>

          {DAYS.map((_, dayIndex) => (
            <DayColumn
              key={dayIndex}
              dayIndex={dayIndex}
              events={events.filter(e => e.day === dayIndex)}
              visible={visible}
              openEdit={openEdit}
            />
          ))}
        </div>
      </section>

      <section className="mobile-list">
        {DAYS.map((day, dayIndex) => (
          <div className="mobile-day" key={day}>
            <h2>{day}</h2>
            {events
              .filter(e => e.day === dayIndex)
              .sort((a,b) => a.start.localeCompare(b.start))
              .map(event => visible(event) && (
                <EventCard key={event.id} event={event} mobile onClick={() => openEdit(event)} />
              ))}
          </div>
        ))}
      </section>

      <p className="note">
        Clique sur un cours pour le modifier. Les données sont sauvegardées dans localStorage.
      </p>

      {editing && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form className="modal" onSubmit={saveEvent} onMouseDown={e => e.stopPropagation()}>
            <h3>{editing === 'new' ? 'Ajouter un cours' : 'Modifier le cours'}</h3>

            <div className="form-grid">
              <Field label="UE">
                <select value={form.ue} onChange={e => setForm({...form, ue:e.target.value})}>
                  {UE_LIST.map(ue => <option key={ue}>{ue}</option>)}
                </select>
              </Field>

              <Field label="Jour">
                <select value={form.day} onChange={e => setForm({...form, day:Number(e.target.value)})}>
                  {DAYS.map((d,i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </Field>

              <Field label="Début">
                <select value={form.start} onChange={e => setForm({...form, start:e.target.value})}>
                  {SLOTS.map(x => <option key={x}>{x}</option>)}
                </select>
              </Field>

              <Field label="Fin">
                <select value={form.end} onChange={e => setForm({...form, end:e.target.value})}>
                  {['10:15','12:30','15:45','18:00'].map(x => <option key={x}>{x}</option>)}
                </select>
              </Field>

              <Field label="Type / suffixe">
                <input value={form.type} onChange={e => setForm({...form, type:e.target.value})} />
              </Field>
              <Field label="Groupe">
                <input value={form.group} onChange={e => setForm({...form, group:e.target.value})} />
              </Field>
              <Field label="Prof">
                <input value={form.teacher} onChange={e => setForm({...form, teacher:e.target.value})} />
              </Field>
              <Field label="Local">
                <input value={form.room} onChange={e => setForm({...form, room:e.target.value})} />
              </Field>
            </div>

            <div className="dialog-actions">
              <button type="button" className="btn danger" onClick={deleteEvent} disabled={editing === 'new'}>
                Supprimer
              </button>
              <div className="right">
                <button type="button" className="btn" onClick={() => setEditing(null)}>Annuler</button>
                <button type="submit" className="btn primary">Enregistrer</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function DayColumn({dayIndex, events, visible, openEdit}) {
  return (
    <div className="day-col" data-day={dayIndex}>
      {Array.from({length:5}).map((_,i)=><div className="slot-bg" key={i}/>)}
      <div className="event-layer">
        {events.map(event => visible(event) && (
          <EventCard key={event.id} event={event} onClick={() => openEdit(event)} />
        ))}
      </div>
    </div>
  )
}

function EventCard({event, mobile=false, onClick}) {
  const index = SLOTS.indexOf(event.start)
  const label = `${event.ue}${event.type ? ` · ${event.type}` : ''}`
  const meta = [event.group, event.teacher, event.room && `Local ${event.room}`].filter(Boolean).join(' • ')

  if (mobile) {
    return (
      <button className="mobile-card" data-ue={event.ue} onClick={onClick}>
        <div className="row">
          <strong>{label}</strong>
          <span>{event.start}–{event.end}</span>
        </div>
        <div className="meta">{meta}</div>
      </button>
    )
  }

  return (
    <button
      className="event"
      data-ue={event.ue}
      style={{'--slot-index': Math.max(0,index)}}
      onClick={onClick}
    >
      <div className="top">
        <span className="ue">{label}</span>
        <span className="time">{event.start}–{event.end}</span>
      </div>
      <div className="meta">{meta}</div>
      <div className="edit">Cliquer pour modifier</div>
    </button>
  )
}

function Stat({value,label}) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>
}

function Field({label, children}) {
  return <label className="field"><span>{label}</span>{children}</label>
}

export default App
