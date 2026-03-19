import './Sidebar.css';

function IconHome() {
  return (
    <svg className="sidebar__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg className="sidebar__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.254l5.096-5.096a.389.389 0 0 0-.029-.518z" />
      <path
        fillRule="evenodd"
        d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.298 12.066 6.115 11 8 11s3.702 1.065 4.923 1.958c.756.246 1.477-.055 1.68-.63A7 7 0 0 0 8 3z"
      />
    </svg>
  );
}

function IconOrders() {
  return (
    <svg className="sidebar__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg className="sidebar__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
    </svg>
  );
}

function IconCustomers() {
  return (
    <svg className="sidebar__icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      <path
        fillRule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.298 12.066 6.115 11 8 11s3.702 1.065 4.923 1.958c.756.246 1.477-.055 1.68-.63A7 7 0 0 0 8 1z"
      />
    </svg>
  );
}

function IconBrand() {
  return (
    <svg className="sidebar__brand-svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M2.5 4A1.5 1.5 0 0 1 4 2.5h8A1.5 1.5 0 0 1 13.5 4v8a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 2.5 12V4zm1 0v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5z" />
      <path d="M6.5 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm1 .5v4h1V6h-1z" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg className="sidebar__chevron" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: IconHome, active: true },
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { id: 'orders', label: 'Orders', icon: IconOrders },
  { id: 'products', label: 'Products', icon: IconProducts },
  { id: 'customers', label: 'Customers', icon: IconCustomers },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__header">
        <span className="sidebar__brand-mark" aria-hidden>
          <IconBrand />
        </span>
        <span className="sidebar__brand-text">Sidebar</span>
      </div>

      <nav className="sidebar__nav" aria-label="Sections">
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ id, label, icon: Icon, active }) => (
            <li key={id} className="sidebar__item">
              <a
                className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}
                href={`#${id}`}
                aria-current={active ? 'page' : undefined}
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
          <IconChevronDown />
        </button>
      </div>
    </aside>
  );
}
