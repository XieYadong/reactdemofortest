export function exportCSV(payload) {
  if (payload && payload.data.length > 0) {
    let str = payload.header.map(h => h.title).join(',') + '\n';
    str += payload.data
      .map(d => payload.header.map(h => d[h.dataIndex]).join(','))
      .join('\n');
    const blob = new global.Blob(['\ufeff' + str], {
      type: 'text/csv;charset=utf-8;'
    });
    const filename = `${payload.name}.csv`;
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  }
}
