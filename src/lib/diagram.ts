import { browser } from '$app/environment';
import { draw } from 'nomnoml';
import PocketBase, { type Collection } from 'pocketbase';
import type { Settings } from './settings';
import { spaces, stripBackslashes } from './utils';

export type Connection = {
  url: string;
  email: string;
  password: string;
};

type AttributeOptions = {
  min?: number;
  max?: number;
  minSelect?: number;
  maxSelect?: number;
  cascadeDelete?: boolean;
  collectionId?: string;
  values?: string[];
};

type Attribute = {
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  options: AttributeOptions;
  isRelation: boolean;
};

type Entity = {
  name: string;
  attributes: Attribute[];
  isView: boolean;
};

type Relation = {
  type: 'aggregation' | 'composition';
  from: string;
  to: string;
};

const viewSystemAttributes = [
  { name: 'id', type: 'string', required: false, unique: true, isRelation: false, options: {} }
];

const collectionSystemAttributes = viewSystemAttributes.concat([
  { name: 'created', type: 'date', required: false, unique: false, isRelation: false, options: {} },
  { name: 'updated', type: 'date', required: false, unique: false, isRelation: false, options: {} }
]);

export async function loadPocketbaseCollections(connection: Connection | undefined) {
  if (!connection) throw new Error('Missing connection parameters');
  const { url, email, password } = connection;
  const pb = new PocketBase(url);
  await pb.admins.authWithPassword(email, password);
  return pb.collections.getFullList();
}

const genericMarkupDirectives = Object.entries({
  bendSize: 0.1,
  leading: 2,
  font: '"Fira Code", monospace',
  background: '#f8f9fa',
  fill: '#fff',
  stroke: '#45485a',
  '.select': ''
})
  .map(([key, value]) => `#${key}: ${value}`)
  .join('\n');

export function generateMarkup(
  collections: Collection[],
  { direction, algorithm, showSystemAttributes, showAttributeFlags, showSelectValues }: Settings
) {
  const entities: Record<string, Entity> = Object.fromEntries(
    collections.map(({ id, name, schema, isView }) => {
      let attributes: Attribute[] = [
        ...(showSystemAttributes
          ? isView
            ? viewSystemAttributes
            : collectionSystemAttributes
          : [])
      ];
      attributes = attributes.concat(
        schema.map(({ name, type, options, required, unique }) => ({
          name,
          type,
          options: options as AttributeOptions,
          required,
          unique,
          isRelation: type === 'relation'
        }))
      );

      return [id, { name, attributes, isView }];
    })
  );

  const entityValues = Object.values(entities);

  const relations: Relation[] = [];
  for (const { name, attributes } of entityValues) {
    for (const attribute of attributes) {
      if (!attribute.isRelation) continue;
      const { collectionId, cascadeDelete } = attribute.options;
      const to = entities[collectionId as string].name;
      attribute.type = to;
      relations.push({
        from: name,
        to,
        type: cascadeDelete ? 'composition' : 'aggregation'
      });
    }
  }

  let result = `${genericMarkupDirectives}\n#ranker: ${algorithm}\n#direction: ${direction}\n\n`;

  for (const { name, attributes, isView } of entityValues) {
    result += `[<collection id=${name}>`;
    if (isView) result += '«view»;';
    result += name;
    if (attributes.length) {
      result += '|';
      const attrNames = attributes.map(({ name }) => name);
      const attrTypeStrings = attributes.map(
        ({ type, options: { min, max, minSelect, maxSelect }, isRelation }) => {
          min = min || minSelect;
          max = max || maxSelect;
          let s = type;
          if (isRelation || min || max) s += '\\[';
          if (min) s += min;
          if ((min || max) && max !== 1) s += '..';
          if (max) s += max;
          if (isRelation || min || max) s += '\\]';
          return s;
        }
      );
      const attrFlagStrings = attributes.map(({ required, unique }) => {
        if (!showAttributeFlags) return '';
        let s = '';
        if (required) s += 'R';
        if (required && unique) s += ' ';
        if (unique) s += 'U';
        return s;
      });

      const maxAttrNameLength = Math.max(...attrNames.map((s) => s.length));
      const maxAttrTypeStringLength = Math.max(
        ...attrTypeStrings.map((s) => stripBackslashes(s).length)
      );
      const maxAttrFlagStringLength = Math.max(...attrFlagStrings.map((s) => s.length));

      for (let i = 0; i < attributes.length; i++) {
        if (i > 0) {
          result +=
            showSystemAttributes && ((isView && i === 1) || (!isView && i === 3)) ? '|' : ';';
        }
        const attrName = attrNames[i];
        const attrTypeString = attrTypeStrings[i];
        const attrFlagString = attrFlagStrings[i];
        result += `${attrName}: ${spaces(maxAttrNameLength - attrName.length)}${attrTypeString}`;
        if (attrFlagString) {
          result += ` ${spaces(
            maxAttrTypeStringLength +
              maxAttrFlagStringLength -
              stripBackslashes(attrTypeString).length -
              attrFlagString.length
          )}${attrFlagString}`;
        }
      }
    }
    result += ']\n';
  }

  for (const { from, to, type } of relations) {
    result += `[${from}]${type === 'composition' ? '+' : 'o'}->[${to}]\n`;
  }

  if (showSelectValues) {
    for (const { name: entityName, attributes } of entityValues) {
      for (const { type, name: attributeName, options } of attributes) {
        if (type !== 'select') continue;
        result += `[${entityName}]+->[<select id=${entityName}${attributeName}>«select»;${attributeName}|${(
          options.values as string[]
        ).join(';')}]\n`;
      }
    }
  }

  return result;
}

export function drawImage(
  canvas: HTMLCanvasElement,
  collections: Collection[] | undefined,
  settings: Settings,
  zoom = 1
) {
  if (!(canvas && collections)) return;
  draw(
    canvas,
    `#lineWidth: ${(1 / zoom).toFixed(3)}\n` + generateMarkup(collections, settings),
    zoom
  );
}

export function validateCollections(object: unknown) {
  const hiddenCanvas = document.createElement('canvas');
  try {
    drawImage(hiddenCanvas, object as Collection[], {
      algorithm: 'longest-path',
      direction: 'down',
      showAttributeFlags: false,
      showSystemAttributes: false,
      showSelectValues: false
    });
  } finally {
    hiddenCanvas.remove();
  }
}

export function downloadPng(collections: Collection[] | undefined, settings: Settings) {
  if (!(browser && collections)) return;
  const hiddenCanvas = document.createElement('canvas');
  drawImage(hiddenCanvas, collections, settings);
  const link = document.createElement('a');
  link.download = 'pb_diagram.png';
  link.href = hiddenCanvas.toDataURL('image/png');
  hiddenCanvas.remove();
  link.click();
  link.remove();
}

export function copyPng(collections: Collection[] | undefined, settings: Settings) {
  if (!(browser && collections)) return;
  const hiddenCanvas = document.createElement('canvas');
  drawImage(hiddenCanvas, collections, settings);
  hiddenCanvas.toBlob((blob) =>
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob as Blob })])
  );
  hiddenCanvas.remove();
}
