import type { CollectionModel } from 'pocketbase';
import { describe, expect, it } from 'vitest';
import { generateMarkup, normalizeCollections } from './diagram';
import example from './example.json';
import legacy from './fixtures/legacy-v0.22.json';
import { defaultSettings, type Settings } from './settings';

const settings: Settings = { ...defaultSettings, showSelectValues: true };

// Every `[...]` node declaration/reference used in a nomnoml relation line
const relationEndpoints = (markup: string) =>
  markup
    .split('\n')
    .filter((line) => /\](o|\+)->\[/.test(line))
    .flatMap((line) => [line.match(/^\[([^\]]+)\]/)![1]]);

const declaredIds = (markup: string) =>
  [...markup.matchAll(/\[<(?:collection|select) id=([^>]+)>/g)].map((m) => m[1]);

describe('normalizeCollections', () => {
  it('leaves current (v0.23+) exports untouched', () => {
    const collections = normalizeCollections(example);
    expect(collections).toEqual(example);
  });

  it('converts legacy (< v0.23) exports, flattening field options', () => {
    const [, expenses] = normalizeCollections(legacy);
    expect(expenses).not.toHaveProperty('schema');
    const user = expenses.fields.find((f) => f.name === 'user');
    expect(user).toMatchObject({
      type: 'relation',
      collectionId: '_pb_users_auth_',
      maxSelect: 1
    });
    expect(user).not.toHaveProperty('options');
  });

  it('rejects input that is not a collections array', () => {
    expect(() => normalizeCollections({})).toThrow();
    expect(() => normalizeCollections([{ name: 'x' }])).toThrow();
  });
});

describe('generateMarkup', () => {
  it('draws legacy exports with relations', () => {
    const markup = generateMarkup(normalizeCollections(legacy), settings);
    expect(markup).toMatch(/user: +users\\\[1\\\]/);
    expect(markup).toMatch(/\[bmugtuznd5yyc6x\]o->\[000pb000users000auth000\]/);
    expect(markup).toMatch(/\[d2c92wgetu1tknt\]\+->\[000pb000users000auth000\]/);
  });

  it('marks view collections based on their type', () => {
    const markup = generateMarkup(example as CollectionModel[], settings);
    expect(markup).toContain('«view»;');
  });

  it('links select value boxes to existing entities instead of creating new ones', () => {
    const markup = generateMarkup(example as CollectionModel[], settings);
    const ids = declaredIds(markup);
    expect(markup).toContain('«select»');
    for (const endpoint of relationEndpoints(markup)) expect(ids).toContain(endpoint);
  });

  it('does not crash on relations to system or missing collections', () => {
    const collections = normalizeCollections([
      {
        id: 'abc',
        name: 'logs',
        type: 'base',
        system: false,
        fields: [{ name: 'admin', type: 'relation', collectionId: 'pbc_superusers', maxSelect: 1 }]
      },
      { id: 'pbc_superusers', name: '_superusers', type: 'auth', system: true, fields: [] }
    ]);
    const markup = generateMarkup(collections, settings);
    expect(markup).toContain('admin: relation\\[1\\]');
    expect(markup).not.toContain('->');
  });
});
