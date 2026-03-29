export function formatJsModule(name, data, headerComment = '') {
  const comment = headerComment ? `${headerComment}\n` : '';
  return `${comment}export const ${name} = ${JSON.stringify(data, null, 2)};\n`;
}

export function roomsModuleText(rooms) {
  return formatJsModule('rooms', rooms, '// Replace placeholder names here with your actual school room list.');
}

export function keysModuleText(keys, defaultPlayerKeys) {
  const keysText = JSON.stringify(keys, null, 2);
  const defaultsText = JSON.stringify(defaultPlayerKeys, null, 2);
  return `export const keys = ${keysText};\n\nexport const DEFAULT_PLAYER_KEYS = ${defaultsText};\n`;
}

export function missionsModuleText(missions) {
  return formatJsModule(
    'missions',
    missions,
    '// Mission content is data-driven so you can edit/add missions without changing core gameplay code.'
  );
}

export function flavorModuleText(flavorText) {
  return `export const flavorText = ${JSON.stringify(flavorText, null, 2)};\n\nexport function pickRandom(list, random = Math.random) {\n  if (!list || list.length === 0) return '';\n  return list[Math.floor(random() * list.length)];\n}\n`;
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
