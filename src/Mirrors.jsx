import './Mirrors.css';

const MIRRORS = [
  {
    id: 'liara',
    name: 'Liara',
    links: [{ label: 'Mirrors', href: 'https://liara.ir/mirrors/' }],
  },
  {
    id: 'arash-hatami',
    name: 'Arash Hatami',
    links: [{ label: 'Mirrors', href: 'https://mirrors.arash-hatami.ir/' }],
  },
  {
    id: 'mobinhost',
    name: 'Mobin Host',
    links: [{ label: 'Mirrors', href: 'https://mirror.mobinhost.com/' }],
  },
  {
    id: 'hamravesh',
    name: 'Hamravesh',
    links: [
      {
        label: 'Container Registry Mirroring',
        href: 'https://hamravesh.com/blog/container-registry-mirroring-and-caching/',
      },
    ],
  },
  {
    id: 'arvan',
    name: 'ArvanCloud',
    links: [
      { label: 'Docker Images', href: 'https://www.arvancloud.ir/fa/dev/docker' },
      { label: 'Linux Packages', href: 'https://www.arvancloud.ir/en/dev/linux-repository' },
    ],
  },
];

export default function Mirrors() {
  return (
    <section id="mirrors" className="mirrors">
      <h2 className="mirrors__title">Mirrors</h2>
      <p className="mirrors__subtitle">Iranian mirror providers for Docker images, Linux packages, and more.</p>
      <div className="mirrors__grid">
        {MIRRORS.map(({ id, name, links }) => (
          <div key={id} className="mirror-card">
            <h3 className="mirror-card__name">{name}</h3>
            <ul className="mirror-card__links">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <a
                    className="mirror-card__link"
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <i className="bi bi-box-arrow-up-right mirror-card__link-icon" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
