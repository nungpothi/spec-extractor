import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function InstructionHistory({ items }) {
    if (items.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: "instruction-history", children: [_jsx("h2", { children: "Instruction History" }), _jsx("ul", { children: items.map((item) => (_jsx("li", { className: `instruction-history__item instruction-history__item--${item.status}`, children: _jsx("span", { children: item.text }) }, item.id))) })] }));
}
