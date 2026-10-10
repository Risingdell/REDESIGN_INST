import { useId, useState } from 'react';
import { Icon } from './Icon';

/** Disclosure list. Items: [{ id, title, content }]. */
export function Accordion({ items, defaultOpen = null, allowMultiple = false }) {
  const [open, setOpen] = useState(defaultOpen ? [defaultOpen] : []);
  const baseId = useId();

  const toggle = (id) =>
    setOpen((list) => (list.includes(id) ? list.filter((x) => x !== id) : allowMultiple ? [...list, id] : [id]));

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const panelId = `${baseId}-${item.id}`;
        return (
          <div key={item.id} className="accordion__item" data-open={isOpen}>
            <h3 style={{ fontSize: 'inherit', letterSpacing: 0 }}>
              <button
                type="button"
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <Icon name="plus" />
              </button>
            </h3>
            <div className="accordion__panel" id={panelId} role="region" aria-hidden={!isOpen}>
              <div>
                <div className="accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
