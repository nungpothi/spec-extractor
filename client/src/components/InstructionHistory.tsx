import { InstructionItem } from '../types';

interface InstructionHistoryProps {
  items: InstructionItem[];
}

export default function InstructionHistory({ items }: InstructionHistoryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="instruction-history">
      <h2>Instruction History</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={`instruction-history__item instruction-history__item--${item.status}`}>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
