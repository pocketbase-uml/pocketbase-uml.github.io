import { browser } from '$app/environment';
import { draw } from 'nomnoml';
import PocketBase, { type CollectionModel } from 'pocketbase';
import type { Settings } from './settings';
import { sanitizeId, spaces, stripBackslashes } from './utils';

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
  options: AttributeOptions;
  isRelation: boolean;
};

type Entity = {
  id: string;
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
  { name: 'id', type: 'string', required: false, isRelation: false, options: {} }
];

const viewSystemAttributeNames = viewSystemAttributes.map((attr) => attr.name);

const collectionSystemAttributes = viewSystemAttributes.concat([
  { name: 'created', type: 'autodate', required: false, isRelation: false, options: {} },
  { name: 'updated', type: 'autodate', required: false, isRelation: false, options: {} }
]);

const collectionSystemAttributeNames = collectionSystemAttributes.map((attr) => attr.name);

export async function loadPocketbaseCollections(connection: Connection | undefined) {
  if (!connection) throw new Error('Missing connection parameters');
  const { url, email, password } = connection;
  const pb = new PocketBase(url);
  await pb.collection('_superusers').authWithPassword(email, password);

  return await pb.collections.getFullList();
}

type LegacyField = {
  name: string;
  type: string;
  required?: boolean;
  options?: Record<string, unknown>;
};

type LegacyCollection = Omit<CollectionModel, 'fields'> & { schema: LegacyField[] };

/**
 * Collections exported from PocketBase < v0.23 have a `schema` array instead of `fields`,
 * with field-specific settings nested under `options`. Convert them to the current shape.
 */
export function normalizeCollections(collections: unknown): CollectionModel[] {
  if (!Array.isArray(collections)) throw new Error('Collections must be an array');
  return collections.map((collection: CollectionModel | LegacyCollection) => {
    if ('fields' in collection && Array.isArray(collection.fields))
      return collection as CollectionModel;
    if ('schema' in collection && Array.isArray(collection.schema)) {
      const { schema, ...rest } = collection;
      return {
        ...rest,
        fields: schema.map(({ options, ...field }) => ({ ...options, ...field }))
      } as CollectionModel;
    }
    throw new Error(`Collection ${collection?.name} has no fields`);
  });
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
  collections: CollectionModel[],
  { direction, algorithm, showSystemAttributes, markRequiredAttributes, showSelectValues }: Settings
) {
  const entities: Record<string, Entity> = Object.fromEntries(
    collections
      .filter(({ system }) => !system) // Filter out system collections
      .map(({ id, name, type, fields }) => {
        const $isView = type === 'view';
        let attributes: Attribute[] = [
          ...(showSystemAttributes
            ? $isView
              ? viewSystemAttributes
              : collectionSystemAttributes
            : [])
        ];
        attributes = attributes.concat(
          fields
            .filter(
              ({ name }) =>
                !($isView
                  ? viewSystemAttributeNames.includes(name)
                  : collectionSystemAttributeNames.includes(name))
            )
            .map((field) => ({
              name: field.name,
              type: field.type,
              options: {
                min: field.min,
                max: field.max,
                minSelect: field.minSelect,
                maxSelect: field.maxSelect,
                cascadeDelete: field.cascadeDelete,
                collectionId: field.collectionId,
                values: field.values
              } as AttributeOptions,
              required: field.required,
              isRelation: field.type === 'relation'
            }))
        );

        return [id, { id: sanitizeId(id), name, attributes, isView: $isView }];
      })
  );

  const entityValues = Object.values(entities);

  const relations: Relation[] = [];
  for (const { id, attributes } of entityValues) {
    for (const attribute of attributes) {
      if (!attribute.isRelation) continue;
      const { collectionId, cascadeDelete } = attribute.options;
      const target = entities[collectionId as string];
      if (!target) {
        // Relation to a system collection (i.e. _superusers) or one missing from the export:
        // keep the attribute, but don't draw an arrow to a non-existent entity
        attribute.type = 'relation';
        continue;
      }
      attribute.type = target.name;
      relations.push({
        from: sanitizeId(id),
        to: sanitizeId(collectionId),
        type: cascadeDelete ? 'composition' : 'aggregation'
      });
    }
  }

  let result = `${genericMarkupDirectives}\n#ranker: ${algorithm}\n#direction: ${direction}\n\n`;

  for (const { id, name, attributes, isView } of entityValues) {
    result += `[<collection id=${id}>`;
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
      const requiredFlagStrings = markRequiredAttributes
        ? attributes.map(({ required }) => (required ? '*' : ''))
        : Array(attributes.length).fill('');

      const maxAttrNameLength = Math.max(...attrNames.map((s) => s.length));
      const maxAttrTypeStringLength = Math.max(
        ...attrTypeStrings.map((s) => stripBackslashes(s).length)
      );
      const maxRequiredFlagStringLength = Math.max(...requiredFlagStrings.map((s) => s.length));

      for (let i = 0; i < attributes.length; i++) {
        if (i > 0) {
          result +=
            showSystemAttributes && ((isView && i === 1) || (!isView && i === 3)) ? '|' : ';';
        }
        const attrName = attrNames[i];
        const attrTypeString = attrTypeStrings[i];
        const requiredFlagString = requiredFlagStrings[i];
        result += `${attrName}: ${spaces(maxAttrNameLength - attrName.length)}${attrTypeString}`;
        if (requiredFlagString) {
          result += ` ${spaces(
            maxAttrTypeStringLength +
              maxRequiredFlagStringLength -
              stripBackslashes(attrTypeString).length -
              requiredFlagString.length
          )}${requiredFlagString}`;
        }
      }
    }
    result += ']\n';
  }

  for (const { from, to, type } of relations) {
    result += `[${from}]${type === 'composition' ? '+' : 'o'}->[${to}]\n`;
  }

  if (showSelectValues) {
    let selectIndex = 0;
    for (const { id: entityId, attributes } of entityValues) {
      for (const { type, name: attributeName, options } of attributes) {
        if (type !== 'select') continue;
        const id = `select${selectIndex++}`;
        result += `[${entityId}]+->[<select id=${id}>«select»;${attributeName}|${(
          options.values as string[]
        ).join(';')}]\n`;
      }
    }
  }

  return result;
}

export function drawImage(
  canvas: HTMLCanvasElement,
  collections: CollectionModel[] | undefined,
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

/**
 * Normalizes the given collections and throws if they can't be drawn.
 * Returns the normalized collections.
 */
export function validateCollections(object: unknown) {
  const collections = normalizeCollections(object);
  const hiddenCanvas = document.createElement('canvas');
  try {
    drawImage(hiddenCanvas, collections, {
      algorithm: 'longest-path',
      direction: 'down',
      markRequiredAttributes: false,
      showSystemAttributes: false,
      showSelectValues: false
    });
  } finally {
    hiddenCanvas.remove();
  }
  return collections;
}

export function downloadPng(collections: CollectionModel[] | undefined, settings: Settings) {
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

export function copyPng(collections: CollectionModel[] | undefined, settings: Settings) {
  if (!(browser && collections)) return;
  const hiddenCanvas = document.createElement('canvas');
  drawImage(hiddenCanvas, collections, settings);
  hiddenCanvas.toBlob((blob) =>
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob as Blob })])
  );
  hiddenCanvas.remove();
}
