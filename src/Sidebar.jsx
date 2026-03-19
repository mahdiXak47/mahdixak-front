import './Sidebar.css';

/** Filled card + official checklist paths from Bootstrap card-checklist (no -fill glyph in the set). */
function IconCardChecklistFilled() {
  return (
    <svg className="sidebar__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect
        className="sidebar__icon-card-fill"
        x="1.5"
        y="3"
        width="13"
        height="10"
        rx="1"
        ry="1"
      />
      <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
    </svg>
  );
}

function BiIcon({ name, className = '' }) {
  return <i className={`bi bi-${name} sidebar__bi ${className}`.trim()} aria-hidden />;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: () => <BiIcon name="house-fill" />, active: true },
  { id: 'dashboard', label: 'Dashboard', icon: () => <BiIcon name="speedometer2" /> },
  { id: 'orders', label: 'Orders', icon: () => <BiIcon name="table" /> },
  { id: 'products', label: 'Products', icon: () => <BiIcon name="grid-fill" /> },
  { id: 'customers', label: 'Customers', icon: () => <BiIcon name="people-fill" /> },
  {
    id: 'notes-to-do',
    label: 'Notes to do',
    icon: IconCardChecklistFilled,
    externalHref: 'https://notes-to-do.darkube.app/',
  },
  {
    id: 'musics',
    label: 'Musics',
    icon: () => <BiIcon name="apple-music" />,
    externalHref: 'https://mahdixak-music.darkube.app/',
  },
  { id: 'blackout-situation', label: 'Blackout situation', icon: () => <BiIcon name="wifi-off" /> },
  {
    id: 'chat',
    label: 'Chat',
    icon: () => <BiIcon name="chat-dots-fill" />,
    externalHref: 'https://oneclick-rocketchat-osgu3zzv.darkube.app/',
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__header">
        <span className="sidebar__brand-mark" aria-hidden>
          <BiIcon name="layout-sidebar-inset" className="sidebar__bi--brand" />
        </span>
        <span className="sidebar__brand-text">Sidebar</span>
      </div>

      <nav className="sidebar__nav" aria-label="Sections">
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ id, label, icon: Icon, active, externalHref }) => (
            <li key={id} className="sidebar__item">
              <a
                className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}
                href={externalHref ?? `#${id}`}
                aria-current={active && !externalHref ? 'page' : undefined}
              >
                <Icon />
                <span className="sidebar__label">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__profile" aria-haspopup="menu" aria-expanded="false">
          <span className="sidebar__avatar" aria-hidden>
            m
          </span>
          <span className="sidebar__username">mdo</span>
          <BiIcon name="caret-down-fill" className="sidebar__bi--footer" />
        </button>
      </div>
    </aside>
  );
}
