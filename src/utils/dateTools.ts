function formateDateToIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formateDateToIsoDateTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const isoDate = formateDateToIso(date);
    return `${isoDate} ${h}:${m}:${s}`;
}

function currentIsoDateTime(): string {
    const date = new Date();
    return formateDateToIsoDateTime(date);
}

export { formateDateToIso, formateDateToIsoDateTime, currentIsoDateTime };
