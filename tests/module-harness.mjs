import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Enlaza dependencias del navegador sin cambiar el código que se prueba.
export async function loadModule(path, dependencies = {}, globals = {}) {
  const context = vm.createContext({ console, performance, ...globals });
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const module = new vm.SourceTextModule(source, { context });
  await module.link(specifier => {
    const exports = dependencies[specifier];
    if (!exports) throw new Error(`Dependencia no definida: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return module.namespace;
}
