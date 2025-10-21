import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SectionCard({ title, children }) {
    return (_jsxs("section", { className: "section-card", children: [_jsx("header", { className: "section-card__header", children: title }), _jsx("div", { className: "section-card__body", children: children })] }));
}
